// src/services/estudiantesService.js

import axiosClient from "../api/axiosClient";
import Logger from "../logs/logger";

const BASE_URL = "/estudiantes";


// =====================================
// 1. CREAR ESTUDIANTE
// =====================================
export const crearEstudiante = async (data) => {
  try {
    const res = await axiosClient.post(BASE_URL, data);
    Logger.api("POST /estudiantes", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error creando estudiante", error);
    throw error;
  }
};


// =====================================
// 2. LISTAR ESTUDIANTES
// =====================================
export const listarEstudiantes = async (params = {}) => {
  try {
    const res = await axiosClient.get(BASE_URL, { params });
    Logger.api("GET /estudiantes", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error listando estudiantes", error);
    throw error;
  }
};


// =====================================
// 3. OBTENER ESTUDIANTE POR ID
// =====================================
export const obtenerEstudiante = async (estudiante_id) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/${estudiante_id}`);
    Logger.api(`GET /estudiantes/${estudiante_id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error obteniendo estudiante ${estudiante_id}`, error);
    throw error;
  }
};


// =====================================
// 4. ACTUALIZAR ESTUDIANTE
// =====================================
export const actualizarEstudiante = async (estudiante_id, data) => {
  try {
    const res = await axiosClient.put(`${BASE_URL}/${estudiante_id}`, data);
    Logger.api(`PUT /estudiantes/${estudiante_id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error actualizando estudiante ${estudiante_id}`, error);
    throw error;
  }
};


// =====================================
// 5. ELIMINAR ESTUDIANTE (soft delete)
// =====================================
export const eliminarEstudiante = async (estudiante_id) => {
  try {
    const res = await axiosClient.delete(`${BASE_URL}/${estudiante_id}`);
    Logger.api(`DELETE /estudiantes/${estudiante_id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error eliminando estudiante ${estudiante_id}`, error);
    throw error;
  }
};


// =====================================
// 6. OBTENER NIVEL Y PROGRESO DEL ESTUDIANTE
// =====================================
export const obtenerNivelEstudiante = async (estudiante_id) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/${estudiante_id}/nivel`);
    Logger.api(`GET /estudiantes/${estudiante_id}/nivel`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(
      `Error obteniendo nivel del estudiante ${estudiante_id}`,
      error
    );
    throw error;
  }
};
