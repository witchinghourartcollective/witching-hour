import { getHourBalance } from "@/lib/hour-token";
import { isAddress } from "viem";

export async function POST(req: Request) {
  const { address } = await req.json();

  if (!address || typeof address !== "string" || !isAddress(address)) {
    return Response.json(
      { error: "Wallet address is invalid." },
      { status: 400 },
    );
  }

  const balance = await getHourBalance(address);

  return Response.json({
    hasAccess: balance > 0n,
    balance: balance.toString(),
  });
}
