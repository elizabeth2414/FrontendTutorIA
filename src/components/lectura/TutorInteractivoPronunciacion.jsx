// src/components/lectura/TutorInteractivoPronunciacion.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { MdMic, MdStop, MdVolumeUp, MdPlayArrow } from "react-icons/md";
import tutorVozService from "../../services/tutorVozService";

/**
 * ✅ FIX DOBLE VOZ (StrictMode):
 * React en modo desarrollo puede montar/desmontar/montar.
 * Este guard vive a nivel de módulo y evita iniciar 2 veces para la misma lista.
 */
let __tutorInitSignature = "";
let __tutorInitLocked = false;

export default function TutorInteractivoPronunciacion({
  palabrasParaPracticar = [],
  nombreEstudiante,
  onCompletarPractica,
  onAnalizarPalabra,
}) {
  // Estados principales
  const [palabraActualIndex, setPalabraActualIndex] = useState(0);
  const [estado, setEstado] = useState("preparando"); // preparando, escuchando, listo, grabando, analizando, feedback, completado
  const [grabando, setGrabando] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [resultadoAnalisis, setResultadoAnalisis] = useState(null);
  const [intentos, setIntentos] = useState(0);
  const [palabrasCompletadas, setPalabrasCompletadas] = useState([]);
  const [tutorHablando, setTutorHablando] = useState(false);

  // ✅ Ref para índice actual (evita closure)
  const palabraActualIndexRef = useRef(palabraActualIndex);
  useEffect(() => {
    palabraActualIndexRef.current = palabraActualIndex;
  }, [palabraActualIndex]);

  // ✅ Ref para evitar hablar doble simultáneo (por clicks rápidos)
  const hablandoRef = useRef(false);

  const palabraActual = palabrasParaPracticar[palabraActualIndex];

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // ✅ Firma estable de palabras (si cambia, se permite reiniciar la sesión)
  const palabrasSignature = useMemo(() => {
    if (!Array.isArray(palabrasParaPracticar) || palabrasParaPracticar.length === 0) return "";
    return palabrasParaPracticar.map((p) => (p?.palabra ?? "").trim().toLowerCase()).join("|");
  }, [palabrasParaPracticar]);

  // ✅ INICIO: SOLO UNA VEZ por firma (incluso con StrictMode)
  useEffect(() => {
    if (!palabrasSignature) return;

    // Si ya se inició para esta firma, NO repetir (aunque el componente se re-monte)
    if (__tutorInitLocked && __tutorInitSignature === palabrasSignature) return;

    __tutorInitLocked = true;
    __tutorInitSignature = palabrasSignature;

    iniciarSesion();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palabrasSignature]);

  // Limpiar al desmontar (NO reseteamos el guard global, para evitar doble en StrictMode)
  useEffect(() => {
    return () => {
      tutorVozService.detener();
      hablandoRef.current = false;
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder]);

  // Si realmente quieres reiniciar cuando cambias de ejercicios/words:
  useEffect(() => {
    // cuando cambia la firma, reiniciamos estados internos
    setPalabraActualIndex(0);
    setEstado("preparando");
    setGrabando(false);
    setAudioBlob(null);
    setResultadoAnalisis(null);
    setIntentos(0);
    setPalabrasCompletadas([]);
    // OJO: NO llamamos iniciarSesion aquí, lo hace el efecto de arriba
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palabrasSignature]);

  const iniciarSesion = async () => {
    // doble protección
    if (hablandoRef.current) return;

    try {
      setTutorHablando(true);
      hablandoRef.current = true;

      await tutorVozService.saludar(nombreEstudiante || "campeón");
      await sleep(350);
      await tutorVozService.explicarPractica();

      setTutorHablando(false);
      hablandoRef.current = false;

      setEstado("escuchando");
      await sleep(200);

      await pronunciarPalabraActual();
    } catch (e) {
      console.error("Error iniciar tutor:", e);
      setTutorHablando(false);
      hablandoRef.current = false;
      setEstado("listo");
    }
  };

  const pronunciarPalabraActual = async () => {
    const indexActual = palabraActualIndexRef.current;
    const palabraObj = palabrasParaPracticar[indexActual];
    if (!palabraObj?.palabra) return;

    if (grabando || estado === "analizando") return;
    if (hablandoRef.current) return;

    try {
      setTutorHablando(true);
      hablandoRef.current = true;

      setEstado("escuchando");
      await sleep(120);

      await tutorVozService.pronunciarPalabra(palabraObj.palabra);
      await sleep(380);
      await tutorVozService.pedirRepetir();

      await sleep(120);
      setTutorHablando(false);
      hablandoRef.current = false;

      setEstado("listo");
    } catch (e) {
      console.error("Error pronunciar palabra:", e);
      setTutorHablando(false);
      hablandoRef.current = false;
      setEstado("listo");
    }
  };

  const escucharOtraVez = async () => {
    if (tutorHablando || grabando || estado === "analizando") return;
    await pronunciarPalabraActual();
  };

  const dividirEnSilabas = (palabra) => {
    const vocales = "aeiouáéíóúü";
    const silabas = [];
    let silabaActual = "";

    for (let i = 0; i < palabra.length; i++) {
      const char = palabra[i].toLowerCase();
      silabaActual += palabra[i];

      if (vocales.includes(char) && i < palabra.length - 1) {
        const siguiente = palabra[i + 1].toLowerCase();
        if (!vocales.includes(siguiente)) {
          if (i < palabra.length - 2 && !vocales.includes(palabra[i + 2].toLowerCase())) {
            silabaActual += palabra[i + 1];
            silabas.push(silabaActual);
            silabaActual = "";
            i++;
          } else {
            silabas.push(silabaActual);
            silabaActual = "";
          }
        }
      }
    }

    if (silabaActual) silabas.push(silabaActual);
    return silabas.length > 0 ? silabas : [palabra];
  };

  const escucharPorSilabas = async () => {
    if (tutorHablando || !palabraActual?.palabra || grabando || estado === "analizando") return;
    if (hablandoRef.current) return;

    try {
      setEstado("escuchando");
      setTutorHablando(true);
      hablandoRef.current = true;

      const silabas = dividirEnSilabas(palabraActual.palabra);
      await tutorVozService.contarSilabas(palabraActual.palabra, silabas);

      await sleep(150);
      setTutorHablando(false);
      hablandoRef.current = false;

      setEstado("listo");
    } catch (e) {
      console.error("Error silabas:", e);
      setTutorHablando(false);
      hablandoRef.current = false;
      setEstado("listo");
    }
  };

  const iniciarGrabacion = async () => {
    try {
      if (tutorHablando) return;

      tutorVozService.detener();
      hablandoRef.current = false;
      setTutorHablando(false);

      if (mediaRecorder?.state === "recording") {
        mediaRecorder.stop();
        return;
      }

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

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
        await analizarPronunciacion(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setGrabando(true);
      setEstado("grabando");

      setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
          setGrabando(false);
        }
      }, 3000);
    } catch (error) {
      console.error("Error al grabar:", error);
      alert("No se pudo acceder al micrófono. Por favor, verifica los permisos.");
      setEstado("listo");
      setGrabando(false);
    }
  };

  const detenerGrabacion = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setGrabando(false);
    }
  };

  const analizarPronunciacion = async (blob) => {
    setEstado("analizando");

    try {
      const objetivo = (palabraActual?.palabra ?? "").trim();
      const resultado = await onAnalizarPalabra(objetivo, blob);

      setResultadoAnalisis(resultado);
      setIntentos((prev) => prev + 1);

      await darFeedback(resultado);
    } catch (error) {
      console.error("Error al analizar:", error);
      setEstado("listo");
    }
  };

  const darFeedback = async (resultado) => {
    setEstado("feedback");
    setTutorHablando(true);
    hablandoRef.current = true;

    try {
      const objetivo = (palabraActual?.palabra ?? "").trim().toLowerCase();
      const transcrito = (resultado?.texto_transcrito ?? "").trim().toLowerCase();
      const precision = Number(resultado?.precision_global ?? 0);

      const coincidenciaBackend =
        typeof resultado?.coincidencia_exacta === "boolean" ? resultado.coincidencia_exacta : null;

      const dijoAlgo = transcrito.length > 0;
      const coincideExacto = coincidenciaBackend !== null ? coincidenciaBackend : transcrito === objetivo;

      const aprobo = dijoAlgo && coincideExacto && precision >= 70;

      if (aprobo) {
        await tutorVozService.celebrarExito();
        await sleep(650);

        setPalabrasCompletadas((prev) => {
          if (prev.includes(palabraActual.palabra)) return prev;
          return [...prev, palabraActual.palabra];
        });

        const siguienteIndex = palabraActualIndexRef.current + 1;

        if (siguienteIndex < palabrasParaPracticar.length) {
          setPalabraActualIndex(siguienteIndex);
          setIntentos(0);
          setResultadoAnalisis(null);
          setAudioBlob(null);

          setTutorHablando(false);
          hablandoRef.current = false;

          setEstado("escuchando");
          await sleep(220);
          await pronunciarPalabraActual();
          return;
        }

        await sleep(300);
        await tutorVozService.despedirse(nombreEstudiante || "Campeón");
        setEstado("completado");

        if (onCompletarPractica) {
          const total = (palabrasCompletadas?.length ?? 0) + 1;
          onCompletarPractica(total);
        }
      } else {
        await tutorVozService.animarMejora();

        if (!dijoAlgo) {
          await sleep(350);
          if (tutorVozService.explicarSilencio) {
            await tutorVozService.explicarSilencio();
          } else {
            await tutorVozService.pronunciarPalabra(objetivo);
            await sleep(250);
            await tutorVozService.pedirRepetir();
          }
        } else if (transcrito !== objetivo) {
          await sleep(350);
          await tutorVozService.explicarError(objetivo, transcrito);
        }

        await sleep(250);
        setResultadoAnalisis(null);
        setAudioBlob(null);
        setEstado("listo");
      }
    } catch (e) {
      console.error("Error feedback tutor:", e);
      setEstado("listo");
    } finally {
      setTutorHablando(false);
      hablandoRef.current = false;
    }
  };

  if (!palabraActual) {
    return (
      <div className="text-center p-8">
        <p className="text-slate-600">No hay palabras para practicar en este momento.</p>
      </div>
    );
  }

  const progreso = ((palabraActualIndex + 1) / palabrasParaPracticar.length) * 100;

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-3xl p-6 shadow-lg border-2 border-purple-200">
      {/* Header con progreso */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-purple-700 flex items-center gap-2">
            <span className="text-2xl">👩‍🏫</span>
            Tutor de Pronunciación
          </h3>
          <div className="text-sm font-semibold text-purple-600">
            Palabra {palabraActualIndex + 1} de {palabrasParaPracticar.length}
          </div>
        </div>

        <div className="w-full bg-purple-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      {/* Palabra actual */}
      <div className="bg-white rounded-2xl p-8 mb-6 text-center border-4 border-purple-200 shadow-inner">
        <div className="mb-2">
          <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
            Practica esta palabra:
          </span>
        </div>
        <div className="text-6xl font-black text-purple-700 mb-4 tracking-wide">
          {palabraActual.palabra}
        </div>
      </div>

      {tutorHablando && (
        <div className="bg-pink-100 border-2 border-pink-300 rounded-xl p-4 mb-4 flex items-center gap-3 animate-pulse">
          <MdVolumeUp className="text-3xl text-pink-600" />
          <div>
            <p className="font-bold text-pink-700">La tutora está hablando...</p>
            <p className="text-sm text-pink-600">Escucha con atención 👂</p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
        <p className="text-sm font-semibold text-blue-800 mb-2">
          {estado === "escuchando" && "👂 Escucha cómo pronuncio la palabra..."}
          {estado === "listo" && '🎤 ¡Tu turno! Presiona "¡Estoy listo!" para grabar'}
          {estado === "grabando" && "🔴 ¡Grabando! Di la palabra ahora"}
          {estado === "analizando" && "🤔 Estoy escuchando tu pronunciación..."}
          {estado === "feedback" && "💬 Te voy a decir cómo lo hiciste..."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={escucharOtraVez}
          disabled={tutorHablando || estado === "grabando" || estado === "analizando"}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <MdVolumeUp size={24} />
          Escuchar otra vez
        </button>

        <button
          onClick={escucharPorSilabas}
          disabled={tutorHablando || estado === "grabando" || estado === "analizando"}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <MdPlayArrow size={24} />
          Por sílabas
        </button>
      </div>

      {estado === "listo" && !grabando && (
        <button
          onClick={iniciarGrabacion}
          disabled={tutorHablando}
          className="w-full py-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl font-black shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          <MdMic size={32} />
          ¡Estoy listo! 🎤
        </button>
      )}

      {grabando && (
        <button
          onClick={detenerGrabacion}
          className="w-full py-6 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white text-xl font-black shadow-lg animate-pulse flex items-center justify-center gap-3"
        >
          <MdStop size={32} />
          Grabando... Di la palabra
        </button>
      )}
    </div>
  );
}
