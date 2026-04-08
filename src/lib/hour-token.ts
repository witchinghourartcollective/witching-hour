import { erc20Abi } from "viem";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

export const HOUR_TOKEN_ADDRESS =
  "0xFC1c0FFF99845676A588CE21c28C4859F3035866";

const client = createPublicClient({
  chain: base,
  transport: http(),
});

export async function getHourBalance(address: `0x${string}`) {
  return client.readContract({
    address: HOUR_TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
  });
}
