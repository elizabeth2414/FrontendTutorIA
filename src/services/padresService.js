// src/services/padresService.js
// VERSIÓN ACTUALIZADA CON SOPORTE PARA EDITAR CUENTA

import axiosClient from "../api/axiosClient";
import Logger from "../logs/logger";

const BASE_URL = "/padres";

// ===============================
// CRUD PADRES
// ===============================

export const crearPadre = async (data) => {
  try {
    const res = await axiosClient.post(`${BASE_URL}/`, data);
    Logger.api("POST /padres", res.data);
    return res.data;
  } catch (error) {
    Logger.error("❌ Error al crear padre", error);
    throw error;
  }
};

export const listarPadres = async (skip = 0, limit = 100) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/`, {
      params: { skip, limit },
    });
    Logger.api("GET /padres", res.data);
    return res.data;
  } catch (error) {
    Logger.error("❌ Error al listar padres", error);
    throw error;
  }
};

/**
 * Obtener información de un padre específico
 * @param {Number} padreId - ID del padre (opcional, si no se pasa, usa el padre autenticado)
 * @returns {Object} - Datos del padre
 */
export const obtenerPadre = async (padreId = null) => {
  try {
    // Si no se pasa padreId, obtenemos el padre actual del token
    const endpoint = padreId ? `${BASE_URL}/${padreId}` : `${BASE_URL}/me`;
    const res = await axiosClient.get(endpoint);
    Logger.api(`GET ${endpoint}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error("❌ Error al obtener padre", error);
    throw error;
  }
};

/**
 * Actualizar datos del padre
 * Soporta actualización de: nombre, apellido, email, password
 * Para cambiar password, debe enviar: password_actual y password
 * @param {Number} padreId - ID del padre
 * @param {Object} data - Datos a actualizar
 * @returns {Object} - Padre actualizado
 */
export const actualizarPadre = async (padreId, data) => {
  try {
    const res = await axiosClient.put(`${BASE_URL}/${padreId}`, data);
    Logger.api(`PUT /padres/${padreId}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error("❌ Error al actualizar padre", error);
    // Propagar el error con más detalles si está disponible
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw error;
  }
};

export const eliminarPadre = async (padreId) => {
  try {
    const res = await axiosClient.delete(`${BASE_URL}/${padreId}`);
    Logger.api(`DELETE /padres/${padreId}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error("❌ Error al eliminar padre", error);
    throw error;
  }
};

// ===============================
// EDITAR PERFIL DEL PADRE ACTUAL
// ===============================

/**
 * Obtener perfil completo del padre autenticado
 * Retorna datos del Usuario y del Padre (nombre, apellido, email, teléfono, etc.)
 * @returns {Object} - Perfil completo del padre
 */
export const obtenerPerfilPadre = async () => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/mi-perfil`);
    Logger.api("GET /padres/mi-perfil", res.data);
    return res.data;
  } catch (error) {
    Logger.error("❌ Error al obtener perfil del padre", error);
    throw error;
  }
};

/**
 * Actualizar perfil del padre autenticado
 * Permite actualizar: nombre, apellido, email, teléfono y contraseña
 * Para cambiar contraseña, debe incluir: password_actual y password
 * @param {Object} data - Datos a actualizar
 * @param {string} data.nombre - Nombre del padre
 * @param {string} data.apellido - Apellido del padre
 * @param {string} data.email - Email del padre
 * @param {string} [data.telefono_contacto] - Teléfono (opcional)
 * @param {string} [data.password_actual] - Contraseña actual (solo si cambia contraseña)
 * @param {string} [data.password] - Nueva contraseña (solo si cambia contraseña)
 * @returns {Object} - Perfil actualizado
 */
export const actualizarPerfilPadre = async (data) => {
  try {
    const res = await axiosClient.put(`${BASE_URL}/mi-perfil`, data);
    Logger.api("PUT /padres/mi-perfil", res.data);
    return res.data;
  } catch (error) {
    Logger.error("❌ Error al actualizar perfil del padre", error);
    // Propagar el error con más detalles si está disponible
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw error;
  }
};

// ===============================
// GESTIÓN DE HIJOS
// ===============================

/**
 * Vincular un hijo al padre actual
 * @param {Object} data - {nombre, apellido, fecha_nacimiento}
 * @returns {Object} - {mensaje: "Hijo vinculado correctamente"}
 */
export const vincularHijo = async (data) => {
  try {
    const res = await axiosClient.post(`${BASE_URL}/vincular-hijo`, data);
    Logger.api("POST /padres/vincular-hijo", res.data);
    return res.data;
  } catch (error) {
    Logger.error("❌ Error al vincular hijo", error);
    throw error;
  }
};

/**
 * Obtener lista de hijos vinculados al padre actual
 * Solo retorna hijos activos (no desvinculados)
 * @returns {Array} - Lista de hijos con cursos y docentes
 */
export const obtenerHijosVinculados = async () => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/mis-hijos`);
    Logger.api("GET /padres/mis-hijos", res.data);
    return res.data;
  } catch (error) {
    Logger.error("❌ Error obteniendo hijos vinculados", error);
    throw error;
  }
};

/**
 * Desvincular un hijo (soft delete)
 * El hijo se marca como inactivo pero no se elimina
 * @param {Number} estudianteId - ID del estudiante a desvincular
 * @returns {Object} - {mensaje, estudiante_id, nombre_completo, nota}
 */
export const desvincularHijo = async (estudianteId) => {
  try {
    const res = await axiosClient.delete(
      `${BASE_URL}/desvincular-hijo/${estudianteId}`
    );
    Logger.api(`DELETE /padres/desvincular-hijo/${estudianteId}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error("❌ Error desvinculando hijo", error);
    throw error;
  }
};

/**
 * Obtener lecturas y actividades de un hijo específico
 * @param {Number} estudianteId - ID del estudiante
 * @returns {Array} - Lista de lecturas con actividades
 */
export const getLecturasHijo = async (estudianteId) => {
  try {
    const res = await axiosClient.get(
      `${BASE_URL}/hijos/${estudianteId}/lecturas`
    );
    Logger.api(`GET /padres/hijos/${estudianteId}/lecturas`, res.data);
    return res.data;
  } catch (error) {
    Logger.error("❌ Error obteniendo lecturas del hijo", error);
    throw error;
  }
};

/**
 * Obtener progreso académico de un hijo específico
 * @param {Number} estudianteId - ID del estudiante
 * @returns {Object} - Estadísticas y progreso del estudiante
 */
export const obtenerProgresoHijo = async (estudianteId) => {
  try {
    const res = await axiosClient.get(
      `${BASE_URL}/hijo/${estudianteId}/progreso`
    );
    Logger.api(`GET /padres/hijo/${estudianteId}/progreso`, res.data);
    return res.data;
  } catch (error) {
    Logger.error("❌ Error obteniendo progreso del hijo", error);
    throw error;
  }
};

// ================================================================
// OBTENER ACTIVIDADES DE UNA LECTURA ESPECÍFICA
// ================================================================
export const obtenerActividadesLectura = async (lecturaId) => {
  try {
    const res = await axiosClient.get(`/ia/lecturas/${lecturaId}/actividades`);
    Logger.api(`GET /ia/lecturas/${lecturaId}/actividades`, res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo actividades de lectura", error);
    throw error;
  }
};

// ================================================================
// OBTENER DETALLE COMPLETO DE UNA ACTIVIDAD (CON PREGUNTAS)
// ================================================================
export const obtenerActividadDetalle = async (actividadId) => {
  try {
    const res = await axiosClient.get(`/ia/actividades/${actividadId}`);
    Logger.api(`GET /ia/actividades/${actividadId}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo detalle de actividad", error);
    throw error;
  }
};

// ================================================================
// ENVIAR RESPUESTAS DE UNA ACTIVIDAD Y OBTENER RESULTADOS
// ================================================================
export const enviarRespuestasActividad = async (payload) => {
  try {
    const res = await axiosClient.post(`/actividades/responder`, payload);
    Logger.api(`POST /actividades/responder`, res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error enviando respuestas de actividad", error);
    throw error;
  }
};

// ================================================================
// SUMAR XP A LA AVENTURA DEL ESTUDIANTE
// ================================================================
export const sumarXPEstudiante = async (estudianteId, puntos, motivo = "Actividad completada") => {
  try {
    const res = await axiosClient.post(`/gamificacion/puntos`, {
      estudiante_id: estudianteId,
      puntos: puntos,
      motivo: motivo,
    });
    Logger.api(`POST /gamificacion/puntos`, res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error sumando XP al estudiante", error);
    throw error;
  }
};

// ================================================================
// MARCAR LECTURA COMO COMPLETADA
// ================================================================
export const marcarLecturaCompletada = async (estudianteId, lecturaId) => {
  try {
    const res = await axiosClient.post(
      `/padres/hijos/${estudianteId}/lecturas/${lecturaId}/completar`
    );
    Logger.api(`POST /padres/hijos/${estudianteId}/lecturas/${lecturaId}/completar`, res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error marcando lectura como completada", error);
    throw error;
  }
};

// ===============================
// ALIASES (para compatibilidad)
// ===============================

/**
 * @deprecated Use obtenerHijosVinculados() instead
 */
export const getHijosPadre = obtenerHijosVinculados;

/**
 * @deprecated Use obtenerHijosVinculados() instead
 */
export const getMisHijos = obtenerHijosVinculados;
