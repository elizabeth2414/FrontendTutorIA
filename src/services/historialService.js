import axiosClient from "../api/axiosClient";

// ===============================
// ESTUDIANTE
// ===============================
export const getMiHistorialPronunciacion = async () => {
  const { data } = await axiosClient.get(
    "/historial/pronunciacion/mis"
  );
  return data;
};

export const getMisPracticasPronunciacion = async () => {
  const { data } = await axiosClient.get(
    "/historial/practicas/mis"
  );
  return data;
};

// ===============================
// PADRE
// ===============================
export const getHistorialPronunciacionHijo = async (id) => {
  const { data } = await axiosClient.get(
    `/historial/pronunciacion/hijo/${id}`
  );
  return data;
};

export const getPracticasPronunciacionHijo = async (id) => {
  const { data } = await axiosClient.get(
    `/historial/practicas/hijo/${id}`
  );
  return data;
};
