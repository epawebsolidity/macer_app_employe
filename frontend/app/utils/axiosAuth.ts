// utils/axiosAuth.ts
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api/v1",
  withCredentials: true,
  
});

// REQUEST
api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;

// RESPONSE
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // ⛔ Tidak ambil refreshToken dari Cookies — cukup kirim request saja
          const res = await axios.post(
            "http://127.0.0.1:5000/api/v1/auth/refreshToken",
            {},
            { withCredentials: true } // refreshToken dikirim otomatis via cookie
          );

          console.log("Token berhasil di-refresh", res);

          const newAccessToken = res.data.accessToken;
          Cookies.set("accessToken", newAccessToken, { path: "/" });

          // Ulangi request asli dengan token baru
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          isRefreshing = false;
          return api(originalRequest);
        } catch (err) {
          isRefreshing = false;
          console.error("Refresh token expired, harus login ulang.");
          //window.location.href = "/";
          return Promise.reject(err);
        }
      }

      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;
