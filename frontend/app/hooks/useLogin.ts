import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Cookies from "js-cookie";
import api from "../utils/axiosAuth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const AuthLoginMancer = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const token = await user.getIdToken();

    Cookies.set("authCookies", token, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: 1,
    });

    return { user, error: null };
  } catch (err: unknown) {
    if (err instanceof Error) return { user: null, error: err.message };
    return { user: null, error: "Unknown error" };
  }
};

export const loginBackend = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth", { email, password });

    Cookies.set("accessToken", response.data?.accessToken, {
      path: "/",
      expires: 1,
    });

    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) return { user: null, error: err.message };
    return { user: null, error: "Unknown error" };
  }
};

export const loginMancer = async (email: string, password: string) => {
  const backendResult = await loginBackend(email, password);
  if (backendResult.error) return backendResult;

  const firebaseResult = await AuthLoginMancer(email, password);
  if (firebaseResult.error) return firebaseResult;

  return { user: backendResult.user, error: null };
};

export const checkUsers = async () => {
  try {
    const response = await api.get("/auth/checkUsers");
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) return { user: null, error: err.message };
    return { user: null, error: "Unknown error" };
  }
};

export const UsersLogout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) return { user: null, error: err.message };
    return { user: null, error: "Unknown error" };
  }
};
