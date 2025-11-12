"use client";

import MancerBanner from "@/public/assets/images/mancer-banner.jpg";
import Image from "next/image";
import { useAccount, useBalance } from "wagmi";

const EDU_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_EDU_CONTRACT_ADDRESS;
const PHII_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PHII_CONTRACT_ADDRESS;

const PagesAdminHome = () => {
  const { address, isConnected } = useAccount();

  const { data: eduBalance, isLoading: isLoadingEdu } = useBalance({
    address: isConnected ? address : undefined,
    token: EDU_CONTRACT_ADDRESS,
    watch: true,
    enabled: !!isConnected,
  });

  const { data: phiiBalance, isLoading: isLoadingPhii } = useBalance({
    address: isConnected ? address : undefined,
    token: PHII_CONTRACT_ADDRESS,
    watch: true,
    enabled: !!isConnected,
  });

  return (
    <div className="min-h-screen bg-[#f9140D] text-white font-sans relative overflow-hidden px-6 md:px-16">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl mx-auto mt-24 hover:shadow-red-500/40 transition-shadow duration-300 overflow-hidden relative">
        {/* Gambar */}
        <div className="relative w-full h-48 sm:h-64 flex">
          <Image
            src={MancerBanner}
            alt="Mancer Banner"
            fill
            className="object-cover w-full h-full"
          />

          {/* Overlay teks di kanan */}
          <div className="absolute inset-0 bg-black/30 flex justify-end items-center p-4">
            <div className="flex flex-col text-right max-w-xs">
              <h2 className="text-white text-2xl sm:text-3xl font-bold drop-shadow-lg">
                Live Stream Wallet Transaction
              </h2>
              <p className="text-white text-xs mt-1 drop-shadow hidden sm:block">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias labore rerum laborum ex dignissimos rem laboriosam dolor quibusdam velit deleniti, tempore tenetur hic veritatis nam cumque assumenda blanditiis a amet?
              </p>

              <p className="text-white text-xs mt-1 drop-shadow sm:hidden">
                Join Mancer and get events and prizes that are useful for the future.
              </p>

              <button className="mt-3 px-4 py-2 bg-yellow-200 text-gray-900 font-bold text-xs rounded-lg hover:bg-red-700 transition w-max self-end">
                Join Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mt-8 max-w-3xl mx-auto bg-yellow-300 p-4 rounded-xl backdrop-blur border border-white/20">
          {!isConnected ? (
            <p className="text-center text-gray-900 text-sm opacity-80">
              Connect your wallet to view token balances.
            </p>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center text-gray-900 font-bold">
                <span className="opacity-80">EDU Balance</span>
                <span className="font-semibold">
                  {isLoadingEdu ? "Loading..." : eduBalance?.formatted} {eduBalance?.symbol}
                </span>
              </div>

              <div className="flex justify-between items-center text-gray-900 font-bold">
                <span className="opacity-80">PHII Balance</span>
                <span className="font-semibold">
                  {isLoadingPhii ? "Loading..." : phiiBalance?.formatted} {phiiBalance?.symbol}
                </span>
              </div>
            </div>
          )}
        </div>

      </div>
      <div className="max-w-3xl mx-auto h-20 bg-gradient-to-t from-[#f9140D] to-transparent flex py-6 justify-end pb-2 md:px-0">
        <h1 className="text-white font-semibold text-lg sm:text-2xl md:text-3xl">
          History Transaction
        </h1>
        <hr/>
      </div>

      <div className="max-w-3xl mx-auto mt-8 space-y-3">

  <div className="bg-white border border-white/20 rounded-lg p-4 flex justify-between items-center backdrop-blur transition">
    
    {/* Value & Date */}
    <div className="flex flex-col">
      <span className="text-gray-800 text-base font-semibold">Send 12.5 EDU</span>
      <span className="text-xs text-gray-800">20 Jan 2025 • 14:22</span>
    </div>

    {/* Detail Button */}
   <button
  className="text-xs px-3 py-1.5 rounded-full bg-[#f9140D] border border-white/30 text-white hover:shadow-[0_0_10px_rgba(249,20,13,0.8)] transition"
>
  View Details
</button>

  </div>

</div>

    </div>
  );
};

export default PagesAdminHome;
