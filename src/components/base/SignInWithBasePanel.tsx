"use client";

import { useState } from "react";
import { createSiweMessage, generateSiweNonce } from "viem/siwe";
import { useAccount, usePublicClient, useSignMessage } from "wagmi";

function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function SignInWithBasePanel() {
  const { address, chainId, isConnected } = useAccount();
  const [status, setStatus] = useState(
    "Connect a wallet and sign a SIWE message to identify yourself in the Base app.",
  );
  const [verifiedAddress, setVerifiedAddress] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { signMessageAsync } = useSignMessage();
  const publicClient = usePublicClient();

  async function handleSignIn() {
    if (!isConnected || !address || !chainId || !publicClient) {
      setStatus("Connect your wallet before signing in.");
      return;
    }

    setIsSigningIn(true);
    setVerifiedAddress(null);

    try {
      const nonce = generateSiweNonce();
      const message = createSiweMessage({
        address,
        chainId,
        domain: window.location.host,
        nonce,
        uri: window.location.origin,
        version: "1",
      });

      setStatus("Awaiting SIWE signature...");
      const signature = await signMessageAsync({ message });

      setStatus("Verifying the SIWE signature locally...");
      const valid = await publicClient.verifySiweMessage({ message, signature });

      if (!valid) {
        throw new Error("SIWE verification failed.");
      }

      setVerifiedAddress(address);
      setStatus("SIWE sign-in succeeded.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Unexpected SIWE sign-in error.",
      );
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
        disabled={!isConnected || isSigningIn}
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
