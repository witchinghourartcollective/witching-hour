import { NextResponse } from "next/server";
import { issueNonce } from "../shared";

export async function GET() {
  return NextResponse.json({
    ok: true,
    nonce: issueNonce(),
    chainId: "0x2105",
  });
}
