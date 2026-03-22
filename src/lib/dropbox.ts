import { DropboxAuth } from "dropbox";
import type { NextRequest } from "next/server";

const DROPBOX_STATE_COOKIE = "dropbox_oauth_state";
const DROPBOX_ACCESS_TOKEN_COOKIE = "dropbox_access_token";
const DROPBOX_REFRESH_TOKEN_COOKIE = "dropbox_refresh_token";

function requireEnv(name: "DROPBOX_APP_KEY" | "DROPBOX_APP_SECRET") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

export function createDropboxAuth() {
  return new DropboxAuth({
    clientId: requireEnv("DROPBOX_APP_KEY"),
    clientSecret: requireEnv("DROPBOX_APP_SECRET"),
  });
}

export function getDropboxRedirectUri(request: NextRequest) {
  return (
    process.env.DROPBOX_REDIRECT_URI ??
    `${request.nextUrl.origin}/api/auth/dropbox/callback`
  );
}

export function getDropboxCookieOptions(request: NextRequest) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: request.nextUrl.protocol === "https:",
  };
}

export function getDropboxStateCookieName() {
  return DROPBOX_STATE_COOKIE;
}

export function getDropboxAccessTokenCookieName() {
  return DROPBOX_ACCESS_TOKEN_COOKIE;
}

export function getDropboxRefreshTokenCookieName() {
  return DROPBOX_REFRESH_TOKEN_COOKIE;
}
