import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  MdAssessment,
  MdTrendingUp,
  MdSearch,
  MdPeople,
  MdTimeline,
  MdCheckCircle,
  MdBook,
} from "react-icons/md";

import { getResumenProgresoEstudiantes } from "../../services/docentesService";

export default function ProgresoEstudiantesDocente() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [datos, setDatos] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ==========================
  // CARGAR DATOS
  // ==========================
  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await getResumenProgresoEstudiantes();
      setDatos(data);
    } catch (err) {
      console.error("Error cargando progreso:", err);
      Swal.fire({
        title: "Error",
        text: "No se pudo cargar el progreso de los estudiantes.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ==========================
  // FILTRAR ESTUDIANTES
  // ==========================
  const estudiantesFiltrados =
    datos?.estudiantes?.filter((est) => {
      const searchLower = searchTerm.toLowerCase();
      const nombre = (est.nombre || "").toLowerCase();
      const apellido = (est.apellido || "").toLowerCase();
      const curso = (est.curso || "").toLowerCase();
      return (
        nombre.includes(searchLower) ||
        apellido.includes(searchLower) ||
        curso.includes(searchLower)
      );
    }) || [];

  // ==========================
  // FUNCIÓN PARA OBTENER COLOR SEGÚN PROMEDIO
  // ==========================
  const getColorPromedio = (promedio) => {
    if (promedio >= 80) return "text-green-600 bg-green-100";
    if (promedio >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando progreso...</p>
        </div>
      </div>
    );
  }

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

      {/* VERSIÓN MÓVIL */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 animate-fadeIn p-4">
        {/* Header móvil */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-slate-900 mb-1">
            Progreso de Estudiantes
          </h1>
          <p className="text-sm text-slate-600">
            Monitorea el avance de tus estudiantes
          </p>
        </div>

        {/* Estadísticas generales móvil */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-3 border border-slate-200">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mx-auto mb-2">
              <MdPeople className="text-purple-600" size={20} />
            </div>
            <p className="text-xs text-slate-600 text-center mb-1">
              Estudiantes
            </p>
            <p className="text-lg font-bold text-slate-900 text-center">
              {datos?.total_estudiantes || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-3 border border-slate-200">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mx-auto mb-2">
              <MdCheckCircle className="text-green-600" size={20} />
            </div>
            <p className="text-xs text-slate-600 text-center mb-1">
              Actividades
            </p>
            <p className="text-lg font-bold text-slate-900 text-center">
              {datos?.estadisticas_generales?.total_actividades_completadas || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-3 border border-slate-200">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mx-auto mb-2">
              <MdBook className="text-blue-600" size={20} />
            </div>
            <p className="text-xs text-slate-600 text-center mb-1">Lecturas</p>
            <p className="text-lg font-bold text-slate-900 text-center">
              {datos?.estadisticas_generales?.total_lecturas_completadas || 0}
            </p>
          </div>
        </div>

        {/* Búsqueda móvil */}
        <div className="mb-4">
          <div className="relative">
            <MdSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar estudiante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Lista móvil */}
        {estudiantesFiltrados.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-slate-200">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              {searchTerm ? (
                <MdSearch size={32} className="text-purple-600" />
              ) : (
                <MdAssessment size={32} className="text-purple-600" />
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {searchTerm
                ? "No se encontraron estudiantes"
                : "No hay estudiantes registrados"}
            </h3>
            <p className="text-sm text-slate-500">
              {searchTerm
                ? `No hay resultados para "${searchTerm}"`
                : "Agrega estudiantes para ver su progreso"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {estudiantesFiltrados.map((est) => (
              <div
                key={est.id}
                onClick={() => navigate(`/docente/menu/progreso/${est.id}`)}
                className="bg-white rounded-xl shadow-sm p-4 border border-slate-200 hover:border-purple-300 transition-all cursor-pointer hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1">
                      {est.nombre} {est.apellido}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                        {est.curso}
                      </span>
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full font-semibold">
                        Nivel {est.nivel_educativo}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getColorPromedio(
                      est.promedio
                    )}`}
                  >
                    {est.promedio.toFixed(1)}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-green-50 rounded-lg p-2">
                    <p className="text-xs text-green-700 font-semibold mb-1">
                      Actividades
                    </p>
                    <p className="text-lg font-bold text-green-900">
                      {est.actividades_completadas}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2">
                    <p className="text-xs text-blue-700 font-semibold mb-1">
                      Lecturas
                    </p>
                    <p className="text-lg font-bold text-blue-900">
                      {est.lecturas_completadas}
                    </p>
                  </div>
                </div>

                {est.ultima_actividad && (
                  <p className="text-xs text-slate-500">
                    Última actividad:{" "}
                    {new Date(est.ultima_actividad).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VERSIÓN DESKTOP */}
      <div className="hidden md:block min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 animate-fadeIn p-6">
        {/* Header desktop */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-600 text-white flex items-center justify-center shadow-lg">
                <MdAssessment size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Progreso de Estudiantes
                </h1>
                <p className="text-sm text-slate-600">
                  Monitorea el avance académico de tus estudiantes
                </p>
              </div>
            </div>

            <div className="relative">
              <MdSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar estudiante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Estadísticas generales desktop */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <MdPeople className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium mb-1">
                  Total Estudiantes
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {datos?.total_estudiantes || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MdCheckCircle className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium mb-1">
                  Actividades Completadas
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {datos?.estadisticas_generales
                    ?.total_actividades_completadas || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MdBook className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium mb-1">
                  Lecturas Completadas
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {datos?.estadisticas_generales?.total_lecturas_completadas ||
                    0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <MdTrendingUp className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium mb-1">
                  Promedio General
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {datos?.estadisticas_generales?.promedio_general?.toFixed(1) ||
                    0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla desktop */}
        {estudiantesFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-slate-200">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {searchTerm ? (
                <MdSearch size={40} className="text-purple-600" />
              ) : (
                <MdAssessment size={40} className="text-purple-600" />
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {searchTerm
                ? "No se encontraron estudiantes"
                : "No hay estudiantes registrados"}
            </h3>
            <p className="text-slate-500">
              {searchTerm
                ? `No hay resultados para "${searchTerm}"`
                : "Agrega estudiantes para ver su progreso"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-bold text-slate-700">
                      Estudiante
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-bold text-slate-700">
                      Curso
                    </th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-slate-700">
                      Nivel
                    </th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-slate-700">
                      Actividades
                    </th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-slate-700">
                      Lecturas
                    </th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-slate-700">
                      Promedio
                    </th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-slate-700">
                      Última Actividad
                    </th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-slate-700">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {estudiantesFiltrados.map((est, index) => (
                    <tr
                      key={est.id}
                      className={`border-b border-slate-100 hover:bg-purple-50/30 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {est.nombre} {est.apellido}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                          {est.curso}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center text-slate-700">
                        Nivel {est.nivel_educativo}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                          {est.actividades_completadas}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                          {est.lecturas_completadas}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${getColorPromedio(
                            est.promedio
                          )}`}
                        >
                          {est.promedio.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center text-sm text-slate-600">
                        {est.ultima_actividad
                          ? new Date(est.ultima_actividad).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          <button
                            onClick={() =>
                              navigate(`/docente/menu/progreso/${est.id}`)
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-lg font-semibold shadow-sm hover:from-purple-600 hover:to-violet-700 transition-all hover:scale-105"
                          >
                            <MdTimeline size={18} />
                            Ver Detalle
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer tabla */}
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 px-6 py-3 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                Total de estudiantes:{" "}
                <span className="font-bold text-purple-600">
                  {estudiantesFiltrados.length}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}