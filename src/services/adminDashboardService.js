import axiosClient from "../api/axiosClient";

export const obtenerDashboardAdmin = async () => {
  try {
    const res = await axiosClient.get("/admin/dashboard");
    return res.data;
  } catch (error) {
    console.error("Error obteniendo estadísticas del dashboard:", error);
    throw error;
  }
  
};


