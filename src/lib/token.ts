export const HOUR_TOKEN = {
  address: "0xFC1c0FFF99845676A588CE21c28C4859F3035866",
  decimals: 18,
  symbol: "hOUR",
  abi: [
    {
      name: "balanceOf",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "owner", type: "address" }],
      outputs: [{ name: "", type: "uint256" }],
    },
    {
      name: "transfer",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [
        { name: "to", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      outputs: [{ name: "", type: "bool" }],
    },
    {
      name: "tradingEnabled",
      type: "function",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "", type: "bool" }],
    },
  ],
} as const;
