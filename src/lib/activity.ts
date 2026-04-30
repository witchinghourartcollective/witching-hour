type BaseScanTransfer = {
  from: string;
  hash: string;
  to: string;
  value: string;
};

const ETHERSCAN_V2_BASE_URL = "https://api.etherscan.io/v2/api";
const BASE_CHAIN_ID = 8453;

export async function fetchTransfers(address: string) {
  const apiKey = process.env.NEXT_PUBLIC_BASESCAN_API;

  if (!apiKey) {
    return [];
  }

  const url = new URL(ETHERSCAN_V2_BASE_URL);
  url.searchParams.set("chainid", String(BASE_CHAIN_ID));
  url.searchParams.set("module", "account");
  url.searchParams.set("action", "tokentx");
  url.searchParams.set("address", address);
  url.searchParams.set("startblock", "0");
  url.searchParams.set("endblock", "99999999");
  url.searchParams.set("sort", "desc");
  url.searchParams.set("apikey", apiKey);

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`BaseScan request failed with status ${res.status}.`);
  }

  const data = (await res.json()) as {
    message?: string;
    result?: BaseScanTransfer[] | string;
    status?: string;
  };

  if (typeof data.result === "string") {
    const normalized = data.result.toLowerCase();
    if (normalized.includes("no transactions found")) {
      return [];
    }

    if (
      normalized.includes("free api access is not supported for this chain") ||
      normalized.includes("deprecated v1 endpoint")
    ) {
      return [];
    }

    throw new Error(data.result);
  }

  if (!Array.isArray(data.result)) {
    return [];
  }

  return data.result.slice(0, 10).map((tx) => {
    const isSender = tx.from.toLowerCase() === address.toLowerCase();

    return {
      id: tx.hash,
      user: isSender ? tx.to : tx.from,
      type: isSender ? "sent" : "received",
      amount: Number(tx.value) / 1e18,
      hash: tx.hash,
    };
  });
}
