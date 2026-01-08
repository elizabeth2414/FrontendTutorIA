import axiosClient from "../api/axiosClient";
import Logger from "../logs/logger";

const BASE_URL = "/admin/docentes";

// ==============================
// LISTAR DOCENTES
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
// CREAR DOCENTE (ADMIN)
// ==============================
export const crearDocenteAdmin = async (docenteData) => {
  try {
    Logger.info("Enviando datos...", docenteData);
    const { data } = await axiosClient.post(BASE_URL, docenteData);
    Logger.info("✔ Docente creado correctamente");
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
    Logger.error(`❌ Error actualizando docente ${id}:`, error);
    throw error;
  }
};


// ==============================
// ELIMINAR DOCENTE
// ==============================
export const eliminarDocenteAdmin = async (id) => {
  try {
    await axiosClient.delete(`${BASE_URL}/${id}`);
    Logger.warn(`⚠ Docente ${id} eliminado`);
  } catch (error) {
    Logger.error(`❌ Error eliminando docente ${id}:`, error);
    throw error;
  }
};
