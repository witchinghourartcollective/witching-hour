import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { base } from "wagmi/chains";
import { baseAccount, injected } from "wagmi/connectors";
import { Attribution } from "ox/erc8021";

const BUILDER_CODE =
  process.env.NEXT_PUBLIC_BASE_BUILDER_CODE ?? "bc_rzjipz72";

const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: [BUILDER_CODE],
});

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    baseAccount({
      appName: "Witching Hour",
    }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  dataSuffix: DATA_SUFFIX,
  ssr: true,
  transports: {
    [base.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
