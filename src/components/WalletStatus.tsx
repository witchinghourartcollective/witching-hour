'use client'

import { useSyncExternalStore } from 'react'
import { useAccount } from 'wagmi'

function subscribe() {
  return () => {}
}

export default function WalletStatus() {
  const { address, isConnected } = useAccount()
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)

  // ⛔ prevent hydration mismatch
  if (!mounted) return null

  return (
    <div style={{ padding: "20px" }}>
      <h2>Wallet Status</h2>
      <p>Connected: {isConnected ? "YES" : "NO"}</p>
      <p>Address: {address || "None"}</p>
    </div>
  )
}
