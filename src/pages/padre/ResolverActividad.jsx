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
} from "react-icons/md";
import { Capacitor } from "@capacitor/core";
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

  // Detectar si es móvil
  const isMobile = Capacitor.isNativePlatform();
  const platform = Capacitor.getPlatform(); // 'ios', 'android', 'web'

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
        alert("Error al cargar la actividad");
        navigate(-1);
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
  const handleEnviar = async () => {
    if (!confirm("¿Estás seguro de enviar tus respuestas?")) return;

    try {
      setEnviando(true);

      const tiempoTotal = Math.round((Date.now() - tiempoInicio) / 1000); // segundos

      const payload = {
        estudiante_id: parseInt(hijoId),
        actividad_id: parseInt(actividadId),
        respuestas: actividad.preguntas.map((p) => ({
          pregunta_id: p.id,
          respuesta_estudiante: respuestas[p.id] || "",
        })),
        tiempo_total: tiempoTotal,
      };

      const resultado = await enviarRespuestasActividad(payload);
      setResultado(resultado);

      console.log("✅ Resultado:", resultado);
    } catch (error) {
      console.error("Error enviando respuestas:", error);
      alert("Error al enviar las respuestas. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  // ==========================
  // PANTALLA DE CARGA MEJORADA
  // ==========================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          {/* Animación de carga mejorada */}
          <div className="relative">
            {/* Círculo exterior rotando */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            {/* Círculo interior pulsando */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full animate-pulse flex items-center justify-center">
                <MdQuiz className="text-white" size={32} />
              </div>
            </div>
          </div>

          {/* Texto de carga con animación */}
          <div className="mt-32 space-y-2">
            <h3 className="text-xl font-bold text-slate-700 animate-pulse">
              Preparando actividad...
            </h3>
            <div className="flex justify-center gap-1">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================
  // PANTALLA DE ERROR
  // ==========================
  if (!actividad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="text-center bg-white rounded-3xl p-8 shadow-2xl max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <MdCancel className="text-red-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Actividad no encontrada
          </h2>
          <p className="text-slate-600 mb-6">
            No pudimos cargar esta actividad
          </p>
          <button
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl transition"
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className={`w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center space-y-4 sm:space-y-6 ${isMobile ? 'max-w-md' : 'max-w-2xl'}`}>
          
          {/* TROFEO CON ANIMACIÓN */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl animate-bounce">
              <MdEmojiEvents size={isMobile ? 48 : 56} className="text-white" />
            </div>
            {/* Partículas decorativas */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
              <div className="absolute top-0 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute top-0 right-1/4 w-3 h-3 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: "0.3s" }}></div>
            </div>
          </div>

          <h1 className={`font-extrabold text-green-700 ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
            ¡Actividad Completada!
          </h1>

          {/* RESULTADOS - Más compacto en móvil */}
          <div className={`grid gap-3 sm:gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
              <p className="text-xs sm:text-sm text-blue-600 font-semibold uppercase">Correctas</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-700">{resultado.respuestas_correctas}</p>
            </div>
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
              <p className="text-xs sm:text-sm text-red-600 font-semibold uppercase">Incorrectas</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-700">{resultado.respuestas_incorrectas}</p>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
              <p className="text-xs sm:text-sm text-green-600 font-semibold uppercase">Puntos</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-700">
                {resultado.puntos_obtenidos}/{resultado.puntos_maximos}
              </p>
            </div>
          </div>

          {/* BARRA DE PROGRESO CON ANIMACIÓN */}
          <div>
            <div className="flex justify-between text-xs sm:text-sm font-semibold text-slate-600 mb-2">
              <span>Porcentaje de acierto</span>
              <span className="text-lg sm:text-xl text-green-600">{porcentaje}%</span>
            </div>
            <div className="w-full h-5 sm:h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-1000 ease-out"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
          </div>

          {/* XP GANADO */}
          {resultado.xp_ganado > 0 && (
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 border-2 border-purple-300 rounded-2xl p-4 sm:p-5 transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-center gap-3 mb-2">
                <MdStars className="text-purple-600 animate-spin" style={{ animationDuration: "3s" }} size={isMobile ? 28 : 32} />
                <h3 className={`font-bold text-purple-700 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                  +{resultado.xp_ganado} XP
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-purple-600">
                ¡Sumado a tu aventura! 🎮
              </p>
            </div>
          )}

          {/* MENSAJE MOTIVADOR */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
            <p className={`text-yellow-800 font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>
              {porcentaje >= 80
                ? "¡Excelente trabajo! Sigue así 🌟"
                : porcentaje >= 60
                ? "¡Bien hecho! Puedes mejorar 💪"
                : "¡No te rindas! Sigue practicando 📚"}
            </p>
          </div>

          {/* BOTONES - Stack en móvil, lado a lado en web */}
          <div className={`flex gap-3 sm:gap-4 ${isMobile ? 'flex-col' : 'flex-row'}`}>
            <button
              onClick={() => navigate(`/padre/menu/hijos/${hijoId}/aventura`)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              Ver Aventura
            </button>
            <button
              onClick={() => navigate(`/padre/menu/actividades`)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              Más Actividades
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================
  // PANTALLA PRINCIPAL DE ACTIVIDAD
  // ==========================
  const pregunta = actividad.preguntas[preguntaActual];
  const totalPreguntas = actividad.preguntas.length;
  const progreso = Math.round(((preguntaActual + 1) / totalPreguntas) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className={`${isMobile ? 'pt-4 px-4 pb-6' : 'pt-24 max-w-4xl mx-auto p-6'} space-y-4 sm:space-y-6`}>

        {/* HEADER - Más compacto en móvil */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
          <div className={`flex items-center mb-4 ${isMobile ? 'flex-col gap-3' : 'justify-between'}`}>
            
            {/* Título y botón volver */}
            <div className={`flex items-center gap-3 sm:gap-4 ${isMobile ? 'w-full' : ''}`}>
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-xl transition active:scale-90 flex-shrink-0"
              >
                <MdArrowBack size={isMobile ? 20 : 24} />
              </button>
              <div className="flex-1">
                <h1 className={`font-bold text-blue-700 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                  {actividad.titulo}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 truncate">
                  {lectura?.titulo || "Actividad de comprensión"}
                </p>
              </div>
            </div>

            {/* Badges de tiempo y puntos */}
            <div className={`flex items-center gap-2 sm:gap-4 ${isMobile ? 'w-full justify-between' : ''}`}>
              {actividad.tiempo_estimado && (
                <div className="flex items-center gap-1.5 sm:gap-2 bg-blue-50 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl border-2 border-blue-200">
                  <MdTimer className="text-blue-600" size={isMobile ? 16 : 20} />
                  <span className="text-xs sm:text-sm font-semibold text-blue-700">
                    {actividad.tiempo_estimado} min
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5 sm:gap-2 bg-purple-50 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl border-2 border-purple-200">
                <MdStars className="text-purple-600" size={isMobile ? 16 : 20} />
                <span className="text-xs sm:text-sm font-semibold text-purple-700">
                  {actividad.puntos_maximos} pts
                </span>
              </div>
            </div>
          </div>

          {/* BARRA DE PROGRESO */}
          <div>
            <div className="flex justify-between text-xs sm:text-sm font-semibold text-slate-600 mb-2">
              <span>
                Pregunta {preguntaActual + 1} de {totalPreguntas}
              </span>
              <span>{progreso}%</span>
            </div>
            <div className="w-full h-2.5 sm:h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>
        </div>

        {/* PREGUNTA ACTUAL */}
        <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg">
          <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className={`rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0 ${isMobile ? 'w-10 h-10 text-base' : 'w-12 h-12 text-lg'}`}>
              {preguntaActual + 1}
            </div>
            <div className="flex-1">
              <h2 className={`font-bold text-slate-800 mb-2 ${isMobile ? 'text-base' : 'text-xl'}`}>
                {pregunta.texto_pregunta}
              </h2>
              {pregunta.tipo_respuesta === "multiple_choice" && (
                <p className="text-xs sm:text-sm text-slate-500">
                  Selecciona la respuesta correcta
                </p>
              )}
              {pregunta.tipo_respuesta === "verdadero_falso" && (
                <p className="text-xs sm:text-sm text-slate-500">
                  Indica si es verdadero o falso
                </p>
              )}
            </div>
          </div>

          {/* OPCIONES DE RESPUESTA */}
          <div className="space-y-2.5 sm:space-y-3">
            {/* MULTIPLE CHOICE */}
            {pregunta.tipo_respuesta === "multiple_choice" &&
              pregunta.opciones?.map((opcion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRespuesta(pregunta.id, opcion)}
                  className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all active:scale-98 ${
                    respuestas[pregunta.id] === opcion
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        respuestas[pregunta.id] === opcion
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {respuestas[pregunta.id] === opcion && (
                        <MdCheckCircle className="text-white" size={isMobile ? 16 : 20} />
                      )}
                    </div>
                    <span className={`font-medium text-slate-700 ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {opcion}
                    </span>
                  </div>
                </button>
              ))}

            {/* VERDADERO/FALSO */}
            {pregunta.tipo_respuesta === "verdadero_falso" && (
              <div className={`grid gap-3 sm:gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <button
                  onClick={() => handleRespuesta(pregunta.id, "verdadero")}
                  className={`p-4 sm:p-5 rounded-xl border-2 transition-all active:scale-95 ${
                    respuestas[pregunta.id] === "verdadero"
                      ? "border-green-500 bg-green-50 shadow-md"
                      : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <MdCheckCircle
                      className={
                        respuestas[pregunta.id] === "verdadero"
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                      size={isMobile ? 28 : 32}
                    />
                    <span className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>
                      Verdadero
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => handleRespuesta(pregunta.id, "falso")}
                  className={`p-4 sm:p-5 rounded-xl border-2 transition-all active:scale-95 ${
                    respuestas[pregunta.id] === "falso"
                      ? "border-red-500 bg-red-50 shadow-md"
                      : "border-gray-200 hover:border-red-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <MdCancel
                      className={
                        respuestas[pregunta.id] === "falso"
                          ? "text-red-600"
                          : "text-gray-400"
                      }
                      size={isMobile ? 28 : 32}
                    />
                    <span className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>
                      Falso
                    </span>
                  </div>
                </button>
              </div>
            )}

            {/* TEXTO LIBRE */}
            {pregunta.tipo_respuesta === "texto_libre" && (
              <textarea
                value={respuestas[pregunta.id] || ""}
                onChange={(e) => handleRespuesta(pregunta.id, e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
                className={`w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none ${isMobile ? 'text-sm' : 'text-base'}`}
                rows={isMobile ? 3 : 4}
              />
            )}
          </div>
        </div>

        {/* NAVEGACIÓN - Responsive */}
        <div className="flex justify-between items-center gap-3">
          <button
            onClick={() => setPreguntaActual(Math.max(0, preguntaActual - 1))}
            disabled={preguntaActual === 0}
            className={`bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${isMobile ? 'px-4 py-2.5 text-sm' : 'px-6 py-3'}`}
          >
            ← Anterior
          </button>

          {preguntaActual < totalPreguntas - 1 ? (
            <button
              onClick={() =>
                setPreguntaActual(Math.min(totalPreguntas - 1, preguntaActual + 1))
              }
              disabled={!respuestas[pregunta.id]}
              className={`bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95 ${isMobile ? 'px-4 py-2.5 text-sm' : 'px-6 py-3'}`}
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={handleEnviar}
              disabled={enviando || Object.values(respuestas).some((r) => !r)}
              className={`bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95 ${isMobile ? 'px-5 py-2.5 text-sm' : 'px-8 py-3'}`}
            >
              {enviando ? "Enviando..." : "Enviar Respuestas ✓"}
            </button>
          )}
        </div>

        {/* INDICADOR DE RESPUESTAS COMPLETADAS */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className={`font-semibold text-slate-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Respuestas completadas:
            </span>
            <span className={`font-bold text-blue-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
              {Object.values(respuestas).filter((r) => r).length} / {totalPreguntas}
            </span>
          </div>
          
          {/* Mini barra de progreso en móvil */}
          {isMobile && (
            <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                style={{ width: `${(Object.values(respuestas).filter((r) => r).length / totalPreguntas) * 100}%` }}
              />
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
