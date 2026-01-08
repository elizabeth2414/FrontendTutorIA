// src/services/actividadesService.js

import axiosClient from "../api/axiosClient";
import Logger from "../logs/logger";

const BASE_URL = "/actividades";

// ===================================================================
// 📘 ACTIVIDADES
// ===================================================================

// Crear actividad educativa
export const crearActividad = async (data) => {
  try {
    const res = await axiosClient.post(BASE_URL, data);
    Logger.api("POST /actividades", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error creando actividad educativa", error);
    throw error;
  }
};

// Listar actividades
export const listarActividades = async (params = {}) => {
  try {
    const res = await axiosClient.get(BASE_URL, { params });
    Logger.api("GET /actividades", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error listando actividades", error);
    throw error;
  }
};

// Obtener actividad por ID
export const obtenerActividad = async (actividad_id) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/${actividad_id}`);
    Logger.api(`GET /actividades/${actividad_id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error obteniendo actividad ${actividad_id}`, error);
    throw error;
  }
};

// Actualizar actividad
export const actualizarActividad = async (actividad_id, data) => {
  try {
    const res = await axiosClient.put(`${BASE_URL}/${actividad_id}`, data);
    Logger.api(`PUT /actividades/${actividad_id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error actualizando actividad ${actividad_id}`, error);
    throw error;
  }
};

// Eliminar actividad
export const eliminarActividad = async (actividad_id) => {
  try {
    const res = await axiosClient.delete(`${BASE_URL}/${actividad_id}`);
    Logger.api(`DELETE /actividades/${actividad_id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error eliminando actividad ${actividad_id}`, error);
    throw error;
  }
};

// ===================================================================
// ❓ PREGUNTAS DE ACTIVIDADES
// ===================================================================

// Agregar pregunta a una actividad
export const agregarPregunta = async (actividad_id, data) => {
  try {
    const res = await axiosClient.post(
      `${BASE_URL}/${actividad_id}/preguntas`,
      data
    );
    Logger.api(
      `POST /actividades/${actividad_id}/preguntas`,
      res.data
    );
    return res.data;
  } catch (error) {
    Logger.error(`Error agregando pregunta a actividad ${actividad_id}`, error);
    throw error;
  }
};

// Listar preguntas de la actividad
export const listarPreguntasActividad = async (actividad_id) => {
  try {
    const res = await axiosClient.get(
      `${BASE_URL}/${actividad_id}/preguntas`
    );
    Logger.api(
      `GET /actividades/${actividad_id}/preguntas`,
      res.data
    );
    return res.data;
  } catch (error) {
    Logger.error(`Error listando preguntas de actividad ${actividad_id}`, error);
    throw error;
  }
};

// ===================================================================
// 📊 PROGRESO DEL ESTUDIANTE
// ===================================================================

// Registrar progreso
export const registrarProgresoActividad = async (data) => {
  try {
    const res = await axiosClient.post(`${BASE_URL}/progreso`, data);
    Logger.api("POST /actividades/progreso", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error registrando progreso de actividad", error);
    throw error;
  }
};

// Listar progreso del estudiante
export const listarProgresoEstudiante = async (estudiante_id) => {
  try {
    const res = await axiosClient.get(
      `${BASE_URL}/estudiante/${estudiante_id}/progreso`
    );
    Logger.api(
      `GET /actividades/estudiante/${estudiante_id}/progreso`,
      res.data
    );
    return res.data;
  } catch (error) {
    Logger.error(
      `Error listando progreso del estudiante ${estudiante_id}`,
      error
    );
    throw error;
  }
};

// ===================================================================
// 📝 RESPUESTAS DE PREGUNTAS
// ===================================================================

// Agregar respuesta
export const agregarRespuestaPregunta = async (progreso_id, data) => {
  try {
    const res = await axiosClient.post(
      `${BASE_URL}/progreso/${progreso_id}/respuestas`,
      data
    );
    Logger.api(
      `POST /actividades/progreso/${progreso_id}/respuestas`,
      res.data
    );
    return res.data;
  } catch (error) {
    Logger.error(
      `Error agregando respuesta a progreso ${progreso_id}`,
      error
    );
    throw error;
  }
};

// Listar respuestas del progreso
export const listarRespuestasProgreso = async (progreso_id) => {
  try {
    const res = await axiosClient.get(
      `${BASE_URL}/progreso/${progreso_id}/respuestas`
    );
    Logger.api(
      `GET /actividades/progreso/${progreso_id}/respuestas`,
      res.data
    );
    return res.data;
  } catch (error) {
    Logger.error(
      `Error listando respuestas del progreso ${progreso_id}`,
      error
    );
    throw error;
  }
};
