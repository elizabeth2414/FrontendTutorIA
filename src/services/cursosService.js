// src/services/cursosService.js

import axiosClient from "../api/axiosClient";
import Logger from "../logs/logger";

const BASE_URL = "/cursos";


// CREAR CURSO
export const crearCurso = async (data) => {
  try {
    const res = await axiosClient.post(`${BASE_URL}/`, data);
    Logger.api("POST /cursos", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error creando curso", error);
    throw error;
  }
};

// LISTAR CURSOS
export const listarCursos = async (params = {}) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/`, { params });
    Logger.api("GET /cursos", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error listando cursos", error);
    throw error;
  }
};

// OBTENER CURSO POR ID
export const obtenerCurso = async (curso_id) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/${curso_id}`);
    Logger.api(`GET /cursos/${curso_id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error obteniendo curso ${curso_id}`, error);
    throw error;
  }
};

// ACTUALIZAR CURSO
export const actualizarCurso = async (curso_id, data) => {
  try {
    const res = await axiosClient.put(`${BASE_URL}/${curso_id}`, data);
    Logger.api(`PUT /cursos/${curso_id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error actualizando curso ${curso_id}`, error);
    throw error;
  }
};

// ELIMINAR CURSO
export const eliminarCurso = async (curso_id) => {
  try {
    const res = await axiosClient.delete(`${BASE_URL}/${curso_id}`);
    Logger.api(`DELETE /cursos/${curso_id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error eliminando curso ${curso_id}`, error);
    throw error;
  }
};


// =====================================
// 6. INSCRIBIR ESTUDIANTE EN CURSO
// =====================================
export const inscribirEstudianteCurso = async (curso_id, estudiante_id) => {
  try {
    const res = await axiosClient.post(`${BASE_URL}/${curso_id}/inscribir`, {
      estudiante_id
    });
    Logger.api(`POST /cursos/${curso_id}/inscribir`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error inscribiendo estudiante en curso ${curso_id}`, error);
    throw error;
  }
};


// =====================================
// 7. LISTAR ESTUDIANTES DE UN CURSO
// =====================================
export const listarEstudiantesCurso = async (curso_id) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/${curso_id}/estudiantes`);
    Logger.api(`GET /cursos/${curso_id}/estudiantes`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error listando estudiantes del curso ${curso_id}`, error);
    throw error;
  }
};


// =====================================
// 8. LISTAR CURSOS DE UN ESTUDIANTE
// =====================================
export const listarCursosEstudiante = async (estudiante_id) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/estudiante/${estudiante_id}`);
    Logger.api(`GET /cursos/estudiante/${estudiante_id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error listando cursos del estudiante ${estudiante_id}`, error);
    throw error;
  }
};
