"use client";

import { useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { parseUnits } from "viem";
import { base, mainnet } from "wagmi/chains";
import { WalletConnect } from "@/components/wallet/WalletConnect";
import { TransactionButton } from "@/components/wallet/TransactionButton";
import { HOUR_TOKEN } from "@/lib/token";

const tipCall = {
  address: HOUR_TOKEN.address,
  abi: HOUR_TOKEN.abi,
  functionName: "transfer",
  args: [
    "0xA327c87770893178144C422511cfaC682c926C6A",
    parseUnits("1", 18),
  ],
} as const;

export default function Feed() {
  const [error, setError] = useState("");

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();

  const switchChain = async (targetChainId: number) => {
    try {
      setError("");
      await switchChainAsync({ chainId: targetChainId });
    } catch {
      setError("Network switch was rejected or is not supported by this wallet.");
    }
  };

  return (
    <div>
      <h2>Feed</h2>

      {!isConnected ? (
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <WalletConnect />
        </div>
      ) : (
        <div>
          <p>Connected: {address}</p>
          <p>Network: {chainId === base.id ? "Base" : `Chain ${chainId}`}</p>
          <WalletConnect />
        </div>
      )}

      <button
        onClick={() => switchChain(chainId === base.id ? mainnet.id : base.id)}
        disabled={!isConnected || isSwitching}
        style={{ marginTop: "10px" }}
      >
        {isSwitching
          ? "Switching..."
          : chainId === base.id
            ? "Switch to ETH"
            : "Switch to Base"}
      </button>

      <div style={{ marginTop: "20px" }}>
        <TransactionButton
          call={tipCall}
          chainId={base.id}
          buttonText="Tip 1 hOUR"
          disabled={!isConnected}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
