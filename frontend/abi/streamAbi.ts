export const streamAbi = [
  {
    name: "createAndDeposit",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "sender", type: "address" },
      { name: "recipient", type: "address" },
      { name: "ratePerSecond", type: "uint256" },
      { name: "token", type: "address" },
      { name: "transferable", type: "bool" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
];

