"use client";

import {
    darkTheme,
    getDefaultConfig,
    RainbowKitProvider
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import React from 'react';
import { WagmiProvider } from 'wagmi';
import { eduChainTestnet } from './utils/chains';

const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [eduChainTestnet],
    ssr: true,
});
const queryClient = new QueryClient();

function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    modalSize="compact"
                    theme={darkTheme({
                        accentColor: '#EF4444',
                        fontStack: 'system',
                        overlayBlur: 'small',
                    })}
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export default Providers;