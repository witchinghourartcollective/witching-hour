import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { Attribution } from "ox/erc8021";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const DEFAULT_BUILDER_CODE = "bc_rzjipz72";

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
  const hash = process.argv[2];
  const builderCode =
    process.env.BASE_BUILDER_CODE ??
    readEnvValue(resolve(process.cwd(), ".env.local"), "BASE_BUILDER_CODE") ??
    readEnvValue(resolve(process.cwd(), ".env"), "BASE_BUILDER_CODE") ??
    DEFAULT_BUILDER_CODE;
  const expectedSuffix = Attribution.toDataSuffix({
    codes: [builderCode],
  });

  if (!hash) {
    console.error("Usage: npm run verify:builder-code -- <tx-hash>");
    process.exit(1);
  }

  const client = createPublicClient({
    chain: base,
    transport: http(),
  });

  const transaction = await client.getTransaction({ hash });
  const input = transaction.input ?? "0x";
  const attribution = Attribution.fromData(input);

  console.log(`Transaction: ${hash}`);
  console.log(`Input: ${input}`);
  console.log(`Expected suffix: ${expectedSuffix}`);

  if (!attribution) {
    console.error("No ERC-8021 attribution suffix found in transaction input.");
    process.exit(2);
  }

  console.log("Decoded attribution:");
  console.log(JSON.stringify(attribution, null, 2));

  const hasBuilderCode =
    "codes" in attribution &&
    Array.isArray(attribution.codes) &&
    attribution.codes.includes(builderCode);

  if (!hasBuilderCode) {
    console.error(`Builder code ${builderCode} was not found in decoded attribution.`);
    process.exit(3);
  }

  console.log(`Verified builder code ${builderCode}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
