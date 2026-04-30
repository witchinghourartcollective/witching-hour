import { erc20Abi } from "viem";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

export const HOUR_TOKEN_ADDRESS =
  "0xFC1c0FFF99845676A588CE21c28C4859F3035866";

const DEFAULT_BASE_RPC_URL = "https://mainnet.base.org";
const BALANCE_TIMEOUT_MS = 8_000;

function getBaseRpcUrl() {
  return (
    process.env.BASE_RPC_URL ??
    process.env.RPC_URL ??
    process.env.NEXT_PUBLIC_BASE_RPC_URL ??
    DEFAULT_BASE_RPC_URL
  );
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(
        new Error(
          `Timed out after ${timeoutMs}ms while connecting to the Base RPC endpoint.`,
        ),
      );
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

const client = createPublicClient({
  chain: base,
  transport: http(getBaseRpcUrl(), {
    retryCount: 0,
    timeout: BALANCE_TIMEOUT_MS,
  }),
});

export async function getHourBalance(address: `0x${string}`) {
  try {
    return await withTimeout(
      client.readContract({
        address: HOUR_TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
      }),
      BALANCE_TIMEOUT_MS,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Base RPC error.";

    throw new Error(
      `Unable to read the hOUR token balance from Base RPC (${getBaseRpcUrl()}): ${message}`,
    );
  }
}
