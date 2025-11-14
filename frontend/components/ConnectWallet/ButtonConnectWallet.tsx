"use client";

import { createWalletUser, deleteWalletUser, getWalletByUserId } from "@/app/hooks/useWallet";
import { getUserIdFromToken } from "@/app/utils/cookies";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function ButtonConnectWallet() {
    const { address, isConnected, isConnecting } = useAccount();

    useEffect(() => {
        const handleWallet = async () => {
            const userId = getUserIdFromToken();
            if (!userId) return;
            if (isConnecting) return;
            if (!isConnected || !address) {
                await deleteWalletUser(userId);
                console.log("Wallet deleted because user disconnected");
                return;
            }
            const checkingWallet = await getWalletByUserId(userId);
            if (!checkingWallet) {
                await createWalletUser(userId, address);
                console.log("Wallet created");
                return;
            }
        };
        handleWallet();
    }, [isConnected, address, isConnecting]);

    return (
        <>
            <ConnectButton.Custom>
                {({ account, chain, openConnectModal, openAccountModal, openChainModal, mounted }) => {
                    const ready = mounted;
                    const connected = ready && account && chain;

                    return (
                        <div
                            {...(!ready && {
                                "aria-hidden": true,
                                style: { opacity: 0, pointerEvents: "none", userSelect: "none" },
                            })}
                        >
                            <div className="block md:hidden">
                                {!connected ? (
                                    <button
                                        onClick={openConnectModal}
                                        className="block w-full text-lg px-3 py-2 bg-transparent border-white border-2 text-white rounded-md font-bold hover:bg-red-300 transition"
                                    >
                                        Connect Wallet
                                    </button>
                                ) : chain.unsupported ? (
                                    <button
                                        onClick={openChainModal}
                                        className="block w-full text-lg px-3 py-2 bg-transparent border-white border-2 text-white rounded-md font-bold hover:bg-red-300 transition"
                                    >
                                        Wrong Network
                                    </button>
                                ) : (
                                    <button
                                        onClick={openAccountModal}
                                        className="block w-full text-lg px-3 py-2 bg-transparent border-white border-2 text-white rounded-md font-bold hover:bg-red-300 transition"
                                    >
                                        {account.displayName}
                                    </button>
                                )}

                            </div>

                            <div className="hidden md:block w-full">
                                {!connected ? (
                                    <button
                                        onClick={openConnectModal}
                                        className="text-xs px-3 py-1 border border-yellow-200 bg-yellow-200 text-gray-800 font-bold rounded-full hover:bg-yellow-400 hover:text-black"
                                    >
                                        Connect
                                    </button>
                                ) : chain.unsupported ? (
                                    <button
                                        onClick={openChainModal}
                                        className="text-xs px-3 py-1 border border-yellow-200 bg-yellow-200 text-gray-800 font-bold rounded-full hover:bg-yellow-400 hover:text-black"
                                    >
                                        Wrong network
                                    </button>
                                ) : (
                                    <button
                                        onClick={openAccountModal}
                                        className="text-xs px-3 py-1 border border-yellow-200 bg-yellow-200 text-gray-800 font-bold rounded-full hover:bg-yellow-400 hover:text-black"
                                    >
                                        {account.displayName}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                }}
            </ConnectButton.Custom>
        </>
    );
}
