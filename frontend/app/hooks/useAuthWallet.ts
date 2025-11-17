"use client";

import { useDisconnect } from "wagmi";
import { loginMancer, UsersLogout } from "./useLogin";

export function useAuthWallet() {
  const { disconnect } = useDisconnect();

  const loginWithClearWallet = async (email: string, password: string) => {
    await disconnect(); // pastikan wallet user sebelumnya terlepas
    return await loginMancer(email, password);
  };

  const logoutWithWallet = async () => {
    await disconnect();
    return await UsersLogout();
  };

  return { loginWithClearWallet, logoutWithWallet };
}
