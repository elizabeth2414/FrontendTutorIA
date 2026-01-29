import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  MdArrowBack,
  MdAssessment,
  MdBook,
  MdCheckCircle,
  MdTrendingUp,
  MdCalendarToday,
  MdTimer,
  MdStar,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  getProgresoDetalladoEstudiante,
  getGraficaProgresoEstudiante,
} from "../../services/docentesService";

export default function ProgresoDetalladoEstudiante() {
  const { estudianteId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [datos, setDatos] = useState(null);
  const [graficaDatos, setGraficaDatos] = useState(null);
  const [periodo, setPeriodo] = useState("mes");
  const [vistaActual, setVistaActual] = useState("resumen"); // resumen, actividades, lecturas
  
  // Estado para expandir/contraer secciones
  const [actividadesExpandidas, setActividadesExpandidas] = useState(false);
  const [lecturasExpandidas, setLecturasExpandidas] = useState(false);

  // ==========================
  // CARGAR DATOS
  // ==========================
  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [progreso, grafica] = await Promise.all([
        getProgresoDetalladoEstudiante(estudianteId),
        getGraficaProgresoEstudiante(estudianteId, periodo),
      ]);
      setDatos(progreso);
      setGraficaDatos(grafica);
    } catch (err) {
      console.error("Error cargando progreso detallado:", err);
      Swal.fire({
        title: "Error",
        text: "No se pudo cargar el progreso del estudiante. Es posible que no tengas permiso para ver esta información.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      }).then(() => navigate("/docente/menu/progreso"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [estudianteId, periodo]);

  // ==========================
  // FUNCIÓN PARA OBTENER COLOR SEGÚN PROMEDIO
  // ==========================
  const getColorPromedio = (promedio) => {
    if (promedio >= 80) return "text-green-600 bg-green-100";
    if (promedio >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  // ==========================
  // FORMATEAR DATOS PARA GRÁFICA
  // ==========================
  const formatearDatosGrafica = () => {
    if (!graficaDatos) return [];

    // Combinar actividades y lecturas por fecha
    const fechasMap = new Map();

    graficaDatos.actividades?.forEach((item) => {
      fechasMap.set(item.fecha, {
        fecha: new Date(item.fecha).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
        }),
        actividades: item.promedio,
        lecturas: 0,
      });
    });

    graficaDatos.lecturas?.forEach((item) => {
      const existing = fechasMap.get(item.fecha);
      if (existing) {
        existing.lecturas = item.promedio;
      } else {
        fechasMap.set(item.fecha, {
          fecha: new Date(item.fecha).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
          }),
          actividades: 0,
          lecturas: item.promedio,
        });
      }
    });

    return Array.from(fechasMap.values()).sort((a, b) => {
      const dateA = new Date(a.fecha);
      const dateB = new Date(b.fecha);
      return dateA - dateB;
    });
  };

  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">
            Cargando progreso del estudiante...
          </p>
        </div>
      </div>
    );
  }

  if (!datos) return null;

  const datosGrafica = formatearDatosGrafica();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Fredoka:wght@500;600;700&display=swap');
        
        * {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Fredoka', 'Poppins', sans-serif;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 animate-fadeIn p-4 md:p-6">
        {/* Botón volver */}
        <button
          onClick={() => navigate("/docente/menu/progreso")}
          className="mb-4 flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-semibold shadow-sm border border-slate-200 transition-all"
        >
          <MdArrowBack size={20} />
          Volver al listado
        </button>

        {/* Header con información del estudiante */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-600 text-white flex items-center justify-center shadow-lg text-2xl font-bold">
                {datos.estudiante.nombre[0]}
                {datos.estudiante.apellido[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {datos.estudiante.nombre} {datos.estudiante.apellido}
                </h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    {datos.estudiante.curso}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold">
                    Nivel {datos.estudiante.nivel_educativo}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MdCheckCircle className="text-green-600" size={20} />
              </div>
              <p className="text-xs md:text-sm text-slate-600 font-medium">
                Actividades
              </p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-slate-900">
              {datos.estadisticas.total_actividades}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MdBook className="text-blue-600" size={20} />
              </div>
              <p className="text-xs md:text-sm text-slate-600 font-medium">
                Lecturas
              </p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-slate-900">
              {datos.estadisticas.total_lecturas}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <MdTrendingUp className="text-orange-600" size={20} />
              </div>
              <p className="text-xs md:text-sm text-slate-600 font-medium">
                Promedio
              </p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-slate-900">
              {datos.estadisticas.promedio_general.toFixed(1)}%
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MdCheckCircle className="text-purple-600" size={20} />
              </div>
              <p className="text-xs md:text-sm text-slate-600 font-medium">
                Esta semana
              </p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-slate-900">
              {datos.estadisticas.actividades_esta_semana +
                datos.estadisticas.lecturas_esta_semana}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <MdStar className="text-yellow-600" size={20} />
              </div>
              <p className="text-xs md:text-sm text-slate-600 font-medium">
                Prom. Act.
              </p>
            </div>
            <p className="text-xl md:text-2xl font-bold text-slate-900">
              {datos.estadisticas.promedio_actividades.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Botón de Zona Práctica */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/docente/menu/progreso/${estudianteId}/practica`)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:from-emerald-600 hover:to-teal-700 transition-all hover:scale-105"
          >
            <MdAssessment size={20} />
            Ver Historial de Zona Práctica
          </button>
        </div>

        {/* Selector de período para la gráfica */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4 md:mb-0">
              Progreso en el Tiempo
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setPeriodo("semana")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  periodo === "semana"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setPeriodo("mes")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  periodo === "mes"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Mes
              </button>
              <button
                onClick={() => setPeriodo("trimestre")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  periodo === "trimestre"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Trimestre
              </button>
            </div>
          </div>

          {/* Gráfica */}
          {datosGrafica.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={datosGrafica}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="fecha"
                  stroke="#64748b"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actividades"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Actividades"
                  dot={{ fill: "#10b981", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="lecturas"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Lecturas"
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500">
                No hay datos suficientes para mostrar la gráfica en este
                período.
              </p>
            </div>
          )}
        </div>

        {/* Actividades completadas */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
          <button
            onClick={() => setActividadesExpandidas(!actividadesExpandidas)}
            className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MdCheckCircle className="text-green-600" size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Actividades Completadas ({datos.actividades.length})
              </h2>
            </div>
            {actividadesExpandidas ? (
              <MdKeyboardArrowUp size={24} className="text-slate-600" />
            ) : (
              <MdKeyboardArrowDown size={24} className="text-slate-600" />
            )}
          </button>

          {actividadesExpandidas && (
            <div className="p-6 pt-0">
              {datos.actividades.length === 0 ? (
                <p className="text-center text-slate-500 py-8">
                  No hay actividades completadas aún.
                </p>
              ) : (
                <div className="space-y-3">
                  {datos.actividades.map((act) => (
                    <div
                      key={act.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div className="mb-3 md:mb-0">
                        <h3 className="font-bold text-slate-900 mb-1">
                          {act.titulo}
                        </h3>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                            {act.tipo}
                          </span>
                          <span className="flex items-center gap-1 text-slate-600">
                            <MdCalendarToday size={12} />
                            {new Date(act.fecha_completacion).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1 text-slate-600">
                            <MdTimer size={12} />
                            {act.tiempo_completacion
                              ? `${act.tiempo_completacion}s`
                              : "—"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-slate-600">Puntuación</p>
                          <p className="text-lg font-bold text-slate-900">
                            {act.puntuacion}/{act.puntos_maximos}
                          </p>
                        </div>
                        <div
                          className={`px-4 py-2 rounded-lg text-sm font-bold ${getColorPromedio(
                            (act.puntuacion / act.puntos_maximos) * 100
                          )}`}
                        >
                          {((act.puntuacion / act.puntos_maximos) * 100).toFixed(
                            1
                          )}
                          %
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Lecturas evaluadas */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <button
            onClick={() => setLecturasExpandidas(!lecturasExpandidas)}
            className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MdBook className="text-blue-600" size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Lecturas Evaluadas ({datos.lecturas.length})
              </h2>
            </div>
            {lecturasExpandidas ? (
              <MdKeyboardArrowUp size={24} className="text-slate-600" />
            ) : (
              <MdKeyboardArrowDown size={24} className="text-slate-600" />
            )}
          </button>

          {lecturasExpandidas && (
            <div className="p-6 pt-0">
              {datos.lecturas.length === 0 ? (
                <p className="text-center text-slate-500 py-8">
                  No hay lecturas evaluadas aún.
                </p>
              ) : (
                <div className="space-y-3">
                  {datos.lecturas.map((lec) => (
                    <div
                      key={lec.id}
                      className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-slate-900 mb-1">
                            {lec.titulo}
                          </h3>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span
                              className={`px-2 py-1 rounded-full font-semibold ${
                                lec.aprobada
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {lec.aprobada ? "Aprobada" : "No aprobada"}
                            </span>
                            <span className="flex items-center gap-1 text-slate-600">
                              <MdCalendarToday size={12} />
                              {new Date(lec.fecha_evaluacion).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div className="bg-white p-2 rounded-lg">
                          <p className="text-xs text-slate-600 mb-1">Precisión</p>
                          <p className="text-sm font-bold text-slate-900">
                            {lec.precision_palabras
                              ? `${lec.precision_palabras.toFixed(1)}%`
                              : "—"}
                          </p>
                        </div>
                        <div className="bg-white p-2 rounded-lg">
                          <p className="text-xs text-slate-600 mb-1">Velocidad</p>
                          <p className="text-sm font-bold text-slate-900">
                            {lec.velocidad_lectura
                              ? `${lec.velocidad_lectura.toFixed(1)}`
                              : "—"}
                          </p>
                        </div>
                        <div className="bg-white p-2 rounded-lg">
                          <p className="text-xs text-slate-600 mb-1">Fluidez</p>
                          <p className="text-sm font-bold text-slate-900">
                            {lec.fluidez ? `${lec.fluidez.toFixed(1)}%` : "—"}
                          </p>
                        </div>
                        <div className="bg-white p-2 rounded-lg">
                          <p className="text-xs text-slate-600 mb-1">Estado</p>
                          <p
                            className={`text-sm font-bold ${
                              lec.aprobada
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {lec.aprobada ? "✓ Aprobada" : "✗ Revisar"}
                          </p>
                        </div>
                      </div>

                      {lec.retroalimentacion && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-xs text-blue-700 font-semibold mb-1">
                            Retroalimentación IA:
                          </p>
                          <p className="text-sm text-slate-700">
                            {lec.retroalimentacion}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}