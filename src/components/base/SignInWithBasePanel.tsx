"use client";

import { useState } from "react";
import { createBaseAccountSDK } from "@base-org/account";

type VerifyResponse = {
  ok: boolean;
  address?: string;
  verifiedAt?: string;
  error?: string;
};

const sdk = createBaseAccountSDK({
  appName: "Witching Hour",
  appChainIds: [8453],
});

function getProvider() {
  return sdk.getProvider();
}

function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function SignInWithBasePanel() {
  const [status, setStatus] = useState("Ready to verify this app with Base.");
  const [verifiedAddress, setVerifiedAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleVerify() {
    setIsLoading(true);
    setVerifiedAddress(null);
    setStatus("Requesting a fresh nonce from the app...");

    try {
      const nonceResponse = await fetch("/api/base-auth/nonce", {
        method: "GET",
        cache: "no-store",
      });
      const noncePayload = (await nonceResponse.json()) as {
        nonce?: string;
        chainId?: string;
        ok?: boolean;
      };

      if (!nonceResponse.ok || !noncePayload.nonce || !noncePayload.chainId) {
        throw new Error("The app failed to generate a Base sign-in nonce.");
      }

      setStatus("Opening Base Account for signature approval...");

      const provider = getProvider();
      const result = (await provider.request({
        method: "wallet_connect",
        params: [
          {
            version: "1",
            capabilities: {
              signInWithEthereum: {
                nonce: noncePayload.nonce,
                chainId: noncePayload.chainId,
              },
            },
          },
        ],
      })) as {
        accounts?: Array<{
          address?: string;
          capabilities?: {
            signInWithEthereum?: {
              message?: string;
              signature?: string;
            };
          };
        }>;
      };

      const account = result.accounts?.[0];
      const address = account?.address;
      const message = account?.capabilities?.signInWithEthereum?.message;
      const signature = account?.capabilities?.signInWithEthereum?.signature;

      if (!address || !message || !signature) {
        throw new Error("Base did not return a sign-in payload.");
      }

      setStatus("Verifying the Base signature on the server...");

      const verifyResponse = await fetch("/api/base-auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          message,
          signature,
        }),
      });

      const verifyPayload = (await verifyResponse.json()) as VerifyResponse;

      if (!verifyResponse.ok || !verifyPayload.ok || !verifyPayload.address) {
        throw new Error(verifyPayload.error ?? "Base verification failed.");
      }

      setVerifiedAddress(verifyPayload.address);
      setStatus("Base verification succeeded for this app.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Unexpected Base verification error.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-blue-400/20 bg-blue-500/10 p-6 shadow-[0_0_80px_rgba(0,102,255,0.14)] backdrop-blur">
      <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">
        Base Verification
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-white">
        Sign in with Base
      </h2>
      <p className="mt-3 text-sm leading-7 text-white/75">
        This uses a real Base Account sign-in flow backed by a server-side nonce
        and signature verification on Base mainnet.
      </p>
      <button
        type="button"
        onClick={() => void handleVerify()}
        disabled={isLoading}
        className="mt-6 rounded-full bg-blue-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Verifying with Base..." : "Verify with Base"}
      </button>
      <p className="mt-4 text-sm text-white/70">{status}</p>
      {verifiedAddress ? (
        <p className="mt-2 text-sm text-blue-100">
          Verified wallet: {formatAddress(verifiedAddress)}
        </p>
      ) : null}
    </div>
  );
}
