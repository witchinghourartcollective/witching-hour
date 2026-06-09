"use client";

import { useEffect, useState } from "react";
import { createSiweMessage } from "viem/siwe";
import { useAccount, useSignMessage } from "wagmi";
import { base } from "wagmi/chains";

function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message
  ) {
    return error.message;
  }

  if (
    error &&
    typeof error === "object" &&
    "shortMessage" in error &&
    typeof error.shortMessage === "string" &&
    error.shortMessage
  ) {
    return error.shortMessage;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Unexpected SIWE sign-in error.";
  }
}

export function SignInWithBasePanel() {
  const { address, chainId, isConnected } = useAccount();
  const [status, setStatus] = useState(
    "Connect a wallet and sign a SIWE message to identify yourself in the Base app.",
  );
  const [verifiedAddress, setVerifiedAddress] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { signMessageAsync } = useSignMessage();

  async function refreshSession() {
    const response = await fetch("/api/base-auth/session", {
      cache: "no-store",
    });
    const payload = (await response.json()) as {
      ok?: boolean;
      authenticated?: boolean;
      address?: string;
      error?: string;
    };

    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || "Failed to load Base auth session.");
    }

    if (payload.authenticated && payload.address) {
      setVerifiedAddress(payload.address);
      setStatus(`Signed in as ${formatAddress(payload.address)}.`);
      return;
    }

    setVerifiedAddress(null);
  }

  useEffect(() => {
    if (!isConnected || !address) {
      setVerifiedAddress(null);
      setStatus(
        "Connect a wallet and sign a SIWE message to identify yourself in the Base app.",
      );
      return;
    }

    if (verifiedAddress && verifiedAddress.toLowerCase() !== address.toLowerCase()) {
      setVerifiedAddress(null);
      setStatus("Wallet changed. Sign in again to refresh the Base app identity.");
    }
  }, [address, isConnected, verifiedAddress]);

  useEffect(() => {
    if (!isConnected || !address || chainId !== base.id) {
      return;
    }

    void refreshSession().catch((error) => {
      setStatus(getErrorMessage(error));
    });
  }, [address, chainId, isConnected]);

  async function handleSignIn() {
    if (!isConnected || !address || !chainId) {
      setStatus("Connect your wallet before signing in.");
      return;
    }

    if (chainId !== base.id) {
      setStatus("Switch the connected wallet to Base before signing in.");
      return;
    }

    setIsSigningIn(true);
    setVerifiedAddress(null);

    try {
      setStatus("Requesting a server nonce...");
      const nonceResponse = await fetch("/api/base-auth/nonce");
      const noncePayload = (await nonceResponse.json()) as {
        ok?: boolean;
        nonce?: string;
        chainId?: string;
        error?: string;
      };

      if (!nonceResponse.ok || !noncePayload.ok || !noncePayload.nonce) {
        throw new Error(noncePayload.error || "Failed to issue a SIWE nonce.");
      }

      const expectedChainId = noncePayload.chainId
        ? Number.parseInt(noncePayload.chainId, 16)
        : base.id;

      const message = createSiweMessage({
        address,
        chainId: expectedChainId,
        domain: window.location.host,
        nonce: noncePayload.nonce,
        uri: window.location.origin,
        version: "1",
        statement: "Sign in to Witching Hour on Base.",
      });

      setStatus("Awaiting SIWE signature...");
      const signature = await signMessageAsync({ message });

      setStatus("Verifying the SIWE signature with the app server...");
      const verifyResponse = await fetch("/api/base-auth/verify", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          address,
          message,
          signature,
        }),
      });
      const verifyPayload = (await verifyResponse.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!verifyResponse.ok || !verifyPayload.ok) {
        throw new Error(verifyPayload.error || "SIWE verification failed.");
      }

      await refreshSession();
      setStatus("SIWE sign-in succeeded.");
    } catch (error) {
      setStatus(getErrorMessage(error));
    } finally {
      setIsSigningIn(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-blue-400/20 bg-blue-500/10 p-6 shadow-[0_0_80px_rgba(0,102,255,0.14)] backdrop-blur">
      <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">
        SIWE Identity
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-white">
        Sign in with Ethereum
      </h2>
      <p className="mt-3 text-sm leading-7 text-white/75">
        The Base app does not expose Farcaster identity here, so authentication
        uses SIWE and the connected wallet address as the user identity.
      </p>
      <button
        type="button"
        onClick={() => void handleSignIn()}
        disabled={!isConnected || isSigningIn || chainId !== base.id}
        className="mt-6 rounded-full bg-blue-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSigningIn ? "Signing in..." : "Sign in with Ethereum"}
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
