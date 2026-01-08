import axiosClient from "../api/axiosClient";

export const getProgresoEstudiante = async (estudianteId) => {
  if (!estudianteId) {
    throw new Error("ID de estudiante requerido");
  }

  const [puntosRes, recompensasRes] = await Promise.all([
    axiosClient.get(`/gamificacion/estudiante/${estudianteId}/puntos`),
    axiosClient.get(`/gamificacion/estudiante/${estudianteId}/recompensas`),
  ]);

  const puntos = puntosRes.data || [];
  const recompensas = recompensasRes.data || [];

  // 🔢 Cálculo simple de progreso (puedes refinar luego)
  const xp_actual = puntos.reduce((acc, p) => acc + p.puntos, 0);
  const nivel_actual = Math.floor(xp_actual / 500) + 1;

  return {
    nombre: "Estudiante",
    nivel_actual,
    xp_actual,
    xp_para_siguiente_nivel: nivel_actual * 500,
    racha_actual: 3, // luego backend real
    recompensas,
  };
};
