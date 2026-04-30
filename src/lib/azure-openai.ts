export const DEFAULT_SYSTEM_PROMPT =
  'You are the Witching Hour terminal assistant. Be concise, accurate, and practical.'

function normalizeBaseUrl(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value
}

function deriveInferenceBaseUrl(projectEndpoint?: string): string {
  if (!projectEndpoint) {
    return ''
  }

  const normalized = normalizeBaseUrl(projectEndpoint)
  const marker = '/api/projects/'
  const markerIndex = normalized.indexOf(marker)

  if (markerIndex === -1) {
    return ''
  }

  return normalized.slice(0, markerIndex)
}

export function extractText(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    return ''
  }

  const response = payload as {
    output_text?: string
    output?: Array<{
      content?: Array<{
        type?: string
        text?: string
      }>
    }>
  }

  if (typeof response.output_text === 'string' && response.output_text.trim()) {
    return response.output_text
  }

  return (
    response.output
      ?.flatMap((item) => item.content ?? [])
      .filter((item) => item.type === 'output_text' || typeof item.text === 'string')
      .map((item) => item.text ?? '')
      .join('') ?? ''
  )
}

export function getAzureOpenAIConfig() {
  const baseUrl = process.env.AZURE_OPENAI_BASE_URL ?? process.env.OPENAI_BASE_URL
  const apiKey =
    process.env.AZURE_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY ?? process.env.QBRAID_API_KEY
  const model = process.env.AZURE_OPENAI_MODEL ?? process.env.QBRAID_MODEL
  const projectEndpoint = process.env.AZURE_AI_PROJECT_ENDPOINT
  const inferenceBaseUrl =
    process.env.AZURE_AI_INFERENCE_BASE_URL ?? deriveInferenceBaseUrl(projectEndpoint)
  const apiFlavor =
    process.env.AI_PROVIDER ?? process.env.AZURE_OPENAI_API_FLAVOR ?? 'responses'
  const qbraidBaseUrl = process.env.QBRAID_BASE_URL

  return {
    apiFlavor,
    apiKey,
    baseUrl: baseUrl ? normalizeBaseUrl(baseUrl) : '',
    inferenceBaseUrl: inferenceBaseUrl ? normalizeBaseUrl(inferenceBaseUrl) : '',
    model,
    projectEndpoint,
    qbraidBaseUrl: qbraidBaseUrl ? normalizeBaseUrl(qbraidBaseUrl) : '',
  }
}

async function callResponsesApi(baseUrl: string, apiKey: string, model: string, input: string) {
  return fetch(`${baseUrl}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      model,
      input,
      instructions: DEFAULT_SYSTEM_PROMPT,
    }),
  })
}

async function callInferenceApi(
  inferenceBaseUrl: string,
  apiKey: string,
  model: string,
  input: string,
) {
  return fetch(`${inferenceBaseUrl}/models/chat/completions?api-version=2024-05-01-preview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
      'extra-parameters': 'drop',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: DEFAULT_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: input,
        },
      ],
    }),
  })
}

async function callQbraidChatApi(
  qbraidBaseUrl: string,
  apiKey: string,
  model: string,
  input: string,
) {
  return fetch(`${qbraidBaseUrl}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      model,
      prompt: `${DEFAULT_SYSTEM_PROMPT}\n\nUser: ${input}`,
      stream: false,
    }),
  })
}

export async function generateAzureOpenAIResponse(input: string): Promise<string> {
  const { apiFlavor, apiKey, baseUrl, inferenceBaseUrl, model, qbraidBaseUrl } =
    getAzureOpenAIConfig()

  if (!apiKey) {
    throw new Error('Missing AZURE_OPENAI_API_KEY, OPENAI_API_KEY, or QBRAID_API_KEY.')
  }

  if (!model) {
    throw new Error('Missing AZURE_OPENAI_MODEL or QBRAID_MODEL.')
  }

  const useInferenceFirst = apiFlavor === 'inference'
  const useQbraid = apiFlavor === 'qbraid'
  let response: Response | null = null
  let payload: unknown = null

  if (useQbraid) {
    if (qbraidBaseUrl) {
      response = await callQbraidChatApi(qbraidBaseUrl, apiKey, model, input)
      payload = await response.json().catch(() => null)
    }
  } else if (useInferenceFirst) {
    if (inferenceBaseUrl) {
      response = await callInferenceApi(inferenceBaseUrl, apiKey, model, input)
      payload = await response.json().catch(() => null)
    }
  } else if (baseUrl) {
    response = await callResponsesApi(baseUrl, apiKey, model, input)
    payload = await response.json().catch(() => null)
  }

  const canFallbackToInference =
    !useInferenceFirst &&
    !useQbraid &&
    inferenceBaseUrl &&
    response?.ok === false &&
    payload &&
    typeof payload === 'object' &&
    'error' in payload &&
    payload.error &&
    typeof payload.error === 'object' &&
    'message' in payload.error &&
    typeof payload.error.message === 'string' &&
    payload.error.message.includes('Deployment')

  if (!response && !baseUrl && !inferenceBaseUrl && !qbraidBaseUrl) {
    throw new Error(
      'Missing AI endpoint configuration. Set AZURE_OPENAI_BASE_URL/OPENAI_BASE_URL, AZURE_AI_INFERENCE_BASE_URL/AZURE_AI_PROJECT_ENDPOINT, or QBRAID_BASE_URL.',
    )
  }

  if (canFallbackToInference) {
    response = await callInferenceApi(inferenceBaseUrl, apiKey, model, input)
    payload = await response.json().catch(() => null)
  }

  if (!response) {
    throw new Error('AI request could not be initialized from the configured endpoints.')
  }

  if (!response.ok) {
    const errorMessage =
      payload &&
      typeof payload === 'object' &&
      'error' in payload &&
      payload.error &&
      typeof payload.error === 'object' &&
      'message' in payload.error &&
      typeof payload.error.message === 'string'
        ? payload.error.message
        : `Azure OpenAI request failed with status ${response.status}.`

    throw new Error(errorMessage)
  }

  const text =
    extractText(payload) ||
    (payload &&
    typeof payload === 'object' &&
    'content' in payload &&
    typeof payload.content === 'string'
      ? payload.content
      : '') ||
    (payload &&
    typeof payload === 'object' &&
    'choices' in payload &&
    Array.isArray(payload.choices) &&
    payload.choices[0] &&
    typeof payload.choices[0] === 'object' &&
    'message' in payload.choices[0] &&
    payload.choices[0].message &&
    typeof payload.choices[0].message === 'object' &&
    'content' in payload.choices[0].message &&
    typeof payload.choices[0].message.content === 'string'
      ? payload.choices[0].message.content
      : '')

  if (!text.trim()) {
    throw new Error('AI provider returned an empty response.')
  }

  return text
}
