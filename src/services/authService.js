// src/services/authService.js

import axiosClient from "../api/axiosClient";
import logger from "../logs/logger";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

const AUTH_BASE = "/auth";

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

export const registroUsuario = async (data) => {
  try {
    const res = await axiosClient.post(`${AUTH_BASE}/registro`, data);
    logger.info("POST /auth/registro", res.data);
    return res.data;
  } catch (error) {
    logger.error("Error en registro de usuario", error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const res = await axiosClient.post(`${AUTH_BASE}/login`, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    await setStorageItem("token", res.data.access_token);
    logger.info("Login exitoso", { email });
    return res.data;
  } catch (error) {
    const statusCode = error?.response?.status;
    const detail = error?.response?.data?.detail;

    if (statusCode === 403) {
      const customError = new Error(detail || "Email no verificado");
      customError.code = "EMAIL_NOT_VERIFIED";
      customError.status = 403;
      throw customError;
    }

    logger.error("Error en login", error);
    throw error;
  }
};

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

export const verificarEmail = async (token) => {
  const res = await axiosClient.get(`${AUTH_BASE}/verificar-email`, {
    params: { token },
  });
  return res.data;
};


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

export const logout = async () => {
  try {
    await removeStorageItem("token");
    await removeStorageItem("roles");
    logger.info("Logout exitoso");
  } catch (error) {
    logger.error("Error en logout", error);
    throw error;
  }
};

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

export const getToken = async () => {
  return await getStorageItem("token");
};

export const configurarCuenta = async ({ token, nuevo_password }) => {
  const res = await axiosClient.post("/auth/configurar-cuenta", {
    token,
    nuevo_password,
  });
  return res.data;
};
