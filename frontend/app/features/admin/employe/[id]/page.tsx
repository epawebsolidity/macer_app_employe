"use client";

import { useEffect, useState } from "react";
import {
    createPublicClient,
    createWalletClient,
    custom,
    encodeFunctionData,
    erc20Abi,
    http,
} from "viem";

import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

import { streamAbi } from "@/abi/streamAbi";
import { EmployeUsers } from "@/app/hooks/useEmploye";
import { eduChainTestnet } from "@/app/utils/chains";
import type { Employee } from "@/types/Employe";

const EmployeeDetailPage = ({ params }: Employee) => {

    const { id } = params;

    // ENV
    const tokenAddress = process.env.NEXT_PUBLIC_PHII_CONTRACT_ADDRESS as `0x${string}`;
    const streamContract = process.env.NEXT_PUBLIC_STREAM_CONTRACT_ADDRESS as `0x${string}`;

    // LOCAL STATE
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [salary, setSalary] = useState("");

    const { address, isConnected } = useAccount();
    const { connect } = useConnect({
        connector: injected(),
    });

    // READ-ONLY CLIENT
    const publicClient = createPublicClient({
        chain: eduChainTestnet,
        transport: http(eduChainTestnet.rpcUrls.default.http[0]),
    });

    // FETCH EMPLOYEE DATA
    useEffect(() => {
        const fetchEmployee = async () => {
            const res = await EmployeUsers();
            const emp = res.data.find(
                (e: Employee) => e.id_employe === Number(id)
            );
            setEmployee(emp || null);
        };

        fetchEmployee();
    }, [id]);

    // HANDLE SEND TOKEN STREAM
    const handleSendReward = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isConnected || !address) {
            await connect();
            return;
        }

        try {
            console.log("Start TX…");

            const decimals = 18n;
            const salaryBig = BigInt(salary);
            const salaryWei = salaryBig * 10n ** decimals;

            // 30 hari
            let ratePerSecond = salaryWei / 2_592_000n;
            if (ratePerSecond === 0n) ratePerSecond = 1n;

            const walletClient = createWalletClient({
                chain: eduChainTestnet,
                transport: custom((window as any).ethereum),
            });

            console.log("sender:", address);
            console.log("salaryWei:", salaryWei.toString());
            console.log("ratePerSecond:", ratePerSecond.toString());

            // 🔎 CHECK BALANCE
            const balance: bigint = await publicClient.readContract({
                address: tokenAddress,
                abi: erc20Abi,
                functionName: "balanceOf",
                args: [address],
            });

            console.log("Balance:", balance.toString());

            if (balance < salaryWei) {
                throw new Error("Balance is not enough to stream this salary");
            }

            // 🔎 CHECK ALLOWANCE
            const allowance: bigint = await publicClient.readContract({
                address: tokenAddress,
                abi: erc20Abi,
                functionName: "allowance",
                args: [address, streamContract],
            });

            console.log("Allowance:", allowance.toString());

            // 🔓 APPROVE IF NEEDED
            if (allowance < salaryWei) {
                console.log("Approving token…");

                const approveData = encodeFunctionData({
                    abi: erc20Abi,
                    functionName: "approve",
                    args: [streamContract, salaryWei],
                });

                const approveTx = await walletClient.sendTransaction({
                    account: address,
                    to: tokenAddress,
                    data: approveData,
                    gas: 300000n,
                });

                console.log("APPROVE HASH:", approveTx);
            }

            // 📌 BUILD STREAM DATA (HARUS DI SINI)
            const streamData = encodeFunctionData({
                abi: streamAbi,
                functionName: "createAndDeposit",
                args: [
                    address,
                    "0x8Df44cbEae7E9227DE84947d9C350b18A1b5a04b",
                    ratePerSecond,
                    tokenAddress,
                    true,
                    salaryWei,
                ],
            });

            console.log("streamData:", streamData);

            // 🚀 SEND TRANSACTION
            const streamTx = await walletClient.sendTransaction({
                account: address,
                to: streamContract,
                data: streamData,
                gas: 800000n,
            });

            console.log("TX SUCCESS:", streamTx);

        } catch (err: any) {
            console.error("TX ERROR:", err);
        }
    };

    if (!employee) return <p>Loading...</p>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 md:px-16 py-24 font-sans text-gray-800">
            <div className="max-w-2xl mx-auto">

                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Employee Profile
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm md:text-base">
                        Detailed information about the selected employee
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex flex-col items-center text-center">

                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                            {employee.name.charAt(0)}
                        </div>

                        <h1 className="mt-4 text-2xl font-semibold text-gray-900">
                            {employee.name}
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Position:{" "}
                            <span className="font-medium text-gray-700">
                                {employee.position}
                            </span>
                        </p>

                        <div className="mt-6 w-full border-t border-gray-200 pt-4 text-sm">
                            <p className="text-gray-600">
                                <span className="font-medium text-gray-800">
                                    Date of Birth:
                                </span>{" "}
                                {employee.date_of_birth}
                            </p>
                        </div>

                        {/* FORM SEND */}
                        <form
                            onSubmit={handleSendReward}
                            className="mt-10 border-t border-gray-200 pt-6 text-center"
                        >
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <input
                                    type="number"
                                    placeholder="send PHII token..."
                                    className="w-full sm:w-2/3 px-4 text-xs py-2 border border-gray-300 rounded-lg
                            focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700"
                                    value={salary}
                                    onChange={(e) => setSalary(e.target.value)}
                                />

                                <button
                                    type="submit"
                                    className="bg-red-600 text-xs hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold shadow-md transition"
                                >
                                    Send
                                </button>
                            </div>
                        </form>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmployeeDetailPage;
