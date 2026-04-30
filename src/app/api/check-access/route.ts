import { getHourBalance } from "@/lib/hour-token";
import { isAddress } from "viem";

export async function POST(req: Request) {
  try {
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
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to check hOUR balance.";

    return Response.json({ error: message }, { status: 503 });
  }
}
