// src/pages/padre/MisHijos.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHijosPadre, desvincularHijo } from "../../services/padresService";
import { MdLinkOff, MdClose, MdWarning } from "react-icons/md";

export default function MisHijos() {
  const navigate = useNavigate();
  const [hijos, setHijos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [modalDesvincular, setModalDesvincular] = useState(false);
  const [hijoSeleccionado, setHijoSeleccionado] = useState(null);
  const [desvinculando, setDesvinculando] = useState(false);

  useEffect(() => {
    cargarHijos();
  }, []);

  const cargarHijos = async () => {
    try {
      console.log("🔄 Cargando hijos...");
      setLoading(true);
      setError(null);
      
      const data = await getHijosPadre();
      
      console.log("✅ Datos recibidos:", data);
      console.log("✅ Primer elemento:", data[0]);
      console.log("✅ Claves del primer elemento:", Object.keys(data[0] || {}));
      
      setHijos(data ?? []);
    } catch (error) {
      console.error("❌ Error completo:", error);
      console.error("❌ Error response:", error.response);
      console.error("❌ Error message:", error.message);
      
      setError(error.message || "Error cargando hijos");
    } finally {
      setLoading(false);
    }
  };

  const abrirModalDesvincular = (estudiante) => {
    setHijoSeleccionado(estudiante);
    setModalDesvincular(true);
  };

  const cerrarModal = () => {
    setModalDesvincular(false);
    setHijoSeleccionado(null);
  };

  const handleDesvincular = async () => {
    if (!hijoSeleccionado) return;

    try {
      setDesvinculando(true);

      await desvincularHijo(hijoSeleccionado.id);

      alert("✅ Hijo desvinculado exitosamente");
      cerrarModal();
      await cargarHijos();
    } catch (err) {
      console.error("Error desvinculando hijo:", err);
      const errorMsg =
        err.response?.data?.detail ||
        err.message ||
        "Error al desvincular al hijo";
      alert(`❌ ${errorMsg}`);
    } finally {
      setDesvinculando(false);
    }
  };

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

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
        
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px -4px rgba(59, 130, 246, 0.25);
        }
      `}</style>

      {/* VERSIÓN MÓVIL */}
      <div className="md:hidden min-h-screen bg-white">
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-5 shadow-lg z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Mis Hijos</h1>
                <p className="text-xs text-blue-100">
                  {hijos.length > 0 ? `${hijos.length} vinculado${hijos.length > 1 ? "s" : ""}` : "Sin hijos"}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => navigate("/padre/menu/hijos/vincular")}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        <main className="pt-24 px-4 pb-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border-l-4 border-red-500">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="font-semibold text-red-900 text-xs">Error</p>
                  <p className="text-red-700 text-xs mt-0.5">{error}</p>
                </div>
              </div>
              <button
                onClick={cargarHijos}
                className="mt-2 w-full px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs font-medium"
              >
                Reintentar
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-3"></div>
              <p className="text-center text-slate-600 text-sm">Cargando hijos...</p>
            </div>
          ) : error ? null : hijos.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-blue-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Sin hijos vinculados</h3>
              <p className="text-sm text-slate-600 mb-5">Vincula a tu primer hijo para comenzar</p>
              <button
                onClick={() => navigate("/padre/menu/hijos/vincular")}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-semibold text-sm"
              >
                Vincular Hijo
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {hijos.map((item, index) => {
                const estudiante = item.estudiante || item;
                const cursos = item.cursos || [];
                const tieneCurso = cursos.length > 0;

                if (!estudiante || !estudiante.nombre || !estudiante.apellido) {
                  console.warn("⚠️ Datos inválidos en índice", index, ":", item);
                  return null;
                }

                return (
                  <div
                    key={estudiante.id || index}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/20">
                          {estudiante.nombre?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">
                            {estudiante.nombre} {estudiante.apellido}
                          </h3>
                          {tieneCurso ? (
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                              {cursos[0].nombre}
                            </span>
                          ) : (
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500">
                              Sin curso
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => abrirModalDesvincular(estudiante)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      >
                        <MdLinkOff size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        disabled={!tieneCurso}
                        onClick={() => navigate(`/padre/menu/hijos/${estudiante.id}/lecturas`)}
                        className={`py-2 rounded-lg font-semibold text-xs transition flex items-center justify-center gap-1.5 ${
                          tieneCurso
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Lecturas
                      </button>

                      <button
                        onClick={() => navigate(`/padre/menu/hijos/${estudiante.id}/juego`)}
                        className="py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold text-xs hover:from-green-700 hover:to-emerald-700 transition flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Juego
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* VERSIÓN DESKTOP */}
      <div className="hidden md:block min-h-screen bg-white pt-24">
        <main className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Mis Hijos</h1>
              <p className="text-slate-600 text-sm">
                {hijos.length > 0
                  ? `Tienes ${hijos.length} hijo${hijos.length > 1 ? "s" : ""} vinculado${hijos.length > 1 ? "s" : ""}`
                  : "Aún no tienes hijos vinculados"}
              </p>
            </div>

            <button
              onClick={() => navigate("/padre/menu/hijos/vincular")}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Vincular Nuevo Hijo
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border-l-4 border-red-500">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="font-semibold text-red-900 text-sm mb-1">Error cargando hijos</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <button
                  onClick={cargarHijos}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <p className="text-center text-slate-600">Cargando hijos...</p>
            </div>
          ) : error ? null : hijos.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Sin hijos vinculados</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Comienza vinculando a tu primer hijo para acceder a sus lecturas y actividades
              </p>
              <button
                onClick={() => navigate("/padre/menu/hijos/vincular")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-bold shadow-lg shadow-blue-500/20"
              >
                Vincular mi Primer Hijo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {hijos.map((item, index) => {
                const estudiante = item.estudiante || item;
                const cursos = item.cursos || [];
                const tieneCurso = cursos.length > 0;

                if (!estudiante || !estudiante.nombre || !estudiante.apellido) {
                  console.warn("⚠️ Datos inválidos en índice", index, ":", item);
                  return null;
                }

                return (
                  <div
                    key={estudiante.id || index}
                    className="bg-white rounded-2xl border border-slate-200 p-5 relative card-hover animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <button
                      onClick={() => abrirModalDesvincular(estudiante)}
                      className="absolute top-4 right-4 p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                      title="Desvincular hijo"
                    >
                      <MdLinkOff size={18} />
                    </button>

                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-xl shadow-blue-500/30">
                        {estudiante.nombre?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 text-center mb-2">
                      {estudiante.nombre} {estudiante.apellido}
                    </h2>

                    <div className="flex justify-center mb-5">
                      {tieneCurso ? (
                        <span className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 font-semibold border border-blue-200">
                          {cursos[0].nombre}
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs rounded-full bg-slate-100 text-slate-500 font-medium">
                          Sin curso asignado
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <button
                        disabled={!tieneCurso}
                        onClick={() => navigate(`/padre/menu/hijos/${estudiante.id}/lecturas`)}
                        className={`w-full py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-sm ${
                          tieneCurso
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Ver Lecturas
                      </button>

                      <button
                        onClick={() => navigate(`/padre/menu/hijos/${estudiante.id}/juego`)}
                        className="w-full py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-green-500/20 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Mi Aventura
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* MODAL */}
      {modalDesvincular && hijoSeleccionado && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative animate-scale-in">
            
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-5 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <MdWarning size={24} />
                </div>
                <h3 className="text-lg font-bold">Confirmar Desvinculación</h3>
              </div>
              <button
                onClick={cerrarModal}
                className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                disabled={desvinculando}
              >
                <MdClose size={20} />
              </button>
            </div>

            <div className="p-5">
              <div className="mb-5 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl">
                <p className="text-slate-800 font-medium mb-2 text-center text-sm">
                  ¿Estás seguro de desvincular a:
                </p>
                <p className="text-xl font-bold text-blue-700 text-center">
                  {hijoSeleccionado.nombre} {hijoSeleccionado.apellido}
                </p>
              </div>

              <div className="space-y-2 text-sm text-slate-700 mb-5 bg-blue-50 p-3 rounded-xl border border-blue-100">
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 flex-shrink-0">ℹ️</span>
                  <span className="text-xs">
                    El hijo será marcado como <strong>inactivo</strong> en el sistema.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 flex-shrink-0">ℹ️</span>
                  <span className="text-xs">
                    Dejará de aparecer en tu lista de hijos vinculados.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 flex-shrink-0">ℹ️</span>
                  <span className="text-xs">
                    Su progreso se conservará, pero no podrá acceder a nuevas actividades.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-xs">
                    Podrás volver a vincularlo más adelante si es necesario.
                  </span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cerrarModal}
                  disabled={desvinculando}
                  className="flex-1 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg transition-all font-bold disabled:opacity-50 text-sm"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleDesvincular}
                  disabled={desvinculando}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all font-bold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 text-sm"
                >
                  {desvinculando ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Desvinculando...
                    </>
                  ) : (
                    <>
                      <MdLinkOff size={18} />
                      Desvincular
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
