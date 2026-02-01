import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getHistorialPronunciacionHijo,
  getPracticasPronunciacionHijo,
} from "../../services/historialService";
import { getMisHijos } from "../../services/padresService";
import { MdShuffle } from "react-icons/md";
import { FaBrain } from "react-icons/fa";

export default function HistorialHijo() {
  const navigate = useNavigate();

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

  const estadisticas = useMemo(() => {
    if (!hijoActivo) return null;

    const promedioPronunciacion =
      pronunciacion.length > 0
        ? (
            pronunciacion.reduce((acc, p) => acc + (p.puntuacion_global || 0), 0) /
            pronunciacion.length
          ).toFixed(1)
        : 0;

    const promedioPracticas =
      practicas.length > 0
        ? (
            practicas.reduce((acc, p) => acc + (p.puntuacion || 0), 0) /
            practicas.length
          ).toFixed(1)
        : 0;

    const totalErrores = practicas.reduce(
      (acc, p) => acc + (p.errores_corregidos || 0),
      0
    );

    return {
      promedioPronunciacion,
      promedioPracticas,
      totalErrores,
      totalLecturas: pronunciacion.length,
      totalPracticas: practicas.length,
    };
  }, [hijoActivo, pronunciacion, practicas]);

  const avatarColors = [
    "bg-gradient-to-br from-emerald-500 to-teal-500",
    "bg-gradient-to-br from-teal-500 to-cyan-500",
    "bg-gradient-to-br from-cyan-500 to-emerald-500",
    "bg-gradient-to-br from-violet-500 to-purple-500",
    "bg-gradient-to-br from-rose-500 to-pink-500",
    "bg-gradient-to-br from-amber-500 to-orange-500",
  ];

  const getAvatarColor = (index) =>
    avatarColors[index % avatarColors.length];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-lg font-bold text-slate-700 mb-1">
            Cargando información
          </h3>
          <p className="text-sm text-slate-500">
            Preparando datos de tus hijos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Fredoka:wght@500;600;700&display=swap');
        * { font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif; }
        h1,h2,h3,h4,h5,h6 { font-family: 'Fredoka', 'Poppins', sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .anim-fade { animation: fadeUp 0.4s ease-out; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 anim-fade">

        {/* HEADER */}
        <div className="bg-white rounded-b-2xl shadow-sm px-4 md:px-6 pt-4 pb-5">
          

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-900">Historial</h1>
                <p className="text-xs text-slate-500">
                  {hijos.length} hijo{hijos.length !== 1 ? "s" : ""} registrado{hijos.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-5 space-y-5">

          {/* Selector de hijos */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
              Selecciona un hijo
            </p>

            {hijos.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-slate-700 font-bold mb-1">No hay hijos registrados</p>
                <p className="text-sm text-slate-500">
                  Contacta con el administrador para más información
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 md:gap-3">
                {hijos.map((h, index) => {
                  const sel = hijoActivo === h.id;
                  return (
                    <button
                      key={h.id}
                      onClick={() => cargarHistorial(h.id)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all active:scale-95 ${
                        sel
                          ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 shadow-md shadow-emerald-500/20 text-white"
                          : "bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white ${
                          sel ? "bg-white/25" : getAvatarColor(index)
                        }`}
                      >
                        {h.nombre?.charAt(0)}
                      </div>
                      <span className="font-bold text-sm">
                        {h.nombre} {h.apellido}
                      </span>
                      {sel && (
                        <svg className="w-4 h-4 text-white/80 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* CONTENIDO DEL HIJO SELECCIONADO */}
          {hijoActivo ? (
            loadingHistorial ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent mx-auto mb-3"></div>
                <p className="text-sm text-slate-500">
                  Cargando historial de {hijoActualObj?.nombre}...
                </p>
              </div>
            ) : (
              <div className="space-y-5">

                {/* Banner nombre hijo */}
                <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 p-4 flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md ${getAvatarColor(
                      hijos.findIndex((h) => h.id === hijoActivo)
                    )}`}
                  >
                    {hijoActualObj?.nombre?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 font-bold">Mostrando historial de</p>
                    <p className="text-base font-bold text-slate-900">
                      {hijoActualObj?.nombre} {hijoActualObj?.apellido}
                    </p>
                  </div>
                </div>

                {/* Stats: 3 métricas */}
                {estadisticas && (
                  <div className="grid grid-cols-3 gap-2 md:gap-4">
                    {/* Lecturas — teal */}
                    <div className="bg-white rounded-2xl shadow-sm border border-teal-200 overflow-hidden">
                      <div className="h-1 bg-gradient-to-r from-teal-400 to-teal-500"></div>
                      <div className="p-3 md:p-4 text-center">
                        <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center">
                          <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <p className="text-teal-600 font-bold uppercase tracking-wide" style={{ fontSize: "9px" }}>
                          Lecturas
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-teal-700 mt-0.5">
                          {estadisticas.promedioPronunciacion}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {estadisticas.totalLecturas} eval.
                        </p>
                      </div>
                    </div>

                    {/* Prácticas — emerald */}
                    <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 overflow-hidden">
                      <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-500"></div>
                      <div className="p-3 md:p-4 text-center">
                        <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-emerald-600 font-bold uppercase tracking-wide" style={{ fontSize: "9px" }}>
                          Prácticas
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-emerald-700 mt-0.5">
                          {estadisticas.promedioPracticas}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {estadisticas.totalPracticas} ejerc.
                        </p>
                      </div>
                    </div>

                    {/* Errores — rose */}
                    <div className="bg-white rounded-2xl shadow-sm border border-rose-200 overflow-hidden">
                      <div className="h-1 bg-gradient-to-r from-rose-400 to-rose-500"></div>
                      <div className="p-3 md:p-4 text-center">
                        <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center">
                          <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9.303 3.376a12.02 12.02 0 01-2.494 3.708m-2.499 3.708a11.952 11.952 0 01-6.809-2.494m-.001-1.935c.064-.542.381-1.037.876-1.326m11.564-8.321A11.955 11.955 0 0112 2.944" />
                          </svg>
                        </div>
                        <p className="text-rose-600 font-bold uppercase tracking-wide" style={{ fontSize: "9px" }}>
                          Errores
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-rose-700 mt-0.5">
                          {estadisticas.totalErrores}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Corregidos
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ══════════════════════════════════════════════════════
                    JUEGOS — dos botones lado a lado
                    ══════════════════════════════════════════════════════ */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Desordena */}
                  <button
                    onClick={() => navigate("/padre/menu/mini-juego")}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 active:scale-95 transition-all overflow-hidden"
                  >
                    <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-500"></div>
                    <div className="p-3 flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-violet-500/20">
                        <MdShuffle size={22} className="text-white" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-900">Desordena</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Ordena letras</p>
                      </div>
                    </div>
                  </button>

                  {/* Parejas */}
                  <button
                    onClick={() => navigate("/padre/menu/mini-juego-memory")}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 active:scale-95 transition-all overflow-hidden"
                  >
                    <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                    <div className="p-3 flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                        <FaBrain size={22} className="text-white" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-900">Parejas</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Memoria</p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Lecturas Evaluadas */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-500"></div>
                  <div className="p-4 md:p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center">
                          <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-slate-900">Lecturas Evaluadas</h2>
                          <p className="text-[10px] text-slate-400">Pronunciación y fluidez</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-teal-600 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-lg">
                        {pronunciacion.length}
                      </span>
                    </div>

                    {pronunciacion.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
                          <svg className="w-7 h-7 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <p className="text-sm font-bold text-slate-600">Sin lecturas evaluadas</p>
                        <p className="text-xs text-slate-400 mt-0.5">Aún no hay registros</p>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {pronunciacion.map((p) => (
                          <div
                            key={p.id}
                            className="bg-teal-50 border border-teal-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-lg px-3 py-2 shadow-sm shadow-teal-500/20 inline-block">
                                <p className="text-xl font-bold">{p.puntuacion_global ?? "-"}</p>
                                <p className="text-[9px] text-teal-100 font-bold uppercase tracking-wide">Puntuación</p>
                              </div>
                              <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                                {p.fecha
                                  ? new Date(p.fecha).toLocaleDateString("es-ES", {
                                      day: "2-digit",
                                      month: "short",
                                    })
                                  : "-"}
                              </span>
                            </div>

                            {p.lectura_titulo && (
                              <div className="bg-white border border-teal-200 rounded-lg px-3 py-2 mb-3">
                                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                  <svg className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                  </svg>
                                  {p.lectura_titulo}
                                </p>
                              </div>
                            )}

                            <div className="space-y-1.5">
                              {[
                                { label: "Fluidez", val: p.fluidez },
                                { label: "Velocidad", val: p.velocidad },
                                { label: "Precisión", val: p.precision },
                              ].map((m) => (
                                <div key={m.label} className="flex items-center justify-between bg-white border border-teal-100 rounded-lg px-2.5 py-1.5">
                                  <span className="text-xs text-slate-500">{m.label}</span>
                                  <span className="text-xs font-bold text-teal-700">{m.val ?? "-"}</span>
                                </div>
                              ))}
                            </div>

                            {p.retroalimentacion && (
                              <div className="mt-3 bg-white border border-teal-100 rounded-lg p-3">
                                <p className="text-xs text-slate-500 flex items-start gap-1.5">
                                  <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                                  </svg>
                                  <span className="whitespace-pre-wrap">{p.retroalimentacion}</span>
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Zona Práctica */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"></div>
                  <div className="p-4 md:p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-slate-900">Zona Práctica</h2>
                          <p className="text-[10px] text-slate-400">Ejercicios de pronunciación</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                        {practicas.length}
                      </span>
                    </div>

                    {practicas.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                          <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 1.393-.129 2.754-.364 4.074-.346 2.088-2.095 3.522-4.175 3.622C14.897 18.306 13.551 18.5 12 18.5s-2.897-.194-3.961-.254c-2.08-.1-3.829-1.534-4.175-3.622A15.053 15.053 0 014.5 10.5c0-1.393.129-2.754.364-4.074.346-2.088 2.095-3.522 4.175-3.622C9.897 2.306 10.449 2.5 12 2.5s-2.103.194-3.961.254" />
                          </svg>
                        </div>
                        <p className="text-sm font-bold text-slate-600">Sin prácticas registradas</p>
                        <p className="text-xs text-slate-400 mt-0.5">Aún no hay ejercicios completados</p>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {practicas.map((p) => (
                          <div
                            key={p.id}
                            className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-lg px-3 py-2 shadow-sm shadow-emerald-500/20 inline-block">
                                <p className="text-xl font-bold">{p.puntuacion ?? "-"}</p>
                                <p className="text-[9px] text-emerald-100 font-bold uppercase tracking-wide">Puntuación</p>
                              </div>
                              <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                                {p.fecha
                                  ? new Date(p.fecha).toLocaleDateString("es-ES", {
                                      day: "2-digit",
                                      month: "short",
                                    })
                                  : "-"}
                              </span>
                            </div>

                            {p.lectura_titulo && (
                              <div className="bg-white border border-emerald-200 rounded-lg px-3 py-2 mb-3">
                                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                  <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                  </svg>
                                  {p.lectura_titulo}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center justify-between bg-white border border-emerald-100 rounded-lg px-2.5 py-1.5 mb-3">
                              <span className="text-xs text-slate-500">Errores corregidos</span>
                              <span className="text-xs font-bold text-emerald-700">{p.errores_corregidos ?? 0}</span>
                            </div>

                            {Array.isArray(p.palabras_objetivo) &&
                              p.palabras_objetivo.length > 0 && (
                                <div className="bg-white border border-emerald-100 rounded-lg p-3 mb-3">
                                  <p className="text-[10px] text-emerald-600 font-bold mb-1.5 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Palabras objetivo
                                  </p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {p.palabras_objetivo.map((palabra, idx) => (
                                      <span
                                        key={idx}
                                        className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-lg text-[10px] font-bold"
                                      >
                                        {palabra}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                            {p.texto_practica && (
                              <div className="bg-white border border-emerald-100 rounded-lg p-3">
                                <p className="text-xs text-slate-500 flex items-start gap-1.5">
                                  <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.25 11.25l4.25 4.25M2.25 2.25l19.5 19.5M8.957 17.052c-2.095-.095-3.599-1.256-3.834-3.069a41.5 41.5 0 01-.165-3.545m0 0a41.625 41.625 0 011.523-3.234m-1.523 3.234a3.375 3.375 0 014.762 0m0 0a3.375 3.375 0 011.523 3.234" />
                                  </svg>
                                  <span className="whitespace-pre-wrap line-clamp-3">
                                    {p.texto_practica}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5H4.5" />
                </svg>
              </div>
              <p className="text-sm font-bold text-slate-600">
                Selecciona un hijo para ver su historial
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
