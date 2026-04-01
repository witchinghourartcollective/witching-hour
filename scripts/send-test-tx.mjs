import { parseEther, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { Attribution } from "ox/erc8021";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const DEFAULT_BUILDER_CODE = "bc_rzjipz72";
const DEFAULT_TO = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";
const DEFAULT_AMOUNT = "0.000001";

function readEnvValue(filePath, key) {
  try {
    const contents = readFileSync(filePath, "utf8");
    for (const rawLine of contents.split("\n")) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) continue;
      const currentKey = line.slice(0, separatorIndex).trim();
      if (currentKey !== key) continue;
      let value = line.slice(separatorIndex + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      return value;
    }
  } catch {}

  return undefined;
}

async function main() {
  const tokenEnvPath = resolve(process.cwd(), "../witching-hour-token/.env");
  const builderCode =
    process.env.BASE_BUILDER_CODE ??
    readEnvValue(resolve(process.cwd(), ".env.local"), "BASE_BUILDER_CODE") ??
    readEnvValue(resolve(process.cwd(), ".env"), "BASE_BUILDER_CODE") ??
    DEFAULT_BUILDER_CODE;
  const privateKey =
    process.env.BASE_TEST_SENDER_PRIVATE_KEY ??
    process.env.PRIVATE_KEY ??
    readEnvValue(tokenEnvPath, "PRIVATE_KEY");

  if (!privateKey) {
    console.error("Missing sender private key.");
    console.error(
      "Set BASE_TEST_SENDER_PRIVATE_KEY or PRIVATE_KEY, or add PRIVATE_KEY to ../witching-hour-token/.env.",
    );
    process.exit(1);
  }

  const to = process.argv[2] ?? DEFAULT_TO;
  const amount = process.argv[3] ?? DEFAULT_AMOUNT;

  const account = privateKeyToAccount(privateKey);
  const dataSuffix = Attribution.toDataSuffix({
    codes: [builderCode],
  });

  const walletClient = createWalletClient({
    account,
    chain: base,
    dataSuffix,
    transport: http(process.env.BASE_RPC_URL),
  });

  console.log(`From: ${account.address}`);
  console.log(`To: ${to}`);
  console.log(`Amount (ETH): ${amount}`);
  console.log(`Builder code: ${builderCode}`);

  const hash = await walletClient.sendTransaction({
    to,
    value: parseEther(amount),
  });

  console.log(`tx hash: ${hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
