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

// ===============================
// PADRE (Tutor IA / mejoras)
// ===============================
export const getMejorasIAHijo = async (id) => {
  const { data } = await axiosClient.get(
    `/historial/mejoras/hijo/${id}`
  );
  return data;
};

// ===============================
// DOCENTE
// ===============================
export const getHistorialPronunciacionEstudianteDocente = async (id) => {
  const { data } = await axiosClient.get(
    `/historial/pronunciacion/docente/${id}`
  );
  return data;
};

export const getPracticasPronunciacionEstudianteDocente = async (id) => {
  const { data } = await axiosClient.get(
    `/historial/practicas/docente/${id}`
  );
  return data;
};

export const getMejorasIAEstudianteDocente = async (id) => {
  const { data } = await axiosClient.get(
    `/historial/mejoras/docente/${id}`
  );
  return data;
};
