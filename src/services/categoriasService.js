import axiosClient from "../api/axiosClient";

export const listarCategorias = async () => {
  const res = await axiosClient.get("/categorias");
  return res.data;
};

export const crearCategoria = async (datos) => {
  const res = await axiosClient.post("/categorias", datos);
  return res.data;
};

export const actualizarCategoria = async (id, datos) => {
  const res = await axiosClient.put(`/categorias/${id}`, datos);
  return res.data;
};

export const eliminarCategoria = async (id) => {
  const res = await axiosClient.delete(`/categorias/${id}`);
  return res.data;
};
