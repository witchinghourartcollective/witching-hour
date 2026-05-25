import { NextResponse } from "next/server";

function getPublicOrigin(request: Request) {
  return process.env.APP_PUBLIC_ORIGIN ?? new URL(request.url).origin;
}

export async function POST(request: Request) {
  const qstashUrl = process.env.QSTASH_URL ?? "https://qstash.upstash.io";
  const qstashToken = process.env.QSTASH_TOKEN;

  if (!qstashUrl || !qstashToken) {
    return NextResponse.json(
      { error: "Missing QSTASH_URL or QSTASH_TOKEN." },
      { status: 500 }
    );
  }

  const destination = new URL("/api/qstash/receive", getPublicOrigin(request)).toString();
  const response = await fetch(`${qstashUrl}/v2/publish/${destination}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${qstashToken}`,
    },
  });

  const bodyText = await response.text();

  return NextResponse.json(
    { ok: response.ok, status: response.status, body: bodyText },
    { status: response.ok ? 200 : 502 }
  );
}
