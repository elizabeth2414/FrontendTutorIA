import axiosClient from "../api/axiosClient";

export const listarLecturas = async () => {
  const res = await axiosClient.get("/lecturas/");
  return res.data;
};


export const crearLectura = async (data) => {
  const res = await axiosClient.post("/lecturas/", data);
  return res.data;
};


export const actualizarLectura = async (id, data) => {
  const res = await axiosClient.put(`/lecturas/${id}`, data);
  return res.data;
};


export const eliminarLectura = async (id) => {
  try {
    const res = await axiosClient.delete(`/lecturas/${id}`);
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
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
  const res = await axiosClient.patch(`/lecturas/${id}/desactivar`);
  return res.data;
};
