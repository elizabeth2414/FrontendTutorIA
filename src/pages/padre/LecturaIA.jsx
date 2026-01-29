import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  analizarLecturaIA,
  obtenerTextoLectura,
  obtenerAudioLectura,
  practicarEjercicioIA,
} from "../../services/iaService";
import { getMisHijos, getLecturasHijo } from "../../services/padresService";
import ttsService from "../../services/ttsService";
import { MdMic, MdStop, MdUpload, MdPlayArrow, MdMenuBook, MdReplay } from "react-icons/md";
import ZonaPracticaIA from "../../components/lectura/ZonaPracticaIA";

export default function LecturaIAHijo() {
  const location = useLocation();

  // Estado general
  const [hijos, setHijos] = useState([]);
  const [hijoSeleccionado, setHijoSeleccionado] = useState(null);
  const [lecturas, setLecturas] = useState([]);
  const [lecturaSeleccionada, setLecturaSeleccionada] = useState(null);
  const [lectura, setLectura] = useState(null);

  // Audio lectura
  const [audioArchivo, setAudioArchivo] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
  const [grabando, setGrabando] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  // Resultado IA lectura
  const [resultado, setResultado] = useState(null);
  const [evaluacionId, setEvaluacionId] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Práctica
  const [ejercicioActivo, setEjercicioActivo] = useState(null);
  const [audioPractica, setAudioPractica] = useState(null);
  const [previewPractica, setPreviewPractica] = useState(null);
  const [grabandoPractica, setGrabandoPractica] = useState(false);
  const [mediaPractica, setMediaPractica] = useState(null);
  const [resultadoPractica, setResultadoPractica] = useState(null);
  const [cargandoPractica, setCargandoPractica] = useState(false);

  // ✅ UI (solo diseño)
  const [panelConfigAbierto, setPanelConfigAbierto] = useState(false);

  //  CARGAR DATOS INICIALES
  useEffect(() => {
    const cargarHijos = async () => {
      try {
        const data = await getMisHijos();
        const lista = Array.isArray(data) ? data : data.hijos || [];

        const hijosFormateados = lista.map((item) => {
          const est = item.estudiante || item;
          return {
            id: est.id,
            nombre: est.nombre || "",
            apellido: est.apellido || "",
          };
        });

        setHijos(hijosFormateados);

        // 🔥 AUTO-CARGAR SI VIENE DESDE OTRA VISTA
        const stateData = location.state;

        if (stateData?.estudianteId && stateData?.lectura) {
          const hijoEncontrado = hijosFormateados.find(
            (h) => h.id === Number(stateData.estudianteId)
          );

          if (hijoEncontrado) {
            setHijoSeleccionado(hijoEncontrado);

            try {
              const lecturasData = await getLecturasHijo(stateData.estudianteId);
              const lecturasLista = Array.isArray(lecturasData)
                ? lecturasData
                : lecturasData.lecturas || [];

              setLecturas(lecturasLista);

              // Auto-seleccionar lectura
              const lecturaInfo = stateData.lectura;
              setLecturaSeleccionada(lecturaInfo);

              // Cargar contenido completo
              setLectura({
                id: lecturaInfo.id,
                titulo: lecturaInfo.titulo,
                contenido: lecturaInfo.contenido,
                nivel_dificultad: lecturaInfo.nivel_dificultad,
                edad_recomendada: lecturaInfo.edad_recomendada,
              });
            } catch (error) {
              console.error("Error cargando lecturas:", error);
              setErrorMsg("No se pudieron cargar las lecturas del estudiante.");
            }
          }
        }
      } catch (error) {
        console.error("Error cargando hijos:", error);
        setErrorMsg("No se pudieron cargar los hijos del padre.");
      }
    };

    cargarHijos();
  }, []);

  const limpiarResultados = () => {
    setResultado(null);
    setEvaluacionId(null);
    setAudioArchivo(null);
    setAudioPreviewUrl(null);
    setEjercicioActivo(null);
    setAudioPractica(null);
    setPreviewPractica(null);
    setResultadoPractica(null);
    ttsService.stop();
  };

  // ==========================
  // Selección hijo
  // ==========================
  const manejarSeleccionHijo = async (e) => {
    const id = Number(e.target.value) || null;
    limpiarResultados();
    setLecturas([]);
    setLecturaSeleccionada(null);
    setLectura(null);

    if (!id) return;

    setHijoSeleccionado(hijos.find((h) => h.id === id));
    try {
      const data = await getLecturasHijo(id);
      setLecturas(Array.isArray(data) ? data : data.lecturas || []);
    } catch {
      setErrorMsg("No se pudieron cargar las lecturas del estudiante.");
    }
  };

  // ==========================
  // Selección lectura
  // ==========================
  const manejarSeleccionLectura = async (e) => {
    const id = Number(e.target.value) || null;
    limpiarResultados();
    if (!id) return;

    const info = lecturas.find((l) => l.id === id);
    setLecturaSeleccionada(info);

    try {
      const data = await obtenerTextoLectura(id);
      setLectura(data);
    } catch {
      setErrorMsg("No se pudo cargar el texto de la lectura.");
    }
  };

  // ==========================
  // ✅ TTS lectura
  // ==========================
  const manejarEscucharLectura = async () => {
    if (!lectura?.contenido) {
      setErrorMsg("No hay texto para leer.");
      return;
    }

    try {
      await ttsService.speak(lectura.contenido, {
        language: "es-ES",
        rate: 0.9,
        pitch: 1.1,
      });
    } catch (error) {
      console.error("Error al reproducir audio:", error);
      setErrorMsg("Error al reproducir el audio de la lectura.");
    }
  };

  // ==========================
  // ✅ Enviar lectura a IA (FIX: enviar cuando el blob exista)
  // ==========================
  const manejarEnviar = async (archivoParam = null) => {
    const archivoFinal = archivoParam || audioArchivo;

    if (!hijoSeleccionado || !lecturaSeleccionada) {
      setErrorMsg("Selecciona un estudiante y una lectura.");
      return;
    }
    if (!archivoFinal || archivoFinal.size < 100) {
      setErrorMsg("¡Ups! Parece que no se grabó nada. Intenta de nuevo. 🎤");
      return;
    }

    setCargando(true);
    setResultado(null);
    setErrorMsg("");

    try {
      const data = await analizarLecturaIA({
        estudianteId: hijoSeleccionado.id,
        contenidoId: lecturaSeleccionada.id,
        archivoAudio: archivoFinal,
        evaluacionId,
      });
      setResultado(data);
      if (data.evaluacion_id) setEvaluacionId(data.evaluacion_id);
    } catch (e) {
      setErrorMsg(
        e.message || "No pudimos escuchar bien el audio. Intenta grabar nuevamente."
      );
    } finally {
      setCargando(false);
    }
  };

  // ==========================
  // Grabación lectura (FIX: enviar en onstop)
  // ==========================
  const iniciarGrabacion = async () => {
    try {
      if (mediaRecorder?.state === "recording") mediaRecorder.stop();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 16000,
        },
      });

      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);

      // ✅ Aquí el blob YA existe, así que aquí se envía
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioArchivo(blob);
        setAudioPreviewUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());

        // ✅ Enviar SOLO cuando ya existe el blob
        await manejarEnviar(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setGrabando(true);
    } catch {
      setErrorMsg("No se pudo acceder al micrófono.");
    }
  };

  // ✅ FIX: ya NO llamamos manejarEnviar aquí (porque todavía no existe el blob)
  const detenerGrabacion = () => {
    mediaRecorder?.stop();
    setGrabando(false);
  };

  const manejarArchivo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioArchivo(file);
    setAudioPreviewUrl(URL.createObjectURL(file));
    e.target.value = "";
  };

  // ==========================
  // Grabación práctica
  // ==========================
  const iniciarGrabacionPractica = async () => {
    try {
      if (mediaPractica?.state === "recording") mediaPractica.stop();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 16000,
        },
      });

      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioPractica(blob);
        setPreviewPractica(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setMediaPractica(recorder);
      setGrabandoPractica(true);
    } catch {
      setErrorMsg("No se pudo acceder al micrófono para la práctica.");
    }
  };

  const detenerGrabacionPractica = () => {
    mediaPractica?.stop();
    setGrabandoPractica(false);
  };

  const manejarArchivoPractica = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioPractica(file);
    setPreviewPractica(URL.createObjectURL(file));
    e.target.value = "";
  };

  const enviarPracticaEjercicio = async () => {
    if (!ejercicioActivo || !audioPractica || audioPractica.size < 100) {
      setErrorMsg("Selecciona un ejercicio y graba tu lectura. ¡Tú puedes! 💪");
      return;
    }

    setCargandoPractica(true);
    setResultadoPractica(null);

    try {
      const data = await practicarEjercicioIA({
        estudianteId: hijoSeleccionado.id,
        ejercicioId: ejercicioActivo.id,
        archivoAudio: audioPractica,
      });
      setResultadoPractica(data);
    } catch {
      setErrorMsg("Error al analizar la práctica.");
    } finally {
      setCargandoPractica(false);
    }
  };

  // ==========================
  // ✅ Voz análisis general
  // ==========================
  useEffect(() => {
    if (!resultado) return;

    const partes = [];
    if (resultado.precision_global != null) {
      partes.push(`Tu precisión fue de ${resultado.precision_global.toFixed(1)} por ciento.`);
    }
    if (resultado.retroalimentacion) {
      partes.push(resultado.retroalimentacion);
    }

    if (partes.length > 0) {
      ttsService
        .speak(partes.join(" "), { language: "es-ES", rate: 0.9, pitch: 1.1 })
        .catch((error) => console.error("Error al reproducir retroalimentación:", error));
    }
  }, [resultado]);

  // ==========================
  // ✅ UI helpers (solo presentación)
  // ==========================
  const precision = useMemo(() => {
    const v = resultado?.precision_global ?? 0;
    return Math.max(0, Math.min(100, Number(v) || 0));
  }, [resultado]);

  const nivelBadge = useMemo(() => {
    const n = lectura?.nivel_dificultad;
    if (n == null) return null;
    if (n <= 2) return { label: "Fácil", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" };
    if (n <= 4) return { label: "Medio", cls: "bg-sky-100 text-sky-700 border-sky-200" };
    return { label: "Reto", cls: "bg-indigo-100 text-indigo-700 border-indigo-200" };
  }, [lectura]);

  // ==========================
  // Render
  // ==========================
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-yellow-50 to-emerald-50">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-8">
        {/* HEADER (sin ícono morado, solo camaleón) */}
        <header className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-50 via-sky-50 to-emerald-50 opacity-80" />

          <div className="relative p-5 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <button
              type="button"
              onClick={() => setPanelConfigAbierto(true)}
              className="flex items-start gap-4 text-left group"
              aria-label="Abrir configuración (seleccionar estudiante y lectura)"
              title="Abrir configuración"
            >
              <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-yellow-200 via-emerald-200 to-sky-200 flex items-center justify-center shadow-sm border border-white/60 group-hover:scale-[1.02] transition">
                <span className="text-3xl">🦎</span>
              </div>

              <div>
                <h1 className="text-2xl md:text-4xl font-extrabold text-slate-800">
                  BookiSmartIA
                </h1>
                <p className="text-sm md:text-base text-slate-600 mt-1">
                  Tu camaleón entrenador cambia de color cuando mejoras ⭐
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700">
                    🎯 Misión: {lectura?.titulo ? "Lectura activa" : "Elegir lectura"}
                  </span>
                  {nivelBadge && (
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${nivelBadge.cls}`}>
                      🧠 Nivel: {nivelBadge.label}
                    </span>
                  )}
                  {lectura?.edad_recomendada != null && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700">
                      🧒 Edad: {lectura.edad_recomendada}+
                    </span>
                  )}
                </div>
              </div>
            </button>

            {/* Panel de intentos y precisión */}
            {resultado ? (
              <div className="flex items-center gap-3 bg-white/90 border border-amber-100 rounded-3xl px-4 py-3 shadow-sm">
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-wide text-slate-400">Intento</span>
                  <span className="text-lg font-extrabold text-indigo-600">
                    #{resultado.numero_intento ?? "1"}
                  </span>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-wide text-slate-400">Precisión</span>
                  <span className="text-lg font-extrabold text-emerald-600">
                    {resultado.precision_global != null ? `${resultado.precision_global.toFixed(1)}%` : "—"}
                  </span>
                </div>

                <button
                  onClick={limpiarResultados}
                  className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700 px-2 py-1 rounded-xl hover:bg-slate-50"
                >
                  <MdReplay />
                  Reiniciar
                </button>
              </div>
            ) : (
              <div className="bg-white/90 border border-amber-100 rounded-3xl px-4 py-3 shadow-sm">
                <p className="text-sm font-bold text-slate-700">Tip del camaleón 🦎</p>
                <p className="text-xs text-slate-500">
                  Primero escucha, luego lee despacito y claro.
                </p>
              </div>
            )}
          </div>

          {/* Barra de progreso visual (con amarillo) */}
          <div className="relative px-5 md:px-7 pb-5 md:pb-7">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span>Progreso de la misión</span>
              <span className="font-extrabold text-slate-700">{precision.toFixed(0)}%</span>
            </div>
            <div className="h-4 w-full rounded-full bg-white border border-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-emerald-400 to-sky-400 transition-all"
                style={{ width: `${precision}%` }}
              />
            </div>
          </div>
        </header>

        {/* ✅ SECCIÓN DE “PASOS” ELIMINADA (por pedido del usuario) */}

        {/* PANEL PRINCIPAL (sin mostrar estudiante/lectura, sin botón “Cambiar misión”) */}
        <section className="bg-white/90 border border-slate-100 rounded-3xl p-4 md:p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-3xl bg-gradient-to-br from-yellow-200 via-emerald-200 to-sky-200 flex items-center justify-center shadow-sm border border-white/60">
                <span className="text-2xl">🦎</span>
              </div>

              <div>
                <p className="text-xs font-extrabold text-amber-600 uppercase tracking-wide">
                  Misión activa
                </p>
                <h2 className="text-base md:text-lg font-extrabold text-slate-800">
                  {lectura?.titulo ? `“${lectura.titulo}”` : "Toca el camaleón para elegir una lectura"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Consejo: respira, separa sílabas y lee claro ⭐
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={manejarEscucharLectura}
              disabled={!lecturaSeleccionada}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-500 text-white text-sm font-extrabold shadow-md hover:shadow-lg hover:brightness-105 disabled:opacity-60 active:scale-[0.99] transition"
            >
              <MdPlayArrow />
              Escuchar lectura
            </button>
          </div>

          {errorMsg && (
            <p className="mt-3 text-xs text-red-600 font-bold bg-red-50 border border-red-100 rounded-2xl px-3 py-2">
              {errorMsg}
            </p>
          )}
        </section>

        {/* TEXTO DE LA LECTURA */}
        <section className="bg-white/90 border border-indigo-100 rounded-3xl p-4 md:p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-10 w-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <MdMenuBook />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-800">Texto de la lectura</h2>
              <p className="text-xs text-slate-500">
                Lee con calma. Tu camaleón 🦎 se vuelve más brillante cuando mejoras.
              </p>
            </div>
          </div>

          {lectura ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-extrabold text-indigo-700">{lectura.titulo}</h3>
                {nivelBadge && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-extrabold border ${nivelBadge.cls}`}>
                    {nivelBadge.label}
                  </span>
                )}
              </div>

              <div className="border border-indigo-100 rounded-3xl p-4 bg-gradient-to-br from-yellow-50/60 via-indigo-50/50 to-emerald-50/40 max-h-72 overflow-y-auto text-[15px] leading-relaxed text-slate-800">
                {lectura.contenido}
              </div>
            </>
          ) : (
            <div className="border border-dashed border-slate-200 rounded-3xl p-5 bg-slate-50/60 text-sm text-slate-500">
              Toca el camaleón 🦎 arriba para elegir estudiante y lectura.
            </div>
          )}
        </section>

        {/* AUDIO DE LECTURA */}
        <section className="bg-white/90 border border-emerald-100 rounded-3xl p-4 md:p-5 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-800">Audio del estudiante</h2>
              <p className="text-xs text-slate-500">
                Graba la lectura o sube un audio para que la IA analice la pronunciación.
              </p>
            </div>

            {cargando && (
              <div className="text-xs font-extrabold text-amber-700 bg-amber-50 border border-amber-100 px-3 py-2 rounded-2xl">
                Analizando... 🧠✨
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            {!grabando ? (
              <button
                type="button"
                onClick={iniciarGrabacion}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-sm font-extrabold hover:bg-emerald-100 shadow-sm active:scale-[0.99] transition"
              >
                <MdMic />
                Grabar 🎤
              </button>
            ) : (
              <button
                type="button"
                onClick={detenerGrabacion}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-red-300 bg-red-50 text-red-800 text-sm font-extrabold hover:bg-red-100 shadow-sm active:scale-[0.99] transition"
              >
                <MdStop />
                Detener y enviar ✅
              </button>
            )}

            <label className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-700 text-sm font-extrabold cursor-pointer hover:bg-slate-50 shadow-sm active:scale-[0.99] transition">
              <MdUpload />
              Subir audio
              <input type="file" accept="audio/*" className="hidden" onChange={manejarArchivo} />
            </label>

            <button
              type="button"
              onClick={() => manejarEnviar(null)}
              disabled={!audioArchivo || cargando}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500 text-white text-sm font-extrabold shadow-md hover:shadow-lg hover:brightness-105 disabled:opacity-60 active:scale-[0.99] transition"
            >
              🚀 Analizar con IA
            </button>
          </div>

          {audioPreviewUrl && (
            <div className="mt-1">
              <p className="text-xs text-slate-500 mb-1 font-bold">Previsualización:</p>
              <div className="border border-slate-200 rounded-3xl px-3 py-2 bg-slate-50">
                <audio controls src={audioPreviewUrl} className="w-full" />
              </div>
            </div>
          )}
        </section>

        {/* RESULTADOS DE LA IA */}
        {resultado && (
          <section className="space-y-5">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/90 border border-emerald-100 rounded-3xl p-4 shadow-sm hover:shadow-md transition">
                <p className="text-xs uppercase tracking-wide text-emerald-500 font-extrabold">
                  Precisión global
                </p>
                <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                  {resultado.precision_global != null ? `${resultado.precision_global.toFixed(1)}%` : "—"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Palabras y puntuación correctas.
                </p>
              </div>

              <div className="bg-white/90 border border-indigo-100 rounded-3xl p-4 shadow-sm hover:shadow-md transition">
                <p className="text-xs uppercase tracking-wide text-indigo-500 font-extrabold">
                  Velocidad lectora
                </p>
                <p className="mt-2 text-3xl font-extrabold text-indigo-600">
                  {resultado.palabras_por_minuto != null ? resultado.palabras_por_minuto.toFixed(1) : "—"}
                  <span className="text-base font-bold text-slate-500 ml-1">ppm</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">Palabras por minuto.</p>
              </div>

              <div className="bg-white/90 border border-amber-100 rounded-3xl p-4 shadow-sm hover:shadow-md transition">
                <p className="text-xs uppercase tracking-wide text-amber-600 font-extrabold">Intento</p>
                <p className="mt-2 text-3xl font-extrabold text-amber-600">
                  #{resultado.numero_intento ?? "1"}
                </p>
                <p className="mt-1 text-xs text-slate-500">Cada audio crea un intento nuevo.</p>
              </div>
            </div>

            {resultado.retroalimentacion && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-4 shadow-sm text-sm text-emerald-900">
                <p className="font-extrabold mb-1">Mensaje del camaleón 🦎:</p>
                <p>{resultado.retroalimentacion}</p>
              </div>
            )}

            <ZonaPracticaIA
              ejercicios={resultado.ejercicios_recomendados}
              ejercicioActivo={ejercicioActivo}
              grabandoPractica={grabandoPractica}
              previewPractica={previewPractica}
              cargandoPractica={cargandoPractica}
              resultadoPractica={resultadoPractica}
              onSelectEjercicio={(ej) => {
                setEjercicioActivo(ej);
                setAudioPractica(null);
                setPreviewPractica(null);
                setResultadoPractica(null);
              }}
              onStartGrabacionPractica={iniciarGrabacionPractica}
              onStopGrabacionPractica={detenerGrabacionPractica}
              onArchivoPractica={manejarArchivoPractica}
              onEnviarPractica={enviarPracticaEjercicio}
            />
          </section>
        )}

        {/* MODAL CONFIG (selección oculta) */}
        {panelConfigAbierto && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setPanelConfigAbierto(false)}
            />
            <div className="absolute left-1/2 top-1/2 w-[92%] max-w-3xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-4 md:p-5 border-b border-slate-100 bg-gradient-to-r from-yellow-50 via-sky-50 to-emerald-50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-3xl bg-gradient-to-br from-yellow-200 via-emerald-200 to-sky-200 flex items-center justify-center shadow-sm border border-white/60">
                      <span className="text-2xl">🦎</span>
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-800">Configurar lectura</h3>
                      <p className="text-xs text-slate-500">
                        Aquí eliges estudiante y lectura (no se muestran en la vista principal).
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setPanelConfigAbierto(false)}
                    className="px-3 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 text-sm font-extrabold hover:bg-slate-50"
                  >
                    ✖ Cerrar
                  </button>
                </div>
              </div>

              <div className="p-4 md:p-5 space-y-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-3">
                    <p className="text-xs font-extrabold text-slate-700 mb-2 flex items-center gap-2">
                      <span className="text-lg">👦👧</span> Estudiante
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {hijos.map((est) => (
                        <button
                          key={est.id}
                          onClick={() => manejarSeleccionHijo({ target: { value: est.id } })}
                          className={[
                            "px-4 py-2 rounded-2xl border text-sm font-extrabold transition active:scale-[0.99]",
                            hijoSeleccionado?.id === est.id
                              ? "border-indigo-300 bg-indigo-100 text-indigo-800"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                          ].join(" ")}
                        >
                          {est.nombre} {est.apellido}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-3">
                    <p className="text-xs font-extrabold text-slate-700 mb-2 flex items-center gap-2">
                      <span className="text-lg">📚</span> Lectura
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {lecturas.map((lec) => (
                        <button
                          key={lec.id}
                          onClick={() => manejarSeleccionLectura({ target: { value: lec.id } })}
                          className={[
                            "px-4 py-2 rounded-2xl border text-sm font-extrabold transition active:scale-[0.99]",
                            lecturaSeleccionada?.id === lec.id
                              ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                          ].join(" ")}
                        >
                          {lec.titulo}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => setPanelConfigAbierto(false)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-sky-500 to-amber-500 text-white text-sm font-extrabold shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99] transition"
                  >
                    ✅ Listo, continuar
                  </button>

                  <button
                    type="button"
                    onClick={limpiarResultados}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-700 text-sm font-extrabold hover:bg-slate-50 active:scale-[0.99] transition"
                  >
                    <MdReplay />
                    Reiniciar intento
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
