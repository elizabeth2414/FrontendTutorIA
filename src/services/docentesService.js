// src/services/docentesService.js

import axiosClient from "../api/axiosClient";
import Logger from "../logs/logger";

const BASE = "/docentes";

// =======================================================
// 1. CURSOS DEL DOCENTE
// =======================================================
export const getCursosDocente = async () => {
  try {
    const res = await axiosClient.get(`${BASE}/cursos`);
    Logger.api("GET /docentes/cursos", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo cursos del docente", error);
    throw error;
  }
};

// =======================================================
// 2. LISTAR ESTUDIANTES DEL DOCENTE
// =======================================================
export const getEstudiantesDocente = async () => {
  try {
    const res = await axiosClient.get(`${BASE}/estudiantes`);
    Logger.api("GET /docentes/estudiantes", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error listando estudiantes del docente", error);
    throw error;
  }
};

// =======================================================
// 3. CREAR ESTUDIANTE PARA EL DOCENTE
// =======================================================
export const crearEstudianteDocente = async (payload) => {
  try {
    const res = await axiosClient.post(`${BASE}/estudiantes`, payload);
    Logger.api("POST /docentes/estudiantes", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error creando estudiante", error);
    throw error;
  }
};
export const obtenerEstudianteDocente = async (id) => {
  try {
    const res = await axiosClient.get(`/docentes/estudiantes/${id}`);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo estudiante por ID", error);
    throw error;
  }
};

export const actualizarEstudianteDocente = async (id, payload) => {
  const res = await axiosClient.put(`/docentes/estudiantes/${id}`, payload);
  return res.data;
};
export const eliminarEstudianteDocente = async (id) => {
  const res = await axiosClient.delete(`/docentes/estudiantes/${id}`);
  return res.data;
};

// =======================================================
// 4. DASHBOARD RESUMEN
// =======================================================
export const getResumenDashboard = async () => {
  try {
    const res = await axiosClient.get(`${BASE}/dashboard/resumen`);
    Logger.api("GET /docentes/dashboard/resumen", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo resumen dashboard", error);
    throw error;
  }
};

// =======================================================
// 5. DASHBOARD PROGRESO MENSUAL
// =======================================================
export const getProgresoMensual = async () => {
  try {
    const res = await axiosClient.get(`${BASE}/dashboard/progreso-mensual`);
    Logger.api("GET /docentes/dashboard/progreso-mensual", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo progreso mensual", error);
    throw error;
  }
};

// =======================================================
// 6. DASHBOARD RENDIMIENTO CURSOS
// =======================================================
export const getRendimientoCursos = async () => {
  try {
    const res = await axiosClient.get(`${BASE}/dashboard/rendimiento-cursos`);
    Logger.api("GET /docentes/dashboard/rendimiento-cursos", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo rendimiento cursos", error);
    throw error;
  }
};

// =======================================================
// 7. NIVELES DE ESTUDIANTES
// =======================================================
export const getNiveles = async () => {
  try {
    const res = await axiosClient.get(`${BASE}/dashboard/niveles`);
    Logger.api("GET /docentes/dashboard/niveles", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo niveles", error);
    throw error;
  }
};
