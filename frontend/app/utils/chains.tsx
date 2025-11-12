import { defineChain } from 'viem';

export const eduChainTestnet = defineChain({
  id: 656476, // contoh, pastikan ID chain benar
  name: 'EduChain Testnet',
  network: 'educhain-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'EDU',
    symbol: 'EDU',
  },
  rpcUrls: {
    default: {
      http: ['https://open-campus-codex-sepolia.drpc.org'], // ganti dengan RPC resmi
    },
    public: {
      http: ['https://open-campus-codex-sepolia.drpc.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'EduChainScan',
      url: 'https://testnet.eduscan.io', // contoh
    },
  },
  testnet: true,
});
