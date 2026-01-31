// src/pages/padre/MisHijos.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getHijosPadre, desvincularHijo } from "../../services/padresService";
import { MdLinkOff } from "react-icons/md";

export default function MisHijos() {
  const navigate = useNavigate();
  const [hijos, setHijos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      
      const errorMsg = error.message || "Error cargando hijos";
      setError(errorMsg);

      await Swal.fire({
        title: "Error",
        text: errorMsg,
        icon: "error",
        confirmButtonColor: "#10b981",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // DESVINCULAR HIJO
  // ==========================================================
  const handleDesvincular = async (estudiante) => {
    // Validación
    if (!estudiante || !estudiante.id) {
      await Swal.fire({
        title: "Error",
        text: "No se pudo identificar al estudiante. Intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#10b981",
      });
      return;
    }

    // Confirmación con preview
    const confirm = await Swal.fire({
      title: "⚠️ Confirmar Desvinculación",
      html: `
        <div style="text-align: left; padding: 1rem;">
          <div style="margin-bottom: 1.25rem; padding: 1rem; background: linear-gradient(to bottom right, #fef3c7, #fed7aa); border: 2px solid #fbbf24; border-radius: 0.75rem;">
            <p style="margin: 0 0 0.5rem 0; color: #78716c; font-weight: 500; text-align: center; font-size: 0.875rem;">
              ¿Estás seguro de desvincular a:
            </p>
            <p style="margin: 0; font-size: 1.25rem; font-weight: bold; color: #059669; text-align: center;">
              ${estudiante.nombre} ${estudiante.apellido}
            </p>
          </div>

          <div style="background-color: #ecfdf5; padding: 0.875rem; border-radius: 0.75rem; border: 1px solid #6ee7b7; margin-bottom: 1rem;">
            <p style="margin: 0 0 0.5rem 0; display: flex; align-items: start; gap: 0.5rem; font-size: 0.75rem; color: #064e3b;">
              <span style="color: #059669; margin-top: 0.125rem;">ℹ️</span>
              <span>El hijo será marcado como <strong>inactivo</strong> en el sistema.</span>
            </p>
            <p style="margin: 0 0 0.5rem 0; display: flex; align-items: start; gap: 0.5rem; font-size: 0.75rem; color: #064e3b;">
              <span style="color: #059669; margin-top: 0.125rem;">ℹ️</span>
              <span>Dejará de aparecer en tu lista de hijos vinculados.</span>
            </p>
            <p style="margin: 0 0 0.5rem 0; display: flex; align-items: start; gap: 0.5rem; font-size: 0.75rem; color: #064e3b;">
              <span style="color: #059669; margin-top: 0.125rem;">ℹ️</span>
              <span>Su progreso se conservará, pero no podrá acceder a nuevas actividades.</span>
            </p>
            <p style="margin: 0; display: flex; align-items: start; gap: 0.5rem; font-size: 0.75rem; color: #064e3b;">
              <span style="color: #16a34a; margin-top: 0.125rem;">✓</span>
              <span>Podrás volver a vincularlo más adelante si es necesario.</span>
            </p>
          </div>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desvincular",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      console.log("📤 Desvinculando hijo:", estudiante.id);

      await desvincularHijo(estudiante.id);

      console.log("✅ Hijo desvinculado correctamente");

      await Swal.fire({
        title: "¡Hijo desvinculado!",
        text: `${estudiante.nombre} ha sido desvinculado exitosamente`,
        icon: "success",
        confirmButtonColor: "#10b981",
        timer: 2000,
        showConfirmButton: false,
      });

      await cargarHijos();
    } catch (err) {
      console.error("❌ Error desvinculando hijo:", err);
      console.error("Response:", err.response?.data);
      
      let errorMsg = "Error al desvincular al hijo. Intenta nuevamente.";
      
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMsg = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          errorMsg = err.response.data.detail.map(e => e.msg).join(', ');
        }
      } else if (err.message) {
        errorMsg = err.message;
      }

      await Swal.fire({
        title: "Error",
        text: errorMsg,
        icon: "error",
        confirmButtonColor: "#10b981",
      });
    }
  };

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
          box-shadow: 0 8px 16px -4px rgba(16, 185, 129, 0.25);
        }
      `}</style>

      {/* VERSIÓN MÓVIL */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 animate-fadeIn">
        <div className="bg-white rounded-b-3xl shadow-lg p-4 mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Mis Hijos</h1>
                <p className="text-xs text-slate-600">
                  {hijos.length > 0 ? `${hijos.length} vinculado${hijos.length > 1 ? "s" : ""}` : "Sin hijos"}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => navigate("/padre/menu/hijos/vincular")}
              className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 transition-all shadow-lg shadow-emerald-500/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        <main className="px-4 pb-8">
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 border-l-4 border-red-500 shadow-sm">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="font-semibold text-red-900 text-sm">Error</p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={cargarHijos}
                className="mt-3 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
              >
                Reintentar
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mb-4"></div>
              <p className="text-center text-slate-600 font-medium">Cargando hijos...</p>
            </div>
          ) : error ? null : hijos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Sin hijos vinculados</h3>
              <p className="text-sm text-slate-600 mb-6 px-4">Vincula a tu primer hijo para comenzar a ver sus lecturas y actividades</p>
              <button
                onClick={() => navigate("/padre/menu/hijos/vincular")}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 transition-all shadow-lg shadow-emerald-500/20"
              >
                Vincular Hijo
              </button>
            </div>
          ) : (
            <div className="space-y-4">
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
                    className="bg-white rounded-2xl border-2 border-emerald-200/50 p-4 shadow-sm hover:shadow-md transition-all animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-emerald-500/20">
                          {estudiante.nombre?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">
                            {estudiante.nombre} {estudiante.apellido}
                          </h3>
                          {tieneCurso ? (
                            <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                              {cursos[0].nombre}
                            </span>
                          ) : (
                            <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-500 font-medium">
                              Sin curso
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDesvincular(estudiante)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                      >
                        <MdLinkOff size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        disabled={!tieneCurso}
                        onClick={() => navigate(`/padre/menu/hijos/${estudiante.id}/lecturas`)}
                        className={`py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                          tieneCurso
                            ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 shadow-md shadow-emerald-500/20"
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
                        className="py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-bold text-xs hover:from-orange-600 hover:to-amber-700 transition-all flex items-center justify-center gap-2 shadow-md"
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
      <div className="hidden md:block min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 animate-fadeIn">
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Mis Hijos</h1>
                  <p className="text-slate-600 text-sm">
                    {hijos.length > 0
                      ? `Tienes ${hijos.length} hijo${hijos.length > 1 ? "s" : ""} vinculado${hijos.length > 1 ? "s" : ""}`
                      : "Aún no tienes hijos vinculados"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/padre/menu/hijos/vincular")}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 transition-all shadow-lg shadow-emerald-500/20 text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Vincular Nuevo Hijo
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-5 rounded-2xl bg-red-50 border-l-4 border-red-500 shadow-sm">
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="font-bold text-red-900 mb-1">Error cargando hijos</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <button
                  onClick={cargarHijos}
                  className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold text-sm"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mb-4"></div>
              <p className="text-center text-slate-600 font-medium text-lg">Cargando hijos...</p>
            </div>
          ) : error ? null : hijos.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 flex items-center justify-center">
                <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Sin hijos vinculados</h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Comienza vinculando a tu primer hijo para acceder a sus lecturas y actividades
              </p>
              <button
                onClick={() => navigate("/padre/menu/hijos/vincular")}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-xl hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 transition-all font-bold shadow-lg shadow-emerald-500/20 text-base"
              >
                Vincular mi Primer Hijo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className="bg-white rounded-2xl border-2 border-emerald-200/50 p-6 relative card-hover animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <button
                      onClick={() => handleDesvincular(estudiante)}
                      className="absolute top-4 right-4 p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all hover:scale-105"
                      title="Desvincular hijo"
                    >
                      <MdLinkOff size={20} />
                    </button>

                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white flex items-center justify-center text-2xl font-bold shadow-xl shadow-emerald-500/20">
                        {estudiante.nombre?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 text-center mb-3">
                      {estudiante.nombre} {estudiante.apellido}
                    </h2>

                    <div className="flex justify-center mb-6">
                      {tieneCurso ? (
                        <span className="px-4 py-1.5 text-sm rounded-full bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 text-emerald-700 font-bold border-2 border-emerald-200">
                          {cursos[0].nombre}
                        </span>
                      ) : (
                        <span className="px-4 py-1.5 text-sm rounded-full bg-slate-100 text-slate-500 font-semibold">
                          Sin curso asignado
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      <button
                        disabled={!tieneCurso}
                        onClick={() => navigate(`/padre/menu/hijos/${estudiante.id}/lecturas`)}
                        className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm ${
                          tieneCurso
                            ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 shadow-lg shadow-emerald-500/20"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Ver Lecturas
                      </button>

                      <button
                        onClick={() => navigate(`/padre/menu/hijos/${estudiante.id}/juego`)}
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-700 transition-all flex items-center justify-center gap-2 shadow-lg text-sm"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </>
  );
}
