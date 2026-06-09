import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http, isAddress } from "viem";
import { base } from "viem/chains";
import {
  BASE_AUTH_SESSION_COOKIE,
  consumeNonce,
  createSessionToken,
  getSessionCookieOptions,
  readSessionToken,
} from "../shared";

const client = createPublicClient({
  chain: base,
  transport: http(),
});

function readNonce(message: string) {
  const match = message.match(/Nonce:\s*([^\n\r]+)/i);
  return match?.[1]?.trim() ?? null;
}

type VerifyPayload = {
  address?: string;
  message?: string;
  signature?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as VerifyPayload;
  const { address, message, signature } = body;

  if (!address || !message || !signature) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing address, message, or signature.",
      },
      { status: 400 },
    );
  }

  if (!isAddress(address)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid wallet address.",
      },
      { status: 400 },
    );
  }

  const nonce = readNonce(message);

  if (!nonce) {
    return NextResponse.json(
      {
        ok: false,
        error: "Signed message did not contain a nonce.",
      },
      { status: 400 },
    );
  }

  const nonceResult = consumeNonce(nonce);

  if (!nonceResult.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: nonceResult.reason,
      },
      { status: 401 },
    );
  }

  try {
    const verified = await client.verifyMessage({
      address,
      message,
      signature: signature as `0x${string}`,
    });

    if (!verified) {
      return NextResponse.json(
        {
          ok: false,
          error: "Signature verification failed.",
        },
        { status: 401 },
      );
    }

    const sessionToken = createSessionToken(address);
    const session = readSessionToken(sessionToken);

    if (!session) {
      return NextResponse.json(
        {
          ok: false,
          error: "Failed to create a signed session.",
        },
        { status: 500 },
      );
    }

    const response = NextResponse.json({
      ok: true,
      address,
      verifiedAt: new Date().toISOString(),
    });

    response.cookies.set(
      BASE_AUTH_SESSION_COOKIE,
      sessionToken,
      getSessionCookieOptions(session.expiresAt),
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Unknown verification error.",
      },
      { status: 500 },
    );
  }
}
