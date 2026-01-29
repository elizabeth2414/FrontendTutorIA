// src/components/lectura/ZonaPracticaIA.jsx - BookiSmartIA (mejor UX + mejor diseño)
// ✅ Sin cambiar tu backend. Solo mejora UI/UX y control de estados.

import { useEffect, useMemo, useRef, useState } from "react";
import { MdMic, MdStop, MdUpload, MdSend, MdVolumeUp, MdSchool } from "react-icons/md";
import TutorInteractivoPronunciacion from "./TutorInteractivoPronunciacion";
import { analizarPalabraIndividual } from "../../services/iaService";

export default function ZonaPracticaIA({
  ejercicios,
  ejercicioActivo,
  grabandoPractica,
  previewPractica,
  cargandoPractica,
  resultadoPractica,
  nombreEstudiante,
  onSelectEjercicio,
  onStartGrabacionPractica,
  onStopGrabacionPractica,
  onArchivoPractica,
  onEnviarPractica,
}) {
  const hayEjercicios = Array.isArray(ejercicios) && ejercicios.length > 0;

  const [modoPractica, setModoPractica] = useState("ejercicios"); // 'ejercicios' o 'tutor'
  const [practicaCompletada, setPracticaCompletada] = useState(false);

  // Para auto-enfocar el ejercicio activo (mejora UX móvil)
  const activoRef = useRef(null);

  // Extraer palabras únicas de los ejercicios para el tutor
  const palabrasParaTutor = useMemo(() => {
    if (!hayEjercicios) return [];
    const palabras = ejercicios
      .flatMap((ej) => {
        if (ej.palabras_objetivo && ej.palabras_objetivo.length > 0) {
          return ej.palabras_objetivo.map((palabra) => ({
            palabra,
            tipo_error: ej.tipo_ejercicio,
            ejercicioId: ej.id,
          }));
        }
        return [];
      })
      .filter((v, i, a) => a.findIndex((t) => t.palabra === v.palabra) === i);

    return palabras;
  }, [ejercicios, hayEjercicios]);

  // ✅ Si el modo tutor no tiene palabras, cae a ejercicios para evitar “pantalla vacía”
  useEffect(() => {
    if (modoPractica === "tutor" && palabrasParaTutor.length === 0 && hayEjercicios) {
      setModoPractica("ejercicios");
    }
  }, [modoPractica, palabrasParaTutor.length, hayEjercicios]);

  // ✅ Auto-scroll al ejercicio activo
  useEffect(() => {
    if (ejercicioActivo?.id && activoRef.current) {
      activoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [ejercicioActivo?.id]);

  // ✅ Reset de estados visuales locales cuando cambias de ejercicio (sin tocar parent)
  // Nota: no podemos modificar el estado del padre, pero sí evitamos confusión visual:
  // - Al cambiar de ejercicio, marcamos “no completado”
  useEffect(() => {
    setPracticaCompletada(false);
  }, [ejercicioActivo?.id]);

  const manejarAnalizarPalabra = async (palabra, audioBlob) => {
    try {
      const resultado = await analizarPalabraIndividual(palabra, audioBlob);
      return resultado;
    } catch (error) {
      console.error("Error al analizar palabra:", error);
      throw error;
    }
  };

  const manejarCompletarPractica = (cantidadCompletadas) => {
    setPracticaCompletada(true);
    // Aquí podrías llamar al padre si luego decides registrar práctica
  };

  // ✅ Botones inteligentes (evita “Enviar” sin audio)
  const hayAudioListo = Boolean(previewPractica);
  const puedeEvaluar = Boolean(ejercicioActivo) && hayAudioListo && !cargandoPractica;

  // Icono por tipo
  const iconoTipo = (tipo) => {
    if (tipo === "palabra_especifica") return "📝";
    if (tipo === "fragmento_problematico") return "📖";
    return "✏️";
  };

  const etiquetaTipo = (tipo) => {
    if (tipo === "palabra_especifica") return "Palabra especial";
    if (tipo === "fragmento_problematico") return "Frase para practicar";
    return "Ejercicio";
  };

  return (
    <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm border border-amber-200 rounded-3xl p-5 shadow-sm space-y-4">
      {/* Fondo decorativo suave */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-yellow-50 via-amber-50 to-emerald-50 opacity-80" />
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-3xl bg-gradient-to-br from-yellow-200 via-emerald-200 to-sky-200 flex items-center justify-center border border-white/60 shadow-sm">
              <span className="text-2xl">🦎</span>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-extrabold text-slate-800">
                Zona de Práctica
              </h3>
              <p className="text-xs text-slate-600">
                Practica tu pronunciación con BookiSmartIA ⭐
              </p>
            </div>
          </div>

          {practicaCompletada && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
              ✅ ¡Completado!
            </span>
          )}
        </div>

        {!hayEjercicios && (
          <div className="mt-4 border-2 border-dashed border-amber-300 rounded-3xl p-5 bg-white/70 text-center space-y-2">
            <p className="text-2xl">🌟</p>
            <p className="text-sm font-extrabold text-amber-800">
              ¡Todavía no hay ejercicios!
            </p>
            <p className="text-xs text-slate-600">
              Primero lee la lectura completa y yo crearé ejercicios especiales para las partes
              donde puedas mejorar. ¡Tú puedes! 💪
            </p>
          </div>
        )}

        {hayEjercicios && (
          <>
            {/* Selector de modo */}
            <div className="mt-4 bg-white/80 rounded-3xl p-3 border border-amber-200">
              <p className="text-xs font-extrabold text-amber-800 mb-2">
                Elige cómo quieres practicar:
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setModoPractica("tutor")}
                  className={[
                    "flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition active:scale-[0.99]",
                    modoPractica === "tutor"
                      ? "bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-500 text-white border-white/40 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
                  ].join(" ")}
                  title="Tutor interactivo"
                >
                  <MdSchool size={22} />
                  <div className="text-left">
                    <p className="text-sm font-extrabold">Tutor</p>
                    <p className="text-[11px] opacity-90">Palabra por palabra</p>
                  </div>
                </button>

                <button
                  onClick={() => setModoPractica("ejercicios")}
                  className={[
                    "flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition active:scale-[0.99]",
                    modoPractica === "ejercicios"
                      ? "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white border-white/40 shadow-md"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
                  ].join(" ")}
                  title="Práctica libre"
                >
                  <MdMic size={22} />
                  <div className="text-left">
                    <p className="text-sm font-extrabold">Libre</p>
                    <p className="text-[11px] opacity-90">A tu ritmo</p>
                  </div>
                </button>
              </div>
            </div>

            {/* MODO TUTOR */}
            {modoPractica === "tutor" && (
              <div className="mt-4">
                {palabrasParaTutor.length > 0 ? (
                  <TutorInteractivoPronunciacion
                    palabrasParaPracticar={palabrasParaTutor}
                    nombreEstudiante={nombreEstudiante || "Campeón"}
                    onAnalizarPalabra={manejarAnalizarPalabra}
                    onCompletarPractica={manejarCompletarPractica}
                  />
                ) : (
                  <div className="border border-amber-200 bg-white/70 rounded-3xl p-4 text-sm text-slate-700">
                    <p className="font-extrabold text-amber-800 mb-1">Tutor no disponible 😅</p>
                    <p className="text-xs text-slate-600">
                      Esta lectura no trajo palabras objetivo para tutor. Usa “Libre” para practicar.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* MODO EJERCICIOS */}
            {modoPractica === "ejercicios" && (
              <div className="mt-4 space-y-3">
                <div className="bg-white/70 rounded-3xl p-4 border border-amber-200">
                  <p className="text-sm text-slate-700">
                    <span className="font-extrabold text-slate-800">✨ ¡Hora de practicar!</span>{" "}
                    Elige un ejercicio, lee en voz alta y te digo cómo lo hiciste. 🚀
                  </p>

                  {/* Estados cortos */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-900 border border-yellow-200">
                      🎯 {ejercicios.length} ejercicios
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-200">
                      🎧 Audio: {hayAudioListo ? "listo" : "no"}
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-200">
                      🎤 Grabando: {grabandoPractica ? "sí" : "no"}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  {ejercicios.map((ej) => {
                    const activo = ejercicioActivo?.id === ej.id;

                    return (
                      <div
                        key={ej.id}
                        ref={activo ? activoRef : null}
                        className={[
                          "rounded-3xl p-4 text-sm transition-all duration-200 border bg-white/85",
                          activo
                            ? "border-amber-500 shadow-md ring-2 ring-amber-200"
                            : "border-slate-200 hover:border-amber-300 hover:shadow-sm",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">{iconoTipo(ej.tipo_ejercicio)}</span>
                              <span className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wide">
                                {etiquetaTipo(ej.tipo_ejercicio)}
                              </span>
                            </div>

                            <p className="font-extrabold text-slate-800 mb-2 text-base">
                              “{ej.texto_practica ?? "Ejercicio de práctica"}”
                            </p>

                            {ej.palabras_objetivo && ej.palabras_objetivo.length > 0 && (
                              <div className="bg-amber-50 rounded-2xl px-3 py-2 mb-2 border border-amber-100">
                                <p className="text-xs font-extrabold text-amber-800 mb-1">
                                  🎯 Palabras importantes:
                                </p>
                                <p className="text-xs text-slate-700 font-semibold">
                                  {ej.palabras_objetivo.join(", ")}
                                </p>
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => onSelectEjercicio(ej)}
                            className={[
                              "text-xs font-extrabold px-4 py-2 rounded-full border transition active:scale-[0.99]",
                              activo
                                ? "border-amber-600 bg-amber-500 text-white shadow-sm"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                            ].join(" ")}
                          >
                            {activo ? "Activo 🎤" : "Elegir"}
                          </button>
                        </div>

                        {activo && (
                          <div className="mt-4 space-y-3 border-t border-amber-100 pt-3">
                            <div className="bg-sky-50 rounded-2xl p-3 border border-sky-200">
                              <p className="text-xs font-extrabold text-sky-800 mb-1">
                                💡 ¿Cómo practicar?
                              </p>
                              <p className="text-xs text-sky-700">
                                1) Lee despacio y claro <br />
                                2) Graba o sube audio <br />
                                3) Pulsa “¡Evalúame!” ⭐
                              </p>
                            </div>

                            {/* Controles */}
                            <div className="flex flex-wrap gap-2 items-center">
                              {!grabandoPractica ? (
                                <button
                                  type="button"
                                  onClick={onStartGrabacionPractica}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-extrabold hover:bg-emerald-100"
                                >
                                  <MdMic size={16} />
                                  Grabar 🎤
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={onStopGrabacionPractica}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-red-300 bg-red-50 text-red-800 text-xs font-extrabold animate-pulse"
                                >
                                  <MdStop size={16} />
                                  Detener ⏹️
                                </button>
                              )}

                              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-200 bg-white text-slate-700 text-xs font-extrabold cursor-pointer hover:bg-slate-50">
                                <MdUpload size={16} />
                                Subir audio
                                <input
                                  type="file"
                                  accept="audio/*"
                                  className="hidden"
                                  onChange={onArchivoPractica}
                                />
                              </label>

                              <button
                                type="button"
                                onClick={onEnviarPractica}
                                disabled={!puedeEvaluar}
                                className={[
                                  "inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-extrabold shadow-sm transition",
                                  puedeEvaluar
                                    ? "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white hover:brightness-105"
                                    : "bg-slate-200 text-slate-500 cursor-not-allowed",
                                ].join(" ")}
                                title={
                                  !ejercicioActivo
                                    ? "Elige un ejercicio"
                                    : !hayAudioListo
                                    ? "Graba o sube un audio primero"
                                    : cargandoPractica
                                    ? "Evaluando..."
                                    : "Evaluar"
                                }
                              >
                                <MdSend size={16} />
                                {cargandoPractica ? "Evaluando..." : "¡Evalúame!"}
                              </button>
                            </div>

                            {/* Audio preview */}
                            {previewPractica && (
                              <div className="border border-indigo-200 rounded-2xl p-3 bg-indigo-50/60">
                                <p className="text-xs font-extrabold text-indigo-700 mb-2 flex items-center gap-1">
                                  <MdVolumeUp /> Tu grabación:
                                </p>
                                <audio controls src={previewPractica} className="w-full" />
                              </div>
                            )}

                            {/* Resultado */}
                            {resultadoPractica && (
                              <div
                                className={[
                                  "mt-2 rounded-3xl p-4 border",
                                  resultadoPractica.mejora_lograda
                                    ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
                                    : "bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200",
                                ].join(" ")}
                              >
                                <div className="text-center mb-3">
                                  <p className="text-4xl mb-2">
                                    {resultadoPractica.mejora_lograda ? "🎉" : "💪"}
                                  </p>
                                  <p
                                    className={[
                                      "text-base font-extrabold",
                                      resultadoPractica.mejora_lograda
                                        ? "text-emerald-700"
                                        : "text-sky-700",
                                    ].join(" ")}
                                  >
                                    {resultadoPractica.mensaje_voz ||
                                      (resultadoPractica.mejora_lograda
                                        ? "¡Excelente! ¡Lo hiciste muy bien!"
                                        : "¡Buen intento! Vamos a seguir practicando.")}
                                  </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-3">
                                  <div className="bg-white/80 rounded-2xl p-3 text-center border border-slate-200">
                                    <p className="text-xs text-slate-600 mb-1">Tu precisión</p>
                                    <p className="text-2xl font-extrabold text-indigo-600">
                                      {resultadoPractica.precision_global != null
                                        ? `${resultadoPractica.precision_global.toFixed(0)}%`
                                        : "—"}
                                    </p>
                                  </div>
                                  <div className="bg-white/80 rounded-2xl p-3 text-center border border-slate-200">
                                    <p className="text-xs text-slate-600 mb-1">Estado</p>
                                    <p className="text-lg font-extrabold">
                                      {resultadoPractica.mejora_lograda ? "✅ ¡Mejorado!" : "🎯 Practicando"}
                                    </p>
                                  </div>
                                </div>

                                {resultadoPractica.mensaje_detallado && (
                                  <div className="bg-white/60 rounded-2xl p-3 border border-slate-200">
                                    <p className="text-xs text-slate-700 leading-relaxed">
                                      {resultadoPractica.mensaje_detallado}
                                    </p>
                                  </div>
                                )}

                                {resultadoPractica.palabras_problema &&
                                  resultadoPractica.palabras_problema.length > 0 && (
                                    <div className="mt-3 bg-white/60 rounded-2xl p-3 border border-amber-200">
                                      <p className="text-xs font-extrabold text-amber-800 mb-2">
                                        🎯 Palabras para seguir practicando:
                                      </p>
                                      <div className="space-y-1">
                                        {resultadoPractica.palabras_problema.map((p, idx) => (
                                          <div key={idx} className="text-xs bg-amber-50 rounded-xl px-2 py-1">
                                            <span className="font-extrabold text-amber-900">
                                              “{p.palabra}”
                                            </span>
                                            {p.sugerencia && (
                                              <span className="text-slate-600 ml-2">- {p.sugerencia}</span>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                {resultadoPractica.mejora_lograda && (
                                  <div className="mt-3 text-center">
                                    <p className="text-xs font-extrabold text-emerald-700">
                                      ¡Sigue así campeón! 🌟 ¡Cada vez lees mejor!
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Nota: si quieren evaluar sin preview, avisa */}
                {!hayAudioListo && ejercicioActivo && (
                  <div className="text-xs text-slate-600 bg-white/70 border border-slate-200 rounded-2xl p-3">
                    💡 Tip: graba o sube un audio para activar “¡Evalúame!”.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
