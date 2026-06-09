import { createHmac, timingSafeEqual } from "node:crypto";

const NONCE_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const BASE_AUTH_SESSION_COOKIE = "wh_base_auth_session";

type NonceStore = {
  issued: Map<string, number>;
  used: Set<string>;
};

type BaseAuthSession = {
  address: string;
  verifiedAt: string;
  expiresAt: number;
};

declare global {
  var __baseNonceStore__: NonceStore | undefined;
}

function getStore() {
  if (!globalThis.__baseNonceStore__) {
    globalThis.__baseNonceStore__ = {
      issued: new Map<string, number>(),
      used: new Set<string>(),
    };
  }

  return globalThis.__baseNonceStore__;
}

function pruneExpiredNonces(store: NonceStore, now: number) {
  for (const [nonce, expiresAt] of store.issued.entries()) {
    if (expiresAt <= now) {
      store.issued.delete(nonce);
    }
  }
}

export function issueNonce() {
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const now = Date.now();
  const store = getStore();

  pruneExpiredNonces(store, now);
  store.issued.set(nonce, now + NONCE_TTL_MS);

  return nonce;
}

export function consumeNonce(nonce: string) {
  const now = Date.now();
  const store = getStore();

  pruneExpiredNonces(store, now);

  if (store.used.has(nonce)) {
    return { ok: false, reason: "Nonce has already been used." } as const;
  }

  const expiresAt = store.issued.get(nonce);

  if (!expiresAt) {
    return { ok: false, reason: "Nonce was not issued by this app." } as const;
  }

  if (expiresAt <= now) {
    store.issued.delete(nonce);
    return { ok: false, reason: "Nonce has expired." } as const;
  }

  store.issued.delete(nonce);
  store.used.add(nonce);

  return { ok: true } as const;
}

function getSessionSecret() {
  return (
    process.env.BASE_AUTH_SESSION_SECRET ||
    process.env.PRIVY_APP_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "dev-insecure-base-auth-session-secret"
  );
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signSessionPayload(payload: string) {
  return createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");
}

export function createSessionToken(address: string, verifiedAt = new Date().toISOString()) {
  const session: BaseAuthSession = {
    address,
    verifiedAt,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
  const payload = toBase64Url(JSON.stringify(session));
  const signature = signSessionPayload(payload);
  return `${payload}.${signature}`;
}

export function readSessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signSessionPayload(payload);
  const provided = Buffer.from(signature, "utf8");
  const expected = Buffer.from(expectedSignature, "utf8");

  if (
    provided.length !== expected.length ||
    !timingSafeEqual(provided, expected)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(fromBase64Url(payload)) as BaseAuthSession;

    if (
      !parsed ||
      typeof parsed.address !== "string" ||
      typeof parsed.verifiedAt !== "string" ||
      typeof parsed.expiresAt !== "number"
    ) {
      return null;
    }

    if (parsed.expiresAt <= Date.now()) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function getSessionCookieOptions(expiresAt: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  };
}

export function getExpiredSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  };
}
