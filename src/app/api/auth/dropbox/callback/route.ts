import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  createDropboxAuth,
  getDropboxAccessTokenCookieName,
  getDropboxCookieOptions,
  getDropboxRedirectUri,
  getDropboxRefreshTokenCookieName,
  getDropboxStateCookieName,
} from "@/lib/dropbox";

type DropboxTokenResult = {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
};

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const storedState = request.cookies.get(getDropboxStateCookieName())?.value;

  if (!code) {
    return NextResponse.json(
      { error: "Missing Dropbox authorization code" },
      { status: 400 },
    );
  }

  if (!state || state !== storedState) {
    return NextResponse.json({ error: "Invalid Dropbox auth state" }, { status: 400 });
  }

  const auth = createDropboxAuth();
  const redirectUri = getDropboxRedirectUri(request);
  const tokenResponse = await auth.getAccessTokenFromCode(redirectUri, code);
  const tokens = tokenResponse.result as DropboxTokenResult;

  if (!tokens.access_token) {
    return NextResponse.json(
      { error: "Dropbox did not return an access token" },
      { status: 400 },
    );
  }

  const response = NextResponse.redirect(new URL("/", request.url));
  const cookieOptions = getDropboxCookieOptions(request);

  response.cookies.set(getDropboxStateCookieName(), "", {
    ...cookieOptions,
    maxAge: 0,
  });

  response.cookies.set(
    getDropboxAccessTokenCookieName(),
    tokens.access_token,
    {
      ...cookieOptions,
      maxAge: tokens.expires_in,
    },
  );

  if (tokens.refresh_token) {
    response.cookies.set(
      getDropboxRefreshTokenCookieName(),
      tokens.refresh_token,
      cookieOptions,
    );
  }

  return response;
}
