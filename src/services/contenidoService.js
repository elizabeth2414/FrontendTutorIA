// src/services/contenidoService.js

import axiosClient from "../api/axiosClient";
import Logger from "../logs/logger";

const BASE_URL = "/contenido";


// =====================================
// 📘 CONTENIDOS DE LECTURA
// =====================================

// Crear lectura
export const crearLectura = async (data) => {
  try {
    const res = await axiosClient.post(`${BASE_URL}/lecturas`, data);
    Logger.api("POST /contenido/lecturas", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error creando lectura", error);
    throw error;
  }
};

// Listar lecturas (con filtros opcionales)
export const listarLecturas = async (params = {}) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/lecturas`, { params });
    Logger.api("GET /contenido/lecturas", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error listando lecturas", error);
    throw error;
  }
};

// Obtener lectura por ID
export const obtenerLectura = async (contenido_id) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/lecturas/${contenido_id}`);
    Logger.api(`GET /contenido/lecturas/${contenido_id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error obteniendo lectura ${contenido_id}`, error);
    throw error;
  }
};

// Actualizar lectura
export const actualizarLectura = async (contenido_id, data) => {
  try {
    const res = await axiosClient.put(
      `${BASE_URL}/lecturas/${contenido_id}`,
      data
    );
    Logger.api(`PUT /contenido/lecturas/${contenido_id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error actualizando lectura ${contenido_id}`, error);
    throw error;
  }
};

// Eliminar lectura
export const eliminarLectura = async (contenido_id) => {
  try {
    const res = await axiosClient.delete(
      `${BASE_URL}/lecturas/${contenido_id}`
    );
    Logger.api(`DELETE /contenido/lecturas/${contenido_id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error eliminando lectura ${contenido_id}`, error);
    throw error;
  }
};


// =====================================
// 🎨 CATEGORÍAS DE LECTURA
// =====================================

// Crear categoría
export const crearCategoria = async (data) => {
  try {
    const res = await axiosClient.post(`${BASE_URL}/categorias`, data);
    Logger.api("POST /contenido/categorias", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error creando categoría", error);
    throw error;
  }
};

// Listar categorías
export const listarCategorias = async (params = {}) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/categorias`, { params });
    Logger.api("GET /contenido/categorias", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error listando categorías", error);
    throw error;
  }
};

// Obtener categoría por ID
export const obtenerCategoria = async (categoria_id) => {
  try {
    const res = await axiosClient.get(
      `${BASE_URL}/categorias/${categoria_id}`
    );
    Logger.api(`GET /contenido/categorias/${categoria_id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error obteniendo categoría ${categoria_id}`, error);
    throw error;
  }
};


// =====================================
// 🎧 AUDIOS DE REFERENCIA
// =====================================

// Crear audio de referencia
export const crearAudioReferencia = async (data) => {
  try {
    const res = await axiosClient.post(`${BASE_URL}/audios`, data);
    Logger.api("POST /contenido/audios", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error creando audio de referencia", error);
    throw error;
  }
};

// Listar audios de un contenido
export const listarAudiosContenido = async (contenido_id) => {
  try {
    const res = await axiosClient.get(
      `${BASE_URL}/lecturas/${contenido_id}/audios`
    );
    Logger.api(
      `GET /contenido/lecturas/${contenido_id}/audios`,
      res.data
    );
    return res.data;
  } catch (error) {
    Logger.error(
      `Error listando audios del contenido ${contenido_id}`,
      error
    );
    throw error;
  }
};
