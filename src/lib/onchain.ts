import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { Attribution } from "ox/erc8021";
import {
  erc20Abi,
  createPublicClient,
  createWalletClient,
  http,
  parseEther,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

import { HOUR_TOKEN_ADDRESS } from "@/lib/hour-token";

const DEFAULT_BUILDER_CODE = "bc_rzjipz72";

function normalizeEnvValue(value?: string) {
  const normalized = value?.trim();
  if (!normalized) return undefined;
  if (normalized === "0x...") return undefined;
  return normalized;
}

function readEnvValue(filePath: string, key: string) {
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

      return normalizeEnvValue(value);
    }
  } catch {}

  return undefined;
}

function getBuilderCode() {
  return (
    process.env.BASE_BUILDER_CODE ??
    process.env.NEXT_PUBLIC_BASE_BUILDER_CODE ??
    readEnvValue(resolve(process.cwd(), ".env.local"), "BASE_BUILDER_CODE") ??
    readEnvValue(resolve(process.cwd(), ".env"), "BASE_BUILDER_CODE") ??
    DEFAULT_BUILDER_CODE
  );
}

function getRpcUrl() {
  return normalizeEnvValue(
    process.env.BASE_RPC_URL ??
    process.env.RPC_URL ??
    readEnvValue(resolve(process.cwd(), ".env.local"), "BASE_RPC_URL") ??
    readEnvValue(resolve(process.cwd(), ".env"), "BASE_RPC_URL"),
  );
}

function getPrivateKey() {
  const tokenEnvPath = resolve(process.cwd(), "../witching-hour-token/.env");
  const privateKey = normalizeEnvValue(
    process.env.BASE_TEST_SENDER_PRIVATE_KEY ??
    process.env.PRIVATE_KEY ??
    readEnvValue(tokenEnvPath, "PRIVATE_KEY"),
  );

  if (!privateKey) {
    throw new Error(
      "Missing BASE_TEST_SENDER_PRIVATE_KEY or PRIVATE_KEY. You can also set PRIVATE_KEY in ../witching-hour-token/.env.",
    );
  }

  return privateKey as `0x${string}`;
}

function getAccount() {
  return privateKeyToAccount(getPrivateKey());
}

function createBasePublicClient() {
  return createPublicClient({
    chain: base,
    transport: http(getRpcUrl()),
  });
}

function createBaseWalletClient() {
  return createWalletClient({
    account: getAccount(),
    chain: base,
    dataSuffix: Attribution.toDataSuffix({
      codes: [getBuilderCode()],
    }),
    transport: http(getRpcUrl()),
  });
}

export function getAddress() {
  return getAccount().address;
}

export async function getTokenBalance(token?: `0x${string}`) {
  const publicClient = createBasePublicClient();

  return publicClient.readContract({
    address: token ?? HOUR_TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [getAddress()],
  });
}

export async function sendETH(to: `0x${string}`, amount: string) {
  const walletClient = createBaseWalletClient();

  return walletClient.sendTransaction({
    to,
    value: parseEther(amount),
  });
}
