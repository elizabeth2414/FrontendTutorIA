import { useEffect, useMemo, useState } from "react";
import {
  getHistorialPronunciacionHijo,
  getPracticasPronunciacionHijo,
} from "../../services/historialService";
import { getMisHijos } from "../../services/padresService";

export default function HistorialHijo() {
  const [hijos, setHijos] = useState([]);
  const [hijoActivo, setHijoActivo] = useState(null);
  const [pronunciacion, setPronunciacion] = useState([]);
  const [practicas, setPracticas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistorial, setLoadingHistorial] = useState(false);

  useEffect(() => {
    const cargarHijos = async () => {
      setLoading(true);
      try {
        const data = await getMisHijos();
        setHijos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    cargarHijos();
  }, []);

  const cargarHistorial = async (id) => {
    setHijoActivo(id);
    setLoadingHistorial(true);
    try {
      const [p, pr] = await Promise.all([
        getHistorialPronunciacionHijo(id),
        getPracticasPronunciacionHijo(id),
      ]);
      setPronunciacion(Array.isArray(p) ? p : []);
      setPracticas(Array.isArray(pr) ? pr : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHistorial(false);
    }
  };

  const hijoActualObj = useMemo(
    () => hijos.find((h) => h.id === hijoActivo) || null,
    [hijos, hijoActivo]
  );

  // Calcular estadísticas
  const estadisticas = useMemo(() => {
    if (!hijoActivo) return null;

    const promedioPronunciacion = pronunciacion.length > 0
      ? (pronunciacion.reduce((acc, p) => acc + (p.puntuacion_global || 0), 0) / pronunciacion.length).toFixed(1)
      : 0;

    const promedioPracticas = practicas.length > 0
      ? (practicas.reduce((acc, p) => acc + (p.puntuacion || 0), 0) / practicas.length).toFixed(1)
      : 0;

    const totalErrores = practicas.reduce((acc, p) => acc + (p.errores_corregidos || 0), 0);

    return {
      promedioPronunciacion,
      promedioPracticas,
      totalErrores,
      totalLecturas: pronunciacion.length,
      totalPracticas: practicas.length,
    };
  }, [hijoActivo, pronunciacion, practicas]);

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
          <h3 className="text-xl font-bold text-slate-900 mb-2">Cargando información</h3>
          <p className="text-slate-600">Preparando datos de tus hijos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header con Gradiente */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
          <div className="flex items-center justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-black text-white drop-shadow-lg">
                  Progreso de mis hijos
                </h1>
              </div>
              <p className="text-white/90 text-lg font-medium">
                Monitorea el desarrollo académico y avances de tus hijos
              </p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30 shadow-xl">
              <p className="text-white/80 text-sm font-semibold mb-1">Total hijos</p>
              <p className="text-5xl font-black text-white">{hijos.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Selector de hijos con cards atractivas */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/60 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-slate-50 to-purple-50 px-6 py-5 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2.5 rounded-xl shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900">Selecciona a tu hijo/a</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 font-medium">
                  {hijos.length} hijo{hijos.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {hijos.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="text-slate-700 font-bold text-xl mb-2">No hay hijos registrados</p>
                <p className="text-slate-500">Contacta con el administrador para más información</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hijos.map((h, index) => (
                  <button
                    key={h.id}
                    onClick={() => cargarHistorial(h.id)}
                    className={`group relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                      hijoActivo === h.id
                        ? "shadow-2xl shadow-purple-500/40"
                        : "shadow-lg hover:shadow-xl"
                    }`}
                  >
                    <div className={`absolute inset-0 ${
                      hijoActivo === h.id
                        ? "bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600"
                        : "bg-gradient-to-br from-slate-50 to-slate-100"
                    }`}></div>
                    
                    {hijoActivo === h.id && (
                      <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                    )}
                    
                    <div className="relative p-5">
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg transform transition-transform group-hover:scale-110 ${
                          hijoActivo === h.id 
                            ? "bg-white/20 text-white backdrop-blur-sm" 
                            : `${getAvatarColor(index)} text-white`
                        }`}>
                          {h.nombre?.charAt(0)}{h.apellido?.charAt(0)}
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`font-bold text-base mb-1 ${
                            hijoActivo === h.id ? "text-white" : "text-slate-900"
                          }`}>
                            {h.nombre} {h.apellido}
                          </p>
                          {h.grado && (
                            <p className={`text-sm font-medium flex items-center gap-1.5 ${
                              hijoActivo === h.id ? "text-white/80" : "text-slate-600"
                            }`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              {h.grado}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {hijoActivo === h.id && (
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
        {hijoActivo && (
          <div className="space-y-6">
            {/* Tarjeta de hijo con estadísticas */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 via-purple-900 to-pink-900 px-6 py-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-2xl ${
                      getAvatarColor(hijos.findIndex(h => h.id === hijoActivo))
                    } text-white`}>
                      {hijoActualObj?.nombre?.charAt(0)}{hijoActualObj?.apellido?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white mb-1">
                        {hijoActualObj ? `${hijoActualObj.nombre} ${hijoActualObj.apellido}` : ""}
                      </h3>
                      {hijoActualObj?.grado && (
                        <div className="flex items-center gap-2 text-purple-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="font-semibold">{hijoActualObj.grado}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {loadingHistorial && (
                    <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/30">
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-white font-bold">Cargando...</span>
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

                  <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl p-5 border-2 border-rose-200 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-rose-500 p-2 rounded-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <p className="text-rose-700 text-xs font-bold uppercase tracking-wide">Errores</p>
                    </div>
                    <p className="text-4xl font-black text-rose-900 mb-1">{estadisticas.totalErrores}</p>
                    <p className="text-rose-600 text-sm font-semibold">Corregidos</p>
                  </div>
                </div>
              )}
            </div>

            {/* Lecturas Evaluadas */}
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

              <div className="p-6">
                {pronunciacion.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <p className="text-slate-700 font-bold text-lg mb-2">Sin lecturas evaluadas</p>
                    <p className="text-slate-500">Aún no hay registros de lecturas evaluadas</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {pronunciacion.map((p) => (
                      <div key={p.id} className="group border-2 border-blue-100 rounded-2xl p-5 bg-gradient-to-br from-blue-50/50 to-white hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-4 shadow-lg shadow-blue-500/30 inline-block">
                              <p className="text-3xl font-black">{p.puntuacion_global ?? "-"}</p>
                              <p className="text-xs text-blue-100 font-medium mt-1">Puntuación</p>
                            </div>
                          </div>
                          <div className="bg-white border border-blue-100 px-3 py-1.5 rounded-full shadow-sm">
                            <p className="text-xs font-semibold text-blue-600">
                              {p.fecha ? new Date(p.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : "-"}
                            </p>
                          </div>
                        </div>

                        {p.lectura_titulo && (
                          <div className="bg-white border border-blue-100 rounded-xl p-3 mb-4 shadow-sm">
                            <p className="text-sm font-bold text-blue-900 flex items-center gap-2">
                              <span className="text-lg">📚</span>
                              {p.lectura_titulo}
                            </p>
                          </div>
                        )}

                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between bg-white border border-blue-50 rounded-lg px-3 py-2">
                            <span className="text-sm text-slate-600 font-medium">Fluidez</span>
                            <span className="text-sm font-black text-blue-700">{p.fluidez ?? "-"}</span>
                          </div>
                          <div className="flex items-center justify-between bg-white border border-blue-50 rounded-lg px-3 py-2">
                            <span className="text-sm text-slate-600 font-medium">Velocidad</span>
                            <span className="text-sm font-black text-blue-700">{p.velocidad ?? "-"}</span>
                          </div>
                          <div className="flex items-center justify-between bg-white border border-blue-50 rounded-lg px-3 py-2">
                            <span className="text-sm text-slate-600 font-medium">Precisión</span>
                            <span className="text-sm font-black text-blue-700">{p.precision ?? "-"}</span>
                          </div>
                        </div>

                        {p.retroalimentacion && (
                          <div className="mt-4 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-4 shadow-sm">
                            <div className="flex items-start gap-2">
                              <span className="text-lg flex-shrink-0">🤖</span>
                              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {p.retroalimentacion}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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

              <div className="p-6">
                {practicas.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-700 font-bold text-lg mb-2">Sin prácticas registradas</p>
                    <p className="text-slate-500">Aún no hay ejercicios de práctica completados</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {practicas.map((p) => (
                      <div key={p.id} className="group border-2 border-emerald-100 rounded-2xl p-5 bg-gradient-to-br from-emerald-50/50 to-white hover:border-emerald-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-4 shadow-lg shadow-emerald-500/30 inline-block">
                              <p className="text-3xl font-black">{p.puntuacion ?? "-"}</p>
                              <p className="text-xs text-emerald-100 font-medium mt-1">Puntuación</p>
                            </div>
                          </div>
                          <div className="bg-white border border-emerald-100 px-3 py-1.5 rounded-full shadow-sm">
                            <p className="text-xs font-semibold text-emerald-600">
                              {p.fecha ? new Date(p.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : "-"}
                            </p>
                          </div>
                        </div>

                        {p.lectura_titulo && (
                          <div className="bg-white border border-emerald-100 rounded-xl p-3 mb-4 shadow-sm">
                            <p className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                              <span className="text-lg">📚</span>
                              {p.lectura_titulo}
                            </p>
                          </div>
                        )}

                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between bg-white border border-emerald-50 rounded-lg px-3 py-2">
                            <span className="text-sm text-slate-600 font-medium">Errores corregidos</span>
                            <span className="text-sm font-black text-emerald-700">{p.errores_corregidos ?? 0}</span>
                          </div>
                        </div>

                        {Array.isArray(p.palabras_objetivo) && p.palabras_objetivo.length > 0 && (
                          <div className="mt-4 bg-white border border-emerald-100 rounded-xl p-3 shadow-sm">
                            <p className="text-xs text-emerald-700 font-semibold mb-2 flex items-center gap-1.5">
                              <span>🎯</span>
                              Palabras objetivo
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {p.palabras_objetivo.map((palabra, idx) => (
                                <span key={idx} className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                                  {palabra}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {p.texto_practica && (
                          <div className="mt-4 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-xl p-4 shadow-sm">
                            <div className="flex items-start gap-2">
                              <span className="text-lg flex-shrink-0">📝</span>
                              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap line-clamp-3 group-hover:line-clamp-none transition-all">
                                {p.texto_practica}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}