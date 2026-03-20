"use client";

import { useState } from "react";
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { parseUnits } from "viem";
import { base, mainnet } from "wagmi/chains";
import { HOUR_TOKEN } from "@/lib/token";

export default function Feed() {
  const [error, setError] = useState("");

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const { writeContract } = useWriteContract();

  const switchChain = async (targetChainId: number) => {
    try {
      setError("");
      await switchChainAsync({ chainId: targetChainId });
    } catch {
      setError("Network switch was rejected or is not supported by this wallet.");
    }
  };

  const handleTip = () => {
    setError("");

    if (!address) {
      setError("Connect wallet first");
      return;
    }

    if (chainId !== base.id) {
      setError("Tips only work on Base. Switch networks before sending hOUR.");
      return;
    }

    writeContract({
      address: HOUR_TOKEN.address,
      abi: HOUR_TOKEN.abi,
      functionName: "transfer",
      args: [
        "0xA327c87770893178144C422511cfaC682c926C6A",
        parseUnits("1", 18),
      ],
    });
  };

  return (
    <div>
      <h2>Feed</h2>

      {!isConnected ? (
        <button onClick={() => connect({ connector: connectors[0] })}>
          Connect Wallet
        </button>
      ) : (
        <div>
          <p>Connected: {address}</p>
          <p>Network: {chainId === base.id ? "Base" : `Chain ${chainId}`}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
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
        <button onClick={handleTip} disabled={!isConnected || chainId !== base.id}>
          Tip 1 hOUR
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
