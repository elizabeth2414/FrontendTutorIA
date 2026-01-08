// src/services/estadisticasService.js

import axiosClient from "../api/axiosClient";
import Logger from "../logs/logger";

const BASE_URL = "/estadisticas";

// ============================================================
// 📘 ESTADÍSTICAS DE ESTUDIANTE
// ============================================================

// Obtener estadísticas completas de un estudiante
export const obtenerEstadisticasEstudiante = async (estudiante_id) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/estudiante/${estudiante_id}`);
    Logger.api(
      `GET /estadisticas/estudiante/${estudiante_id}`,
      res.data
    );
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo estadísticas del estudiante", error);
    throw error;
  }
};

// ============================================================
// 🎓 PROGRESO DE CURSOS (DOCENTE)
// ============================================================

// Obtener progreso de los cursos de un docente
export const obtenerProgresoCursosDocente = async (docente_id) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/cursos/${docente_id}`);
    Logger.api(
      `GET /estadisticas/cursos/${docente_id}`,
      res.data
    );
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo progreso de cursos del docente", error);
    throw error;
  }
};

// ============================================================
// 📝 REPORTES DE EVALUACIONES
// ============================================================

// Obtener reportes de evaluaciones de un estudiante (límite opcional)
export const obtenerReportesEvaluacion = async (estudiante_id, limite = 10) => {
  try {
    const res = await axiosClient.get(
      `${BASE_URL}/evaluaciones/${estudiante_id}`,
      { params: { limite } }
    );
    Logger.api(
      `GET /estadisticas/evaluaciones/${estudiante_id}`,
      res.data
    );
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo reportes de evaluación", error);
    throw error;
  }
};

// ============================================================
// 📈 TENDENCIAS DE PROGRESO
// ============================================================

// Obtener tendencias de progreso (últimos X días)
export const obtenerTendenciasProgreso = async (estudiante_id, dias = 30) => {
  try {
    const res = await axiosClient.get(
      `${BASE_URL}/tendencias/${estudiante_id}`,
      { params: { dias } }
    );
    Logger.api(
      `GET /estadisticas/tendencias/${estudiante_id}`,
      res.data
    );
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo tendencias de progreso", error);
    throw error;
  }
};

// ============================================================
// 📊 DASHBOARD DOCENTE
// ============================================================

// Obtener dashboard de un docente
export const obtenerDashboardDocente = async (docente_id) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/dashboard/docente/${docente_id}`);
    Logger.api(
      `GET /estadisticas/dashboard/docente/${docente_id}`,
      res.data
    );
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo dashboard del docente", error);
    throw error;
  }
};
