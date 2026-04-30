import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { Attribution } from "ox/erc8021";
import {
  createPublicClient,
  createWalletClient,
  erc20Abi,
  formatEther,
  formatUnits,
  http,
  isAddress,
  parseEther,
  parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

const DEFAULT_BUILDER_CODE = "bc_rzjipz72";
const HOUR_TOKEN_ADDRESS = "0xFC1c0FFF99845676A588CE21c28C4859F3035866";
const HOUR_DECIMALS = 18;

function normalizeEnvValue(value) {
  const normalized = value?.trim();
  if (!normalized || normalized === "0x...") {
    return undefined;
  }

  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    return normalized.slice(1, -1);
  }

  return normalized;
}

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

      return normalizeEnvValue(line.slice(separatorIndex + 1));
    }
  } catch {}

  return undefined;
}

function getBuilderCode() {
  return (
    normalizeEnvValue(process.env.BASE_BUILDER_CODE) ??
    normalizeEnvValue(process.env.NEXT_PUBLIC_BASE_BUILDER_CODE) ??
    readEnvValue(resolve(process.cwd(), ".env.local"), "BASE_BUILDER_CODE") ??
    readEnvValue(resolve(process.cwd(), ".env.local"), "NEXT_PUBLIC_BASE_BUILDER_CODE") ??
    readEnvValue(resolve(process.cwd(), ".env"), "BASE_BUILDER_CODE") ??
    readEnvValue(resolve(process.cwd(), ".env"), "NEXT_PUBLIC_BASE_BUILDER_CODE") ??
    DEFAULT_BUILDER_CODE
  );
}

function getRpcUrl() {
  return (
    normalizeEnvValue(process.env.BASE_RPC_URL) ??
    normalizeEnvValue(process.env.RPC_URL) ??
    readEnvValue(resolve(process.cwd(), ".env.local"), "BASE_RPC_URL") ??
    readEnvValue(resolve(process.cwd(), ".env"), "BASE_RPC_URL")
  );
}

function getPrivateKey() {
  const tokenEnvPath = resolve(process.cwd(), "../witching-hour-token/.env");
  const privateKey =
    normalizeEnvValue(process.env.BASE_TEST_SENDER_PRIVATE_KEY) ??
    normalizeEnvValue(process.env.PRIVATE_KEY) ??
    readEnvValue(resolve(process.cwd(), ".env.local"), "BASE_TEST_SENDER_PRIVATE_KEY") ??
    readEnvValue(resolve(process.cwd(), ".env.local"), "PRIVATE_KEY") ??
    readEnvValue(resolve(process.cwd(), ".env"), "BASE_TEST_SENDER_PRIVATE_KEY") ??
    readEnvValue(resolve(process.cwd(), ".env"), "PRIVATE_KEY") ??
    readEnvValue(tokenEnvPath, "PRIVATE_KEY");

  if (!privateKey) {
    throw new Error(
      "Missing BASE_TEST_SENDER_PRIVATE_KEY or PRIVATE_KEY. You can also set PRIVATE_KEY in ../witching-hour-token/.env.",
    );
  }

  return privateKey;
}

function parseArgs(argv) {
  const [to, amount, ...rest] = argv;

  if (!to || !amount) {
    throw new Error(
      "Usage: node scripts/send-hour.mjs <to> <hour-amount> [--gas-topup <eth-amount>]",
    );
  }

  if (!isAddress(to)) {
    throw new Error(`Invalid recipient address: ${to}`);
  }

  const options = {
    to,
    amount,
    gasTopup: undefined,
  };

  for (let index = 0; index < rest.length; index += 1) {
    const flag = rest[index];

    if (flag === "--gas-topup") {
      const value = rest[index + 1];
      if (!value) {
        throw new Error("Expected an ETH amount after --gas-topup");
      }

      options.gasTopup = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${flag}`);
  }

  return options;
}

async function main() {
  const { to, amount, gasTopup } = parseArgs(process.argv.slice(2));
  const account = privateKeyToAccount(getPrivateKey());
  const rpcUrl = getRpcUrl();
  const publicClient = createPublicClient({
    chain: base,
    transport: http(rpcUrl),
  });
  const walletClient = createWalletClient({
    account,
    chain: base,
    dataSuffix: Attribution.toDataSuffix({
      codes: [getBuilderCode()],
    }),
    transport: http(rpcUrl),
  });

  const [senderHourBalance, senderEthBalance] = await Promise.all([
    publicClient.readContract({
      address: HOUR_TOKEN_ADDRESS,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [account.address],
    }),
    publicClient.getBalance({ address: account.address }),
  ]);

  const transferAmount = parseUnits(amount, HOUR_DECIMALS);

  if (senderHourBalance < transferAmount) {
    throw new Error(
      `Insufficient hOUR balance. Have ${formatUnits(senderHourBalance, HOUR_DECIMALS)}, need ${amount}.`,
    );
  }

  console.log(`From: ${account.address}`);
  console.log(`To: ${to}`);
  console.log(`Sender ETH: ${formatEther(senderEthBalance)}`);
  console.log(
    `Sender hOUR: ${formatUnits(senderHourBalance, HOUR_DECIMALS)}`,
  );

  const result = {};

  if (gasTopup) {
    const topupHash = await walletClient.sendTransaction({
      to,
      value: parseEther(gasTopup),
    });

    console.log(`ETH top-up hash: ${topupHash}`);
    await publicClient.waitForTransactionReceipt({ hash: topupHash });
    result.ethTopupHash = topupHash;
  }

  const hourHash = await walletClient.writeContract({
    address: HOUR_TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: "transfer",
    args: [to, transferAmount],
  });

  console.log(`hOUR transfer hash: ${hourHash}`);
  result.hourHash = hourHash;

  console.log(
    JSON.stringify({
      from: account.address,
      to,
      hourAmount: amount,
      gasTopup,
      ...result,
    }),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
