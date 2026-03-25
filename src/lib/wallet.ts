import { createConfig } from "@privy-io/wagmi";
import { base, mainnet } from "viem/chains";
import { http } from "wagmi";

export const supportedChains = [base, mainnet] as const;

export const config = createConfig({
  chains: supportedChains,
  ssr: true,
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});
