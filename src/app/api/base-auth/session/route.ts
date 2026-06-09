import { NextRequest, NextResponse } from "next/server";
import { BASE_AUTH_SESSION_COOKIE, readSessionToken } from "../shared";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(BASE_AUTH_SESSION_COOKIE)?.value;
  const session = readSessionToken(token);

  if (!session) {
    return NextResponse.json({
      ok: true,
      authenticated: false,
    });
  }

  return NextResponse.json({
    ok: true,
    authenticated: true,
    address: session.address,
    verifiedAt: session.verifiedAt,
    expiresAt: session.expiresAt,
  });
}
