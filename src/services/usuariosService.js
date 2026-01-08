// src/services/usuariosService.js

import axiosClient from "../api/axiosClient";
import Logger from "../logs/logger";

const BASE_URL = "/usuarios";


// ==============================
// 1. LISTAR USUARIOS
// ==============================
export const listarUsuarios = async (params = {}) => {
  try {
    const res = await axiosClient.get(BASE_URL, { params });
    Logger.api("GET /usuarios", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error listando usuarios", error);
    throw error;
  }
};


// ==============================
// 2. OBTENER USUARIO POR ID
// ==============================
export const obtenerUsuario = async (usuario_id) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/${usuario_id}`);
    Logger.api(`GET /usuarios/${usuario_id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error obteniendo usuario ${usuario_id}`, error);
    throw error;
  }
};


// ==============================
// 3. ACTUALIZAR USUARIO
// ==============================
export const actualizarUsuario = async (usuario_id, data) => {
  try {
    const res = await axiosClient.put(`${BASE_URL}/${usuario_id}`, data);
    Logger.api(`PUT /usuarios/${usuario_id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error actualizando usuario ${usuario_id}`, error);
    throw error;
  }
};


// ==============================
// 4. ELIMINAR USUARIO (soft delete)
// ==============================
export const eliminarUsuario = async (usuario_id) => {
  try {
    const res = await axiosClient.delete(`${BASE_URL}/${usuario_id}`);
    Logger.api(`DELETE /usuarios/${usuario_id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error eliminando usuario ${usuario_id}`, error);
    throw error;
  }
};


// ==============================
// 5. AGREGAR ROL A USUARIO
// ==============================
export const agregarRolUsuario = async (usuario_id, rolData) => {
  try {
    const res = await axiosClient.post(`${BASE_URL}/${usuario_id}/roles`, rolData);
    Logger.api(`POST /usuarios/${usuario_id}/roles`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error agregando rol a usuario ${usuario_id}`, error);
    throw error;
  }
};


// ==============================
// 6. LISTAR ROLES DE USUARIO
// ==============================
export const listarRolesUsuario = async (usuario_id) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/${usuario_id}/roles`);
    Logger.api(`GET /usuarios/${usuario_id}/roles`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error listando roles de usuario ${usuario_id}`, error);
    throw error;
  }
};
