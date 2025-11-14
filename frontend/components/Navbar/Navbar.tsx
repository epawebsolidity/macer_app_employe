"use client";

import { UsersLogout } from "@/app/hooks/useLogin";
import { clearAllClientCookies } from "@/app/utils/cookies";
import ButtonConnectWallet from "@/components/ConnectWallet/ButtonConnectWallet";
import logo from "@/public/assets/images/logo-mancer.png";
import { NavbarProps } from "@/types/NavbarProps";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar({ isOpen, setIsOpen, navItems }: NavbarProps) {

  const router = useRouter();
  const handleLogout = async () => {
    await UsersLogout();
    clearAllClientCookies();
    router.push("/");
  };

  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 z-50 w-full bg-[#f9140D] text-white">

        {/* Navbar Desktop Mancer */}
        <div className="mx-auto max-w-5xl flex items-center justify-between px-[10px] py-4 sm:px-[10px] relative">
          <button
            className="sm:hidden w-10 h-10 flex items-center justify-center text-white text-3xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "×" : "☰"}
          </button>
          <Image
            src={logo}
            alt="Logo Perusahaan"
            width={120}
            height={120}
            className="rounded-full filter brightness-0 invert"
          />
          <div className="hidden sm:flex items-center gap-6 ml-auto">
            {navItems.map(({ to, label }) => (
              <Link
                key={to}
                href={to}
                className="text-white hover:text-gray-200 text-sm font-bold"
              >
                {label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1 border border-purple-300 bg-purple-300 text-gray-800 font-bold rounded-full hover:bg-yellow-400 hover:text-black"
            >
              Logout
            </button>
            <ButtonConnectWallet />
          </div>
        </div>

        {/* Navbar Mobile Mancer */}
        {isOpen && (
          <div
            className="sm:hidden flex flex-col gap-3 px-4 py-5 
             bg-[#f9140D]
               text-white rounded-b-lg shadow-lg 
               animate-slideDown"
          >
            <div className="flex flex-col gap-3">
              {navItems.map(({ to, label }) => (
                <Link
                  key={to}
                  href={to}
                  className="relative px-3 py-2 rounded-md 
                 transition-all duration-200 
                 hover:bg-white/10 hover:pl-5 
                 active:scale-95"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="font-medium tracking-wide">{label}</span>
                  <span
                    className="absolute left-0 bottom-0 h-[2px] w-0 font-bold bg-white 
                   transition-all duration-300 group-hover:w-full"
                  ></span>
                </Link>
              ))}
              <ButtonConnectWallet />
              <button
                onClick={handleLogout}
                className="mt-3 px-3 py-2 bg-yellow-200 text-gray-900 rounded-md 
               hover:bg-white/20 transition-all duration-200 
               active:scale-95 tracking-wide font-bold"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
