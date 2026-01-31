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

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { lectura } = location.state || {};

  // ==========================
  // CARGAR ACTIVIDAD
  // ==========================
  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const data = await obtenerActividadDetalle(actividadId);
        setActividad(data);

        const respuestasIniciales = {};
        data.preguntas.forEach((p) => {
          respuestasIniciales[p.id] = "";
        });
        setRespuestas(respuestasIniciales);
      } catch (error) {
        console.error("Error cargando actividad:", error);
        setErrorMessage("Error al cargar la actividad. Por favor vuelve e inténtalo.");
        setShowErrorModal(true);
        setTimeout(() => navigate(-1), 2500);
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
    setRespuestas((prev) => ({ ...prev, [preguntaId]: valor }));
  };

  // ==========================
  // ENVIAR RESPUESTAS — con fix del 500
  // ==========================
  const handleEnviarClick = () => {
    const pendientes = actividad.preguntas.filter((p) => {
      const val = respuestas[p.id];
      // texto_libre: también valida que no sea solo espacios
      if (p.tipo_respuesta === "texto_libre") return !val || !val.trim();
      return !val;
    });

    if (pendientes.length > 0) {
      setErrorMessage(`Faltan ${pendientes.length} pregunta${pendientes.length !== 1 ? "s" : ""} por responder.`);
      setShowErrorModal(true);
      return;
    }
    setShowConfirmModal(true);
  };

  const handleEnviarConfirmado = async () => {
    setShowConfirmModal(false);

    try {
      setEnviando(true);

      // ─── FIX 1: parsear IDs con parseInt y validar que no sean NaN ───
      const estudianteId = parseInt(hijoId, 10);
      const actividadIdNum = parseInt(actividadId, 10);

      if (isNaN(estudianteId) || isNaN(actividadIdNum)) {
        setErrorMessage("Error interno: IDs inválidos. Por favor vuelve y reintentar.");
        setShowErrorModal(true);
        return;
      }

      const tiempoTotal = Math.max(1, Math.round((Date.now() - tiempoInicio) / 1000));

      // ─── FIX 2: parseInt en pregunta_id + trim en texto_libre ───
      const respuestasPayload = actividad.preguntas.map((p) => {
        let valor = respuestas[p.id] || "";
        // Si es texto libre, trimear espacios
        if (p.tipo_respuesta === "texto_libre") valor = valor.trim();
        return {
          pregunta_id: parseInt(p.id, 10),   // ← parseInt aquí resuelve el 500
          respuesta_estudiante: valor,
        };
      });

      // ─── FIX 3: validar que ningún pregunta_id sea NaN ───
      const idInvalido = respuestasPayload.find((r) => isNaN(r.pregunta_id));
      if (idInvalido) {
        setErrorMessage("Error interno: pregunta con ID inválido. Por favor recarga la página.");
        setShowErrorModal(true);
        return;
      }

      const payload = {
        estudiante_id: estudianteId,
        actividad_id: actividadIdNum,
        respuestas: respuestasPayload,
        tiempo_total: tiempoTotal,
      };

      console.log("📤 Payload enviado:", JSON.stringify(payload, null, 2));

      const resultado = await enviarRespuestasActividad(payload);
      setResultado(resultado);
      console.log("✅ Resultado:", resultado);

    } catch (error) {
      console.error("❌ Error:", error);
      console.error("❌ Response data:", error.response?.data);

      let mensajeError = "Error al enviar las respuestas. Intenta de nuevo.";

      // Duplicada
      const detail = error.response?.data?.detail || "";
      if (
        detail.includes("llave duplicada") ||
        detail.includes("UniqueViolation") ||
        detail.includes("Ya existe la llave") ||
        detail.includes("ya completada")
      ) {
        mensajeError = "Ya completaste esta actividad anteriormente. Selecciona otra actividad para practicar más.";
        setErrorMessage(mensajeError);
        setShowErrorModal(true);
        setTimeout(() => navigate("/padre/menu/actividades"), 3000);
        return;
      }

      // Otros errores del server
      if (detail) mensajeError = detail;
      else if (error.response?.data?.message) mensajeError = error.response.data.message;
      else if (error.response?.status === 500) mensajeError = "Error en el servidor (500). Por favor contacta al administrador.";
      else if (error.message) mensajeError = error.message;

      setErrorMessage(mensajeError);
      setShowErrorModal(true);
    } finally {
      setEnviando(false);
    }
  };

  // ==========================
  // MODAL CONFIRMACIÓN
  // ==========================
  const ModalConfirmacion = () => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <MdWarning className="text-emerald-600" size={22} />
          </div>
          <h3 className="text-base font-bold text-slate-900">¿Enviar respuestas?</h3>
        </div>
        <p className="text-sm text-slate-500 mb-5">
          Una vez enviadas no podrás cambiarlas. ¿Estás seguro?
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowConfirmModal(false)}
            className="flex-1 px-4 py-2.5 bg-slate-100 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleEnviarConfirmado}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20 transition"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );

  // ==========================
  // MODAL ERROR
  // ==========================
  const ModalError = () => {
    const isDuplicate = errorMessage.includes("Ya completaste");
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDuplicate ? "bg-amber-50 border border-amber-200" : "bg-rose-50 border border-rose-200"}`}>
                {isDuplicate ? <MdWarning className="text-amber-600" size={22} /> : <MdCancel className="text-rose-600" size={22} />}
              </div>
              <h3 className="text-base font-bold text-slate-900">{isDuplicate ? "Actividad completada" : "Error"}</h3>
            </div>
            <button onClick={() => setShowErrorModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition">
              <MdClose size={20} className="text-slate-400" />
            </button>
          </div>
          <p className="text-sm text-slate-600 mb-4">{errorMessage}</p>
          <div className={`rounded-xl p-3 mb-5 ${isDuplicate ? "bg-emerald-50 border border-emerald-200" : "bg-slate-50 border border-slate-200"}`}>
            <p className={`text-xs ${isDuplicate ? "text-emerald-700" : "text-slate-600"}`}>
              💡 {isDuplicate ? "Selecciona otra actividad para seguir practicando." : "Si el problema persiste, recarga la página e inténtalo de nuevo."}
            </p>
          </div>
          <div className="flex gap-3">
            {isDuplicate ? (
              <>
                <button onClick={() => navigate("/padre/menu/actividades")} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20">
                  Ver Actividades
                </button>
                <button onClick={() => navigate(`/padre/menu/hijos/${hijoId}/aventura`)} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl font-bold text-sm shadow-md shadow-violet-500/20">
                  Mi Aventura
                </button>
              </>
            ) : (
              <button onClick={() => setShowErrorModal(false)} className="w-full px-4 py-2.5 bg-rose-500 text-white rounded-xl font-bold text-sm shadow-md shadow-rose-500/20">
                Cerrar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Preparando actividad...</p>
        </div>
      </div>
    );
  }

  // ==========================
  // SIN ACTIVIDAD
  // ==========================
  if (!actividad) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
            <MdCancel className="text-rose-600" size={28} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Actividad no encontrada</h2>
          <p className="text-sm text-slate-500 mb-5">No pudimos cargar esta actividad.</p>
          <button onClick={() => navigate(-1)} className="w-full px-6 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20">
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
    const porcentaje = resultado.puntos_maximos > 0
      ? Math.round((resultado.puntos_obtenidos / resultado.puntos_maximos) * 100)
      : 0;

    const mensaje =
      porcentaje >= 80 ? "¡Excelente trabajo! 🌟"
      : porcentaje >= 60 ? "¡Bien hecho! 💪"
      : "¡Sigue practicando! 📚";

    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Fredoka:wght@500;600;700&display=swap');
          * { font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif; }
          h1,h2,h3,h4,h5,h6 { font-family: 'Fredoka', 'Poppins', sans-serif; }
          @keyframes popIn { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
          .anim-pop { animation: popIn 0.5s cubic-bezier(.34,1.56,.64,1) forwards; }
        `}</style>

        {/* MÓVIL — Resultados */}
        <div className="md:hidden min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
          <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center space-y-5">

            <div className="anim-pop">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <MdEmojiEvents size={40} className="text-white" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-emerald-700">¡Completado!</h1>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                <p className="text-emerald-600 font-bold uppercase tracking-wide" style={{ fontSize: "9px" }}>Correctas</p>
                <p className="text-xl font-bold text-emerald-700 mt-0.5">{resultado.respuestas_correctas}</p>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
                <p className="text-rose-600 font-bold uppercase tracking-wide" style={{ fontSize: "9px" }}>Incorrectas</p>
                <p className="text-xl font-bold text-rose-700 mt-0.5">{resultado.respuestas_incorrectas}</p>
              </div>
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 text-center">
                <p className="text-violet-600 font-bold uppercase tracking-wide" style={{ fontSize: "9px" }}>Puntos</p>
                <p className="text-xl font-bold text-violet-700 mt-0.5">{resultado.puntos_obtenidos}/{resultado.puntos_maximos}</p>
              </div>
            </div>

            {/* Barra progreso */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
                <span>Porcentaje de acierto</span>
                <span className="text-emerald-600 text-sm">{porcentaje}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 transition-all duration-1000 rounded-full" style={{ width: `${porcentaje}%` }} />
              </div>
            </div>

            {/* XP */}
            {resultado.xp_ganado > 0 && (
              <div className="bg-gradient-to-r from-violet-50 to-violet-100 border border-violet-200 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-0.5">
                  <MdStars className="text-violet-500" size={22} />
                  <h3 className="text-xl font-bold text-violet-700">+{resultado.xp_ganado} XP</h3>
                </div>
                <p className="text-xs text-violet-500">¡Sumado a tu aventura! 🎮</p>
              </div>
            )}

            {/* Mensaje */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-sm text-amber-800 font-bold">{mensaje}</p>
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-3">
              <button onClick={() => navigate(`/padre/menu/hijos/${hijoId}/aventura`)} className="w-full py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl font-bold text-sm shadow-md shadow-violet-500/20 active:scale-95 transition-all">
                Ver Mi Aventura
              </button>
              <button onClick={() => navigate("/padre/menu/actividades")} className="w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20 active:scale-95 transition-all">
                Más Actividades
              </button>
            </div>
          </div>
        </div>

        {/* DESKTOP — Resultados */}
        <div className="hidden md:flex min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 items-center justify-center p-6">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center space-y-6">

            <div className="anim-pop">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/30">
                <MdEmojiEvents size={48} className="text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-emerald-700">¡Actividad Completada!</h1>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <p className="text-emerald-600 font-bold uppercase tracking-wide" style={{ fontSize: "10px" }}>Correctas</p>
                <p className="text-3xl font-bold text-emerald-700 mt-1">{resultado.respuestas_correctas}</p>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center">
                <p className="text-rose-600 font-bold uppercase tracking-wide" style={{ fontSize: "10px" }}>Incorrectas</p>
                <p className="text-3xl font-bold text-rose-700 mt-1">{resultado.respuestas_incorrectas}</p>
              </div>
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 text-center">
                <p className="text-violet-600 font-bold uppercase tracking-wide" style={{ fontSize: "10px" }}>Puntos</p>
                <p className="text-3xl font-bold text-violet-700 mt-1">{resultado.puntos_obtenidos}/{resultado.puntos_maximos}</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold text-slate-500 mb-2">
                <span>Porcentaje de acierto</span>
                <span className="text-emerald-600 text-xl">{porcentaje}%</span>
              </div>
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 transition-all duration-1000 rounded-full" style={{ width: `${porcentaje}%` }} />
              </div>
            </div>

            {resultado.xp_ganado > 0 && (
              <div className="bg-gradient-to-r from-violet-50 to-violet-100 border border-violet-200 rounded-xl p-5">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <MdStars className="text-violet-500" size={28} />
                  <h3 className="text-2xl font-bold text-violet-700">+{resultado.xp_ganado} XP</h3>
                </div>
                <p className="text-sm text-violet-500">¡Sumado a tu aventura! 🎮</p>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-base text-amber-800 font-bold">{mensaje}</p>
            </div>

            <div className="flex gap-4">
              <button onClick={() => navigate(`/padre/menu/hijos/${hijoId}/aventura`)} className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl font-bold shadow-md shadow-violet-500/20 hover:shadow-lg transition-all">
                Ver Mi Aventura
              </button>
              <button onClick={() => navigate("/padre/menu/actividades")} className="flex-1 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-xl font-bold shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all">
                Más Actividades
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ==========================
  // PANTALLA PRINCIPAL — preguntas
  // ==========================
  const pregunta = actividad.preguntas[preguntaActual];
  const totalPreguntas = actividad.preguntas.length;
  const progreso = Math.round(((preguntaActual + 1) / totalPreguntas) * 100);
  const respuestasCompletadas = Object.values(respuestas).filter((r) => r && (typeof r === "string" ? r.trim() : r)).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Fredoka:wght@500;600;700&display=swap');
        * { font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif; }
        h1,h2,h3,h4,h5,h6 { font-family: 'Fredoka', 'Poppins', sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .anim-fade { animation: fadeUp 0.35s ease-out; }
      `}</style>

      {showConfirmModal && <ModalConfirmacion />}
      {showErrorModal && <ModalError />}

      {/* ============================================================
          📱 MÓVIL
          ============================================================ */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">

        {/* Header móvil */}
        <div className="bg-white rounded-b-2xl shadow-md px-4 pt-4 pb-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-3 transition-colors">
            <MdArrowBack size={16} />
            <span className="font-bold text-sm">Volver</span>
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-md shadow-emerald-500/20 flex-shrink-0">
              <MdQuiz size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-bold text-slate-900 truncate">{actividad.titulo}</h1>
              <p className="text-xs text-slate-500 truncate">{lectura?.titulo || "Actividad"}</p>
            </div>
          </div>

          {/* badges tiempo / puntos */}
          <div className="flex gap-2 mb-3">
            <div className="flex items-center gap-1.5 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg">
              <MdTimer className="text-teal-600" size={13} />
              <span className="text-xs font-bold text-teal-700">{actividad.tiempo_estimado || 10} min</span>
            </div>
            <div className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-lg">
              <MdStars className="text-violet-600" size={13} />
              <span className="text-xs font-bold text-violet-700">{actividad.puntos_maximos} pts</span>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-bold text-slate-500">Pregunta {preguntaActual + 1}/{totalPreguntas}</span>
              <span className="text-xs font-bold text-emerald-600">{progreso}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 transition-all duration-300 rounded-full" style={{ width: `${progreso}%` }} />
            </div>
          </div>
        </div>

        {/* Contenido móvil */}
        <main className="px-4 pt-5 pb-8 space-y-4 anim-fade" key={preguntaActual}>

          {/* Card pregunta */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm shadow-emerald-500/20">
                {preguntaActual + 1}
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-bold text-slate-900 leading-snug">{pregunta.texto_pregunta}</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {pregunta.tipo_respuesta === "multiple_choice" && "Selecciona una respuesta"}
                  {pregunta.tipo_respuesta === "verdadero_falso" && "Verdadero o Falso"}
                  {pregunta.tipo_respuesta === "texto_libre" && "Escribe tu respuesta"}
                </p>
              </div>
            </div>

            {/* Opciones */}
            <div className="space-y-2">
              {/* multiple_choice */}
              {pregunta.tipo_respuesta === "multiple_choice" &&
                pregunta.opciones?.map((opcion, idx) => {
                  const selected = respuestas[pregunta.id] === opcion;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleRespuesta(pregunta.id, opcion)}
                      className={`w-full text-left p-3 rounded-xl border-2 transition-all active:scale-[.97] ${
                        selected ? "border-emerald-500 bg-emerald-50 shadow-sm shadow-emerald-500/10" : "border-slate-200 hover:border-emerald-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          selected ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
                        }`}>
                          {selected && <MdCheckCircle className="text-white" size={14} />}
                        </div>
                        <span className="text-sm font-medium text-slate-800">{opcion}</span>
                      </div>
                    </button>
                  );
                })}

              {/* verdadero_falso */}
              {pregunta.tipo_respuesta === "verdadero_falso" && (
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: "verdadero", label: "Verdadero", Icon: MdCheckCircle, color: "emerald" },
                    { val: "falso", label: "Falso", Icon: MdCancel, color: "rose" },
                  ].map(({ val, label, Icon, color }) => {
                    const sel = respuestas[pregunta.id] === val;
                    return (
                      <button
                        key={val}
                        onClick={() => handleRespuesta(pregunta.id, val)}
                        className={`p-3 rounded-xl border-2 transition-all active:scale-95 ${
                          sel
                            ? color === "emerald" ? "border-emerald-500 bg-emerald-50" : "border-rose-500 bg-rose-50"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <Icon className={sel ? (color === "emerald" ? "text-emerald-600" : "text-rose-600") : "text-slate-300"} size={24} />
                          <span className="text-xs font-bold text-slate-700">{label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* texto_libre */}
              {pregunta.tipo_respuesta === "texto_libre" && (
                <textarea
                  value={respuestas[pregunta.id] || ""}
                  onChange={(e) => handleRespuesta(pregunta.id, e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none resize-none text-sm transition-all"
                  rows={3}
                />
              )}
            </div>
          </div>

          {/* Navegación */}
          <div className="flex justify-between gap-3">
            <button
              onClick={() => setPreguntaActual(Math.max(0, preguntaActual - 1))}
              disabled={preguntaActual === 0}
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm disabled:opacity-40 active:scale-95 transition-all shadow-sm"
            >
              ← Anterior
            </button>

            {preguntaActual < totalPreguntas - 1 ? (
              <button
                onClick={() => setPreguntaActual(preguntaActual + 1)}
                disabled={!respuestas[pregunta.id]}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-xl font-bold text-sm disabled:opacity-40 active:scale-95 transition-all shadow-md shadow-emerald-500/20"
              >
                Siguiente →
              </button>
            ) : (
              <button
                onClick={handleEnviarClick}
                disabled={enviando || respuestasCompletadas < totalPreguntas}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-xl font-bold text-sm disabled:opacity-40 active:scale-95 transition-all shadow-md shadow-emerald-500/20"
              >
                {enviando ? "Enviando..." : "Enviar ✓"}
              </button>
            )}
          </div>

          {/* Contador respuestas */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-500">Respondidas</span>
              <span className="text-sm font-bold text-emerald-600">{respuestasCompletadas} / {totalPreguntas}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 transition-all duration-300 rounded-full" style={{ width: `${(respuestasCompletadas / totalPreguntas) * 100}%` }} />
            </div>
          </div>
        </main>
      </div>

      {/* ============================================================
          🖥️  DESKTOP
          ============================================================ */}
      <div className="hidden md:block min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <main className="max-w-3xl mx-auto px-6 py-6 space-y-5">

          {/* Header desktop */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:text-emerald-600 flex items-center justify-center transition-all shadow-sm">
                  <MdArrowBack size={20} className="text-slate-500" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">{actividad.titulo}</h1>
                  <p className="text-sm text-slate-500">{lectura?.titulo || "Actividad de comprensión"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 px-4 py-2 rounded-xl">
                  <MdTimer className="text-teal-600" size={18} />
                  <span className="text-sm font-bold text-teal-700">{actividad.tiempo_estimado || 10} min</span>
                </div>
                <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 px-4 py-2 rounded-xl">
                  <MdStars className="text-violet-600" size={18} />
                  <span className="text-sm font-bold text-violet-700">{actividad.puntos_maximos} pts</span>
                </div>
              </div>
            </div>

            {/* Progress desktop */}
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-sm font-bold text-slate-500">Pregunta {preguntaActual + 1} de {totalPreguntas}</span>
                <span className="text-sm font-bold text-emerald-600">{progreso}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 transition-all duration-300 rounded-full" style={{ width: `${progreso}%` }} />
              </div>
            </div>
          </div>

          {/* Card pregunta desktop */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 anim-fade" key={preguntaActual}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-md shadow-emerald-500/20">
                {preguntaActual + 1}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 leading-snug">{pregunta.texto_pregunta}</h2>
                <p className="text-sm text-slate-400 mt-1">
                  {pregunta.tipo_respuesta === "multiple_choice" && "Selecciona la respuesta correcta"}
                  {pregunta.tipo_respuesta === "verdadero_falso" && "Indica si es verdadero o falso"}
                  {pregunta.tipo_respuesta === "texto_libre" && "Escribe tu respuesta"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* multiple_choice */}
              {pregunta.tipo_respuesta === "multiple_choice" &&
                pregunta.opciones?.map((opcion, idx) => {
                  const selected = respuestas[pregunta.id] === opcion;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleRespuesta(pregunta.id, opcion)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selected ? "border-emerald-500 bg-emerald-50 shadow-sm shadow-emerald-500/10" : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          selected ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
                        }`}>
                          {selected && <MdCheckCircle className="text-white" size={16} />}
                        </div>
                        <span className="font-medium text-slate-800">{opcion}</span>
                      </div>
                    </button>
                  );
                })}

              {/* verdadero_falso */}
              {pregunta.tipo_respuesta === "verdadero_falso" && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { val: "verdadero", label: "Verdadero", Icon: MdCheckCircle, color: "emerald" },
                    { val: "falso", label: "Falso", Icon: MdCancel, color: "rose" },
                  ].map(({ val, label, Icon, color }) => {
                    const sel = respuestas[pregunta.id] === val;
                    return (
                      <button
                        key={val}
                        onClick={() => handleRespuesta(pregunta.id, val)}
                        className={`p-5 rounded-xl border-2 transition-all ${
                          sel
                            ? color === "emerald" ? "border-emerald-500 bg-emerald-50 shadow-sm" : "border-rose-500 bg-rose-50 shadow-sm"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Icon className={sel ? (color === "emerald" ? "text-emerald-600" : "text-rose-600") : "text-slate-300"} size={30} />
                          <span className="text-base font-bold text-slate-700">{label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* texto_libre */}
              {pregunta.tipo_respuesta === "texto_libre" && (
                <textarea
                  value={respuestas[pregunta.id] || ""}
                  onChange={(e) => handleRespuesta(pregunta.id, e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none resize-none transition-all"
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
              className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold disabled:opacity-40 hover:border-slate-300 transition-all shadow-sm"
            >
              ← Anterior
            </button>

            {preguntaActual < totalPreguntas - 1 ? (
              <button
                onClick={() => setPreguntaActual(preguntaActual + 1)}
                disabled={!respuestas[pregunta.id]}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-xl font-bold disabled:opacity-40 shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all"
              >
                Siguiente →
              </button>
            ) : (
              <button
                onClick={handleEnviarClick}
                disabled={enviando || respuestasCompletadas < totalPreguntas}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-xl font-bold disabled:opacity-40 shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all"
              >
                {enviando ? "Enviando..." : "Enviar Respuestas ✓"}
              </button>
            )}
          </div>

          {/* Contador desktop */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500">Respondidas</span>
            <div className="flex items-center gap-4">
              <div className="w-40 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 transition-all duration-300 rounded-full" style={{ width: `${(respuestasCompletadas / totalPreguntas) * 100}%` }} />
              </div>
              <span className="text-sm font-bold text-emerald-600">{respuestasCompletadas} / {totalPreguntas}</span>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
