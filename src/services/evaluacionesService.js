// src/services/evaluacionesService.js

import axiosClient from "../api/axiosClient";
import Logger from "../logs/logger";

const BASE_URL = "/evaluaciones";


// =====================================
// 📘 EVALUACIONES DE LECTURA
// =====================================

// Crear nueva evaluación
export const crearEvaluacion = async (data) => {
  try {
    const res = await axiosClient.post(`${BASE_URL}`, data);
    Logger.api("POST /evaluaciones", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error creando evaluación", error);
    throw error;
  }
};

// Listar evaluaciones (con filtros opcionales)
export const listarEvaluaciones = async (params = {}) => {
  try {
    const res = await axiosClient.get(BASE_URL, { params });
    Logger.api("GET /evaluaciones", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error listando evaluaciones", error);
    throw error;
  }
};

// Obtener evaluación por ID
export const obtenerEvaluacion = async (evaluacion_id) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/${evaluacion_id}`);
    Logger.api(`GET /evaluaciones/${evaluacion_id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error obteniendo evaluación ${evaluacion_id}`, error);
    throw error;
  }
};


// =====================================
// 🤖 ANÁLISIS DE IA
// =====================================

// Agregar análisis IA
export const agregarAnalisisIA = async (evaluacion_id, data) => {
  try {
    const res = await axiosClient.post(
      `${BASE_URL}/${evaluacion_id}/analisis-ia`,
      data
    );
    Logger.api(`POST /evaluaciones/${evaluacion_id}/analisis-ia`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error agregando análisis IA a evaluación ${evaluacion_id}`, error);
    throw error;
  }
};

// Obtener análisis IA
export const obtenerAnalisisIA = async (evaluacion_id) => {
  try {
    const res = await axiosClient.get(
      `${BASE_URL}/${evaluacion_id}/analisis-ia`
    );
    Logger.api(`GET /evaluaciones/${evaluacion_id}/analisis-ia`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(
      `Error obteniendo análisis IA de la evaluación ${evaluacion_id}`,
      error
    );
    throw error;
  }
};


// =====================================
// 🔁 INTENTOS DE LECTURA
// =====================================

// Crear intento de lectura
export const agregarIntentoLectura = async (evaluacion_id, data) => {
  try {
    const res = await axiosClient.post(
      `${BASE_URL}/${evaluacion_id}/intentos`,
      data
    );
    Logger.api(`POST /evaluaciones/${evaluacion_id}/intentos`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(
      `Error agregando intento de lectura en evaluación ${evaluacion_id}`,
      error
    );
    throw error;
  }
};

// Listar intentos de una evaluación
export const listarIntentosEvaluacion = async (evaluacion_id) => {
  try {
    const res = await axiosClient.get(
      `${BASE_URL}/${evaluacion_id}/intentos`
    );
    Logger.api(`GET /evaluaciones/${evaluacion_id}/intentos`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(
      `Error listando intentos de evaluación ${evaluacion_id}`,
      error
    );
    throw error;
  }
};


// =====================================
// 📋 DETALLES DE EVALUACIÓN
// =====================================

// Agregar detalle a evaluación
export const agregarDetalleEvaluacion = async (evaluacion_id, data) => {
  try {
    const res = await axiosClient.post(
      `${BASE_URL}/${evaluacion_id}/detalles`,
      data
    );
    Logger.api(`POST /evaluaciones/${evaluacion_id}/detalles`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(
      `Error agregando detalle a evaluación ${evaluacion_id}`,
      error
    );
    throw error;
  }
};

// Listar detalles
export const listarDetallesEvaluacion = async (evaluacion_id) => {
  try {
    const res = await axiosClient.get(
      `${BASE_URL}/${evaluacion_id}/detalles`
    );
    Logger.api(`GET /evaluaciones/${evaluacion_id}/detalles`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(
      `Error listando detalles de evaluación ${evaluacion_id}`,
      error
    );
    throw error;
  }
};


// =====================================
// ❗ ERRORES DE PRONUNCIACIÓN
// =====================================

// Crear error de pronunciación
export const agregarErrorPronunciacion = async (detalle_id, data) => {
  try {
    const res = await axiosClient.post(
      `${BASE_URL}/detalles/${detalle_id}/errores`,
      data
    );
    Logger.api(`POST /evaluaciones/detalles/${detalle_id}/errores`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(
      `Error agregando error de pronunciación al detalle ${detalle_id}`,
      error
    );
    throw error;
  }
};
