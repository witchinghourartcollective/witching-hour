import crypto from "node:crypto";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  createDropboxAuth,
  getDropboxCookieOptions,
  getDropboxRedirectUri,
  getDropboxStateCookieName,
} from "@/lib/dropbox";

export async function GET(request: NextRequest) {
  const auth = createDropboxAuth();
  const redirectUri = getDropboxRedirectUri(request);
  const state = crypto.randomUUID();

  const authUrl = await auth.getAuthenticationUrl(
    redirectUri,
    state,
    "code",
    "offline",
    ["files.metadata.read", "files.content.read"],
  );

  const response = NextResponse.redirect(authUrl.toString());

  response.cookies.set(
    getDropboxStateCookieName(),
    state,
    getDropboxCookieOptions(request),
  );

  return response;
}
