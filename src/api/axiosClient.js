// src/api/axiosClient.js

import axios from "axios";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

// Base URL del backend
const BASE_URL = "http://192.168.54.20:8000/api";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 segundos
  headers: {
    "Content-Type": "application/json",
  },
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