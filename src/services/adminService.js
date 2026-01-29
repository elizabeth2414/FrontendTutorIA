import axiosClient from "../api/axiosClient";
import Logger from "../logs/logger";

const BASE_URL = "/admin/docentes";

// ==============================
// LISTAR DOCENTES (NO ELIMINADOS)
// ==============================
export const listarDocentesAdmin = async () => {
  try {
    const { data } = await axiosClient.get(BASE_URL);
    Logger.info("Docentes listados correctamente", data);
    return data;
  } catch (error) {
    Logger.error("❌ Error listando docentes:", error);
    throw error;
  }
};

// ==============================
// LISTAR DOCENTES ELIMINADOS
// ==============================
export const listarDocentesEliminadosAdmin = async () => {
  try {
    const { data } = await axiosClient.get(`${BASE_URL}/eliminados`);
    Logger.info("Docentes eliminados listados correctamente", data);
    return data;
  } catch (error) {
    Logger.error("❌ Error listando docentes eliminados:", error);
    throw error;
  }
};

// ==============================
// CREAR DOCENTE (ADMIN)
// ✅ Si el email estaba eliminado, backend RESTAURA automáticamente
// ==============================
export const crearDocenteAdmin = async (docenteData) => {
  try {
    Logger.info("Enviando datos...", docenteData);
    const { data } = await axiosClient.post(BASE_URL, docenteData);
    Logger.info("✔ Docente creado/restaurado correctamente");
    return data;
  } catch (error) {
    Logger.error("❌ Error creando docente:", error.response?.data || error);
    throw error;
  }
};

// ==============================
// ACTUALIZAR DOCENTE
// ==============================
export const actualizarDocenteAdmin = async (id, docenteData) => {
  try {
    const { data } = await axiosClient.put(`${BASE_URL}/${id}`, docenteData);
    Logger.info(`✔ Docente ${id} actualizado correctamente`);
    return data;
  } catch (error) {
    Logger.error(`❌ Error actualizando docente ${id}:`, error.response?.data || error);
    throw error;
  }
};

// ==============================
// TOGGLE ACTIVO/INACTIVO
// ✅ Backend bloquea si tiene alumnos
// ==============================
export const toggleDocenteAdmin = async (id) => {
  try {
    const { data } = await axiosClient.patch(`${BASE_URL}/${id}/toggle`);
    Logger.info(`✔ Docente ${id} estado cambiado`);
    return data;
  } catch (error) {
    Logger.error(`❌ Error cambiando estado docente ${id}:`, error.response?.data || error);
    throw error;
  }
};

// ==============================
// RESTAURAR DOCENTE ELIMINADO
// ==============================
export const restaurarDocenteAdmin = async (id) => {
  try {
    const { data } = await axiosClient.patch(`${BASE_URL}/${id}/restore`);
    Logger.info(`✔ Docente ${id} restaurado`);
    return data;
  } catch (error) {
    Logger.error(`❌ Error restaurando docente ${id}:`, error.response?.data || error);
    throw error;
  }
};

// ==============================
// ELIMINAR DOCENTE (SOFT DELETE)
// ✅ Backend bloquea si tiene alumnos
// ==============================
export const eliminarDocenteAdmin = async (id) => {
  try {
    await axiosClient.delete(`${BASE_URL}/${id}`);
    Logger.warn(`⚠ Docente ${id} eliminado (soft delete)`);
  } catch (error) {
    Logger.error(`❌ Error eliminando docente ${id}:`, error.response?.data || error);
    throw error;
  }
};
