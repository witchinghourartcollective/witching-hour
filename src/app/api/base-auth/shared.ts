const NONCE_TTL_MS = 10 * 60 * 1000;

type NonceStore = {
  issued: Map<string, number>;
  used: Set<string>;
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
