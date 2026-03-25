"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

type WalletConnectProps = {
  className?: string;
};

export function WalletConnect({ className }: WalletConnectProps) {
  const { address, isConnected } = useAccount();
  const { authenticated, connectWallet, login, logout, ready } = usePrivy();

  if (isConnected && address) {
    return (
      <div className={`flex items-center gap-2 ${className ?? ""}`.trim()}>
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/85">
          {truncateAddress(address)}
        </span>
        <button
          type="button"
          onClick={() => void logout()}
          className="rounded-full border border-white/15 px-3 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={!ready}
      onClick={() => {
        if (authenticated) {
          connectWallet();
          return;
        }

        login();
      }}
      className={`rounded-full border border-fuchsia-400/40 bg-fuchsia-500/10 px-4 py-2 text-sm font-medium text-fuchsia-100 transition hover:border-fuchsia-300/60 hover:bg-fuchsia-500/20 disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ""}`.trim()}
    >
      {!ready
        ? "Loading..."
        : authenticated
          ? "Connect wallet"
          : "Sign in"}
    </button>
  );
}
