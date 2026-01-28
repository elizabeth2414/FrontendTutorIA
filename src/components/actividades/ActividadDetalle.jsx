import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  obtenerActividadIA,
  actualizarActividad,
  eliminarPregunta,
} from "../../services/iaActividadesService";

import {
  MdArrowBack,
  MdEdit,
  MdSave,
  MdDelete,
  MdClose,
  MdQuiz,
  MdCheckCircle,
  MdSmartToy,
  MdTimer,
  MdStar,
  MdHelp,
} from "react-icons/md";

export default function ActividadDetalle() {
  const { actividadId } = useParams();
  const navigate = useNavigate();

  const [actividad, setActividad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  
  const [formActividad, setFormActividad] = useState({
    titulo: "",
    descripcion: "",
    dificultad: 1,
    tiempo_estimado: 0,
    puntos_maximos: 0,
  });

  const [errors, setErrors] = useState({
    titulo: "",
    dificultad: "",
    tiempo_estimado: "",
    puntos_maximos: "",
  });

  useEffect(() => {
    cargarActividad();
  }, [actividadId]);

  const cargarActividad = async () => {
    try {
      setLoading(true);
      const data = await obtenerActividadIA(actividadId);
      setActividad(data);
      setFormActividad({
        titulo: data.titulo,
        descripcion: data.descripcion || "",
        dificultad: data.dificultad || 1,
        tiempo_estimado: data.tiempo_estimado || 0,
        puntos_maximos: data.puntos_maximos || 0,
      });
    } catch (err) {
      console.error("Error cargando actividad:", err);
      
      await Swal.fire({
        title: "Error",
        text: "No se pudo cargar la actividad. Intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
      
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // VALIDACIONES
  // ==========================================================
  const validateField = (name, value) => {
    let msg = "";

    if (name === "titulo") {
      if (!value || value.trim().length === 0) {
        msg = "El título es obligatorio.";
      } else if (value.trim().length < 3) {
        msg = "El título debe tener al menos 3 caracteres.";
      } else if (value.trim().length > 200) {
        msg = "El título no puede exceder 200 caracteres.";
      }
    }

    if (name === "dificultad") {
      const num = Number(value);
      if (isNaN(num) || num < 1 || num > 5) {
        msg = "La dificultad debe estar entre 1 y 5.";
      }
    }

    if (name === "tiempo_estimado") {
      const num = Number(value);
      if (isNaN(num) || num < 0) {
        msg = "El tiempo estimado no puede ser negativo.";
      } else if (num > 300) {
        msg = "El tiempo estimado no puede exceder 300 minutos.";
      }
    }

    if (name === "puntos_maximos") {
      const num = Number(value);
      if (isNaN(num) || num < 0) {
        msg = "Los puntos no pueden ser negativos.";
      } else if (num > 1000) {
        msg = "Los puntos no pueden exceder 1000.";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: msg }));
    return msg === "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validaciones especiales
    if (name === "dificultad") {
      const num = Number(value);
      if (num < 1 || num > 5) return;
    }

    if (name === "tiempo_estimado" || name === "puntos_maximos") {
      const num = Number(value);
      if (num < 0) return;
    }

    setFormActividad({ ...formActividad, [name]: value });
    validateField(name, value);
  };

  // ==========================================================
  // GUARDAR ACTIVIDAD
  // ==========================================================
  const handleGuardarActividad = async () => {
    // Validar todos los campos
    const tituloValido = validateField("titulo", formActividad.titulo);
    const dificultadValida = validateField("dificultad", formActividad.dificultad);
    const tiempoValido = validateField("tiempo_estimado", formActividad.tiempo_estimado);
    const puntosValidos = validateField("puntos_maximos", formActividad.puntos_maximos);

    if (!tituloValido || !dificultadValida || !tiempoValido || !puntosValidos) {
      await Swal.fire({
        title: "Error de validación",
        text: "Por favor corrige los errores antes de guardar.",
        icon: "warning",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    // Validación adicional
    if (!formActividad.titulo.trim()) {
      await Swal.fire({
        title: "Campo requerido",
        text: "El título es obligatorio.",
        icon: "warning",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    setGuardando(true);

    try {
      const payload = {
        titulo: formActividad.titulo.trim(),
        descripcion: formActividad.descripcion.trim(),
        dificultad: Number(formActividad.dificultad),
        tiempo_estimado: Number(formActividad.tiempo_estimado),
        puntos_maximos: Number(formActividad.puntos_maximos),
      };

      console.log("📤 Actualizando actividad:", payload);

      await actualizarActividad(actividadId, payload);

      await Swal.fire({
        title: "¡Actividad actualizada!",
        text: "Los cambios han sido guardados exitosamente",
        icon: "success",
        confirmButtonColor: "#9333ea",
        timer: 2000,
        showConfirmButton: false,
      });

      setEditando(false);
      await cargarActividad();
    } catch (err) {
      console.error("Error actualizando actividad:", err);
      
      let errorMsg = "Error al actualizar la actividad. Intenta nuevamente.";
      
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMsg = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          errorMsg = err.response.data.detail.map(e => e.msg).join(', ');
        }
      }

      await Swal.fire({
        title: "Error",
        text: errorMsg,
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    } finally {
      setGuardando(false);
    }
  };

  // ==========================================================
  // ELIMINAR PREGUNTA
  // ==========================================================
  const handleEliminarPregunta = async (pregunta) => {
    const confirm = await Swal.fire({
      title: "⚠️ ¿Eliminar Pregunta?",
      html: `
        <div style="text-align: left; padding: 1rem;">
          <p style="margin: 0 0 0.5rem 0; font-weight: bold; font-size: 16px;">
            ${pregunta.texto_pregunta}
          </p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
            <span style="padding: 0.25rem 0.5rem; background-color: #e9d5ff; color: #7e22ce; border-radius: 0.375rem; font-size: 12px;">
              ${pregunta.tipo_respuesta || 'Pregunta'}
            </span>
            <span style="padding: 0.25rem 0.5rem; background-color: #dbeafe; color: #1e40af; border-radius: 0.375rem; font-size: 12px;">
              ${pregunta.puntuacion || 0} puntos
            </span>
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
      await eliminarPregunta(pregunta.id);

      await Swal.fire({
        title: "¡Pregunta eliminada!",
        text: "La pregunta ha sido eliminada correctamente",
        icon: "success",
        confirmButtonColor: "#9333ea",
        timer: 2000,
        showConfirmButton: false,
      });

      await cargarActividad();
    } catch (err) {
      console.error("Error eliminando pregunta:", err);
      
      await Swal.fire({
        title: "Error",
        text: "No se pudo eliminar la pregunta. Intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    }
  };

  // ==========================================================
  // CANCELAR EDICIÓN
  // ==========================================================
  const handleCancelarEdicion = () => {
    setEditando(false);
    setFormActividad({
      titulo: actividad.titulo,
      descripcion: actividad.descripcion || "",
      dificultad: actividad.dificultad || 1,
      tiempo_estimado: actividad.tiempo_estimado || 0,
      puntos_maximos: actividad.puntos_maximos || 0,
    });
    setErrors({
      titulo: "",
      dificultad: "",
      tiempo_estimado: "",
      puntos_maximos: "",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando actividad...</p>
        </div>
      </div>
    );
  }

  if (!actividad) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50">
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-slate-200 max-w-md mx-4">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdQuiz size={40} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Actividad no encontrada
          </h3>
          <p className="text-slate-500 mb-6">
            No se pudo encontrar la actividad solicitada
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white rounded-xl font-semibold shadow-lg hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 transition-all"
          >
            <MdArrowBack size={20} />
            Volver
          </button>
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

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out;
        }
      `}</style>

      {/* VERSIÓN MÓVIL */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 animate-fadeIn p-4">
        {/* Header móvil */}
        <div className="mb-5">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/80 rounded-lg transition-all shadow-sm bg-white"
            >
              <MdArrowBack size={20} className="text-slate-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-900">Detalle de Actividad</h1>
              {actividad.configuracion?.generado_por_ia && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  <MdSmartToy size={12} />
                  Generada por IA
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info de la actividad móvil */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200 mb-4">
          {/* Título */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Título <span className="text-red-500">*</span>
            </label>
            {editando ? (
              <div>
                <input
                  type="text"
                  name="titulo"
                  value={formActividad.titulo}
                  onChange={handleChange}
                  disabled={guardando}
                  className={`w-full px-3 py-2 rounded-lg border-2 outline-none transition text-sm ${
                    errors.titulo
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  } disabled:bg-slate-50`}
                  placeholder="Título de la actividad"
                />
                {errors.titulo && (
                  <p className="text-red-600 text-xs mt-1">{errors.titulo}</p>
                )}
              </div>
            ) : (
              <h2 className="text-lg font-bold text-slate-900">{actividad.titulo}</h2>
            )}
          </div>

          {/* Descripción */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Descripción
            </label>
            {editando ? (
              <textarea
                name="descripcion"
                value={formActividad.descripcion}
                onChange={handleChange}
                disabled={guardando}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition text-sm resize-none disabled:bg-slate-50"
                placeholder="Descripción de la actividad (opcional)"
              />
            ) : (
              <p className="text-sm text-slate-600">
                {actividad.descripcion || "Sin descripción"}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            {/* Dificultad */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dificultad <span className="text-red-500">*</span>
              </label>
              {editando ? (
                <div>
                  <input
                    type="number"
                    name="dificultad"
                    min="1"
                    max="5"
                    value={formActividad.dificultad}
                    onChange={handleChange}
                    disabled={guardando}
                    className={`w-full px-3 py-2 rounded-lg border-2 outline-none transition text-sm ${
                      errors.dificultad
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-purple-500"
                    } disabled:bg-slate-50`}
                  />
                  {errors.dificultad && (
                    <p className="text-red-600 text-xs mt-1">{errors.dificultad}</p>
                  )}
                </div>
              ) : (
                <p className="text-orange-500 font-bold">
                  {"★".repeat(actividad.dificultad || 1)}
                  {"☆".repeat(5 - (actividad.dificultad || 1))}
                </p>
              )}
            </div>

            {/* Tiempo */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tiempo (min)
              </label>
              {editando ? (
                <div>
                  <input
                    type="number"
                    name="tiempo_estimado"
                    min="0"
                    value={formActividad.tiempo_estimado}
                    onChange={handleChange}
                    disabled={guardando}
                    className={`w-full px-3 py-2 rounded-lg border-2 outline-none transition text-sm ${
                      errors.tiempo_estimado
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-purple-500"
                    } disabled:bg-slate-50`}
                  />
                  {errors.tiempo_estimado && (
                    <p className="text-red-600 text-xs mt-1">{errors.tiempo_estimado}</p>
                  )}
                </div>
              ) : (
                <p className="text-slate-900 font-bold text-sm">
                  {actividad.tiempo_estimado || 0} min
                </p>
              )}
            </div>

            {/* Puntos */}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Puntos Máximos
              </label>
              {editando ? (
                <div>
                  <input
                    type="number"
                    name="puntos_maximos"
                    min="0"
                    value={formActividad.puntos_maximos}
                    onChange={handleChange}
                    disabled={guardando}
                    className={`w-full px-3 py-2 rounded-lg border-2 outline-none transition text-sm ${
                      errors.puntos_maximos
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-purple-500"
                    } disabled:bg-slate-50`}
                  />
                  {errors.puntos_maximos && (
                    <p className="text-red-600 text-xs mt-1">{errors.puntos_maximos}</p>
                  )}
                </div>
              ) : (
                <p className="text-slate-900 font-bold text-sm">
                  {actividad.puntos_maximos} pts
                </p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            {!editando ? (
              <button
                onClick={() => setEditando(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-lg font-semibold hover:bg-violet-600 transition"
              >
                <MdEdit size={18} />
                Editar Actividad
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleGuardarActividad}
                  disabled={guardando}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                  {guardando ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <MdSave size={18} />
                      Guardar
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancelarEdicion}
                  disabled={guardando}
                  className="px-4 py-2 bg-slate-400 text-white rounded-lg font-semibold hover:bg-slate-500 transition disabled:opacity-50"
                >
                  <MdClose size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Preguntas móvil */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-600 flex items-center justify-center">
              <MdHelp size={18} className="text-white" />
            </div>
            Preguntas ({actividad.preguntas?.length || 0})
          </h3>

          {actividad.preguntas && actividad.preguntas.length > 0 ? (
            <div className="space-y-3">
              {actividad.preguntas.map((pregunta, index) => (
                <div
                  key={pregunta.id}
                  className="border-2 border-slate-200 rounded-lg p-3 animate-slideInLeft"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                        {index + 1}
                      </div>
                      <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                        {pregunta.tipo_respuesta || 'Pregunta'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleEliminarPregunta(pregunta)}
                      className="p-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>

                  {/* Texto */}
                  <p className="text-sm font-semibold text-slate-900 mb-2">
                    {pregunta.texto_pregunta}
                  </p>

                  {/* Opciones */}
                  {pregunta.opciones && Array.isArray(pregunta.opciones) && (
                    <div className="space-y-1 mb-2">
                      {pregunta.opciones.map((opcion, idx) => {
                        const esCorrecta = opcion === pregunta.respuesta_correcta;
                        return (
                          <div
                            key={idx}
                            className={`text-xs px-2 py-1 rounded ${
                              esCorrecta
                                ? 'bg-green-50 text-green-800 font-semibold'
                                : 'bg-slate-50 text-slate-600'
                            }`}
                          >
                            {esCorrecta && '✓ '}{opcion}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Explicación */}
                  {pregunta.explicacion && (
                    <div className="p-2 bg-blue-50 rounded-lg mb-2">
                      <p className="text-xs text-blue-900">
                        <span className="font-semibold">💡 </span>
                        {pregunta.explicacion}
                      </p>
                    </div>
                  )}

                  {/* Puntuación */}
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MdCheckCircle size={12} />
                    {pregunta.puntuacion || 0} puntos
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MdQuiz size={32} className="text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">No hay preguntas en esta actividad</p>
            </div>
          )}
        </div>
      </div>

      {/* VERSIÓN DESKTOP */}
      <div className="hidden md:block min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 animate-fadeIn p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header desktop */}
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                <MdArrowBack size={24} className="text-slate-600" />
              </button>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-600 text-white flex items-center justify-center shadow-lg">
                <MdQuiz size={28} />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900">Detalle de Actividad</h1>
                {actividad.configuracion?.generado_por_ia && (
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    <MdSmartToy size={14} />
                    Generada por IA
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Info de la actividad desktop */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 mb-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Información de la Actividad
              </h2>

              {!editando ? (
                <button
                  onClick={() => setEditando(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-xl font-semibold hover:bg-violet-600 transition shadow-sm"
                >
                  <MdEdit size={18} />
                  Editar Actividad
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleGuardarActividad}
                    disabled={guardando}
                    className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition shadow-sm disabled:opacity-50"
                  >
                    {guardando ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <MdSave size={18} />
                        Guardar
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancelarEdicion}
                    disabled={guardando}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-400 text-white rounded-xl font-semibold hover:bg-slate-500 transition shadow-sm disabled:opacity-50"
                  >
                    <MdClose size={18} />
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Título <span className="text-red-500">*</span>
                </label>
                {editando ? (
                  <div>
                    <input
                      type="text"
                      name="titulo"
                      value={formActividad.titulo}
                      onChange={handleChange}
                      disabled={guardando}
                      className={`w-full px-4 py-2.5 rounded-xl border-2 outline-none transition ${
                        errors.titulo
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                      } disabled:bg-slate-50`}
                      placeholder="Título de la actividad"
                    />
                    {errors.titulo && (
                      <p className="text-red-600 text-xs mt-2">{errors.titulo}</p>
                    )}
                  </div>
                ) : (
                  <h3 className="text-2xl font-bold text-slate-900">{actividad.titulo}</h3>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Descripción
                </label>
                {editando ? (
                  <textarea
                    name="descripcion"
                    value={formActividad.descripcion}
                    onChange={handleChange}
                    disabled={guardando}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition resize-none disabled:bg-slate-50"
                    placeholder="Descripción de la actividad (opcional)"
                  />
                ) : (
                  <p className="text-slate-600">
                    {actividad.descripcion || "Sin descripción"}
                  </p>
                )}
              </div>

              {/* Grid de stats */}
              <div className="grid grid-cols-3 gap-4">
                {/* Dificultad */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Dificultad (1-5) <span className="text-red-500">*</span>
                  </label>
                  {editando ? (
                    <div>
                      <input
                        type="number"
                        name="dificultad"
                        min="1"
                        max="5"
                        value={formActividad.dificultad}
                        onChange={handleChange}
                        disabled={guardando}
                        className={`w-full px-4 py-2.5 rounded-xl border-2 outline-none transition ${
                          errors.dificultad
                            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                            : "border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                        } disabled:bg-slate-50`}
                      />
                      {errors.dificultad && (
                        <p className="text-red-600 text-xs mt-2">{errors.dificultad}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-2xl text-orange-500 font-bold">
                      {"★".repeat(actividad.dificultad || 1)}
                      {"☆".repeat(5 - (actividad.dificultad || 1))}
                    </p>
                  )}
                </div>

                {/* Tiempo */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tiempo estimado (min)
                  </label>
                  {editando ? (
                    <div>
                      <input
                        type="number"
                        name="tiempo_estimado"
                        min="0"
                        value={formActividad.tiempo_estimado}
                        onChange={handleChange}
                        disabled={guardando}
                        className={`w-full px-4 py-2.5 rounded-xl border-2 outline-none transition ${
                          errors.tiempo_estimado
                            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                            : "border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                        } disabled:bg-slate-50`}
                      />
                      {errors.tiempo_estimado && (
                        <p className="text-red-600 text-xs mt-2">{errors.tiempo_estimado}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-900 font-bold text-lg">
                      {actividad.tiempo_estimado || 0} min
                    </p>
                  )}
                </div>

                {/* Puntos */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Puntos máximos
                  </label>
                  {editando ? (
                    <div>
                      <input
                        type="number"
                        name="puntos_maximos"
                        min="0"
                        value={formActividad.puntos_maximos}
                        onChange={handleChange}
                        disabled={guardando}
                        className={`w-full px-4 py-2.5 rounded-xl border-2 outline-none transition ${
                          errors.puntos_maximos
                            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                            : "border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                        } disabled:bg-slate-50`}
                      />
                      {errors.puntos_maximos && (
                        <p className="text-red-600 text-xs mt-2">{errors.puntos_maximos}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-900 font-bold text-lg">
                      {actividad.puntos_maximos} pts
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preguntas desktop */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-600 flex items-center justify-center">
                <MdHelp size={22} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Preguntas ({actividad.preguntas?.length || 0})
              </h3>
            </div>

            {actividad.preguntas && actividad.preguntas.length > 0 ? (
              <div className="space-y-4">
                {actividad.preguntas.map((pregunta, index) => (
                  <div
                    key={pregunta.id}
                    className="border-2 border-slate-200 rounded-xl p-5 hover:border-purple-200 hover:shadow-lg transition-all animate-slideInLeft"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-600 text-white flex items-center justify-center font-bold shadow-lg">
                          {index + 1}
                        </div>
                        <div>
                          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-lg font-semibold">
                            {pregunta.tipo_respuesta || 'Pregunta'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleEliminarPregunta(pregunta)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition hover:scale-105"
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>

                    {/* Texto */}
                    <p className="text-lg font-semibold text-slate-900 mb-4">
                      {pregunta.texto_pregunta}
                    </p>

                    {/* Opciones */}
                    {pregunta.opciones && Array.isArray(pregunta.opciones) && (
                      <div className="grid grid-cols-1 gap-2 mb-4">
                        {pregunta.opciones.map((opcion, idx) => {
                          const esCorrecta = opcion === pregunta.respuesta_correcta;
                          return (
                            <div
                              key={idx}
                              className={`px-4 py-3 rounded-xl border-2 transition ${
                                esCorrecta
                                  ? 'bg-green-50 border-green-300'
                                  : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`font-bold ${
                                  esCorrecta ? 'text-green-600' : 'text-slate-600'
                                }`}>
                                  {String.fromCharCode(65 + idx)}.
                                </span>
                                <span className={`flex-1 ${
                                  esCorrecta ? 'text-green-900 font-semibold' : 'text-slate-700'
                                }`}>
                                  {opcion}
                                </span>
                                {esCorrecta && (
                                  <MdCheckCircle size={20} className="text-green-600" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Explicación */}
                    {pregunta.explicacion && (
                      <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl mb-3">
                        <p className="text-sm font-semibold text-blue-800 mb-1 flex items-center gap-2">
                          <span className="text-lg">💡</span>
                          Explicación:
                        </p>
                        <p className="text-sm text-blue-900">{pregunta.explicacion}</p>
                      </div>
                    )}

                    {/* Puntuación */}
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MdCheckCircle size={16} />
                      Puntuación: <span className="font-bold text-slate-900">{pregunta.puntuacion || 0} puntos</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MdQuiz size={40} className="text-slate-400" />
                </div>
                <p className="text-slate-500 text-lg">No hay preguntas en esta actividad</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
