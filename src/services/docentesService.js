import axiosClient from "../api/axiosClient";
import Logger from "../logs/logger";

const BASE = "/docentes";

// =======================================================
// 1. CURSOS DEL DOCENTE
// =======================================================
export const getCursosDocente = async () => {
  try {
    const res = await axiosClient.get(`${BASE}/cursos`);
    Logger.api("GET /docentes/cursos", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo cursos del docente", error);
    throw error;
  }
};

// =======================================================
// 2. LISTAR ESTUDIANTES DEL DOCENTE
// =======================================================
export const getEstudiantesDocente = async () => {
  try {
    const res = await axiosClient.get(`${BASE}/estudiantes`);
    Logger.api("GET /docentes/estudiantes", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error listando estudiantes del docente", error);
    throw error;
  }
};

// =======================================================
// 3. CREAR ESTUDIANTE PARA EL DOCENTE
// =======================================================
export const crearEstudianteDocente = async (payload) => {
  try {
    const res = await axiosClient.post(`${BASE}/estudiantes`, payload);
    Logger.api("POST /docentes/estudiantes", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error creando estudiante", error);
    throw error;
  }
};

// =======================================================
// 4. OBTENER UN ESTUDIANTE POR ID
// =======================================================
export const obtenerEstudianteDocente = async (id) => {
  try {
    const res = await axiosClient.get(`${BASE}/estudiantes/${id}`);
    Logger.api("GET /docentes/estudiantes/:id", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo estudiante por ID", error);
    throw error;
  }
};

// =======================================================
// 5. ACTUALIZAR ESTUDIANTE ✅ CORRECTO CON PUT
// =======================================================
export const actualizarEstudianteDocente = async (id, payload) => {
  try {
    const res = await axiosClient.put(`${BASE}/estudiantes/${id}`, payload);
    Logger.api("PUT /docentes/estudiantes/:id", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error actualizando estudiante", error);
    throw error;
  }
};

// =======================================================
// 6. ELIMINAR ESTUDIANTE
// =======================================================
export const eliminarEstudianteDocente = async (id) => {
  try {
    const res = await axiosClient.delete(`${BASE}/estudiantes/${id}`);
    Logger.api("DELETE /docentes/estudiantes/:id", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error eliminando estudiante", error);
    throw error;
  }
};

// =======================================================
// 7. DASHBOARD RESUMEN
// =======================================================
export const getResumenDashboard = async () => {
  try {
    const res = await axiosClient.get(`${BASE}/dashboard/resumen`);
    Logger.api("GET /docentes/dashboard/resumen", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo resumen dashboard", error);
    throw error;
  }
};

// =======================================================
// 8. DASHBOARD PROGRESO MENSUAL
// =======================================================
export const getProgresoMensual = async () => {
  try {
    const res = await axiosClient.get(`${BASE}/dashboard/progreso-mensual`);
    Logger.api("GET /docentes/dashboard/progreso-mensual", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo progreso mensual", error);
    throw error;
  }
};

// =======================================================
// 9. DASHBOARD RENDIMIENTO CURSOS
// =======================================================
export const getRendimientoCursos = async () => {
  try {
    const res = await axiosClient.get(`${BASE}/dashboard/rendimiento-cursos`);
    Logger.api("GET /docentes/dashboard/rendimiento-cursos", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo rendimiento cursos", error);
    throw error;
  }
};

// =======================================================
// 10. NIVELES DE ESTUDIANTES
// =======================================================
export const getNiveles = async () => {
  try {
    const res = await axiosClient.get(`${BASE}/dashboard/niveles`);
    Logger.api("GET /docentes/dashboard/niveles", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo niveles", error);
    throw error;
  }
};

// =======================================================
// 11. OBTENER RESUMEN DE PROGRESO DE TODOS LOS ESTUDIANTES
// =======================================================
export const getResumenProgresoEstudiantes = async () => {
  try {
    const res = await axiosClient.get(`${BASE}/progreso/resumen`);
    Logger.api("GET /docentes/progreso/resumen", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo resumen de progreso", error);
    throw error;
  }
};

// =======================================================
// 12. OBTENER PROGRESO DETALLADO DE UN ESTUDIANTE
// =======================================================
export const getProgresoDetalladoEstudiante = async (estudianteId) => {
  try {
    const res = await axiosClient.get(`${BASE}/progreso/estudiante/${estudianteId}`);
    Logger.api(`GET /docentes/progreso/estudiante/${estudianteId}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo progreso detallado del estudiante", error);
    throw error;
  }
};

// =======================================================
// 13. OBTENER DATOS DE GRÁFICA DE PROGRESO DE UN ESTUDIANTE
// =======================================================
export const getGraficaProgresoEstudiante = async (estudianteId, periodo = "mes") => {
  try {
    const res = await axiosClient.get(
      `${BASE}/progreso/estudiante/${estudianteId}/grafica-progreso?periodo=${periodo}`
    );
    Logger.api(`GET /docentes/progreso/estudiante/${estudianteId}/grafica-progreso`, res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo gráfica de progreso", error);
    throw error;
  }
};

// =======================================================
// 14. OBTENER RESUMEN DE HISTORIAL DE PRÁCTICA
// =======================================================
export const getResumenHistorialPractica = async () => {
  try {
    const res = await axiosClient.get(`${BASE}/historial-practica/resumen`);
    Logger.api("GET /docentes/historial-practica/resumen", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo resumen de historial de práctica", error);
    throw error;
  }
};

// =======================================================
// 15. OBTENER HISTORIAL DETALLADO DE PRÁCTICA DE UN ESTUDIANTE
// =======================================================
export const getHistorialPracticaDetallado = async (estudianteId) => {
  try {
    const res = await axiosClient.get(`${BASE}/historial-practica/estudiante/${estudianteId}`);
    Logger.api(`GET /docentes/historial-practica/estudiante/${estudianteId}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo historial detallado de práctica", error);
    throw error;
  }
};

// =======================================================
// 16. OBTENER ESTADÍSTICAS DE TIEMPO DE PRÁCTICA
// =======================================================
export const getEstadisticasTiempoPractica = async (estudianteId, periodo = "mes") => {
  try {
    const res = await axiosClient.get(
      `${BASE}/historial-practica/estudiante/${estudianteId}/estadisticas-tiempo?periodo=${periodo}`
    );
    Logger.api(`GET /docentes/historial-practica/estudiante/${estudianteId}/estadisticas-tiempo`, res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo estadísticas de tiempo de práctica", error);
    throw error;
  }
};

// =======================================================
// 14. OBTENER HISTORIAL DE PRÁCTICA DE UN ESTUDIANTE
// =======================================================
export const getHistorialPracticaEstudiante = async (estudianteId) => {
  try {
    const res = await axiosClient.get(`/historial/practicas/estudiante/${estudianteId}`);
    Logger.api(`GET /historial/practicas/estudiante/${estudianteId}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo historial de práctica del estudiante", error);
    throw error;
  }
};

// =======================================================
// 15. OBTENER HISTORIAL DE PRÁCTICA DETALLADO DE UN ESTUDIANTE
// =======================================================
export const getHistorialPracticaEstudianteDetallado = async (estudianteId) => {
  try {
    const res = await axiosClient.get(`/historial/practicas/estudiante/${estudianteId}/detallado`);
    Logger.api(`GET /historial/practicas/estudiante/${estudianteId}/detallado`, res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error obteniendo historial de práctica detallado", error);
    throw error;
  }
};