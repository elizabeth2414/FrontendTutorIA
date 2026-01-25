import axiosClient from "../api/axiosClient";
import Logger from "../logs/logger";

const BASE_URL = "/cursos";


// ===============================================
// CREAR CURSO
// ===============================================
export const crearCurso = async (data) => {
  try {
    const res = await axiosClient.post(`${BASE_URL}/`, data);
    Logger.api("POST /cursos", res.data);
    Logger.info("✔ Curso creado exitosamente");
    return res.data;
  } catch (error) {
    Logger.error("❌ Error creando curso:", error);
    throw error;
  }
};


// ===============================================
// LISTAR TODOS LOS CURSOS (Activos e Inactivos)
// ===============================================
export const listarCursos = async (params = {}) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/`, { params });
    Logger.api(`GET /cursos - Total: ${res.data.length}`);
    return res.data;
  } catch (error) {
    Logger.error("❌ Error listando cursos:", error);
    throw error;
  }
};


// ===============================================
// LISTAR SOLO CURSOS ACTIVOS (Para combobox) ← NUEVO
// ===============================================
export const listarCursosActivos = async () => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/activos`);
    Logger.api(`GET /cursos/activos - Total activos: ${res.data.length}`);
    Logger.info("✔ Cursos activos cargados");
    return res.data;
  } catch (error) {
    Logger.error("❌ Error listando cursos activos:", error);
    throw error;
  }
};


// ===============================================
// OBTENER CURSO POR ID
// ===============================================
export const obtenerCurso = async (curso_id) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/${curso_id}`);
    Logger.api(`GET /cursos/${curso_id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`❌ Error obteniendo curso ${curso_id}:`, error);
    throw error;
  }
};


// ===============================================
// ACTUALIZAR CURSO
// ===============================================
export const actualizarCurso = async (curso_id, data) => {
  try {
    const res = await axiosClient.put(`${BASE_URL}/${curso_id}`, data);
    Logger.api(`PUT /cursos/${curso_id}`, res.data);
    Logger.info(`✔ Curso ${curso_id} actualizado`);
    return res.data;
  } catch (error) {
    Logger.error(`❌ Error actualizando curso ${curso_id}:`, error);
    throw error;
  }
};


// ===============================================
// TOGGLE ACTIVO/INACTIVO ← NUEVO
// ===============================================
export const toggleCurso = async (curso_id) => {
  try {
    const res = await axiosClient.patch(`${BASE_URL}/${curso_id}/toggle`);
    Logger.api(`PATCH /cursos/${curso_id}/toggle`, res.data);
    Logger.info(`✔ Estado del curso ${curso_id} cambiado`);
    return res.data;
  } catch (error) {
    Logger.error(`❌ Error cambiando estado del curso ${curso_id}:`, error);
    throw error;
  }
};


// ===============================================
// ELIMINAR CURSO (Con validación de relaciones)
// ===============================================
export const eliminarCurso = async (curso_id) => {
  try {
    const res = await axiosClient.delete(`${BASE_URL}/${curso_id}`);
    Logger.api(`DELETE /cursos/${curso_id}`, res.data);
    Logger.warn(`⚠ Curso ${curso_id} eliminado`);
    return res.data;
  } catch (error) {
    Logger.error(`❌ Error eliminando curso ${curso_id}:`, error);
    // El error puede contener info de relaciones (estudiantes, lecturas, etc)
    throw error;
  }
};


// ===============================================
// INSCRIBIR ESTUDIANTE EN CURSO
// ===============================================
export const inscribirEstudianteCurso = async (curso_id, estudiante_id) => {
  try {
    const res = await axiosClient.post(`${BASE_URL}/${curso_id}/inscribir`, {
      estudiante_id
    });
    Logger.api(`POST /cursos/${curso_id}/inscribir`, res.data);
    Logger.info(`✔ Estudiante ${estudiante_id} inscrito en curso ${curso_id}`);
    return res.data;
  } catch (error) {
    Logger.error(`❌ Error inscribiendo estudiante en curso ${curso_id}:`, error);
    throw error;
  }
};


// ===============================================
// LISTAR ESTUDIANTES DE UN CURSO
// ===============================================
export const listarEstudiantesCurso = async (curso_id) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/${curso_id}/estudiantes`);
    Logger.api(`GET /cursos/${curso_id}/estudiantes - Total: ${res.data.length}`);
    return res.data;
  } catch (error) {
    Logger.error(`❌ Error listando estudiantes del curso ${curso_id}:`, error);
    throw error;
  }
};


// ===============================================
// LISTAR CURSOS DE UN ESTUDIANTE (Solo activos)
// ===============================================
export const listarCursosEstudiante = async (estudiante_id) => {
  try {
    const res = await axiosClient.get(`${BASE_URL}/estudiante/${estudiante_id}`);
    Logger.api(`GET /cursos/estudiante/${estudiante_id} - Total: ${res.data.length}`);
    return res.data;
  } catch (error) {
    Logger.error(`❌ Error listando cursos del estudiante ${estudiante_id}:`, error);
    throw error;
  }
};
