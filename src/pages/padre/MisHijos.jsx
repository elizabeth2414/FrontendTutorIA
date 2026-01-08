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
  
  // Estados para el modal de desvincular
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
    <div className="min-h-screen bg-white">
      {/* ESTILOS CSS */}
      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>

      <main className="pt-24 max-w-7xl mx-auto p-6 space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              Mis Hijos
            </h1>
            <p className="text-sm text-gray-500">
              {hijos.length > 0
                ? `Tienes ${hijos.length} hijo${hijos.length > 1 ? "s" : ""} vinculado${hijos.length > 1 ? "s" : ""}`
                : "Aún no tienes hijos vinculados"}
            </p>
          </div>

          <button
            onClick={() => navigate("/padre/menu/hijos/vincular")}
            className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            ➕ Vincular Hijo
          </button>
        </div>

        {/* MOSTRAR ERROR SI HAY */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 font-semibold mb-2">❌ Error cargando hijos</p>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={cargarHijos}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* ESTADOS */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-center text-gray-600">
              Cargando hijos...
            </p>
          </div>
        ) : error ? null : hijos.length === 0 ? (
          <div className="bg-white border rounded-xl p-10 text-center text-gray-600">
            <p className="text-xl mb-4">📭</p>
            <p>Aún no tienes hijos vinculados.</p>
            <button
              onClick={() => navigate("/padre/menu/hijos/vincular")}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Vincular mi primer hijo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {hijos.map((item, index) => {
              // 🔥 DETECTAR FORMATO AUTOMÁTICAMENTE
              const estudiante = item.estudiante || item;
              const cursos = item.cursos || [];
              const tieneCurso = cursos.length > 0;

              // Validar que tenga los datos mínimos
              if (!estudiante || !estudiante.nombre || !estudiante.apellido) {
                console.warn("⚠️ Datos inválidos en índice", index, ":", item);
                return null;
              }

              return (
                <div
                  key={estudiante.id || index}
                  className="bg-white rounded-2xl border border-gray-200
                             shadow-sm hover:shadow-md hover:-translate-y-0.5
                             transition p-6 flex flex-col relative"
                >

                  {/* BOTÓN DESVINCULAR */}
                  <button
                    onClick={() => abrirModalDesvincular(estudiante)}
                    className="absolute top-4 right-4 p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                    title="Desvincular hijo"
                  >
                    <MdLinkOff size={20} />
                  </button>

                  {/* AVATAR */}
                  <div className="flex justify-center">
                    <div className="w-14 h-14 rounded-full bg-blue-600 text-white
                                    flex items-center justify-center text-xl font-bold shadow">
                      {estudiante.nombre?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  </div>

                  {/* NOMBRE */}
                  <h2 className="mt-3 text-xl font-bold text-gray-800 text-center">
                    {estudiante.nombre} {estudiante.apellido}
                  </h2>

                  {/* CURSO */}
                  <div className="flex justify-center mt-2">
                    {tieneCurso ? (
                      <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 font-medium">
                        {cursos[0].nombre}
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-500">
                        Curso no asignado
                      </span>
                    )}
                  </div>

                  {/* BOTONES */}
                  <div className="mt-6 space-y-3">
                    <button
                      disabled={!tieneCurso}
                      onClick={() =>
                        navigate(`/padre/menu/hijos/${estudiante.id}/lecturas`)
                      }
                      className={`w-full py-2.5 rounded-xl font-semibold transition
                        ${
                          tieneCurso
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      📘 Ver Lecturas
                    </button>




                    <button
                      onClick={() =>
                        navigate(`/padre/menu/hijos/${estudiante.id}/juego`)
                      }
                      className="w-full py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
                    >
                      🎮 Mi aventura
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}
      </main>

      {/* MODAL DE CONFIRMACIÓN PARA DESVINCULAR */}
      {modalDesvincular && hijoSeleccionado && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative animate-scale-in">
            
            {/* HEADER DEL MODAL */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <MdWarning size={28} />
                </div>
                <h3 className="text-xl font-bold">Confirmar Desvinculación</h3>
              </div>
              <button
                onClick={cerrarModal}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
                disabled={desvinculando}
              >
                <MdClose size={24} />
              </button>
            </div>

            {/* CONTENIDO DEL MODAL */}
            <div className="p-6">
              <div className="mb-6 p-5 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl">
                <p className="text-gray-800 font-medium mb-3 text-center">
                  ¿Estás seguro de desvincular a:
                </p>
                <p className="text-2xl font-bold text-blue-700 text-center">
                  {hijoSeleccionado.nombre} {hijoSeleccionado.apellido}
                </p>
              </div>

              <div className="space-y-3 text-sm text-gray-700 mb-6 bg-blue-50 p-4 rounded-xl">
                <p className="flex items-start gap-3">
                  <span className="text-blue-600 mt-0.5 text-lg">ℹ️</span>
                  <span>
                    El hijo será marcado como <strong>inactivo</strong> en el sistema.
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-blue-600 mt-0.5 text-lg">ℹ️</span>
                  <span>
                    Dejará de aparecer en tu lista de hijos vinculados.
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-blue-600 mt-0.5 text-lg">ℹ️</span>
                  <span>
                    Su progreso se conservará, pero no podrá acceder a nuevas actividades.
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-green-600 mt-0.5 text-lg">✓</span>
                  <span>
                    Podrás volver a vincularlo más adelante si es necesario.
                  </span>
                </p>
              </div>

              {/* BOTONES */}
              <div className="flex gap-3">
                <button
                  onClick={cerrarModal}
                  disabled={desvinculando}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition-all font-semibold disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleDesvincular}
                  disabled={desvinculando}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {desvinculando ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-3 border-white border-t-transparent"></div>
                      Desvinculando...
                    </>
                  ) : (
                    <>
                      <MdLinkOff size={20} />
                      Desvincular
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
