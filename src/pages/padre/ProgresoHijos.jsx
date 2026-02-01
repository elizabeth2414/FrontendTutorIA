// src/pages/padre/ProgresoHijos.jsx

import { useEffect, useState } from "react";
import {
  getHistorialPronunciacionHijo,
  getPracticasPronunciacionHijo,
} from "../../services/historialService";
import { getMisHijos } from "../../services/padresService";
import { useNavigate } from "react-router-dom";

import PronunciacionChart from "../../components/charts/PronunciacionChart";
import PracticasChart from "../../components/charts/PracticasChart";

import { MdInsights, MdTrendingUp, MdFlag, MdArrowBack } from "react-icons/md";

export default function ProgresoHijos() {
  const navigate = useNavigate();
  const [hijos, setHijos] = useState([]);
  const [activo, setActivo] = useState(null);
  const [pron, setPron] = useState([]);
  const [prac, setPrac] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgreso, setLoadingProgreso] = useState(false);
  const [error, setError] = useState(null);

  // ==========================
  // Cargar hijos al montar
  // ==========================
  useEffect(() => {
    const cargarHijos = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getMisHijos();
        let lista = [];
        if (Array.isArray(data)) lista = data;
        else if (data && Array.isArray(data.hijos)) lista = data.hijos;
        else if (data && typeof data === "object") lista = [data];

        // Normalizar cada hijo
        lista = lista.map((item) => {
          const est = item.estudiante || item;
          return {
            id: est.id,
            nombre: est.nombre || "",
            apellido: est.apellido || "",
            nivel_educativo: est.nivel_educativo || 1,
          };
        }).filter((e) => e.id);

        setHijos(lista);

        if (lista.length > 0) {
          await cargarProgreso(lista[0].id);
        }
      } catch (err) {
        console.error("Error al cargar hijos:", err);
        setError("No se pudieron cargar los hijos");
      } finally {
        setLoading(false);
      }
    };

    cargarHijos();
  }, []);

  // ==========================
  // Cargar progreso del hijo
  // ==========================
  const cargarProgreso = async (id) => {
    try {
      setLoadingProgreso(true);
      setActivo(id);

      const [pronunciacionData, practicasData] = await Promise.all([
        getHistorialPronunciacionHijo(id),
        getPracticasPronunciacionHijo(id),
      ]);

      setPron(Array.isArray(pronunciacionData) ? pronunciacionData : []);
      setPrac(Array.isArray(practicasData) ? practicasData : []);
    } catch (err) {
      console.error("Error al cargar progreso:", err);
      setPron([]);
      setPrac([]);
    } finally {
      setLoadingProgreso(false);
    }
  };

  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Cargando información...</p>
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
        <div className="max-w-md w-full bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
            <span className="text-3xl">❌</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Error</h3>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  const hijoActual = hijos.find((h) => h.id === activo);
  const sinDatos = pron.length === 0 && prac.length === 0;

  // ── Componente wrapper para los charts (fix recharts) ──
  // ResponsiveContainer necesita un padre con height explícito y min-w-0
  const ChartWrapper = ({ children, heightMobile = 220, heightDesktop = 260 }) => (
    <>
      {/* móvil */}
      <div className="md:hidden min-w-0" style={{ width: "100%", height: heightMobile }}>
        {children}
      </div>
      {/* desktop */}
      <div className="hidden md:block min-w-0" style={{ width: "100%", height: heightDesktop }}>
        {children}
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Fredoka:wght@500;600;700&display=swap');
        * { font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif; }
        h1,h2,h3,h4,h5,h6 { font-family: 'Fredoka', 'Poppins', sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .anim-fade { animation: fadeUp 0.4s ease-out; }
      `}</style>

      {/* ============================================================
          📱 MÓVIL
          ============================================================ */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 anim-fade">

        {/* Header móvil */}
        <div className="bg-white rounded-b-2xl shadow-md px-4 pt-4 pb-5">
         
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <MdInsights size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Progreso</h1>
              <p className="text-xs text-slate-500">Seguimiento de avances</p>
            </div>
          </div>
        </div>

        <main className="px-4 pt-5 pb-8 space-y-4">

          {/* Selector hijos móvil */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Selecciona un hijo</p>

            {hijos.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                </div>
                <p className="text-sm text-slate-600 font-bold mb-1">No tienes hijos registrados</p>
                <p className="text-xs text-slate-400">Registra a tus hijos para ver su progreso</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {hijos.map((h) => {
                  const sel = activo === h.id;
                  return (
                    <button
                      key={h.id}
                      onClick={() => cargarProgreso(h.id)}
                      disabled={loadingProgreso}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                        sel
                          ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-md shadow-emerald-500/20"
                          : "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                      } ${loadingProgreso ? "opacity-50" : ""}`}
                    >
                      {h.nombre}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Contenido según estado */}
          {activo ? (
            loadingProgreso ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent mx-auto mb-3"></div>
                <p className="text-sm text-slate-500">Cargando progreso...</p>
              </div>
            ) : sinDatos ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
                  <span className="text-3xl">📚</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{hijoActual?.nombre} aún no tiene datos</h3>
                <p className="text-sm text-slate-400">Aparecerán cuando comience a practicar</p>
              </div>
            ) : (
              <div className="space-y-4">

                {/* Banner nombre hijo móvil */}
                <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-emerald-500/20">
                    {hijoActual?.nombre?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 font-bold">Mostrando progreso de</p>
                    <p className="text-sm font-bold text-slate-900">{hijoActual?.nombre} {hijoActual?.apellido}</p>
                  </div>
                </div>

                {/* ── Pronunciación móvil ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-500"></div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center">
                          <MdTrendingUp className="text-teal-600" size={18} />
                        </div>
                        <h2 className="text-sm font-bold text-slate-900">Pronunciación</h2>
                      </div>
                      <span className="text-xs font-bold text-teal-600 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-lg">
                        {pron.length} registros
                      </span>
                    </div>

                    {pron.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-8">No hay datos aún</p>
                    ) : (
                      <ChartWrapper heightMobile={200}>
                        <PronunciacionChart data={pron} />
                      </ChartWrapper>
                    )}
                  </div>
                </div>

                {/* ── Prácticas móvil ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"></div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                          <MdFlag className="text-emerald-600" size={18} />
                        </div>
                        <h2 className="text-sm font-bold text-slate-900">Prácticas</h2>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                        {prac.length} prácticas
                      </span>
                    </div>

                    {prac.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-8">No hay prácticas aún</p>
                    ) : (
                      <ChartWrapper heightMobile={200}>
                        <PracticasChart data={prac} />
                      </ChartWrapper>
                    )}
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                <span className="text-2xl">👆</span>
              </div>
              <p className="text-sm font-bold text-slate-600">Selecciona un hijo arriba</p>
            </div>
          )}
        </main>
      </div>

      {/* ============================================================
          🖥️  DESKTOP
          ============================================================ */}
      <div className="hidden md:block min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 anim-fade">
        <main className="max-w-5xl mx-auto px-6 py-6 space-y-5">

          {/* Header desktop */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
        
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <MdInsights size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Progreso Académico</h1>
                <p className="text-sm text-slate-500">Seguimiento del avance en pronunciación y prácticas</p>
              </div>
            </div>
          </div>

          {/* Selector hijos desktop */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Selecciona un hijo</p>

            {hijos.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <span className="text-3xl">👨‍👩‍👧‍👦</span>
                </div>
                <p className="text-slate-600 font-bold mb-1">No tienes hijos registrados</p>
                <p className="text-sm text-slate-400">Registra a tus hijos para ver su progreso</p>
              </div>
            ) : (
              <div className="flex gap-3 flex-wrap">
                {hijos.map((h) => {
                  const sel = activo === h.id;
                  return (
                    <button
                      key={h.id}
                      onClick={() => cargarProgreso(h.id)}
                      disabled={loadingProgreso}
                      className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                        sel
                          ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-md shadow-emerald-500/20"
                          : "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                      } ${loadingProgreso ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {h.nombre}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Contenido según estado */}
          {activo ? (
            loadingProgreso ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-14 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-slate-500">Cargando progreso de {hijoActual?.nombre}...</p>
              </div>
            ) : sinDatos ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-14 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center">
                  <span className="text-4xl">📚</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{hijoActual?.nombre} aún no tiene datos registrados</h3>
                <p className="text-slate-400">Aparecerán aquí cuando comience a practicar</p>
              </div>
            ) : (
              <div className="space-y-5">

                {/* Banner nombre hijo desktop */}
                <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-emerald-500/20">
                    {hijoActual?.nombre?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 font-bold">Mostrando progreso de</p>
                    <p className="text-lg font-bold text-slate-900">{hijoActual?.nombre} {hijoActual?.apellido}</p>
                  </div>
                </div>

                {/* ── Grid 2 columnas: Pronunciación + Prácticas ── */}
                <div className="grid md:grid-cols-2 gap-5">

                  {/* Pronunciación desktop */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-500"></div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center">
                            <MdTrendingUp className="text-teal-600" size={20} />
                          </div>
                          <h2 className="text-base font-bold text-slate-900">Pronunciación</h2>
                        </div>
                        <span className="text-xs font-bold text-teal-600 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-lg">
                          {pron.length} registros
                        </span>
                      </div>

                      {pron.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-10">No hay datos de pronunciación aún</p>
                      ) : (
                        <ChartWrapper heightDesktop={240}>
                          <PronunciacionChart data={pron} />
                        </ChartWrapper>
                      )}
                    </div>
                  </div>

                  {/* Prácticas desktop */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"></div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                            <MdFlag className="text-emerald-600" size={20} />
                          </div>
                          <h2 className="text-base font-bold text-slate-900">Prácticas</h2>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                          {prac.length} prácticas
                        </span>
                      </div>

                      {prac.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-10">No hay prácticas registradas aún</p>
                      ) : (
                        <ChartWrapper heightDesktop={240}>
                          <PracticasChart data={prac} />
                        </ChartWrapper>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-14 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                <span className="text-3xl">👆</span>
              </div>
              <p className="text-lg font-bold text-slate-600">Selecciona un hijo para ver su progreso</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
