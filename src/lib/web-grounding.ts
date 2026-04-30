import {
  DEFAULT_SYSTEM_PROMPT,
  extractText,
  generateAzureOpenAIResponse,
  getAzureOpenAIConfig,
} from "@/lib/azure-openai";

type SearchResult = {
  title: string;
  url: string;
  snippet: string;
};

type FetchedPage = {
  title: string;
  url: string;
  content: string;
  contentType: string;
};

type ToolCall = {
  arguments?: string;
  call_id?: string;
  name?: string;
  type?: string;
};

const TOOL_SYSTEM_PROMPT = `${DEFAULT_SYSTEM_PROMPT}

You can use the available web tools when the user needs current or site-specific information.
Prefer these rules:
- If the user gives a URL or domain, fetch that site before answering.
- If the user asks to look something up on the web, search first, then fetch relevant pages.
- Answer like the Witching Hour terminal, not a generic helper.
- Keep it tight, specific, and grounded in the fetched material.
- Prefer concrete phrasing over hedging. Do not say you "appear" to have found something if the page text is clear.
- Use short paragraphs or flat bullets when useful.
- Cite the URLs you actually used at the end under "Sources:".
- Never claim you browsed a page unless tool output is present.`;

const TOOL_DEFINITIONS = [
  {
    type: "function",
    name: "fetch_url",
    description:
      "Fetch a URL or domain, extract readable text, and return a concise page snapshot.",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The absolute URL or bare domain to fetch.",
        },
      },
      required: ["url"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "search_web",
    description:
      "Search the public web and return a short ranked list of result URLs with snippets.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The web query to search for.",
        },
      },
      required: ["query"],
      additionalProperties: false,
    },
  },
];

function normalizeBaseUrl(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function looksLikeBareDomain(value: string): boolean {
  return /^(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s]*)?$/i.test(value);
}

function normalizeUrl(raw: string): string | null {
  const value = raw.trim().replace(/[),.;]+$/, "");

  if (!value) {
    return null;
  }

  if (looksLikeBareDomain(value)) {
    return `https://${value}`;
  }

  try {
    const parsed = new URL(value);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

function extractUrls(prompt: string): string[] {
  const matches =
    prompt.match(
      /\bhttps?:\/\/[^\s<>"')]+|\b(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s<>"')]*)?/gi,
    ) ?? [];

  const seen = new Set<string>();
  const urls: string[] = [];

  for (const match of matches) {
    const normalized = normalizeUrl(match);

    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    urls.push(normalized);
  }

  return urls;
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(Number.parseInt(code, 16)),
    );
}

function stripHtml(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<\/?(article|section|main|div|p|li|ul|ol|h\d|br|tr|td|th)[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\r/g, "")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]{2,}/g, " "),
  ).trim();
}

function summarizeText(input: string, maxChars: number): string {
  if (!input) {
    return "";
  }

  const text = input.trim();

  if (text.length <= maxChars) {
    return text;
  }

  return `${text.slice(0, maxChars)}...`;
}

function parseDdqHref(href: string): string | null {
  const decodedHref = decodeHtmlEntities(href);

  if (decodedHref.includes("uddg=")) {
    const wrapped = decodedHref.startsWith("http")
      ? decodedHref
      : `https://duckduckgo.com${decodedHref.startsWith("/") ? "" : "/"}${decodedHref}`;

    try {
      const parsed = new URL(wrapped);
      const uddg = parsed.searchParams.get("uddg");
      return uddg ? decodeURIComponent(uddg) : null;
    } catch {
      return null;
    }
  }

  return normalizeUrl(decodedHref);
}

async function fetchWithTimeout(
  url: string,
  init?: RequestInit,
  timeoutMs = 12000,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; WitchingHourBot/1.0; +https://witchinghourmac.com)",
        Accept:
          "text/html,application/xhtml+xml,application/json,text/plain;q=0.9,*/*;q=0.8",
        ...(init?.headers ?? {}),
      },
      redirect: "follow",
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchUrlSnapshot(rawUrl: string): Promise<FetchedPage> {
  const url = normalizeUrl(rawUrl);

  if (!url) {
    throw new Error("Invalid URL.");
  }

  try {
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}.`);
    }

    const contentType = response.headers.get("content-type") ?? "unknown";
    const body = await response.text();

    if (contentType.includes("text/html")) {
      const titleMatch = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const title = summarizeText(
        decodeHtmlEntities(titleMatch?.[1]?.trim() ?? url),
        200,
      );
      const content = summarizeText(stripHtml(body), 12000);

      return {
        title,
        url,
        content,
        contentType,
      };
    }

    if (contentType.includes("application/json")) {
      return {
        title: url,
        url,
        content: summarizeText(body, 12000),
        contentType,
      };
    }

    return {
      title: url,
      url,
      content: summarizeText(body.replace(/\r/g, "").trim(), 12000),
      contentType,
    };
  } catch {
    const readerResponse = await fetchWithTimeout(`https://r.jina.ai/http://${url.replace(/^https?:\/\//, "")}`);

    if (!readerResponse.ok) {
      throw new Error(`Reader fetch failed with status ${readerResponse.status}.`);
    }

    const body = await readerResponse.text();
    const titleMatch = body.match(/^Title:\s*(.+)$/m);

    return {
      title: summarizeText(titleMatch?.[1]?.trim() ?? url, 200),
      url,
      content: summarizeText(body.trim(), 12000),
      contentType: readerResponse.headers.get("content-type") ?? "text/plain",
    };
  }
}

async function searchWeb(query: string): Promise<SearchResult[]> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const response = await fetchWithTimeout(
    `https://r.jina.ai/http://html.duckduckgo.com/html/?q=${encodeURIComponent(trimmedQuery)}`,
  );

  if (!response.ok) {
    throw new Error(`Search failed with status ${response.status}.`);
  }

  const markdown = await response.text();
  const blockRegex =
    /## \[(.+?)\]\((.+?)\)\n\n(?:\[[^\]]*?\]\((.+?)\)\n\n)?\[(.+?)\]\((.+?)\)/g;
  const results: SearchResult[] = [];
  const seen = new Set<string>();

  for (const match of markdown.matchAll(blockRegex)) {
    const title = summarizeText(match[1] ?? "", 180);
    const url = parseDdqHref(match[2] ?? match[3] ?? "");
    const snippet = summarizeText(match[4] ?? "", 280);

    if (!url || !title || seen.has(url)) {
      continue;
    }

    seen.add(url);
    results.push({
      title,
      url,
      snippet,
    });

    if (results.length >= 5) {
      break;
    }
  }

  return results;
}

function promptNeedsSearch(prompt: string): boolean {
  const lower = prompt.toLowerCase();

  if (extractUrls(prompt).length > 0) {
    return false;
  }

  return [
    "look up",
    "search",
    "browse",
    "find out",
    "what is on",
    "what's on",
    "latest",
    "website",
    "site",
    "online",
    "internet",
    "web",
  ].some((needle) => lower.includes(needle));
}

function buildContextBlock(pages: FetchedPage[], results: SearchResult[]): string {
  const sections: string[] = [];

  if (results.length > 0) {
    sections.push(
      [
        "Web search results:",
        ...results.map(
          (result, index) =>
            `${index + 1}. ${result.title}\nURL: ${result.url}\nSnippet: ${result.snippet || "None"}`,
        ),
      ].join("\n"),
    );
  }

  if (pages.length > 0) {
    sections.push(
      [
        "Fetched page content:",
        ...pages.map(
          (page, index) =>
            `Page ${index + 1}: ${page.title}\nURL: ${page.url}\nContent-Type: ${page.contentType}\nContent:\n${page.content}`,
        ),
      ].join("\n\n"),
    );
  }

  return sections.join("\n\n");
}

function parseToolArguments(raw: string | undefined): Record<string, unknown> {
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function buildUserInput(prompt: string, contextBlock: string) {
  const text = contextBlock
    ? `${prompt}\n\nUse this grounded web context if it is relevant:\n${contextBlock}`
    : prompt;

  return [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text,
        },
      ],
    },
  ];
}

async function callResponsesApi(body: Record<string, unknown>) {
  const { apiKey, baseUrl } = getAzureOpenAIConfig();

  if (!apiKey) {
    throw new Error("Missing AZURE_OPENAI_API_KEY, OPENAI_API_KEY, or QBRAID_API_KEY.");
  }

  if (!baseUrl) {
    throw new Error("Missing AZURE_OPENAI_BASE_URL or OPENAI_BASE_URL.");
  }

  const response = await fetch(`${normalizeBaseUrl(baseUrl)}/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      payload.error &&
      typeof payload.error === "object" &&
      "message" in payload.error &&
      typeof payload.error.message === "string"
        ? payload.error.message
        : `Azure OpenAI request failed with status ${response.status}.`;

    throw new Error(message);
  }

  return payload as {
    id?: string;
    output?: ToolCall[];
    output_text?: string;
  };
}

export async function generateGroundedWebResponse(prompt: string): Promise<string> {
  const trimmedPrompt = prompt.trim();
  const { model, baseUrl } = getAzureOpenAIConfig();

  if (!trimmedPrompt) {
    throw new Error("Prompt is required.");
  }

  if (!model) {
    throw new Error("Missing AZURE_OPENAI_MODEL or QBRAID_MODEL.");
  }

  const directUrls = extractUrls(trimmedPrompt).slice(0, 3);
  const prefetchedPages: FetchedPage[] = [];
  let prefetchedResults: SearchResult[] = [];

  for (const url of directUrls) {
    try {
      prefetchedPages.push(await fetchUrlSnapshot(url));
    } catch (error) {
      prefetchedPages.push({
        title: url,
        url,
        content:
          error instanceof Error ? `Failed to fetch: ${error.message}` : "Failed to fetch.",
        contentType: "error",
      });
    }
  }

  if (prefetchedPages.length === 0 && promptNeedsSearch(trimmedPrompt)) {
    try {
      prefetchedResults = await searchWeb(trimmedPrompt);

      for (const result of prefetchedResults.slice(0, 2)) {
        try {
          prefetchedPages.push(await fetchUrlSnapshot(result.url));
        } catch {
          // Ignore individual fetch failures here and let the model work from the search result set.
        }
      }
    } catch {
      // Fall back to plain model response if search fails.
    }
  }

  const contextBlock = buildContextBlock(prefetchedPages, prefetchedResults);

  if (!baseUrl) {
    return generateAzureOpenAIResponse(
      contextBlock ? `${trimmedPrompt}\n\n${contextBlock}` : trimmedPrompt,
    );
  }

  try {
    let payload = await callResponsesApi({
      model,
      instructions: TOOL_SYSTEM_PROMPT,
      tools: TOOL_DEFINITIONS,
      input: buildUserInput(trimmedPrompt, contextBlock),
    });

    for (let iteration = 0; iteration < 4; iteration += 1) {
      const toolCalls =
        payload.output?.filter(
          (item) => item && item.type === "function_call" && item.call_id && item.name,
        ) ?? [];

      if (toolCalls.length === 0) {
        const text = extractText(payload);

        if (!text.trim()) {
          throw new Error("Azure OpenAI returned an empty response.");
        }

        return text;
      }

      const toolOutputs = await Promise.all(
        toolCalls.map(async (call) => {
          const args = parseToolArguments(call.arguments);

          if (call.name === "fetch_url") {
            try {
              const page = await fetchUrlSnapshot(String(args.url ?? ""));
              return {
                type: "function_call_output",
                call_id: call.call_id,
                output: JSON.stringify(page),
              };
            } catch (error) {
              return {
                type: "function_call_output",
                call_id: call.call_id,
                output: JSON.stringify({
                  error: error instanceof Error ? error.message : "Fetch failed.",
                }),
              };
            }
          }

          if (call.name === "search_web") {
            try {
              const results = await searchWeb(String(args.query ?? ""));
              return {
                type: "function_call_output",
                call_id: call.call_id,
                output: JSON.stringify({ results }),
              };
            } catch (error) {
              return {
                type: "function_call_output",
                call_id: call.call_id,
                output: JSON.stringify({
                  error: error instanceof Error ? error.message : "Search failed.",
                }),
              };
            }
          }

          return {
            type: "function_call_output",
            call_id: call.call_id,
            output: JSON.stringify({ error: `Unknown tool ${call.name}.` }),
          };
        }),
      );

      payload = await callResponsesApi({
        model,
        instructions: TOOL_SYSTEM_PROMPT,
        tools: TOOL_DEFINITIONS,
        previous_response_id: payload.id,
        input: toolOutputs,
      });
    }
  } catch {
    return generateAzureOpenAIResponse(
      contextBlock ? `${trimmedPrompt}\n\n${contextBlock}` : trimmedPrompt,
    );
  }

  return generateAzureOpenAIResponse(
    contextBlock ? `${trimmedPrompt}\n\n${contextBlock}` : trimmedPrompt,
  );
}
