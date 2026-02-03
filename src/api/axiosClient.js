import axios from "axios";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

const RAW_API_BASE = (import.meta.env.VITE_API_URL || "").trim();
let API_BASE = RAW_API_BASE.replace(/\/+$/, "");

if (typeof window !== "undefined" && window.location.protocol === "https:") {
  API_BASE = API_BASE.replace(/^http:\/\//i, "https://");
}

if (!API_BASE) {
  console.warn("⚠️ Falta VITE_API_URL en tu .env / .env.production");
}

const BASE_URL = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use(
  async (config) => {
    let token = null;

    if (Capacitor.isNativePlatform()) {
      const { value } = await Preferences.get({ key: "token" });
      token = value;
    } else {
      token = localStorage.getItem("token");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (Capacitor.isNativePlatform()) {
        await Preferences.remove({ key: "token" });
        await Preferences.remove({ key: "roles" });
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
      }

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
