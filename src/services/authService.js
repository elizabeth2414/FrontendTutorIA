// src/services/authService.js

import axiosClient from "../api/axiosClient";
import logger from "../logs/logger";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

const AUTH_BASE = "/auth";

// =====================================
// Helpers storage (web / mobile)
// =====================================
const setStorageItem = async (key, value) => {
  if (Capacitor.isNativePlatform()) {
    await Preferences.set({ key, value });
  } else {
    localStorage.setItem(key, value);
  }
};

const getStorageItem = async (key) => {
  if (Capacitor.isNativePlatform()) {
    const { value } = await Preferences.get({ key });
    return value;
  }
  return localStorage.getItem(key);
};

const removeStorageItem = async (key) => {
  if (Capacitor.isNativePlatform()) {
    await Preferences.remove({ key });
  } else {
    localStorage.removeItem(key);
  }
};

// =====================================
// 1. REGISTRO
// =====================================
export const registroUsuario = async (data) => {
  try {
    const res = await axiosClient.post(`${AUTH_BASE}/registro`, data);
    logger.info("POST /auth/registro", res.data);
    // Importante: el backend ya envía correo de verificación
    return res.data;
  } catch (error) {
    logger.error("Error en registro de usuario", error);
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

    const res = await axiosClient.post(`${AUTH_BASE}/login`, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // Guardar token
    await setStorageItem("token", res.data.access_token);

    logger.info("✅ Login exitoso", { email });
    return res.data;
  } catch (error) {
    // ⭐ Manejo especial: email no verificado (403)
    const statusCode = error?.response?.status;
    const detail = error?.response?.data?.detail;

    if (statusCode === 403) {
      logger.warn("⚠️ Login bloqueado: email no verificado", { email, detail });
      // Lanzamos un error más fácil de manejar en UI
      const customError = new Error(detail || "Email no verificado");
      customError.code = "EMAIL_NOT_VERIFIED";
      customError.status = 403;
      throw customError;
    }

    logger.error("❌ Error en login", error);
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

    await setStorageItem("roles", JSON.stringify(roles));

    logger.info("GET /auth/me", res.data);
    return res.data;
  } catch (error) {
    logger.error("Error obteniendo usuario actual", error);
    throw error;
  }
};

// =====================================
// 4. CAMBIO DE CONTRASEÑA
// =====================================
export const cambiarPassword = async (data) => {
  try {
    const res = await axiosClient.post(`${AUTH_BASE}/cambio-password`, data);
    logger.info("POST /auth/cambio-password", res.data);
    return res.data;
  } catch (error) {
    logger.error("Error cambiando password", error);
    throw error;
  }
};

// =====================================
// 5. RESET PASSWORD
// =====================================
export const solicitarResetPassword = async (email) => {
  try {
    const res = await axiosClient.post(`${AUTH_BASE}/reset-password`, { email });
    logger.info("POST /auth/reset-password", res.data);
    return res.data;
  } catch (error) {
    logger.error("Error solicitando reset password", error);
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
    logger.info("POST /auth/confirm-reset-password", res.data);
    return res.data;
  } catch (error) {
    logger.error("Error confirmando reset password", error);
    throw error;
  }
};

// =====================================
// 7. VERIFICAR EMAIL (NUEVO)
// Llamado cuando el frontend recibe el token por URL
// Ej: /verificar-email?token=xxx -> llamas a esto
// =====================================
export const verificarEmail = async (token) => {
  try {
    const res = await axiosClient.get(`${AUTH_BASE}/verificar-email`, {
      params: { token },
    });
    logger.info("GET /auth/verificar-email", res.data);
    return res.data;
  } catch (error) {
    logger.error("Error verificando email", error);
    throw error;
  }
};

// =====================================
// 8. REENVIAR VERIFICACIÓN (NUEVO)
// Útil si el usuario intenta loguearse y no verificó
// =====================================
export const reenviarVerificacion = async (email) => {
  try {
    const res = await axiosClient.post(`${AUTH_BASE}/reenviar-verificacion`, {
      email,
    });
    logger.info("POST /auth/reenviar-verificacion", res.data);
    return res.data;
  } catch (error) {
    logger.error("Error reenviando verificación", error);
    throw error;
  }
};

// =====================================
// 9. LOGOUT
// =====================================
export const logout = async () => {
  try {
    await removeStorageItem("token");
    await removeStorageItem("roles");
    logger.info("✅ Logout exitoso");
  } catch (error) {
    logger.error("Error en logout", error);
    throw error;
  }
};

// =====================================
// 10. REGISTRO PADRE
// =====================================
export const registrarPadre = async (data) => {
  try {
    const res = await axiosClient.post(`${AUTH_BASE}/registro-padre`, data);
    logger.info("POST /auth/registro-padre", res.data);
    return res.data;
  } catch (error) {
    logger.error("Error al registrar padre", error);
    throw error;
  }
};

// =====================================
// 11. OBTENER TOKEN (útil para axiosClient)
// =====================================
export const getToken = async () => {
  return await getStorageItem("token");
};
