"use client";

import { EmployeUsersById } from "@/app/hooks/useEmploye";
import { getUserIdFromToken } from "@/app/utils/cookies";
import { useEffect, useState } from "react";

const PagesUsersHome = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const idUsers = getUserIdFromToken();

    const fetchEmployee = async () => {
      const res = await EmployeUsersById(idUsers);

      setEmployees(res?.data || []);
      setLoading(false);
    };

    fetchEmployee();
  }, []);

  const employee = employees[0]; // Ambil 1 employee saja

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white font-sans text-black px-6 md:px-16 py-24">

      <div className="w-full max-w-xl mx-auto">

        {/* HEADER USER */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-yellow-300 flex items-center justify-center text-xl font-semibold text-black shadow">
            {employee ? employee.name.charAt(0) : "?"}
          </div>

          <div>
            <h2 className="text-xl font-bold">
              {loading ? "Loading..." : "Welcome Back,"}
            </h2>

            <p className="text-gray-600 text-lg font-semibold">
              {loading
                ? "Fetching data..."
                : employee
                  ? employee.name
                  : "Unknown User"}
            </p>
          </div>
        </div>

        {/* CARD AIRDROP */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-yellow-200 hover:shadow-xl transition-all">

          {/* Title */}
          <h1 className="text-3xl font-bold tracking-wide">
            Airdrop Allocation
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Your PHII reward allocation is ready to claim.
          </p>

          {/* Allocation Display */}
          <div className="mt-7 bg-gradient-to-r from-yellow-200 to-yellow-100 p-6 rounded-2xl border border-yellow-300 shadow-inner">
            <p className="text-gray-700 text-sm font-medium">Your Allocation</p>
            <h2 className="text-4xl font-extrabold text-yellow-800 mt-1">
              100 PHII
            </h2>
          </div>

          {/* Claim Button */}
          <button
            className="mt-8 w-full py-3 bg-yellow-400 text-black font-bold rounded-2xl hover:bg-yellow-500 transition transform hover:-translate-y-0.5 shadow-md"
          >
            Claim Reward
          </button>
        </div>

      </div>
    </div>
  );
};

export default PagesUsersHome;

