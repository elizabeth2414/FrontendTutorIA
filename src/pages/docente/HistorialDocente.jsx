import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import { getEstudiantesDocente } from "../../services/docentesService";
import {
  getHistorialPronunciacionEstudianteDocente,
  getPracticasPronunciacionEstudianteDocente,
} from "../../services/historialService";

export default function HistorialDocente() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [estudianteActivo, setEstudianteActivo] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingHistorial, setLoadingHistorial] = useState(false);

  const [pronunciacion, setPronunciacion] = useState([]);
  const [practicas, setPracticas] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const est = await getEstudiantesDocente();
        setEstudiantes(Array.isArray(est) ? est : []);
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar tus estudiantes.",
          icon: "error",
          confirmButtonColor: "#9333ea",
        });
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const estudiantesFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return estudiantes;
    return estudiantes.filter((e) => {
      const nombre = `${e.nombre || ""} ${e.apellido || ""}`.toLowerCase();
      const curso = (e.curso_nombre || e.curso || "").toLowerCase();
      return nombre.includes(q) || curso.includes(q);
    });
  }, [estudiantes, busqueda]);

  const cargarHistorial = async (estudianteId) => {
    try {
      setEstudianteActivo(estudianteId);
      setLoadingHistorial(true);

      const [p, pr] = await Promise.all([
        getHistorialPronunciacionEstudianteDocente(estudianteId),
        getPracticasPronunciacionEstudianteDocente(estudianteId),
      ]);

      setPronunciacion(Array.isArray(p) ? p : []);
      setPracticas(Array.isArray(pr) ? pr : []);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Sin acceso",
        text: "No se pudo cargar el historial (revisa permisos o relación docente-estudiante).",
        icon: "warning",
        confirmButtonColor: "#9333ea",
      });
    } finally {
      setLoadingHistorial(false);
    }
  };

  const estudianteActualObj = useMemo(
    () => estudiantes.find((e) => e.id === estudianteActivo) || null,
    [estudiantes, estudianteActivo]
  );

  // Calcular estadísticas
  const estadisticas = useMemo(() => {
    if (!estudianteActivo) return null;

    const promedioPronunciacion = pronunciacion.length > 0
      ? (pronunciacion.reduce((acc, p) => acc + (p.puntuacion_global || 0), 0) / pronunciacion.length).toFixed(1)
      : 0;

    const promedioPracticas = practicas.length > 0
      ? (practicas.reduce((acc, p) => acc + (p.puntuacion || 0), 0) / practicas.length).toFixed(1)
      : 0;

    const totalErrores = practicas.reduce((acc, p) => acc + (p.errores_detectados || 0), 0);
    const totalIntentos = practicas.reduce((acc, p) => acc + (p.intentos || 0), 0);

    return {
      promedioPronunciacion,
      promedioPracticas,
      totalErrores,
      totalIntentos,
      totalLecturas: pronunciacion.length,
      totalPracticas: practicas.length,
    };
  }, [estudianteActivo, pronunciacion, practicas]);

  // Colores para avatares
  const avatarColors = [
    'bg-gradient-to-br from-purple-500 to-pink-500',
    'bg-gradient-to-br from-blue-500 to-cyan-500',
    'bg-gradient-to-br from-emerald-500 to-teal-500',
    'bg-gradient-to-br from-orange-500 to-red-500',
    'bg-gradient-to-br from-indigo-500 to-purple-500',
    'bg-gradient-to-br from-rose-500 to-pink-500',
  ];

  const getAvatarColor = (index) => avatarColors[index % avatarColors.length];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Cargando historial académico</h3>
          <p className="text-slate-600">Preparando datos de tus estudiantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header Mejorado con Gradiente */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
          <div className="flex items-center justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-black text-white drop-shadow-lg">
                  Historial Académico
                </h1>
              </div>
              <p className="text-white/90 text-lg font-medium">
                Seguimiento detallado del progreso de tus estudiantes
              </p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30 shadow-xl">
              <p className="text-white/80 text-sm font-semibold mb-1">Total estudiantes</p>
              <p className="text-5xl font-black text-white">{estudiantes.length}</p>
            </div>
          </div>

          {/* Búsqueda mejorada */}
          <div className="relative max-w-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/40">
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o curso..."
                className="w-full pl-14 pr-6 py-4 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Selector de estudiantes con cards atractivas */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/60 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-slate-50 to-purple-50 px-6 py-5 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2.5 rounded-xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900">Estudiantes</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 font-medium">
                  {estudiantesFiltrados.length} de {estudiantes.length}
                </span>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  {estudiantesFiltrados.length}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {estudiantesFiltrados.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-slate-700 font-bold text-xl mb-2">No se encontraron estudiantes</p>
                <p className="text-slate-500">Intenta ajustar los filtros de búsqueda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {estudiantesFiltrados.map((e, index) => (
                  <button
                    key={e.id}
                    onClick={() => cargarHistorial(e.id)}
                    className={`group relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                      estudianteActivo === e.id
                        ? "shadow-2xl shadow-purple-500/40"
                        : "shadow-lg hover:shadow-xl"
                    }`}
                  >
                    <div className={`absolute inset-0 ${
                      estudianteActivo === e.id
                        ? "bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600"
                        : "bg-gradient-to-br from-slate-50 to-slate-100"
                    }`}></div>
                    
                    {estudianteActivo === e.id && (
                      <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                    )}
                    
                    <div className="relative p-5">
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg transform transition-transform group-hover:scale-110 ${
                          estudianteActivo === e.id 
                            ? "bg-white/20 text-white backdrop-blur-sm" 
                            : `${getAvatarColor(index)} text-white`
                        }`}>
                          {e.nombre?.charAt(0)}{e.apellido?.charAt(0)}
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`font-bold text-base mb-1 ${
                            estudianteActivo === e.id ? "text-white" : "text-slate-900"
                          }`}>
                            {e.nombre} {e.apellido}
                          </p>
                          {e.curso_nombre && (
                            <p className={`text-sm font-medium flex items-center gap-1.5 ${
                              estudianteActivo === e.id ? "text-white/80" : "text-slate-600"
                            }`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              {e.curso_nombre}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {estudianteActivo === e.id && (
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 mt-3">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-white font-semibold text-sm">Seleccionado</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contenido del historial */}
        {estudianteActivo && (
          <div className="space-y-6">
            {/* Tarjeta de estudiante con estadísticas mejorada */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 via-purple-900 to-pink-900 px-6 py-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-2xl ${
                      getAvatarColor(estudiantes.findIndex(e => e.id === estudianteActivo))
                    } text-white`}>
                      {estudianteActualObj?.nombre?.charAt(0)}{estudianteActualObj?.apellido?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white mb-1">
                        {estudianteActualObj ? `${estudianteActualObj.nombre} ${estudianteActualObj.apellido}` : ""}
                      </h3>
                      {estudianteActualObj?.curso_nombre && (
                        <div className="flex items-center gap-2 text-purple-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span className="font-semibold">{estudianteActualObj.curso_nombre}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {loadingHistorial && (
                    <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/30">
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-white font-bold">Actualizando...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Métricas con diseño de cards */}
              {estadisticas && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-500 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <p className="text-blue-700 text-xs font-bold uppercase tracking-wide">Lecturas</p>
                    </div>
                    <p className="text-4xl font-black text-blue-900 mb-1">{estadisticas.promedioPronunciacion}</p>
                    <p className="text-blue-600 text-sm font-semibold">{estadisticas.totalLecturas} evaluaciones</p>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-5 border-2 border-emerald-200 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-emerald-500 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-emerald-700 text-xs font-bold uppercase tracking-wide">Prácticas</p>
                    </div>
                    <p className="text-4xl font-black text-emerald-900 mb-1">{estadisticas.promedioPracticas}</p>
                    <p className="text-emerald-600 text-sm font-semibold">{estadisticas.totalPracticas} ejercicios</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-purple-500 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <p className="text-purple-700 text-xs font-bold uppercase tracking-wide">Intentos</p>
                    </div>
                    <p className="text-4xl font-black text-purple-900 mb-1">{estadisticas.totalIntentos}</p>
                    <p className="text-purple-600 text-sm font-semibold">En prácticas</p>
                  </div>
                </div>
              )}
            </div>

            {/* Resto del contenido (tablas) permanece igual */}
            {/* Lecturas Evaluadas - Tabla profesional */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-5 border-b border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 p-2.5 rounded-xl shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-900">Lecturas Evaluadas</h3>
                      <p className="text-sm text-blue-700">Evaluaciones de pronunciación y fluidez</p>
                    </div>
                  </div>
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {pronunciacion.length}
                  </span>
                </div>
              </div>

              {pronunciacion.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-slate-700 font-bold text-lg mb-2">Sin lecturas evaluadas</p>
                  <p className="text-slate-500">El estudiante aún no ha completado evaluaciones de lectura</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Lectura</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">Puntuación</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">Fluidez</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">Velocidad</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">Precisión</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Retroalimentación</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {pronunciacion.map((p, idx) => (
                        <tr key={p.id} className={`hover:bg-blue-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{p.lectura_titulo || "Sin título"}</p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <p className="text-sm text-slate-600 font-medium">
                              {p.fecha ? new Date(p.fecha).toLocaleDateString('es-ES', { 
                                day: '2-digit', 
                                month: 'short',
                                year: 'numeric'
                              }) : "-"}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-black text-xl shadow-lg">
                              {p.puntuacion_global ?? "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-sm font-bold text-slate-800">{p.fluidez ?? "-"}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-sm font-bold text-slate-800">{p.velocidad ?? "-"}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-sm font-bold text-slate-800">{p.precision ?? "-"}</span>
                          </td>
                          <td className="px-6 py-4">
                            {p.retroalimentacion ? (
                              <p className="text-sm text-slate-600 line-clamp-2 max-w-xs">{p.retroalimentacion}</p>
                            ) : (
                              <span className="text-sm text-slate-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Zona Práctica */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 px-6 py-5 border-b border-emerald-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-500 p-2.5 rounded-xl shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-emerald-900">Zona Práctica</h3>
                      <p className="text-sm text-emerald-700">Ejercicios y actividades de pronunciación</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {practicas.length}
                  </span>
                </div>
              </div>

              {practicas.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-700 font-bold text-lg mb-2">Sin prácticas registradas</p>
                  <p className="text-slate-500">El estudiante aún no ha realizado ejercicios de práctica</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-slate-50 to-emerald-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Lectura</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">Puntuación</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">Intentos</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">Errores</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Palabras objetivo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {practicas.map((p, idx) => (
                        <tr key={p.id} className={`hover:bg-emerald-50/50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{p.lectura_titulo || "Sin título"}</p>
                            {p.texto_practica && (
                              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{p.texto_practica}</p>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <p className="text-sm text-slate-600 font-medium">
                              {p.fecha ? new Date(p.fecha).toLocaleDateString('es-ES', { 
                                day: '2-digit', 
                                month: 'short',
                                year: 'numeric'
                              }) : "-"}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-block px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                              {p.tipo_ejercicio || "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-black text-xl shadow-lg">
                              {p.puntuacion ?? "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-sm font-bold text-slate-800">{p.intentos ?? 0}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-sm font-bold text-slate-800">{p.errores_detectados ?? 0}</span>
                          </td>
                          <td className="px-6 py-4">
                            {Array.isArray(p.palabras_objetivo) && p.palabras_objetivo.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {p.palabras_objetivo.slice(0, 3).map((palabra, idx) => (
                                  <span key={idx} className="inline-block px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                                    {palabra}
                                  </span>
                                ))}
                                {p.palabras_objetivo.length > 3 && (
                                  <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-200 text-slate-600 text-xs font-bold">
                                    +{p.palabras_objetivo.length - 3}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-slate-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}