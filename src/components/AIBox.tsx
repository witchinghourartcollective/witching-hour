'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'

function parseOutput(output: string) {
  const marker = '\nSources:'
  const markerIndex = output.indexOf(marker)

  if (markerIndex === -1) {
    return {
      body: output,
      sources: [] as string[],
    }
  }

  const body = output.slice(0, markerIndex).trim()
  const sourceBlock = output.slice(markerIndex + marker.length).trim()
  const sources = sourceBlock
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.startsWith('http://') || line.startsWith('https://'))

  return { body, sources }
}

export default function AIBox() {
  const { address } = useAccount()
  const [prompt, setPrompt] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const parsedOutput = parseOutput(output)

  const sendPrompt = async () => {
    if (!address) {
      alert("Connect wallet")
      return
    }

    if (!prompt.trim()) {
      setOutput('Enter a prompt first.')
      return
    }

    setOutput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          address
        })
      })

      const text = (await res.text()).trim()

      if (!res.ok) {
        setOutput(text || 'ERROR: Failed to fetch AI')
        setLoading(false)
        return
      }

      setOutput(text || 'No response')
    } catch {
      setOutput("ERROR: Failed to fetch AI")
    }

    setLoading(false)
  }

  return (
    <div style={{
      background: "black",
      color: "#00ff9f",
      fontFamily: "monospace",
      padding: "20px",
      minHeight: "400px"
    }}>
      <h2>WHM TERMINAL</h2>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="> enter signal, URL, or web lookup..."
        style={{
          width: "100%",
          height: "100px",
          background: "black",
          color: "#00ff9f",
          border: "1px solid #00ff9f",
          marginBottom: "10px"
        }}
      />

      <button onClick={sendPrompt}>
        {loading ? "TRANSMITTING..." : "INVOKE"}
      </button>

      <div style={{ marginTop: 20 }}>
        <pre style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          textShadow: "0 0 5px #00ff9f"
        }}>
          {parsedOutput.body}
        </pre>

        {parsedOutput.sources.length > 0 ? (
          <div style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 8 }}>Sources:</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {parsedOutput.sources.map((source) => (
                <a
                  key={source}
                  href={source}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: '#7dffca',
                    textDecoration: 'underline',
                    wordBreak: 'break-all',
                  }}
                >
                  {source}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
