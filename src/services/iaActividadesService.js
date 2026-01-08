// src/services/iaActividadesService.js

import axiosClient from "../api/axiosClient";
import Logger from "../logs/logger";

const BASE_URL = "/ia";

// ================================================================
// 1. GENERAR ACTIVIDADES POR IA PARA UNA LECTURA
// ================================================================
export const generarActividadesIA = async (contenidoId, opciones) => {
  try {
    Logger.info(`🚀 Generando actividades IA para lectura ${contenidoId}`, opciones);

    const res = await axiosClient.post(
      `${BASE_URL}/lecturas/${contenidoId}/generar-actividades`,
      opciones,
      {
        timeout: 120000, // 2 minutos de timeout
      }
    );

    Logger.api(
      `POST /ia/lecturas/${contenidoId}/generar-actividades`,
      res.data
    );

    return res.data;
  } catch (error) {
    console.error("❌ ERROR COMPLETO:", error);
    console.error("❌ Error response.data:", error.response?.data);
    console.error("❌ Error response.status:", error.response?.status);

    if (error.response?.data) {
      console.error("🔴 DETALLE DEL ERROR DEL SERVIDOR:", JSON.stringify(error.response.data, null, 2));
    }

    Logger.error("Error generando actividades IA", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });

    if (error.response) {
      const errorMsg = error.response.data?.detail 
        || error.response.data?.message 
        || `Error del servidor: ${error.response.status}`;
      
      const enhancedError = new Error(errorMsg);
      enhancedError.status = error.response.status;
      enhancedError.data = error.response.data;
      throw enhancedError;
    } else if (error.request) {
      throw new Error("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
    } else {
      throw error;
    }
  }
};

// ================================================================
// 2. OBTENER TODAS LAS ACTIVIDADES DE UNA LECTURA
// ================================================================
export const obtenerActividadesDeLectura = async (contenidoId) => {
  try {
    const res = await axiosClient.get(
      `${BASE_URL}/lecturas/${contenidoId}/actividades`
    );

    Logger.api(`GET /ia/lecturas/${contenidoId}/actividades`, res.data);

    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo actividades de lectura", error);
    throw error;
  }
};

// ================================================================
// 3. OBTENER ACTIVIDAD INDIVIDUAL + PREGUNTAS
// ================================================================
export const obtenerActividadIA = async (actividadId) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/actividades/${actividadId}`);

    Logger.api(`GET /ia/actividades/${actividadId}`, res.data);

    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo actividad IA", error);
    throw error;
  }
};

// ================================================================
// 4. ACTUALIZAR ACTIVIDAD (necesitas crear este endpoint en backend)
// ================================================================
export const actualizarActividad = async (actividadId, datos) => {
  try {
    const res = await axiosClient.put(
      `/actividades/${actividadId}`,
      datos
    );

    Logger.api(`PUT /actividades/${actividadId}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error actualizando actividad", error);
    throw error;
  }
};

// ================================================================
// 5. ELIMINAR ACTIVIDAD (necesitas crear este endpoint en backend)
// ================================================================
export const eliminarActividad = async (actividadId) => {
  try {
    const res = await axiosClient.delete(`/actividades/${actividadId}`);

    Logger.api(`DELETE /actividades/${actividadId}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error eliminando actividad", error);
    throw error;
  }
};

// ================================================================
// 6. ACTUALIZAR PREGUNTA
// ================================================================
export const actualizarPregunta = async (preguntaId, datos) => {
  try {
    const res = await axiosClient.put(
      `/preguntas/${preguntaId}`,
      datos
    );

    Logger.api(`PUT /preguntas/${preguntaId}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error actualizando pregunta", error);
    throw error;
  }
};

// ================================================================
// 7. ELIMINAR PREGUNTA
// ================================================================
export const eliminarPregunta = async (preguntaId) => {
  try {
    const res = await axiosClient.delete(`/preguntas/${preguntaId}`);

    Logger.api(`DELETE /preguntas/${preguntaId}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error eliminando pregunta", error);
    throw error;
  }
};
