import axiosClient from "../api/axiosClient";

export const listarLecturas = async () => {
  const res = await axiosClient.get("/lecturas/");  // ✅ Agregado /
  return res.data;
};

export const crearLectura = async (data) => {
  const res = await axiosClient.post("/lecturas/", data);  // ✅ Agregado /
  return res.data;
};

export const actualizarLectura = async (id, data) => {
  const res = await axiosClient.put(`/lecturas/${id}/`, data);  // ✅ Agregado /
  return res.data;
};

export const eliminarLectura = async (id) => {
  const res = await axiosClient.delete(`/lecturas/${id}/`, data);  // ✅ Agregado /
  return res.data;
};
