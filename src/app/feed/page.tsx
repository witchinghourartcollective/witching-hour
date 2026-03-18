"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function Feed() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

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
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      )}

      <div style={{ border: "1px solid #222", padding: "10px", marginTop: "20px" }}>
        <p>User: 0x123...</p>
        <p>First signal dropped.</p>
        <button>Tip hOUR</button>
      </div>
    </div>
  );
}
