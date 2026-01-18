// src/pages/padre/ResolverActividad.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  MdArrowBack,
  MdCheckCircle,
  MdCancel,
  MdQuiz,
  MdTimer,
  MdStars,
  MdEmojiEvents,
  MdWarning,
  MdClose,
} from "react-icons/md";
import { obtenerActividadDetalle, enviarRespuestasActividad } from "../../services/padresService";

export default function ResolverActividad() {
  const { hijoId, lecturaId, actividadId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [actividad, setActividad] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [tiempoInicio] = useState(Date.now());

  // Modales personalizados
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Datos pasados desde la vista anterior
  const { lectura, estudiante } = location.state || {};

  // ==========================
  // CARGAR ACTIVIDAD
  // ==========================
  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const data = await obtenerActividadDetalle(actividadId);
        setActividad(data);

        // Inicializar respuestas vacías
        const respuestasIniciales = {};
        data.preguntas.forEach((p) => {
          respuestasIniciales[p.id] = "";
        });
        setRespuestas(respuestasIniciales);
      } catch (error) {
        console.error("Error cargando actividad:", error);
        setErrorMessage("Error al cargar la actividad");
        setShowErrorModal(true);
        setTimeout(() => navigate(-1), 2000);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [actividadId, navigate]);

  // ==========================
  // MANEJAR RESPUESTAS
  // ==========================
  const handleRespuesta = (preguntaId, valor) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: valor,
    }));
  };

  // ==========================
  // ENVIAR RESPUESTAS
  // ==========================
  const handleEnviarClick = () => {
    // Validar que todas las preguntas tengan respuesta
    const respuestasPendientes = actividad.preguntas.filter(p => !respuestas[p.id]);
    
    if (respuestasPendientes.length > 0) {
      setErrorMessage(`Faltan ${respuestasPendientes.length} pregunta(s) por responder.`);
      setShowErrorModal(true);
      return;
    }
    
    setShowConfirmModal(true);
  };

  const handleEnviarConfirmado = async () => {
    setShowConfirmModal(false);
    
    try {
      setEnviando(true);

      const tiempoTotal = Math.round((Date.now() - tiempoInicio) / 1000);

      const payload = {
        estudiante_id: parseInt(hijoId),
        actividad_id: parseInt(actividadId),
        respuestas: actividad.preguntas.map((p) => ({
          pregunta_id: p.id,
          respuesta_estudiante: respuestas[p.id] || "",
        })),
        tiempo_total: tiempoTotal,
      };

      console.log("📤 Enviando payload:", JSON.stringify(payload, null, 2));
      console.log("📋 Detalles:", {
        hijoId,
        actividadId,
        totalPreguntas: actividad.preguntas.length,
        respuestasCompletas: Object.values(respuestas).filter(r => r).length,
        tiempoTotal: `${tiempoTotal} segundos`
      });

      const resultado = await enviarRespuestasActividad(payload);
      setResultado(resultado);

      console.log("✅ Resultado recibido:", resultado);
    } catch (error) {
      console.error("❌ Error completo:", error);
      console.error("❌ Error response:", error.response);
      console.error("❌ Error data:", error.response?.data);
      
      // Mostrar el error específico del servidor
      let mensajeError = "Error al enviar las respuestas. Intenta de nuevo.";
      
      // Detectar error de actividad duplicada
      if (error.response?.data?.detail && 
          (error.response.data.detail.includes("llave duplicada") || 
           error.response.data.detail.includes("UniqueViolation") ||
           error.response.data.detail.includes("Ya existe la llave"))) {
        mensajeError = "⚠️ Ya completaste esta actividad anteriormente. No puedes volver a enviar respuestas. Si quieres practicar más, selecciona otra actividad.";
        setErrorMessage(mensajeError);
        setShowErrorModal(true);
        
        // Después de 3 segundos, redirigir a actividades
        setTimeout(() => {
          navigate(`/padre/menu/actividades`);
        }, 3000);
        return;
      }
      
      if (error.response?.data?.detail) {
        mensajeError = error.response.data.detail;
      } else if (error.response?.data?.message) {
        mensajeError = error.response.data.message;
      } else if (error.response?.status === 500) {
        mensajeError = "Error en el servidor (500). Por favor contacta al administrador.";
      } else if (error.message) {
        mensajeError = error.message;
      }
      
      setErrorMessage(mensajeError);
      setShowErrorModal(true);
    } finally {
      setEnviando(false);
    }
  };

  // ==========================
  // MODAL DE CONFIRMACIÓN
  // ==========================
  const ModalConfirmacion = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <MdWarning className="text-blue-600" size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            ¿Enviar respuestas?
          </h3>
        </div>
        <p className="text-sm text-slate-600 mb-6">
          ¿Estás seguro de enviar tus respuestas? No podrás cambiarlas después.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowConfirmModal(false)}
            className="flex-1 px-4 py-2.5 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleEnviarConfirmado}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );

  // ==========================
  // MODAL DE ERROR
  // ==========================
  const ModalError = () => {
    const isDuplicateError = errorMessage.includes("Ya completaste esta actividad");
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isDuplicateError ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                {isDuplicateError ? (
                  <MdWarning className="text-yellow-600" size={24} />
                ) : (
                  <MdCancel className="text-red-600" size={24} />
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {isDuplicateError ? 'Actividad Completada' : 'Error'}
              </h3>
            </div>
            <button
              onClick={() => setShowErrorModal(false)}
              className="p-1 hover:bg-slate-100 rounded-lg transition"
            >
              <MdClose size={24} />
            </button>
          </div>
          <p className="text-sm text-slate-600 mb-4">{errorMessage}</p>
          
          {isDuplicateError ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-800">
                💡 <strong>Sugerencia:</strong> Selecciona otra actividad para seguir practicando.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-800">
                💡 <strong>Consejo:</strong> Revisa la consola del navegador para más detalles técnicos.
              </p>
            </div>
          )}
          
          <div className="flex gap-3">
            {isDuplicateError ? (
              <>
                <button
                  onClick={() => navigate(`/padre/menu/actividades`)}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Ver Actividades
                </button>
                <button
                  onClick={() => navigate(`/padre/menu/hijos/${hijoId}/aventura`)}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Mi Aventura
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==========================
  // PANTALLA DE CARGA
  // ==========================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Preparando actividad...</p>
        </div>
      </div>
    );
  }

  // ==========================
  // PANTALLA DE ERROR
  // ==========================
  if (!actividad) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white p-6">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-slate-200 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <MdCancel className="text-red-600" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Actividad no encontrada
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            No pudimos cargar esta actividad
          </p>
          <button
            onClick={() => navigate(-1)}
            className="w-full px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // ==========================
  // PANTALLA DE RESULTADOS
  // ==========================
  if (resultado) {
    const porcentaje = Math.round(
      (resultado.puntos_obtenidos / resultado.puntos_maximos) * 100
    );

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

        {/* VERSIÓN MÓVIL - RESULTADOS */}
        <div className="md:hidden min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
          <div className="w-full bg-white rounded-2xl shadow-xl p-6 text-center space-y-4">
            
            <div className="relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg animate-bounce">
                <MdEmojiEvents size={40} className="text-white" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-green-700">
              ¡Completado!
            </h1>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-[10px] text-blue-600 font-semibold uppercase">Correctas</p>
                <p className="text-xl font-bold text-blue-700">{resultado.respuestas_correctas}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-[10px] text-red-600 font-semibold uppercase">Incorrectas</p>
                <p className="text-xl font-bold text-red-700">{resultado.respuestas_incorrectas}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-[10px] text-green-600 font-semibold uppercase">Puntos</p>
                <p className="text-xl font-bold text-green-700">
                  {resultado.puntos_obtenidos}/{resultado.puntos_maximos}
                </p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
                <span>Porcentaje de acierto</span>
                <span className="text-lg text-green-600">{porcentaje}%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-1000"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>

            {resultado.xp_ganado > 0 && (
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-300 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <MdStars className="text-purple-600" size={24} />
                  <h3 className="text-xl font-bold text-purple-700">
                    +{resultado.xp_ganado} XP
                  </h3>
                </div>
                <p className="text-xs text-purple-600">
                  ¡Sumado a tu aventura! 🎮
                </p>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
              <p className="text-sm text-yellow-800 font-semibold">
                {porcentaje >= 80
                  ? "¡Excelente trabajo! 🌟"
                  : porcentaje >= 60
                  ? "¡Bien hecho! 💪"
                  : "¡Sigue practicando! 📚"}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate(`/padre/menu/hijos/${hijoId}/aventura`)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md active:scale-95 transition-all"
              >
                Ver Mi Aventura
              </button>
              <button
                onClick={() => navigate(`/padre/menu/actividades`)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold shadow-md active:scale-95 transition-all"
              >
                Más Actividades
              </button>
            </div>
          </div>
        </div>

        {/* VERSIÓN DESKTOP - RESULTADOS */}
        <div className="hidden md:flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 items-center justify-center p-6">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
            
            <div className="relative">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl animate-bounce">
                <MdEmojiEvents size={48} className="text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-green-700">
              ¡Actividad Completada!
            </h1>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                <p className="text-xs text-blue-600 font-semibold uppercase">Correctas</p>
                <p className="text-3xl font-bold text-blue-700">{resultado.respuestas_correctas}</p>
              </div>
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                <p className="text-xs text-red-600 font-semibold uppercase">Incorrectas</p>
                <p className="text-3xl font-bold text-red-700">{resultado.respuestas_incorrectas}</p>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
                <p className="text-xs text-green-600 font-semibold uppercase">Puntos</p>
                <p className="text-3xl font-bold text-green-700">
                  {resultado.puntos_obtenidos}/{resultado.puntos_maximos}
                </p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold text-slate-600 mb-2">
                <span>Porcentaje de acierto</span>
                <span className="text-xl text-green-600">{porcentaje}%</span>
              </div>
              <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-1000"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>

            {resultado.xp_ganado > 0 && (
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 border-2 border-purple-300 rounded-2xl p-5">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <MdStars className="text-purple-600" size={32} />
                  <h3 className="text-2xl font-bold text-purple-700">
                    +{resultado.xp_ganado} XP
                  </h3>
                </div>
                <p className="text-sm text-purple-600">
                  ¡Sumado a tu aventura! 🎮
                </p>
              </div>
            )}

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
              <p className="text-base text-yellow-800 font-semibold">
                {porcentaje >= 80
                  ? "¡Excelente trabajo! Sigue así 🌟"
                  : porcentaje >= 60
                  ? "¡Bien hecho! Puedes mejorar 💪"
                  : "¡No te rindas! Sigue practicando 📚"}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/padre/menu/hijos/${hijoId}/aventura`)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Ver Mi Aventura
              </button>
              <button
                onClick={() => navigate(`/padre/menu/actividades`)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Más Actividades
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ==========================
  // PANTALLA PRINCIPAL
  // ==========================
  const pregunta = actividad.preguntas[preguntaActual];
  const totalPreguntas = actividad.preguntas.length;
  const progreso = Math.round(((preguntaActual + 1) / totalPreguntas) * 100);

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

      {/* Modales */}
      {showConfirmModal && <ModalConfirmacion />}
      {showErrorModal && <ModalError />}

      {/* VERSIÓN MÓVIL */}
      <div className="md:hidden min-h-screen bg-white">
        {/* Header fijo móvil */}
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-4 shadow-lg z-30">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition"
            >
              <MdArrowBack size={20} className="text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-base font-bold text-white truncate">
                {actividad.titulo}
              </h1>
              <p className="text-xs text-blue-100 truncate">
                {lectura?.titulo || "Actividad"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-1.5 bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm">
              <MdTimer className="text-white" size={14} />
              <span className="text-xs font-semibold text-white">
                {actividad.tiempo_estimado || 10} min
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm">
              <MdStars className="text-white" size={14} />
              <span className="text-xs font-semibold text-white">
                {actividad.puntos_maximos} pts
              </span>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-xs font-semibold text-white/90 mb-1">
              <span>Pregunta {preguntaActual + 1}/{totalPreguntas}</span>
              <span>{progreso}%</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>
        </div>

        {/* Contenido móvil */}
        <main className="pt-40 px-4 pb-8 space-y-4">
          {/* Pregunta móvil */}
          <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {preguntaActual + 1}
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-slate-900 mb-1">
                  {pregunta.texto_pregunta}
                </h2>
                <p className="text-xs text-slate-500">
                  {pregunta.tipo_respuesta === "multiple_choice" && "Selecciona una respuesta"}
                  {pregunta.tipo_respuesta === "verdadero_falso" && "Verdadero o Falso"}
                  {pregunta.tipo_respuesta === "texto_libre" && "Escribe tu respuesta"}
                </p>
              </div>
            </div>

            {/* Opciones móvil */}
            <div className="space-y-2">
              {pregunta.tipo_respuesta === "multiple_choice" &&
                pregunta.opciones?.map((opcion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRespuesta(pregunta.id, opcion)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all active:scale-98 ${
                      respuestas[pregunta.id] === opcion
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          respuestas[pregunta.id] === opcion
                            ? "border-blue-500 bg-blue-500"
                            : "border-slate-300"
                        }`}
                      >
                        {respuestas[pregunta.id] === opcion && (
                          <MdCheckCircle className="text-white" size={16} />
                        )}
                      </div>
                      <span className="text-sm font-medium text-slate-800">
                        {opcion}
                      </span>
                    </div>
                  </button>
                ))}

              {pregunta.tipo_respuesta === "verdadero_falso" && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleRespuesta(pregunta.id, "verdadero")}
                    className={`p-3 rounded-lg border-2 transition-all active:scale-95 ${
                      respuestas[pregunta.id] === "verdadero"
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <MdCheckCircle
                        className={respuestas[pregunta.id] === "verdadero" ? "text-green-600" : "text-slate-400"}
                        size={24}
                      />
                      <span className="text-sm font-semibold">Verdadero</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRespuesta(pregunta.id, "falso")}
                    className={`p-3 rounded-lg border-2 transition-all active:scale-95 ${
                      respuestas[pregunta.id] === "falso"
                        ? "border-red-500 bg-red-50"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <MdCancel
                        className={respuestas[pregunta.id] === "falso" ? "text-red-600" : "text-slate-400"}
                        size={24}
                      />
                      <span className="text-sm font-semibold">Falso</span>
                    </div>
                  </button>
                </div>
              )}

              {pregunta.tipo_respuesta === "texto_libre" && (
                <textarea
                  value={respuestas[pregunta.id] || ""}
                  onChange={(e) => handleRespuesta(pregunta.id, e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none text-sm"
                  rows={3}
                />
              )}
            </div>
          </div>

          {/* Navegación móvil */}
          <div className="flex justify-between gap-3">
            <button
              onClick={() => setPreguntaActual(Math.max(0, preguntaActual - 1))}
              disabled={preguntaActual === 0}
              className="bg-slate-200 text-slate-700 rounded-lg font-semibold px-4 py-2.5 text-sm transition disabled:opacity-50 active:scale-95"
            >
              ← Anterior
            </button>

            {preguntaActual < totalPreguntas - 1 ? (
              <button
                onClick={() => setPreguntaActual(Math.min(totalPreguntas - 1, preguntaActual + 1))}
                disabled={!respuestas[pregunta.id]}
                className="bg-blue-600 text-white rounded-lg font-semibold px-4 py-2.5 text-sm transition disabled:opacity-50 shadow-md active:scale-95"
              >
                Siguiente →
              </button>
            ) : (
              <button
                onClick={handleEnviarClick}
                disabled={enviando || Object.values(respuestas).some((r) => !r)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold px-5 py-2.5 text-sm transition disabled:opacity-50 shadow-md active:scale-95"
              >
                {enviando ? "Enviando..." : "Enviar ✓"}
              </button>
            )}
          </div>

          {/* Contador móvil */}
          <div className="bg-white rounded-xl shadow-md p-3 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">
                Completadas:
              </span>
              <span className="text-sm font-bold text-blue-600">
                {Object.values(respuestas).filter((r) => r).length} / {totalPreguntas}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                style={{ width: `${(Object.values(respuestas).filter((r) => r).length / totalPreguntas) * 100}%` }}
              />
            </div>
          </div>
        </main>
      </div>

      {/* VERSIÓN DESKTOP */}
      <div className="hidden md:block min-h-screen bg-white pt-6">
        <main className="max-w-4xl mx-auto px-6 py-6 space-y-6">
          {/* Header desktop */}
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <MdArrowBack size={24} />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-blue-700">
                    {actividad.titulo}
                  </h1>
                  <p className="text-sm text-slate-600">
                    {lectura?.titulo || "Actividad de comprensión"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {actividad.tiempo_estimado && (
                  <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-200">
                    <MdTimer className="text-blue-600" size={20} />
                    <span className="text-sm font-semibold text-blue-700">
                      {actividad.tiempo_estimado} min
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-xl border border-purple-200">
                  <MdStars className="text-purple-600" size={20} />
                  <span className="text-sm font-semibold text-purple-700">
                    {actividad.puntos_maximos} pts
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold text-slate-600 mb-2">
                <span>Pregunta {preguntaActual + 1} de {totalPreguntas}</span>
                <span>{progreso}%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                  style={{ width: `${progreso}%` }}
                />
              </div>
            </div>
          </div>

          {/* Pregunta desktop */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                {preguntaActual + 1}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  {pregunta.texto_pregunta}
                </h2>
                <p className="text-sm text-slate-500">
                  {pregunta.tipo_respuesta === "multiple_choice" && "Selecciona la respuesta correcta"}
                  {pregunta.tipo_respuesta === "verdadero_falso" && "Indica si es verdadero o falso"}
                  {pregunta.tipo_respuesta === "texto_libre" && "Escribe tu respuesta"}
                </p>
              </div>
            </div>

            {/* Opciones desktop */}
            <div className="space-y-3">
              {pregunta.tipo_respuesta === "multiple_choice" &&
                pregunta.opciones?.map((opcion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRespuesta(pregunta.id, opcion)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      respuestas[pregunta.id] === opcion
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          respuestas[pregunta.id] === opcion
                            ? "border-blue-500 bg-blue-500"
                            : "border-slate-300"
                        }`}
                      >
                        {respuestas[pregunta.id] === opcion && (
                          <MdCheckCircle className="text-white" size={20} />
                        )}
                      </div>
                      <span className="font-medium text-slate-800">
                        {opcion}
                      </span>
                    </div>
                  </button>
                ))}

              {pregunta.tipo_respuesta === "verdadero_falso" && (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleRespuesta(pregunta.id, "verdadero")}
                    className={`p-5 rounded-xl border-2 transition-all ${
                      respuestas[pregunta.id] === "verdadero"
                        ? "border-green-500 bg-green-50 shadow-md"
                        : "border-slate-200 hover:border-green-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <MdCheckCircle
                        className={respuestas[pregunta.id] === "verdadero" ? "text-green-600" : "text-slate-400"}
                        size={32}
                      />
                      <span className="text-lg font-semibold">Verdadero</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRespuesta(pregunta.id, "falso")}
                    className={`p-5 rounded-xl border-2 transition-all ${
                      respuestas[pregunta.id] === "falso"
                        ? "border-red-500 bg-red-50 shadow-md"
                        : "border-slate-200 hover:border-red-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <MdCancel
                        className={respuestas[pregunta.id] === "falso" ? "text-red-600" : "text-slate-400"}
                        size={32}
                      />
                      <span className="text-lg font-semibold">Falso</span>
                    </div>
                  </button>
                </div>
              )}

              {pregunta.tipo_respuesta === "texto_libre" && (
                <textarea
                  value={respuestas[pregunta.id] || ""}
                  onChange={(e) => handleRespuesta(pregunta.id, e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                  rows={4}
                />
              )}
            </div>
          </div>

          {/* Navegación desktop */}
          <div className="flex justify-between">
            <button
              onClick={() => setPreguntaActual(Math.max(0, preguntaActual - 1))}
              disabled={preguntaActual === 0}
              className="bg-slate-200 text-slate-700 rounded-lg font-semibold px-6 py-3 transition disabled:opacity-50"
            >
              ← Anterior
            </button>

            {preguntaActual < totalPreguntas - 1 ? (
              <button
                onClick={() => setPreguntaActual(Math.min(totalPreguntas - 1, preguntaActual + 1))}
                disabled={!respuestas[pregunta.id]}
                className="bg-blue-600 text-white rounded-lg font-semibold px-6 py-3 transition disabled:opacity-50 shadow-lg"
              >
                Siguiente →
              </button>
            ) : (
              <button
                onClick={handleEnviarClick}
                disabled={enviando || Object.values(respuestas).some((r) => !r)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold px-8 py-3 transition disabled:opacity-50 shadow-lg"
              >
                {enviando ? "Enviando..." : "Enviar Respuestas ✓"}
              </button>
            )}
          </div>

          {/* Contador desktop */}
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600">
                Respuestas completadas:
              </span>
              <span className="text-base font-bold text-blue-600">
                {Object.values(respuestas).filter((r) => r).length} / {totalPreguntas}
              </span>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
