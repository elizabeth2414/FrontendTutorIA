import axiosClient from "../api/axiosClient";
import Logger from "../logs/logger";

export const listarCategorias = async () => {
  try {
    const res = await axiosClient.get("/categorias");
    Logger.api("GET /categorias", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error listando categorías", error);
    throw error;
  }
};

export const crearCategoria = async (datos) => {
  try {
    const res = await axiosClient.post("/categorias", datos);
    Logger.api("POST /categorias", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error creando categoría", error);
    throw error;
  }
};

export const actualizarCategoria = async (id, datos) => {
  try {
    const res = await axiosClient.put(`/categorias/${id}`, datos);
    Logger.api(`PUT /categorias/${id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error actualizando categoría ${id}`, error);
    throw error;
  }
};

export const eliminarCategoria = async (id) => {
  try {
    const res = await axiosClient.delete(`/categorias/${id}`);
    Logger.api(`DELETE /categorias/${id}`, res.data);
    return res.data;
  } catch (error) {
    Logger.error(`Error eliminando categoría ${id}`, error);
    throw error;
  }
};
