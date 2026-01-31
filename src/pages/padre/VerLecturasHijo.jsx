import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLecturasHijo } from "../../services/padresService";
import { MdArrowBack, MdMenuBook, MdSearch, MdLock } from "react-icons/md";

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
  const lecturasFiltradas = lecturas.filter((lectura) =>
    lectura.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ─────────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Cargando lecturas...</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // AGRUPAMIENTO POR NIVEL (lógica original intacta)
  // ─────────────────────────────────────────────
  const lecturasPorNivel = lecturasFiltradas.reduce((acc, lectura) => {
    const nivel = lectura.nivel_dificultad;
    if (!acc[nivel]) acc[nivel] = [];
    acc[nivel].push(lectura);
    return acc;
  }, {});

  // Niveles ordenados
  const niveles = Object.keys(lecturasPorNivel)
    .map(Number)
    .sort((a, b) => a - b);

  // Desbloqueo de niveles: un nivel se desbloquea solo cuando todas las lecturas del anterior están completas
  const nivelesDesbloqueados = {};
  let nivelAnteriorCompleto = true;

  niveles.forEach((nivel) => {
    const todasCompletas = lecturasPorNivel[nivel].every((l) => l.completada);
    nivelesDesbloqueados[nivel] = nivelAnteriorCompleto;
    nivelAnteriorCompleto = todasCompletas;
  });

  // ─────────────────────────────────────────────
  // DESBLOQUEO SECUENCIAL DENTRO DE CADA NIVEL
  // Dentro de un nivel desbloqueado, cada lectura se activa
  // solo cuando la anterior ya fue completada.
  // Si el nivel está bloqueado, todas sus lecturas están bloqueadas.
  // ─────────────────────────────────────────────
  const getLecturasConEstado = (nivel) => {
    const lecturas = lecturasPorNivel[nivel] || [];
    const nivelBloqueado = !nivelesDesbloqueados[nivel];

    // Si el nivel está bloqueado, todas bloqueadas
    if (nivelBloqueado) {
      return lecturas.map((l) => ({
        ...l,
        _bloqueada: true,
        _estado: "bloqueada", // nivel bloqueado
      }));
    }

    // Nivel desbloqueado → secuencial dentro
    let anteriorCompletada = true;

    return lecturas.map((l) => {
      const estaDesbloqueada = anteriorCompletada;

      // Si esta lectura no está completada, la siguiente queda pendiente
      if (!l.completada) {
        anteriorCompletada = false;
      }

      let estado;
      if (l.completada) {
        estado = "completada";
      } else if (estaDesbloqueada) {
        estado = "activa"; // es la lectura actual que puede leer
      } else {
        estado = "pendiente"; // pendiente porque la anterior no se completó
      }

      return {
        ...l,
        _bloqueada: !estaDesbloqueada,
        _estado: estado,
      };
    });
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
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

      {/* ====================================================
          📱 VERSIÓN MÓVIL
          ==================================================== */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 animate-fadeIn">

        {/* Header móvil */}
        <div className="bg-white rounded-b-3xl shadow-lg p-4 mb-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 mb-3 transition-colors"
          >
            <MdArrowBack size={16} />
            <span className="font-medium text-sm">Volver</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <MdMenuBook size={24} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-slate-900">Lecturas</h1>
              <p className="text-slate-500 text-xs">
                {lecturas.length} lectura{lecturas.length !== 1 ? "s" : ""} disponible{lecturas.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Contenido móvil */}
        <main className="px-4 pb-8">

          {/* Buscador móvil */}
          <div className="mb-5">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <MdSearch size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar lectura..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm transition-all bg-white"
              />
            </div>
          </div>

          {/* Sin lecturas */}
          {lecturas.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No hay lecturas disponibles</h3>
              <p className="text-sm text-slate-500">El docente aún no ha asignado lecturas.</p>
            </div>

          ) : lecturasFiltradas.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No se encontraron lecturas</h3>
              <p className="text-sm text-slate-500">Intenta con otro término de búsqueda.</p>
            </div>

          ) : (
            /* Lista por niveles móvil */
            <div className="space-y-6">
              {niveles.map((nivel) => {
                const nivelBloqueado = !nivelesDesbloqueados[nivel];
                const lecturasConEstado = getLecturasConEstado(nivel);

                return (
                  <div key={nivel}>
                    {/* Badge del nivel */}
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`px-4 py-1.5 rounded-full font-bold text-sm shadow-sm ${
                          nivelBloqueado
                            ? "bg-slate-200 text-slate-500"
                            : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-emerald-500/20"
                        }`}
                      >
                        Nivel {nivel}
                      </div>
                      {nivelBloqueado && <MdLock size={18} className="text-slate-400" />}
                    </div>

                    {/* Tarjetas móvil */}
                    <div className="space-y-3">
                      {lecturasConEstado.map((l) => (
                        <div
                          key={l.id}
                          className={`bg-white rounded-2xl border shadow-sm transition-all ${
                            l._estado === "completada"
                              ? "border-emerald-200"
                              : l._estado === "activa"
                              ? "border-emerald-400 ring-2 ring-emerald-200"
                              : "border-slate-200 opacity-55"
                          }`}
                        >
                          <div className="p-4">
                            {/* Fila: título + badge estado */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className={`font-bold text-sm flex-1 ${l._bloqueada ? "text-slate-400" : "text-slate-900"}`}>
                                {l.titulo}
                              </h3>

                              {/* Badge de estado */}
                              {l._estado === "completada" && (
                                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full whitespace-nowrap border border-emerald-200">
                                  ✅ Completada
                                </span>
                              )}
                              {l._estado === "activa" && (
                                <span className="px-2.5 py-0.5 bg-emerald-600 text-white text-xs font-bold rounded-full whitespace-nowrap">
                                  📖 En progreso
                                </span>
                              )}
                              {(l._estado === "pendiente" || l._estado === "bloqueada") && (
                                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-full whitespace-nowrap border border-slate-200">
                                  ⏳ Pendiente
                                </span>
                              )}
                            </div>

                            {/* Extracto */}
                            <p className={`text-xs mb-2.5 line-clamp-2 ${l._bloqueada ? "text-slate-400" : "text-slate-500"}`}>
                              {l.contenido?.substring(0, 80)}
                              {l.contenido?.length > 80 ? "..." : ""}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${l._bloqueada ? "bg-slate-100 text-slate-400" : "bg-purple-100 text-purple-700"}`}>
                                📘 {l.curso || "General"}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${l._bloqueada ? "bg-slate-100 text-slate-400" : "bg-orange-100 text-orange-700"}`}>
                                🎯 {l.edad_recomendada} años
                              </span>
                              {l.actividades && l.actividades.length > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${l._bloqueada ? "bg-slate-100 text-slate-400" : "bg-teal-100 text-teal-700"}`}>
                                  🧩 {l.actividades.length}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Botón acción */}
                          <div className="px-4 pb-4">
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
                                      actividades: l.actividades,
                                    },
                                  },
                                })
                              }
                              disabled={l._bloqueada}
                              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                                l._bloqueada
                                  ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                                  : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 text-white shadow-md shadow-emerald-500/20 active:scale-95"
                              }`}
                            >
                              {l._bloqueada ? (
                                <>
                                  <MdLock size={14} /> Bloqueada
                                </>
                              ) : (
                                <>🧠 Iniciar práctica</>
                              )}
                            </button>
                          </div>
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

      {/* ====================================================
          🖥️ VERSIÓN DESKTOP
          ==================================================== */}
      <div className="hidden md:block min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 animate-fadeIn">
        <main className="max-w-6xl mx-auto px-6 py-6">

          {/* Header desktop */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:border-emerald-300 hover:text-emerald-700 transition-all text-sm mb-5 shadow-sm"
            >
              <MdArrowBack size={18} />
              Volver
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center justify-between gap-6">
              {/* Izquierda: icono + título */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                  <MdMenuBook size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Lecturas del hijo</h1>
                  <p className="text-sm text-slate-500">Selecciona una lectura para iniciar la práctica</p>
                </div>
              </div>

              {/* Buscador desktop */}
              <div className="w-80 flex-shrink-0">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <MdSearch size={20} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar lectura..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm transition-all bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sin lecturas */}
          {lecturas.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <span className="text-4xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No hay lecturas disponibles</h3>
              <p className="text-slate-500">El docente aún no ha asignado lecturas para este estudiante.</p>
            </div>

          ) : lecturasFiltradas.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No se encontraron lecturas</h3>
              <p className="text-slate-500">Intenta con otro término de búsqueda.</p>
            </div>

          ) : (
            /* Lista por niveles desktop */
            <div className="space-y-8">
              {niveles.map((nivel) => {
                const nivelBloqueado = !nivelesDesbloqueados[nivel];
                const lecturasConEstado = getLecturasConEstado(nivel);

                return (
                  <div key={nivel}>
                    {/* Badge del nivel */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`px-5 py-2 rounded-full font-bold text-base shadow-sm ${
                          nivelBloqueado
                            ? "bg-slate-200 text-slate-500"
                            : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-emerald-500/20"
                        }`}
                      >
                        Nivel {nivel}
                      </div>
                      {nivelBloqueado && <MdLock size={20} className="text-slate-400" />}
                      <span className="text-sm text-slate-400 ml-1">
                        {lecturasConEstado.filter((l) => l.completada).length} / {lecturasConEstado.length} completadas
                      </span>
                    </div>

                    {/* Tarjetas desktop */}
                    <div className="space-y-3">
                      {lecturasConEstado.map((l) => (
                        <div
                          key={l.id}
                          className={`bg-white rounded-2xl border shadow-sm transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-5 ${
                            l._estado === "completada"
                              ? "border-emerald-200"
                              : l._estado === "activa"
                              ? "border-emerald-400 ring-2 ring-emerald-200"
                              : "border-slate-200 opacity-55"
                          }`}
                        >
                          {/* Info lectura */}
                          <div className="flex-1 min-w-0">
                            {/* Título + badge */}
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className={`font-bold text-base ${l._bloqueada ? "text-slate-400" : "text-slate-900"}`}>
                                {l.titulo}
                              </h3>

                              {l._estado === "completada" && (
                                <span className="px-3 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                                  ✅ Completada
                                </span>
                              )}
                              {l._estado === "activa" && (
                                <span className="px-3 py-0.5 bg-emerald-600 text-white text-xs font-bold rounded-full">
                                  📖 En progreso
                                </span>
                              )}
                              {(l._estado === "pendiente" || l._estado === "bloqueada") && (
                                <span className="px-3 py-0.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-full border border-slate-200">
                                  ⏳ Pendiente
                                </span>
                              )}
                            </div>

                            {/* Extracto */}
                            <p className={`text-sm mb-3 ${l._bloqueada ? "text-slate-400" : "text-slate-500"}`}>
                              {l.contenido?.substring(0, 120)}
                              {l.contenido?.length > 120 ? "..." : ""}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${l._bloqueada ? "bg-slate-100 text-slate-400" : "bg-purple-100 text-purple-700"}`}>
                                📘 {l.curso || "Curso general"}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${l._bloqueada ? "bg-slate-100 text-slate-400" : "bg-orange-100 text-orange-700"}`}>
                                🎯 Edad: {l.edad_recomendada} años
                              </span>
                              {l.actividades && l.actividades.length > 0 && (
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${l._bloqueada ? "bg-slate-100 text-slate-400" : "bg-teal-100 text-teal-700"}`}>
                                  🧩 {l.actividades.length} actividad{l.actividades.length > 1 ? "es" : ""}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Botón acción */}
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
                                    actividades: l.actividades,
                                  },
                                },
                              })
                            }
                            disabled={l._bloqueada}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 flex-shrink-0 ${
                              l._bloqueada
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                                : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 text-white shadow-md shadow-emerald-500/20 hover:scale-[1.02]"
                            }`}
                          >
                            {l._bloqueada ? (
                              <>
                                <MdLock size={16} /> Bloqueada
                              </>
                            ) : (
                              <>🧠 Iniciar práctica</>
                            )}
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
