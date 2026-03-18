"use client";

import "./globals.css";
import { WagmiProvider } from "wagmi";
import { config } from "../lib/wallet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <nav style={{ padding: "10px", borderBottom: "1px solid #222" }}>
              <a href="/feed" style={{ marginRight: "10px" }}>Feed</a>
              <a href="/token">Token</a>
            </nav>

            <main style={{ padding: "20px" }}>
              {children}
            </main>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
