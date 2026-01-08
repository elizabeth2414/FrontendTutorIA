import axiosClient from "../api/axiosClient";
import Logger from "../logs/logger";

const BASE_URL = "/ia";

export const obtenerTextoLectura = async (contenidoId) => {
  try {
    const res = await axiosClient.get(
      `${BASE_URL}/lectura-texto/${contenidoId}`
    );
    Logger.api("GET /ia/lectura-texto", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error al obtener texto de lectura IA", error);
    throw error;
  }
};

export const obtenerAudioLectura = (contenidoId) => {
  return `${axiosClient.defaults.baseURL}${BASE_URL}/lectura-audio/${contenidoId}`;
};

export const analizarLecturaIA = async ({
  estudianteId,
  contenidoId,
  archivoAudio,
  evaluacionId = null,
}) => {
  try {
    // 🧪 Validaciones
    if (!(archivoAudio instanceof Blob)) {
      throw new Error("El archivo de audio no es válido.");
    }
    if (archivoAudio.size === 0) {
      throw new Error("El audio está vacío.");
    }

    const formData = new FormData();
    formData.append("estudiante_id", estudianteId);
    formData.append("contenido_id", contenidoId);
    formData.append(
      "audio",
      archivoAudio,
      archivoAudio.name || "lectura.webm"
    );
    formData.append("modo", "ninos"); // 🧸 modo infantil

    if (evaluacionId) {
      formData.append("evaluacion_id", evaluacionId);
    }

    const res = await axiosClient.post(
      `${BASE_URL}/analizar-lectura`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000,
      }
    );

    Logger.api("POST /ia/analizar-lectura", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error al analizar lectura IA", error);

    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }

    throw error;
  }
};

export const practicarEjercicioIA = async ({
  estudianteId,
  ejercicioId,
  archivoAudio,
}) => {
  try {
    if (!(archivoAudio instanceof Blob) || archivoAudio.size === 0) {
      throw new Error("Audio de práctica inválido.");
    }

    const formData = new FormData();
    formData.append("estudiante_id", estudianteId);
    formData.append("ejercicio_id", ejercicioId);
    formData.append(
      "audio",
      archivoAudio,
      archivoAudio.name || "practica.webm"
    );

    const res = await axiosClient.post(
      `${BASE_URL}/practicar-ejercicio`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
      }
    );

    Logger.api("POST /ia/practicar-ejercicio", res.data);
    return res.data;
  } catch (error) {
    Logger.error("Error al practicar ejercicio IA", error);

    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }

    throw error;
  }
};
