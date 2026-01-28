// src/pages/docente/ActividadesLectura.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  obtenerActividadesDeLectura,
  eliminarActividad,
  generarActividadesIA,
} from "../../services/iaActividadesService";

import {
  MdArrowBack,
  MdDelete,
  MdEdit,
  MdSmartToy,
  MdQuiz,
  MdCheckCircle,
  MdHelpOutline,
} from "react-icons/md";

export default function ActividadesLectura() {
  const { lecturaId } = useParams();
  const navigate = useNavigate();

  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generandoIA, setGenerandoIA] = useState(false);

  useEffect(() => {
    cargarActividades();
  }, [lecturaId]);

  const cargarActividades = async () => {
    try {
      setLoading(true);
      const data = await obtenerActividadesDeLectura(lecturaId);
      setActividades(data);
    } catch (err) {
      console.error("Error cargando actividades:", err);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar las actividades. Intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // ELIMINAR ACTIVIDAD
  // ==========================================================
  const handleEliminar = async (actividad) => {
    const confirm = await Swal.fire({
      title: "⚠️ ¿Eliminar Actividad?",
      html: `
        <div style="text-align: left; padding: 1rem;">
          <p style="margin: 0 0 0.5rem 0; font-weight: bold; font-size: 16px;">${actividad.titulo}</p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
            <span style="padding: 0.25rem 0.5rem; background-color: #e9d5ff; color: #7e22ce; border-radius: 0.375rem; font-size: 12px;">
              ${actividad.preguntas?.length || 0} preguntas
            </span>
            <span style="padding: 0.25rem 0.5rem; background-color: #dbeafe; color: #1e40af; border-radius: 0.375rem; font-size: 12px;">
              ${actividad.puntos_maximos} puntos
            </span>
            ${actividad.configuracion?.generado_por_ia ? 
              '<span style="padding: 0.25rem 0.5rem; background-color: #f3e8ff; color: #6b21a8; border-radius: 0.375rem; font-size: 12px;">🤖 Generada por IA</span>' 
              : ''
            }
          </div>
          <p style="color: #64748b; font-size: 0.875rem; margin: 0;">
            Esta acción no se puede deshacer.
          </p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      await eliminarActividad(actividad.id);
      
      await Swal.fire({
        title: "¡Eliminada!",
        text: "La actividad ha sido eliminada correctamente",
        icon: "success",
        confirmButtonColor: "#9333ea",
        timer: 2000,
        showConfirmButton: false,
      });

      cargarActividades();
    } catch (err) {
      console.error("Error eliminando actividad:", err);
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar la actividad. Intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    }
  };

  // ==========================================================
  // GENERAR ACTIVIDADES CON IA
  // ==========================================================
  const handleGenerarIA = async () => {
    const confirm = await Swal.fire({
      title: "🤖 Generar Actividades con IA",
      html: `
        <div style="text-align: left; padding: 1rem;">
          <p style="color: #64748b; font-size: 0.875rem; margin: 0 0 1rem 0;">
            Se generarán automáticamente <strong>5 actividades personalizadas</strong> usando inteligencia artificial para esta lectura.
          </p>
          
          <div style="background-color: #f3e8ff; padding: 0.75rem; border-radius: 0.5rem; border-left: 4px solid #9333ea; margin-bottom: 1rem;">
            <p style="margin: 0; font-size: 0.875rem; color: #6b21a8;">
              <strong>Incluye:</strong>
            </p>
            <ul style="margin: 0.5rem 0 0 1.5rem; font-size: 0.875rem; color: #6b21a8;">
              <li>Preguntas de opción múltiple</li>
              <li>Preguntas de verdadero/falso</li>
              <li>Adaptadas al nivel de dificultad</li>
            </ul>
          </div>

          <div style="background-color: #fef3c7; padding: 0.75rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; font-size: 0.875rem; color: #92400e;">
              <strong>Nota:</strong> Este proceso puede tomar unos segundos. Las actividades se agregarán a las existentes.
            </p>
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, generar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#9333ea",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      setGenerandoIA(true);

      await generarActividadesIA(lecturaId, {
        num_preguntas: 5,
        incluir_verdadero_falso: true,
        incluir_multiple_choice: true,
        dificultad: 3,
        idioma: "es",
      });

      await Swal.fire({
        title: "¡Actividades generadas!",
        text: "Las actividades han sido creadas exitosamente con IA",
        icon: "success",
        confirmButtonColor: "#9333ea",
        timer: 2000,
        showConfirmButton: false,
      });

      cargarActividades();
    } catch (err) {
      console.error("Error generando actividades:", err);
      
      let errorMsg = "Error generando actividades con IA";
      
      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 404) {
          errorMsg = "Servicio de IA no disponible. Verifica la configuración.";
        } else if (status === 500) {
          errorMsg = data?.detail || "Error interno del servidor de IA.";
        } else if (status === 401 || status === 403) {
          errorMsg = "No autorizado. Verifica tu sesión.";
        } else {
          errorMsg = data?.detail || `Error del servidor (${status})`;
        }
      } else if (err.request) {
        errorMsg = "No se pudo conectar con el servicio de IA. Verifica que el backend esté corriendo.";
      }

      Swal.fire({
        title: "Error",
        text: errorMsg,
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    } finally {
      setGenerandoIA(false);
    }
  };

  // ==========================================================
  // MODAL DE AYUDA (?)
  // ==========================================================
  const mostrarAyuda = () => {
    Swal.fire({
      title: "❓ ¿Qué hace este botón?",
      html: `
        <div style="text-align: left; padding: 1rem;">
          <h4 style="color: #7c3aed; font-weight: bold; margin: 0 0 0.75rem 0;">
            🤖 Generación Automática con IA
          </h4>
          
          <p style="margin: 0 0 1rem 0; color: #475569; font-size: 0.875rem;">
            Este botón utiliza <strong>Inteligencia Artificial</strong> para crear automáticamente actividades de comprensión lectora basadas en el contenido de tu lectura.
          </p>

          <div style="background-color: #f0fdf4; padding: 0.75rem; border-radius: 0.5rem; border-left: 4px solid #22c55e; margin-bottom: 1rem;">
            <p style="margin: 0 0 0.5rem 0; font-weight: bold; color: #166534; font-size: 0.875rem;">
              ✅ ¿Qué se genera?
            </p>
            <ul style="margin: 0 0 0 1.5rem; font-size: 0.875rem; color: #166534;">
              <li><strong>3 preguntas personalizadas</strong></li>
              <li>Opción múltiple y verdadero/falso</li>
              <li>Adaptadas al nivel de dificultad</li>
              <li>Basadas en el contenido de la lectura</li>
            </ul>
          </div>

          <div style="background-color: #eff6ff; padding: 0.75rem; border-radius: 0.5rem; border-left: 4px solid #3b82f6; margin-bottom: 1rem;">
            <p style="margin: 0 0 0.5rem 0; font-weight: bold; color: #1e40af; font-size: 0.875rem;">
              🎯 ¿Cómo funciona?
            </p>
            <ol style="margin: 0 0 0 1.5rem; font-size: 0.875rem; color: #1e40af;">
              <li>Haz clic en "Generar con IA"</li>
              <li>Confirma la generación</li>
              <li>Espera unos segundos (la IA está trabajando)</li>
              <li>¡Listo! Las actividades aparecerán aquí</li>
            </ol>
          </div>

          <div style="background-color: #fef3c7; padding: 0.75rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; font-size: 0.875rem; color: #92400e;">
              <strong>💡 Consejo:</strong> Las actividades generadas se suman a las existentes. Puedes editarlas o eliminarlas después.
            </p>
          </div>
        </div>
      `,
      icon: "info",
      confirmButtonText: "Entendido",
      confirmButtonColor: "#9333ea",
      width: "600px",
    });
  };

  const handleVerDetalle = (actividadId) => {
    navigate(`/docente/menu/actividades/${actividadId}/detalle`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando actividades...</p>
        </div>
      </div>
    );
  }

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

      {/* LOADER IA */}
      {generandoIA && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center max-w-sm mx-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Generando actividades
            </h3>
            <p className="text-slate-600 text-center">
              La IA está creando actividades personalizadas. Por favor espera...
            </p>
          </div>
        </div>
      )}

      {/* VERSIÓN MÓVIL */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 animate-fadeIn p-4">
        {/* Header móvil */}
        <div className="mb-5">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate("/docente/menu/lecturas")}
              className="p-2 hover:bg-white/80 rounded-lg transition-all shadow-sm bg-white"
            >
              <MdArrowBack size={20} className="text-slate-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-900">Actividades</h1>
              <p className="text-sm text-slate-600">{actividades.length} actividades</p>
            </div>
          </div>

          {/* Botones de acción móvil */}
          <div className="flex gap-2">
            <button
              onClick={handleGenerarIA}
              disabled={generandoIA}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white font-semibold shadow-lg hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 transition-all disabled:opacity-50"
            >
              <MdSmartToy size={20} />
              Generar con IA
            </button>
            <button
              onClick={mostrarAyuda}
              className="p-3 rounded-xl bg-white border-2 border-purple-200 text-purple-600 hover:bg-purple-50 transition-all shadow-sm"
              title="Ayuda"
            >
              <MdHelpOutline size={22} />
            </button>
          </div>
        </div>

        {/* Contenido móvil */}
        {actividades.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-slate-200">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MdQuiz size={32} className="text-purple-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              No hay actividades
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Genera actividades automáticamente con IA
            </p>
            <button
              onClick={handleGenerarIA}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white rounded-lg font-semibold shadow-lg"
            >
              <MdSmartToy size={18} />
              Generar con IA
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {actividades.map((actividad) => (
              <div
                key={actividad.id}
                className="bg-white rounded-xl shadow-sm p-4 border border-slate-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      {actividad.titulo}
                    </h3>
                    {actividad.descripcion && (
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {actividad.descripcion}
                      </p>
                    )}
                  </div>
                  
                  {actividad.configuracion?.generado_por_ia && (
                    <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full flex items-center gap-1 whitespace-nowrap">
                      <MdSmartToy size={12} />
                      IA
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-wrap gap-2 mb-3 text-xs">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md font-semibold">
                    {actividad.preguntas?.length || 0} preguntas
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-semibold">
                    {actividad.puntos_maximos} puntos
                  </span>
                  {actividad.tiempo_estimado && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md font-semibold">
                      ⏱️ {actividad.tiempo_estimado} min
                    </span>
                  )}
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md font-semibold">
                    {"★".repeat(actividad.dificultad || 1)}
                    {"☆".repeat(5 - (actividad.dificultad || 1))}
                  </span>
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerDetalle(actividad.id)}
                    className="flex-1 px-3 py-2 bg-violet-500 text-white rounded-lg text-xs font-semibold hover:bg-violet-600 transition flex items-center justify-center gap-1"
                  >
                    <MdEdit size={14} />
                    Ver/Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(actividad)}
                    className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all shadow-sm"
                  >
                    <MdDelete size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VERSIÓN DESKTOP */}
      <div className="hidden md:block min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 animate-fadeIn p-6">
        {/* Header desktop */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/docente/menu/lecturas")}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                <MdArrowBack size={24} className="text-slate-600" />
              </button>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-600 text-white flex items-center justify-center shadow-lg">
                <MdQuiz size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Actividades de la Lectura</h1>
                <p className="text-sm text-slate-600">
                  Gestiona y genera actividades automáticamente
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={mostrarAyuda}
                className="p-3 rounded-xl bg-white border-2 border-purple-200 text-purple-600 hover:bg-purple-50 transition-all shadow-sm"
                title="¿Qué hace el botón de IA?"
              >
                <MdHelpOutline size={24} />
              </button>
              <button
                onClick={handleGenerarIA}
                disabled={generandoIA}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white rounded-xl font-semibold shadow-lg hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 transition-all disabled:opacity-50"
              >
                <MdSmartToy size={22} />
                Generar con IA
              </button>
            </div>
          </div>
        </div>

        {/* Contenido desktop */}
        {actividades.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-slate-200">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdQuiz size={40} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No hay actividades para esta lectura
            </h3>
            <p className="text-slate-500 mb-6">
              Genera actividades automáticamente usando Inteligencia Artificial
            </p>
            <button
              onClick={handleGenerarIA}
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white rounded-xl font-semibold shadow-lg hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 transition-all"
            >
              <MdSmartToy size={20} />
              Generar Primera Actividad con IA
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actividades.map((actividad) => (
              <div
                key={actividad.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-lg hover:border-purple-200 transition-all"
              >
                {/* Header de la card */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900 mb-1">
                      {actividad.titulo}
                    </h3>
                    {actividad.descripcion && (
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {actividad.descripcion}
                      </p>
                    )}
                  </div>
                  
                  {actividad.configuracion?.generado_por_ia && (
                    <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full flex items-center gap-1">
                      <MdSmartToy size={14} />
                      IA
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MdQuiz size={16} className="text-purple-500" />
                    <span><strong>{actividad.preguntas?.length || 0}</strong> preguntas</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MdCheckCircle size={16} className="text-blue-500" />
                    <span><strong>{actividad.puntos_maximos}</strong> puntos máx.</span>
                  </div>
                  {actividad.tiempo_estimado && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <span>⏱️</span>
                      <span><strong>{actividad.tiempo_estimado}</strong> minutos</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Dificultad:</span>
                    <span className="text-sm text-orange-500 font-bold">
                      {"★".repeat(actividad.dificultad || 1)}
                      {"☆".repeat(5 - (actividad.dificultad || 1))}
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleVerDetalle(actividad.id)}
                    className="flex-1 bg-violet-500 hover:bg-violet-600 text-white px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-all shadow-sm"
                  >
                    <MdEdit size={16} />
                    Ver/Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(actividad)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm hover:scale-105"
                    title="Eliminar"
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
