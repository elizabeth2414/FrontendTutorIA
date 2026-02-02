// src/api/axiosClient.js
import axios from "axios";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

// 🔒 FORZAMOS HTTPS EN PRODUCCIÓN (Azure)
const PROD_API = "https://tutor-ia-backend-6927.azurewebsites.net";
const DEV_API = "http://localhost:8000";

const isProd =
  typeof window !== "undefined" &&
  window.location.hostname.includes("azurewebsites.net");

const API_BASE = isProd ? PROD_API : DEV_API;
const BASE_URL = `${API_BASE}/api`;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Token
axiosClient.interceptors.request.use(async (config) => {
  let token = null;

  if (Capacitor.isNativePlatform()) {
    const { value } = await Preferences.get({ key: "token" });
    token = value;
  } else {
    token = localStorage.getItem("token");
  }

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401
axiosClient.interceptors.response.use(
  (r) => r,
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
