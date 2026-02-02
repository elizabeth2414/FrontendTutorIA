import axios from "axios";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

// ✅ Base URL desde Vite env
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const BASE_URL = `${API_BASE}/api`;

if (!API_BASE) {
  console.warn("⚠️ Falta VITE_API_URL en tu .env / .env.production");
}

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Interceptor para agregar token a todas las peticiones
axiosClient.interceptors.request.use(
  async (config) => {
    let token = null;

    // Obtener token según la plataforma
    if (Capacitor.isNativePlatform()) {
      const { value } = await Preferences.get({ key: "token" });
      token = value;
    } else {
      token = localStorage.getItem("token");
    }

    // Agregar token si existe
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si el token expiró (401), redirigir al login
    if (error.response?.status === 401) {
      // Limpiar token
      if (Capacitor.isNativePlatform()) {
        await Preferences.remove({ key: "token" });
        await Preferences.remove({ key: "roles" });
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
      }
      
      // Redirigir al login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;