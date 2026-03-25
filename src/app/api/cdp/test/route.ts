import { NextResponse } from "next/server";
import { generateJwt } from "@coinbase/cdp-sdk/auth";

const CDP_HOST = "api.cdp.coinbase.com";
const CDP_PATH = "/platform/v2/evm/accounts";

function normalizeSecret(secret: string) {
  return secret.includes("\\n") ? secret.replace(/\\n/g, "\n") : secret;
}

function maskKeyId(keyId: string) {
  return keyId.length <= 8 ? keyId : `${keyId.slice(0, 4)}...${keyId.slice(-4)}`;
}

export async function GET() {
  const apiKeyId = process.env.CDP_API_KEY_ID;
  const rawSecret = process.env.CDP_API_KEY_SECRET;

  if (!apiKeyId || !rawSecret) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing CDP_API_KEY_ID or CDP_API_KEY_SECRET.",
        expectedEnv: ["CDP_API_KEY_ID", "CDP_API_KEY_SECRET"],
      },
      { status: 500 },
    );
  }

  const apiKeySecret = normalizeSecret(rawSecret);

  try {
    const token = await generateJwt({
      apiKeyId,
      apiKeySecret,
      requestMethod: "GET",
      requestHost: CDP_HOST,
      requestPath: CDP_PATH,
      expiresIn: 120,
    });

    const response = await fetch(`https://${CDP_HOST}${CDP_PATH}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    return NextResponse.json(
      {
        ok: response.ok,
        keyId: maskKeyId(apiKeyId),
        endpoint: `GET https://${CDP_HOST}${CDP_PATH}`,
        status: response.status,
        payload,
      },
      { status: response.ok ? 200 : response.status },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown CDP test failure.";

    return NextResponse.json(
      {
        ok: false,
        keyId: maskKeyId(apiKeyId),
        endpoint: `GET https://${CDP_HOST}${CDP_PATH}`,
        error: message,
      },
      { status: 500 },
    );
  }
}
