import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLecturasHijo } from "../../services/padresService";
import { MdArrowBack, MdMenuBook, MdSearch } from "react-icons/md";

export default function VerLecturasHijo() {
  const { hijoId } = useParams();
  const navigate = useNavigate();

  const [lecturas, setLecturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!hijoId) return;

    const cargarLecturas = async () => {
      try {
        const data = await getLecturasHijo(hijoId);
        setLecturas(data);
      } catch (error) {
        console.error("❌ Error cargando lecturas:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarLecturas();
  }, [hijoId]);

  // Filtrar lecturas por término de búsqueda
  const lecturasFiltradas = lecturas.filter(lectura =>
    lectura.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500">Cargando lecturas...</p>
        </div>
      </div>
    );
  }

  // Agrupar lecturas por nivel
  const lecturasPorNivel = lecturasFiltradas.reduce((acc, lectura) => {
    const nivel = lectura.nivel_dificultad;
    if (!acc[nivel]) acc[nivel] = [];
    acc[nivel].push(lectura);
    return acc;
  }, {});

  // Determinar niveles desbloqueados
  const niveles = Object.keys(lecturasPorNivel)
    .map(Number)
    .sort((a, b) => a - b);

  const nivelesDesbloqueados = {};
  let nivelAnteriorCompleto = true;

  niveles.forEach((nivel) => {
    const todasCompletas = lecturasPorNivel[nivel].every(
      (l) => l.completada
    );
    nivelesDesbloqueados[nivel] = nivelAnteriorCompleto;
    nivelAnteriorCompleto = todasCompletas;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      {/* VERSIÓN MÓVIL */}
      <div className="md:hidden min-h-screen bg-white">
        {/* Header móvil fijo */}
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-5 shadow-lg z-30">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-3 transition-colors"
          >
            <MdArrowBack size={16} />
            <span className="font-medium text-xs">Volver</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MdMenuBook size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white mb-0.5">Lecturas</h1>
              <p className="text-xs text-blue-100">
                {lecturas.length} lectura{lecturas.length !== 1 ? "s" : ""} disponible{lecturas.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Contenido móvil */}
        <main className="pt-32 px-4 pb-8">
          {/* Buscador móvil */}
          <div className="mb-5">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <MdSearch size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar lectura..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none text-sm transition-all"
              />
            </div>
          </div>

          {/* Sin lecturas */}
          {lecturas.length === 0 ? (
            <div className="bg-white border-2 border-slate-200 rounded-xl p-8 text-center">
              <div className="text-5xl mb-3">📚</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                No hay lecturas disponibles
              </h3>
              <p className="text-sm text-slate-600">
                El docente aún no ha asignado lecturas.
              </p>
            </div>
          ) : lecturasFiltradas.length === 0 ? (
            <div className="bg-white border-2 border-slate-200 rounded-xl p-8 text-center">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                No se encontraron lecturas
              </h3>
              <p className="text-sm text-slate-600">
                Intenta con otro término de búsqueda.
              </p>
            </div>
          ) : (
            /* Lista por niveles móvil */
            <div className="space-y-5">
              {niveles.map((nivel) => {
                const bloqueado = !nivelesDesbloqueados[nivel];

                return (
                  <div key={nivel} className="space-y-3">
                    {/* Nivel */}
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1.5 rounded-lg font-bold text-sm ${
                        bloqueado 
                          ? "bg-slate-200 text-slate-500" 
                          : "bg-blue-600 text-white"
                      }`}>
                        Nivel {nivel}
                      </div>
                      {bloqueado && <span className="text-xl">🔒</span>}
                    </div>

                    {/* Tarjetas móvil */}
                    <div className="space-y-3">
                      {lecturasPorNivel[nivel].map((l) => (
                        <div
                          key={l.id}
                          className={`rounded-xl border-2 p-4 transition-all ${
                            bloqueado
                              ? "bg-slate-50 border-slate-200 opacity-60"
                              : "bg-white border-slate-200 hover:border-blue-400 hover:shadow-md"
                          }`}
                        >
                          <div className="mb-3">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-bold text-sm text-slate-900 flex-1">
                                {l.titulo}
                              </h3>
                              {l.completada && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full whitespace-nowrap">
                                  ✅
                                </span>
                              )}
                            </div>
                            
                            <p className="text-xs text-slate-600 mb-2 line-clamp-2">
                              {l.contenido?.substring(0, 80)}
                              {l.contenido?.length > 80 ? "..." : ""}
                            </p>

                            <div className="flex flex-wrap gap-1.5 text-xs">
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                                📘 {l.curso || "General"}
                              </span>
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-medium">
                                🎯 {l.edad_recomendada} años
                              </span>
                              {l.actividades && l.actividades.length > 0 && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                                  🧩 {l.actividades.length}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              navigate(`/padre/menu/hijos/${hijoId}/practica-ia`, {
                                state: {
                                  estudianteId: hijoId,
                                  lecturaId: l.id,
                                  lectura: {
                                    id: l.id,
                                    titulo: l.titulo,
                                    contenido: l.contenido,
                                    nivel_dificultad: l.nivel_dificultad,
                                    edad_recomendada: l.edad_recomendada,
                                    curso: l.curso,
                                    actividades: l.actividades
                                  }
                                },
                              })
                            }
                            disabled={bloqueado}
                            className={`w-full py-2.5 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                              bloqueado
                                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                            }`}
                          >
                            🧠 Iniciar práctica
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* VERSIÓN DESKTOP */}
      <div className="hidden md:block min-h-screen bg-white pt-6">
        <main className="max-w-6xl mx-auto px-6 py-6">
          {/* Header Desktop */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-6">
              {/* Lado izquierdo: Botón volver + Título */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition text-sm"
                >
                  <MdArrowBack size={18} />
                  Volver
                </button>

                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <MdMenuBook size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Lecturas del hijo
                  </h1>
                  <p className="text-sm text-slate-600">
                    Selecciona una lectura para iniciar la práctica
                  </p>
                </div>
              </div>

              {/* Buscador desktop */}
              <div className="w-80">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <MdSearch size={20} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar lectura..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none text-sm transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sin lecturas */}
          {lecturas.length === 0 ? (
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-16 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No hay lecturas disponibles
              </h3>
              <p className="text-slate-600">
                El docente aún no ha asignado lecturas para este estudiante.
              </p>
            </div>
          ) : lecturasFiltradas.length === 0 ? (
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-16 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No se encontraron lecturas
              </h3>
              <p className="text-slate-600">
                Intenta con otro término de búsqueda.
              </p>
            </div>
          ) : (
            /* Lista por niveles desktop */
            <div className="space-y-6">
              {niveles.map((nivel) => {
                const bloqueado = !nivelesDesbloqueados[nivel];

                return (
                  <div key={nivel} className="space-y-4">
                    {/* Nivel */}
                    <div className="flex items-center gap-3">
                      <div className={`px-4 py-2 rounded-xl font-bold text-base ${
                        bloqueado 
                          ? "bg-slate-200 text-slate-500" 
                          : "bg-blue-600 text-white"
                      }`}>
                        Nivel {nivel}
                      </div>
                      {bloqueado && <span className="text-2xl">🔒</span>}
                    </div>

                    {/* Tarjetas desktop */}
                    <div className="space-y-3">
                      {lecturasPorNivel[nivel].map((l) => (
                        <div
                          key={l.id}
                          className={`rounded-2xl border-2 p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 transition-all ${
                            bloqueado
                              ? "bg-slate-50 border-slate-200 opacity-60"
                              : "bg-white border-slate-200 hover:border-blue-400 hover:shadow-lg"
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold text-base text-slate-900">
                                {l.titulo}
                              </h3>
                              {l.completada && (
                                <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                  ✅ Completada
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm text-slate-600 mb-3">
                              {l.contenido?.substring(0, 120)}
                              {l.contenido?.length > 120 ? "..." : ""}
                            </p>

                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                                📘 {l.curso || "Curso general"}
                              </span>
                              <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                                🎯 Edad: {l.edad_recomendada} años
                              </span>
                              {l.actividades && l.actividades.length > 0 && (
                                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                  🧩 {l.actividades.length} actividad{l.actividades.length > 1 ? "es" : ""}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              navigate(`/padre/menu/hijos/${hijoId}/practica-ia`, {
                                state: {
                                  estudianteId: hijoId,
                                  lecturaId: l.id,
                                  lectura: {
                                    id: l.id,
                                    titulo: l.titulo,
                                    contenido: l.contenido,
                                    nivel_dificultad: l.nivel_dificultad,
                                    edad_recomendada: l.edad_recomendada,
                                    curso: l.curso,
                                    actividades: l.actividades
                                  }
                                },
                              })
                            }
                            disabled={bloqueado}
                            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                              bloqueado
                                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20"
                            }`}
                          >
                            🧠 Iniciar práctica
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
