// src/pages/padre/ActividadesHijos.jsx

import { useEffect, useState } from "react";
import { getMisHijos, getLecturasHijo, obtenerActividadesLectura } from "../../services/padresService";
import { useNavigate } from "react-router-dom";
import {
  MdQuiz,
  MdCheckCircle,
  MdLock,
  MdPlayArrow,
  MdArrowForward,
  MdBook,
  MdSearch,
  MdArrowBack,
} from "react-icons/md";

export default function ActividadesHijos() {
  const [hijosConActividades, setHijosConActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const hijosFiltrados = hijosConActividades.filter((hijo) =>
    `${hijo.nombre} ${hijo.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ==========================
  // CARGA DE DATOS
  // ==========================
  useEffect(() => {
    const cargarHijosYActividades = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getMisHijos();

        let lista = [];
        if (Array.isArray(data)) lista = data;
        else if (data && Array.isArray(data.hijos)) lista = data.hijos;
        else if (data && typeof data === "object") lista = [data];

        const estudiantes = lista
          .map((item) => {
            const est = item.estudiante || item;
            return {
              id: est.id,
              nombre: est.nombre || "",
              apellido: est.apellido || "",
              nivel_educativo: est.nivel_educativo || 1,
            };
          })
          .filter((est) => est.id);

        const hijosTemp = [];

        for (const hijo of estudiantes) {
          try {
            const lecturas = await getLecturasHijo(hijo.id);
            const lecturasArray = Array.isArray(lecturas) ? lecturas : lecturas?.lecturas || [];

            const todas = await Promise.all(
              lecturasArray.map(async (lectura) => {
                try {
                  const actividades = await obtenerActividadesLectura(lectura.id);
                  return {
                    ...lectura,
                    actividades: actividades || [],
                    tieneActividades: !!(actividades && actividades.length > 0),
                  };
                } catch {
                  return { ...lectura, actividades: [], tieneActividades: false };
                }
              })
            );

            // ════════════════════════════════════════════════════════════
            // 🐛 FIX DEL CONTEO
            //
            // ANTES (roto):
            //   lecturasCompletadas = completada && tieneActividades  ← SOLO estas
            //   lecturasPendientes  = !completada
            //   → completada && !tieneActividades DESAPARECÍA del conteo
            //
            //   Ejemplo: 5 lecturas totales
            //     2 completadas CON actividades  → contadas ✅
            //     1 completada  SIN actividades  → ❌ PERDIDA
            //     2 pendientes                   → contadas ✅
            //   Stats mostraba: Completadas=2, Pendientes=2 → parecía que eran 4
            //
            // AHORA (correcto):
            //   completadas        = TODAS las completadas          → para el número del stat
            //   completadasConActs = las que tienen actividades     → muestran botones "Resolver"
            //   completadasSinActs = las que no tienen actividades  → se muestran sin botón
            //   pendientes         = todas las no completadas       → botón "Practicar"
            //
            //   Stats correcto: Completadas=3, Pendientes=2, Total=5 ✅
            // ════════════════════════════════════════════════════════════

            const completadas = todas.filter((l) => l.completada);
            const completadasConActs = completadas.filter((l) => l.tieneActividades);
            const completadasSinActs = completadas.filter((l) => !l.tieneActividades);
            const pendientes = todas.filter((l) => !l.completada);

            let totalActividades = 0;
            completadasConActs.forEach((l) => {
              totalActividades += l.actividades.length;
            });

            hijosTemp.push({
              ...hijo,
              totalLecturas: todas.length,
              completadas,              // todas completadas → stat
              completadasConActs,       // con actividades  → botones resolver
              completadasSinActs,       // sin actividades  → badge info
              pendientes,               // no completadas   → botón practicar
              totalActividades,
            });
          } catch {
            hijosTemp.push({
              ...hijo,
              totalLecturas: 0,
              completadas: [],
              completadasConActs: [],
              completadasSinActs: [],
              pendientes: [],
              totalActividades: 0,
            });
          }
        }

        setHijosConActividades(hijosTemp);
      } catch (err) {
        setError(err.message || "Error al cargar los hijos");
      } finally {
        setLoading(false);
      }
    };

    cargarHijosYActividades();
  }, []);

  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Cargando actividades...</p>
        </div>
      </div>
    );
  }

  // ==========================
  // ERROR
  // ==========================
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 text-center shadow-lg border border-slate-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
            <span className="text-3xl">❌</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Error al cargar</h3>
          <p className="text-sm text-slate-500 mb-5">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────
  // COMPONENTES INTERNOS
  // ──────────────────────────────────────────

  // Sección con barra de color arriba
  const Seccion = ({ barClass, children }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className={`h-1 ${barClass}`}></div>
      <div className="p-4 md:p-5">{children}</div>
    </div>
  );

  // Card: completada CON actividades (emerald)
  const CardConActs = ({ lectura, hijo }) => (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 transition-all hover:shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-slate-900 truncate">{lectura.titulo}</h4>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {lectura.contenido?.substring(0, 60)}{lectura.contenido?.length > 60 ? "…" : ""}
          </p>
        </div>
        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <MdCheckCircle className="text-emerald-600" size={14} />
        </div>
      </div>

      <div className="space-y-1.5 mb-3">
        <p className="text-emerald-600 font-bold uppercase tracking-wide mb-1" style={{ fontSize: "9px" }}>
          Actividades ({lectura.actividades.length})
        </p>
        {lectura.actividades.slice(0, 2).map((act, idx) => (
          <div key={act.id || idx} className="flex items-center gap-2 bg-white border border-emerald-200 rounded-lg px-2.5 py-1.5">
            <MdQuiz className="text-emerald-500 flex-shrink-0" size={13} />
            <p className="text-xs font-medium text-slate-700 truncate flex-1">
              {act.titulo || `Actividad ${idx + 1}`}
            </p>
          </div>
        ))}
        {lectura.actividades.length > 2 && (
          <p className="text-xs text-emerald-500 text-center font-medium">
            + {lectura.actividades.length - 2} más
          </p>
        )}
      </div>

      {lectura.actividades.length === 1 ? (
        <button
          onClick={() =>
            navigate(
              `/padre/menu/hijos/${hijo.id}/lecturas/${lectura.id}/actividades/${lectura.actividades[0].id}`,
              { state: { lectura, estudiante: hijo } }
            )
          }
          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 text-white rounded-xl font-bold shadow-md shadow-emerald-500/20 px-4 py-2.5 text-xs transition-all active:scale-95"
        >
          <MdArrowForward size={15} /> Resolver Actividad
        </button>
      ) : (
        <div className="space-y-1.5">
          {lectura.actividades.map((act) => (
            <button
              key={act.id}
              onClick={() =>
                navigate(
                  `/padre/menu/hijos/${hijo.id}/lecturas/${lectura.id}/actividades/${act.id}`,
                  { state: { lectura, estudiante: hijo } }
                )
              }
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 text-white rounded-xl font-bold shadow-md shadow-emerald-500/20 px-4 py-2 text-xs transition-all active:scale-95"
            >
              <MdQuiz size={13} /> {act.titulo || "Actividad"}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Card: completada SIN actividades (emerald tenue)
  const CardSinActs = ({ lectura }) => (
    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
        <MdCheckCircle className="text-emerald-500" size={12} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-800 truncate">{lectura.titulo}</p>
        <p style={{ fontSize: "10px" }} className="text-emerald-600">
          El docente aún no generó actividades
        </p>
      </div>
    </div>
  );

  // Card: pendiente (rose → tomatito)
  const CardPendiente = ({ lectura, hijo }) => (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 transition-all hover:shadow-sm">
      <h4 className="text-sm font-bold text-slate-900 mb-1">{lectura.titulo}</h4>
      <p className="text-xs text-slate-500 mb-3 line-clamp-1">
        {lectura.contenido?.substring(0, 60)}{lectura.contenido?.length > 60 ? "…" : ""}
      </p>
      <button
        onClick={() =>
          navigate(`/padre/menu/hijos/${hijo.id}/practica-ia`, {
            state: { estudianteId: hijo.id, lecturaId: lectura.id, lectura },
          })
        }
        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl font-bold shadow-md shadow-rose-500/20 px-4 py-2.5 text-xs transition-all active:scale-95"
      >
        <MdPlayArrow size={15} /> Practicar
      </button>
    </div>
  );

  // ==========================
  // RENDER
  // ==========================
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Fredoka:wght@500;600;700&display=swap');
        * { font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Fredoka', 'Poppins', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-fade { animation: fadeUp 0.4s ease-out; }
      `}</style>

      {/* ============================================================
          📱 MÓVIL
          ============================================================ */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 anim-fade">

        {/* Header móvil */}
        <div className="bg-white rounded-b-3xl shadow-md px-4 pt-4 pb-5 mb-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-3 transition-colors"
          >
            <MdArrowBack size={16} />
            <span className="font-medium text-sm">Volver</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <MdQuiz size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Actividades</h1>
              <p className="text-slate-500 text-xs">
                {hijosConActividades.length} hijo{hijosConActividades.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        <main className="px-4 pb-8">
          {/* Buscador móvil */}
          <div className="mb-5 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <MdSearch size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar hijo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm transition-all bg-white"
            />
          </div>

          {/* Sin hijos vinculados */}
          {hijosConActividades.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <span className="text-3xl">📭</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No hay hijos vinculados</h3>
              <p className="text-sm text-slate-500 mb-4">Aún no tienes hijos vinculados.</p>
              <button
                onClick={() => navigate("/padre/menu/hijos")}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                Ir a Mis Hijos
              </button>
            </div>
          ) : hijosFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No se encontraron hijos</h3>
              <p className="text-sm text-slate-500">Intenta con otro término de búsqueda.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {hijosFiltrados.map((hijo) => (
                <div key={hijo.id} className="space-y-3">

                  {/* ── Tarjeta hijo + stats ── */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white flex items-center justify-center font-bold shadow-md text-lg">
                        {hijo.nombre?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900">
                          {hijo.nombre} {hijo.apellido}
                        </h2>
                        <p className="text-xs text-slate-500">
                          Nivel {hijo.nivel_educativo} · {hijo.totalLecturas} lectura{hijo.totalLecturas !== 1 ? "s" : ""} total
                        </p>
                      </div>
                    </div>

                    {/*
                      Stats: 3 colores distintos para diferenciar rápido
                        ✅ Completadas → emerald (verde)
                        ⏳ Pendientes  → amber  (naranja cálido)
                        📝 Actividades → violet (morado suave)
                    */}
                    <div className="grid grid-cols-3 gap-2">
                      {/* Completadas — emerald */}
                      <div className="text-center bg-emerald-50 border border-emerald-200 rounded-xl px-1.5 py-2.5">
                        <p className="text-emerald-600 font-bold uppercase tracking-wide" style={{ fontSize: "9px" }}>
                          Completadas
                        </p>
                        <p className="font-bold text-emerald-700 text-xl mt-0.5">
                          {hijo.completadas.length}
                        </p>
                      </div>
                      {/* Pendientes — amber */}
                      <div className="text-center bg-amber-50 border border-amber-200 rounded-xl px-1.5 py-2.5">
                        <p className="text-amber-600 font-bold uppercase tracking-wide" style={{ fontSize: "9px" }}>
                          Pendientes
                        </p>
                        <p className="font-bold text-amber-700 text-xl mt-0.5">
                          {hijo.pendientes.length}
                        </p>
                      </div>
                      {/* Actividades — violet */}
                      <div className="text-center bg-violet-50 border border-violet-200 rounded-xl px-1.5 py-2.5">
                        <p className="text-violet-600 font-bold uppercase tracking-wide" style={{ fontSize: "9px" }}>
                          Actividades
                        </p>
                        <p className="font-bold text-violet-700 text-xl mt-0.5">
                          {hijo.totalActividades}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ── Completadas CON actividades — emerald fuerte ── */}
                  {hijo.completadasConActs.length > 0 && (
                    <Seccion barClass="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600">
                      <h3 className="text-sm font-bold text-emerald-700 mb-3 flex items-center gap-2">
                        <MdCheckCircle size={17} /> Completadas — Actividades disponibles
                      </h3>
                      <div className="space-y-3">
                        {hijo.completadasConActs.map((l) => (
                          <CardConActs key={l.id} lectura={l} hijo={hijo} />
                        ))}
                      </div>
                    </Seccion>
                  )}

                  {/* ── Completadas SIN actividades — emerald tenue ── */}
                  {hijo.completadasSinActs.length > 0 && (
                    <Seccion barClass="bg-gradient-to-r from-emerald-200 to-emerald-300">
                      <h3 className="text-sm font-bold text-emerald-600 mb-3 flex items-center gap-2">
                        <MdCheckCircle size={16} /> Completadas — Sin actividades aún
                      </h3>
                      <div className="space-y-2">
                        {hijo.completadasSinActs.map((l) => (
                          <CardSinActs key={l.id} lectura={l} />
                        ))}
                      </div>
                    </Seccion>
                  )}

                  {/* ── Pendientes — rose (tomatito) ── */}
                  {hijo.pendientes.length > 0 && (
                    <Seccion barClass="bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600">
                      <h3 className="text-sm font-bold text-rose-700 mb-3 flex items-center gap-2">
                        <MdBook size={17} /> Pendientes — Practica para desbloquear
                      </h3>
                      <div className="space-y-3">
                        {hijo.pendientes.map((l) => (
                          <CardPendiente key={l.id} lectura={l} hijo={hijo} />
                        ))}
                      </div>
                    </Seccion>
                  )}

                  {/* ── Sin lecturas ── */}
                  {hijo.totalLecturas === 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                        <MdLock className="text-slate-400" size={24} />
                      </div>
                      <h3 className="text-sm font-bold text-slate-700 mb-1">Sin lecturas asignadas</h3>
                      <p className="text-xs text-slate-500">El docente aún no ha asignado lecturas.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ============================================================
          🖥️  DESKTOP
          ============================================================ */}
      <div className="hidden md:block min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 anim-fade">
        <main className="max-w-7xl mx-auto px-6 py-6">

          {/* Header desktop */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold hover:border-emerald-300 hover:text-emerald-700 transition-all text-sm mb-5 shadow-sm"
            >
              <MdArrowBack size={18} /> Volver
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                  <MdQuiz size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Actividades de Comprensión</h1>
                  <p className="text-sm text-slate-500">
                    Practica las lecturas y resuelve actividades generadas por IA
                  </p>
                </div>
              </div>

              {/* Buscador desktop */}
              <div className="w-80 flex-shrink-0 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <MdSearch size={20} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar hijo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none text-sm transition-all bg-white"
                />
              </div>
            </div>
          </div>

          {/* Sin hijos vinculados */}
          {hijosConActividades.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <span className="text-4xl">📭</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No hay hijos vinculados</h3>
              <p className="text-slate-500 mb-6">Aún no tienes hijos vinculados a tu cuenta.</p>
              <button
                onClick={() => navigate("/padre/menu/hijos")}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all"
              >
                Ir a Mis Hijos
              </button>
            </div>
          ) : hijosFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No se encontraron hijos</h3>
              <p className="text-slate-500">Intenta con otro término de búsqueda.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {hijosFiltrados.map((hijo) => (
                <div key={hijo.id} className="space-y-4">

                  {/* ── Tarjeta hijo desktop + stats ── */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white flex items-center justify-center font-bold shadow-lg text-xl">
                          {hijo.nombre?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">
                            {hijo.nombre} {hijo.apellido}
                          </h2>
                          <p className="text-sm text-slate-500">
                            Nivel {hijo.nivel_educativo} · {hijo.totalLecturas} lectura{hijo.totalLecturas !== 1 ? "s" : ""} total
                          </p>
                        </div>
                      </div>

                      {/*
                        Stats desktop — mismos 3 colores distintos:
                          ✅ Completadas → emerald
                          ⏳ Pendientes  → amber
                          📝 Actividades → violet
                      */}
                      <div className="flex gap-3">
                        {/* Completadas — emerald */}
                        <div className="text-center bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-2.5">
                          <p className="text-emerald-600 font-bold uppercase tracking-wide" style={{ fontSize: "10px" }}>
                            Completadas
                          </p>
                          <p className="font-bold text-emerald-700 text-2xl mt-0.5">
                            {hijo.completadas.length}
                          </p>
                        </div>
                        {/* Pendientes — amber */}
                        <div className="text-center bg-amber-50 border border-amber-200 rounded-xl px-5 py-2.5">
                          <p className="text-amber-600 font-bold uppercase tracking-wide" style={{ fontSize: "10px" }}>
                            Pendientes
                          </p>
                          <p className="font-bold text-amber-700 text-2xl mt-0.5">
                            {hijo.pendientes.length}
                          </p>
                        </div>
                        {/* Actividades — violet */}
                        <div className="text-center bg-violet-50 border border-violet-200 rounded-xl px-5 py-2.5">
                          <p className="text-violet-600 font-bold uppercase tracking-wide" style={{ fontSize: "10px" }}>
                            Actividades
                          </p>
                          <p className="font-bold text-violet-700 text-2xl mt-0.5">
                            {hijo.totalActividades}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Completadas CON actividades — emerald fuerte ── */}
                  {hijo.completadasConActs.length > 0 && (
                    <Seccion barClass="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600">
                      <h3 className="text-base font-bold text-emerald-700 mb-4 flex items-center gap-2">
                        <MdCheckCircle size={20} /> Completadas — Actividades disponibles
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {hijo.completadasConActs.map((l) => (
                          <CardConActs key={l.id} lectura={l} hijo={hijo} />
                        ))}
                      </div>
                    </Seccion>
                  )}

                  {/* ── Completadas SIN actividades — emerald tenue ── */}
                  {hijo.completadasSinActs.length > 0 && (
                    <Seccion barClass="bg-gradient-to-r from-emerald-200 to-emerald-300">
                      <h3 className="text-base font-bold text-emerald-600 mb-3 flex items-center gap-2">
                        <MdCheckCircle size={19} /> Completadas — Sin actividades aún
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {hijo.completadasSinActs.map((l) => (
                          <CardSinActs key={l.id} lectura={l} />
                        ))}
                      </div>
                    </Seccion>
                  )}

                  {/* ── Pendientes — rose (tomatito) ── */}
                  {hijo.pendientes.length > 0 && (
                    <Seccion barClass="bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600">
                      <h3 className="text-base font-bold text-rose-700 mb-4 flex items-center gap-2">
                        <MdBook size={20} /> Pendientes — Practica para desbloquear actividades
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {hijo.pendientes.map((l) => (
                          <CardPendiente key={l.id} lectura={l} hijo={hijo} />
                        ))}
                      </div>
                    </Seccion>
                  )}

                  {/* ── Sin lecturas ── */}
                  {hijo.totalLecturas === 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                        <MdLock className="text-slate-400" size={28} />
                      </div>
                      <h3 className="text-base font-bold text-slate-700 mb-1">Sin lecturas asignadas</h3>
                      <p className="text-sm text-slate-500">
                        El docente aún no ha asignado lecturas a este estudiante.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
