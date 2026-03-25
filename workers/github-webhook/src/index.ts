interface Env {
  GITHUB_WEBHOOK_SECRET: string;
}

const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(secret: string, body: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  return `sha256=${toHex(signature)}`;
}

function json(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    ...init,
  });
}

const githubWebhookWorker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET") {
      return json({
        ok: true,
        service: "witching-hour-github-webhook",
        path: url.pathname,
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET, POST" },
      });
    }

    const body = await request.text();
    const githubSignature = request.headers.get("x-hub-signature-256");

    if (!env.GITHUB_WEBHOOK_SECRET) {
      return json(
        { ok: false, error: "Missing GITHUB_WEBHOOK_SECRET" },
        { status: 500 }
      );
    }

    if (!githubSignature) {
      return json(
        { ok: false, error: "Missing x-hub-signature-256 header" },
        { status: 401 }
      );
    }

    const expectedSignature = await sign(env.GITHUB_WEBHOOK_SECRET, body);
    if (githubSignature !== expectedSignature) {
      return json({ ok: false, error: "Invalid signature" }, { status: 401 });
    }

    const event = request.headers.get("x-github-event") ?? "unknown";
    const delivery = request.headers.get("x-github-delivery") ?? "unknown";

    let payload: unknown = body;
    try {
      payload = JSON.parse(body);
    } catch {
      // Keep raw body for non-JSON deliveries.
    }

    console.log(
      JSON.stringify({
        event,
        delivery,
        payload,
      })
    );

    return json({
      ok: true,
      event,
      delivery,
    });
  },
};

export default githubWebhookWorker;
