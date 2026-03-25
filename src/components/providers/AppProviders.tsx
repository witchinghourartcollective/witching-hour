"use client";

import { useState } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "@privy-io/wagmi";
import { base } from "viem/chains";
import { config, supportedChains } from "@/lib/wallet";

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  if (!privyAppId) {
    throw new Error("Missing NEXT_PUBLIC_PRIVY_APP_ID.");
  }

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        defaultChain: base,
        loginMethods: ["wallet", "email"],
        supportedChains: [...supportedChains],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
