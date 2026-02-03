import axios from "axios";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

// ✅ Base URL desde Vite env
const RAW_API_BASE = (import.meta.env.VITE_API_URL || "").trim();

// Normaliza: quita "/" final
let API_BASE = RAW_API_BASE.replace(/\/+$/, "");

// ✅ Blindaje: si el frontend está en HTTPS, jamás uses HTTP para backend (evita Mixed Content)
if (typeof window !== "undefined" && window.location.protocol === "https:") {
  API_BASE = API_BASE.replace(/^http:\/\//i, "https://");
}

// ✅ Si no está definida, al menos avisa (en prod debe venir)
if (!API_BASE) {
  console.warn("⚠️ Falta VITE_API_URL en tu .env / .env.production");
}

// ✅ Evita duplicar /api si ya viene incluido en VITE_API_URL
const BASE_URL = API_BASE.endsWith("/api") ? API_BASE : `${API_BASE}/api`;

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
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
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