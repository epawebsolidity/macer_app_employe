"use client";

import tokenAbi from "@/abi/tokenAbi.ts";
import { getAllowcationAirdrop } from "@/app/hooks/useAirdrop";
import { EmployeUsersById } from "@/app/hooks/useEmploye";
import { getUserIdFromToken } from "@/app/utils/cookies";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useWriteContract } from "wagmi";
import { injected } from "wagmi/connectors";
// const AIRDROP_ABI = [
//   {
//     inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
//     name: "claimReward",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
// ];

const PagesUsersHome = () => {
  const [employees, setEmployees] = useState([]);
  const [salary, setSalary] = useState([]);
  const [loading, setLoading] = useState(true);

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: injected(),
  });
  const { writeContract, isPending } = useWriteContract();

  useEffect(() => {
    const loadData = async () => {
      const idUsers = getUserIdFromToken();

      const empRes = await EmployeUsersById(Number(idUsers));
      const empData = empRes?.data || [];
      setEmployees(empData);

      const employee = empData[0];
      if (employee) {
        const res = await getAllowcationAirdrop(employee.id_employe);
        setSalary(res || []);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const employee = employees[0];
  const salaryValue = salary.length > 0 ? Number(salary[0].salary) : 0;

  console.log(salary.length > 0 ? Number(salary[0].salary) : 0);
  const decimals = 18; // token decimals
  const salaryValue0 = salaryValue; // dari D
  const amount = parseUnits(salaryValue0, decimals); // BigInt
  const handleClaim = async () => {
    if (!isConnected) {
      connect();
      return;
    }

    try {
      await writeContract({
        address: process.env.NEXT_PUBLIC_PHII_CONTRACT_ADDRESS as `0x${string}`,
        abi: tokenAbi,
        functionName: "withdrawMax",
        args: [amount, address],
      });


      alert("Reward claimed!");
    } catch (error) {
      console.error(error);
      alert("Failed to claim reward");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white font-sans text-black px-6 md:px-16 py-24">
      <div className="w-full max-w-xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-yellow-300 flex items-center justify-center text-xl font-semibold text-black shadow">
            {employee ? employee.name[0] : ""}
          </div>

          <div>
            <h2 className="text-xl font-bold">
              {loading ? "Loading..." : "Welcome Back,"}
            </h2>

            <p className="text-gray-600 text-lg font-semibold">
              {employee ? employee.name : "Unknown User"}
            </p>
          </div>
        </div>

        {/* CARD */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-yellow-200 hover:shadow-xl transition-all">
          <h1 className="text-3xl font-bold tracking-wide">Airdrop Allocation</h1>
          <p className="text-gray-500 text-sm mt-1">Your PHII reward allocation is ready to claim.</p>

          <div className="mt-7 bg-gradient-to-r from-yellow-200 to-yellow-100 p-6 rounded-2xl border border-yellow-300 shadow-inner">
            <p className="text-gray-700 text-sm font-medium">Your Allocation</p>
            <h2 className="text-4xl font-extrabold text-yellow-800 mt-1">
              {salaryValue} PHII
            </h2>
          </div>

          <button
            onClick={handleClaim}
            disabled={isPending}
            className="mt-8 w-full py-3 bg-yellow-400 text-black font-bold rounded-2xl hover:bg-yellow-500 transition transform hover:-translate-y-0.5 shadow-md"
          >
            {isPending ? "Processing..." : "Claim Reward"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PagesUsersHome;
