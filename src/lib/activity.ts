type BaseScanTransfer = {
  from: string;
  hash: string;
  to: string;
  value: string;
};

export async function fetchTransfers(address: string) {
  const apiKey = process.env.NEXT_PUBLIC_BASESCAN_API;

  const url = `https://api.basescan.org/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;

  const res = await fetch(url);
  const data = (await res.json()) as { result?: BaseScanTransfer[] };

  if (!data.result || !Array.isArray(data.result)) {
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
