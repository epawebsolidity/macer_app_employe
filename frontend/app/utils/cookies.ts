import { JwtPayloadCustom } from "@/types/JwtPayloadCustom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = () => {
  const token = Cookies.get("accessToken");
  if (!token) return null;

  const decoded = jwtDecode<JwtPayloadCustom>(token);
  return decoded.id;
};

export const clearAllClientCookies = () => {
  const all = Cookies.get();
  Object.keys(all).forEach((key) => Cookies.remove(key));
};



