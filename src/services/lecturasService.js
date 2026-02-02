import axiosClient from "../api/axiosClient";
import Logger from "../logs/logger";

export const listarLecturas = async () => {
  try {
    const res = await axiosClient.get("/lecturas/");
    Logger.api("GET /lecturas", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error listando lecturas", error);
    throw error;
  }
};

export const crearLectura = async (data) => {
  try {
    const res = await axiosClient.post("/lecturas/", data);
    Logger.api("POST /lecturas", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error creando lectura", error);
    throw error;
  }
};

export const actualizarLectura = async (id, data) => {
  try {
    const res = await axiosClient.put(`/lecturas/${id}`, data);
    Logger.api(`PUT /lecturas/${id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error actualizando lectura ${id}`, error);
    throw error;
  }
};

export const eliminarLectura = async (id) => {
  try {
    const res = await axiosClient.delete(`/lecturas/${id}`);
    Logger.api(`DELETE /lecturas/${id}`, res.data);
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    Logger.error(`Error eliminando lectura ${id}`, error);
    
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400 && data?.puede_desactivar) {
        return {
          success: false,
          puedeDesactivar: true,
          mensaje: data.mensaje,
          detalles: data.detalles,
        };
      }

      return {
        success: false,
        mensaje: data?.detail || "Error eliminando lectura",
      };
    }

    return {
      success: false,
      mensaje: "No se pudo conectar con el servidor",
    };
  }
};

export const desactivarLectura = async (id) => {
  try {
    const res = await axiosClient.patch(`/lecturas/${id}/desactivar`);
    Logger.api(`PATCH /lecturas/${id}/desactivar`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error desactivando lectura ${id}`, error);
    throw error;
  }
};
