// src/services/authService.js

import axiosClient from "../api/axiosClient";
import Logger from "../logs/logger";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

const AUTH_BASE = "/auth";

// =====================================
// 1. REGISTRO
// =====================================
export const registroUsuario = async (data) => {
  try {
    const res = await axiosClient.post(`${AUTH_BASE}/registro`, data);
    Logger.info("POST /auth/registro", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error en registro de usuario", error);
    throw error;
  }
};

// =====================================
// 2. LOGIN
// =====================================
export const login = async (email, password) => {
  try {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const res = await axiosClient.post("/auth/login", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // Guardar token según la plataforma
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({
        key: "token",
        value: res.data.access_token,
      });
    } else {
      localStorage.setItem("token", res.data.access_token);
    }

    Logger.info("✅ Login exitoso", { email });
    return res.data;
  } catch (error) {
    Logger.error("❌ Error en login", error);
    throw error;
  }
};

// =====================================
// 3. OBTENER USUARIO ACTUAL
// =====================================
export const getUsuarioActual = async () => {
  try {
    const res = await axiosClient.get(`${AUTH_BASE}/me`);

    const roles = Array.isArray(res.data.roles)
      ? res.data.roles
      : res.data.rol
      ? [res.data.rol]
      : [];

    // Guardar roles según la plataforma
    if (Capacitor.isNativePlatform()) {
      await Preferences.set({
        key: "roles",
        value: JSON.stringify(roles),
      });
    } else {
      localStorage.setItem("roles", JSON.stringify(roles));
    }

    Logger.info("GET /auth/me", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo usuario actual", error);
    throw error;
  }
};

// =====================================
// 4. CAMBIO DE CONTRASEÑA
// =====================================
export const cambiarPassword = async (data) => {
  try {
    const res = await axiosClient.post(`${AUTH_BASE}/cambio-password`, data);
    Logger.info("POST /auth/cambio-password", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error cambiando password", error);
    throw error;
  }
};

// =====================================
// 5. RESET PASSWORD
// =====================================
export const solicitarResetPassword = async (email) => {
  try {
    const res = await axiosClient.post(`${AUTH_BASE}/reset-password`, { email });
    Logger.info("POST /auth/reset-password", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error solicitando reset password", error);
    throw error;
  }
};

// =====================================
// 6. CONFIRMAR RESET PASSWORD
// =====================================
export const confirmarResetPassword = async (token, nuevo_password) => {
  try {
    const res = await axiosClient.post(`${AUTH_BASE}/confirm-reset-password`, {
      token,
      nuevo_password,
    });
    Logger.info("POST /auth/confirm-reset-password", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error confirmando reset password", error);
    throw error;
  }
};

// =====================================
// 7. LOGOUT
// =====================================
export const logout = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      await Preferences.remove({ key: "token" });
      await Preferences.remove({ key: "roles" });
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("roles");
    }
    Logger.info("✅ Logout exitoso");
  } catch (error) {
    Logger.error("Error en logout", error);
    throw error;
  }
};

// =====================================
// 8. REGISTRO PADRE
// =====================================
export const registrarPadre = async (data) => {
  try {
    const res = await axiosClient.post(`/auth/registro-padre`, data);
    Logger.info("POST /auth/registro-padre", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error al registrar padre", error);
    throw error;
  }
};

// =====================================
// 9. OBTENER TOKEN (útil para axiosClient)
// =====================================
export const getToken = async () => {
  if (Capacitor.isNativePlatform()) {
    const { value } = await Preferences.get({ key: "token" });
    return value;
  } else {
    return localStorage.getItem("token");
  }
};