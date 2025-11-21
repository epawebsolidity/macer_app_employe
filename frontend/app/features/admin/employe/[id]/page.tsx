"use client"

import { streamAbi } from '@/abi/streamAbi';
import { eduChainTestnet } from '@/app/utils/chains';
import { useEffect, useState } from "react";
import { createPublicClient, erc20Abi, http } from "viem";
import { useAccount, useConnect, useWriteContract } from "wagmi";
import { injected } from "wagmi/connectors";

import { EmployeUsers } from "@/app/hooks/useEmploye";
import type { Employee } from "@/types/Employe";

const EmployeeDetailPage = ({ params }: Employee) => {
    const { id } = params;
    const decimals = 18; // token decimals

    const tokenAddress = process.env.NEXT_PUBLIC_PHII_CONTRACT_ADDRESS as `0x${string}`;
    const streamContract = process.env.NEXT_PUBLIC_STREAM_CONTRACT_ADDRESS as `0x${string}`;
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [salary, setSalary] = useState("");
    const [status_claim] = useState("NotClaimed");
    const { address, isConnected } = useAccount();
    const { connect } = useConnect({
        connector: injected(),
    });

    const publicClient = createPublicClient({
        chain: eduChainTestnet,
        transport: http(eduChainTestnet.rpcUrls.default.http[0]),
    });


    const { writeContractAsync } = useWriteContract();
    //const provider = useProvider();
    // Fetch employee data
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

    // Handle sending token
    const handleSendReward = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!address) {
            console.log("Wallet not connected");
            return;
        }

        try {
            console.log("Start TX…");

            //-----------------------------------------------------
            // 📌 1. HITUNG ANGKA
            //-----------------------------------------------------
            const decimals = 18n;
            const duration = 30n * 24n * 60n * 60n;

            const salaryWei = BigInt(salary) * 10n ** decimals;

            // ❌ stop multiplying by 1e18!
            //const ratePerSecond = (salaryWei * (10n ** 18n)) / duration;

            // ✔ this is correct
            const ratePerSecond = salaryWei / duration;

            // jumlah deposit (1 bulan penuh)
            const deposit = salaryWei;

            console.log("ratePerSecond fits uint128:", ratePerSecond <= (2n ** 128n - 1n));
            console.log("salaryWei:", salaryWei.toString());
            console.log("ratePerSecond:", ratePerSecond.toString());
            console.log("deposit:", deposit.toString());

            //-----------------------------------------------------
            // 📌 2. APPROVE TOKEN
            //-----------------------------------------------------
            console.log("Approving token…");

            await writeContractAsync({
                account: address,
                address: tokenAddress,
                abi: erc20Abi,
                functionName: "approve",
                args: [streamContract, deposit],
            });

            console.log("Approve success");

            //-----------------------------------------------------
            // 📌 3. TRANSFER TOKEN KE KONTRAK (SANGAT WAJIB)
            //-----------------------------------------------------
            console.log("Transfer token to contract…");

            await writeContractAsync({
                account: address,
                address: tokenAddress,
                abi: erc20Abi,
                functionName: "transferFrom",
                args: [
                    address,
                    streamContract,
                    deposit
                ],
            });

            console.log("transferFrom success");

            //-----------------------------------------------------
            // 📌 4. CEK BALANCE KONTRAK
            //-----------------------------------------------------
            const bal = await publicClient.readContract({
                address: tokenAddress,
                abi: erc20Abi,
                functionName: "balanceOf",
                args: [streamContract],
            });

            console.log("Contract balance now:", bal.toString());

            //-----------------------------------------------------
            // 📌 5. CREATE STREAM
            //-----------------------------------------------------
            console.log("Estimating gas…");

            const estimatedGas = await publicClient.estimateGas({
                account: address,
                address: streamContract,
                abi: streamAbi,
                functionName: "createAndDeposit",
                args: [address, recipient, ratePerSecond, tokenAddress, true, salaryWei],
            });

            const gas = estimatedGas; // dari step 1
            const maxFeePerGas = BigInt(1_000_000_000);        // 1 gwei
            const maxPriorityFeePerGas = BigInt(100_000_000);  // 0.1 gwei

            //-----------------------------------------------------
            // 📌 6. EXECUTE
            //-----------------------------------------------------
            console.log("Sending transaction…");

            await writeContractAsync({
                account: address,
                address: streamContract,
                abi: streamAbi,
                functionName: "createAndDeposit",
                args: [
                    address,
                    "0x8Df44cbEae7E9227DE84947d9C350b18A1b5a04b",
                    ratePerSecond,
                    tokenAddress,
                    true,
                    deposit,
                ],
                gas, // gas limit
                maxFeePerGas,
                maxPriorityFeePerGas
            });

            console.log("Transaction SUCCESS!");

        } catch (err) {
            console.error("TX ERROR:", err);
        }
    };


    if (!employee) return <p>Loading...</p>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 md:px-16 py-24 font-sans text-gray-800">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Employee Profile
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm md:text-base">
                        Detailed information about the selected employee
                    </p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex flex-col items-center text-center">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                            {employee.name.charAt(0)}
                        </div>

                        {/* Info */}
                        <h1 className="mt-4 text-2xl font-semibold text-gray-900">
                            {employee.name}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Position:{" "}
                            <span className="font-medium text-gray-700">
                                {employee.position}
                            </span>
                        </p>

                        {/* Date */}
                        <div className="mt-6 w-full border-t border-gray-200 pt-4 text-sm">
                            <p className="text-gray-600">
                                <span className="font-medium text-gray-800">
                                    Date of Birth:
                                </span>{" "}
                                {employee.date_of_birth}
                            </p>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSendReward}
                            className="mt-10 border-t border-gray-200 pt-6 text-center"
                        >
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <input
                                    type="number"
                                    placeholder="send token phii ..."
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

