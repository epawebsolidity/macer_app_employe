import { defineChain } from 'viem';

export const eduChainTestnet = defineChain({
  id: 656476,
  name: 'EduChain Testnet',
  network: 'educhain-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'EDU',
    symbol: 'EDU',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.open-campus-codex.gelato.digital'],
    },
    public: {
      http: ['https://rpc.open-campus-codex.gelato.digital'],
    },
  },
  blockExplorers: {
    default: {
      name: 'EduChainScan',
      url: 'https://testnet.eduscan.io',
    },
  },
  testnet: true,
  fees: {
    defaultPriorityFee: () => 1n,      // 1 wei
    defaultBaseFee: () => 1000000000n, // 1 gwei
  },
});
