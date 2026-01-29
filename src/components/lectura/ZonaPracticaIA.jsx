// src/components/lectura/ZonaPracticaIA.jsx - VERSIÓN CON TUTOR INTERACTIVO
import { useState } from 'react';
import {
  MdMic,
  MdStop,
  MdUpload,
  MdSend,
  MdVolumeUp,
  MdSchool,
} from "react-icons/md";
import TutorInteractivoPronunciacion from './TutorInteractivoPronunciacion';
import { analizarPalabraIndividual } from '../../services/iaService';

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
  const [modoPractica, setModoPractica] = useState('ejercicios'); // 'ejercicios' o 'tutor'
  const [practicaCompletada, setPracticaCompletada] = useState(false);

  // Extraer palabras únicas de los ejercicios para el tutor
  const palabrasParaTutor = hayEjercicios 
    ? ejercicios.flatMap(ej => {
        if (ej.palabras_objetivo && ej.palabras_objetivo.length > 0) {
          return ej.palabras_objetivo.map(palabra => ({
            palabra,
            tipo_error: ej.tipo_ejercicio,
            ejercicioId: ej.id,
          }));
        }
        return [];
      }).filter((v, i, a) => a.findIndex(t => t.palabra === v.palabra) === i)
    : [];

  const manejarAnalizarPalabra = async (palabra, audioBlob) => {
    try {
      const resultado = await analizarPalabraIndividual(palabra, audioBlob);
      return resultado;
    } catch (error) {
      console.error('Error al analizar palabra:', error);
      throw error;
    }
  };

  const manejarCompletarPractica = (cantidadCompletadas) => {
    setPracticaCompletada(true);
    // Aquí podrías llamar a una función del padre para registrar la práctica
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 shadow-md space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🎯</span>
        <h3 className="text-base font-bold text-slate-800">
          Zona de Práctica de Pronunciación
        </h3>
      </div>
      
      {!hayEjercicios && (
        <div className="border-2 border-dashed border-amber-300 rounded-2xl p-5 bg-white/70 text-center space-y-2">
          <p className="text-2xl">🌟</p>
          <p className="text-sm font-semibold text-amber-800">
            ¡Todavía no hay ejercicios!
          </p>
          <p className="text-xs text-slate-600">
            Primero lee la lectura completa y yo crearé ejercicios especiales 
            para las partes donde puedas mejorar. ¡Tú puedes! 💪
          </p>
        </div>
      )}

      {hayEjercicios && (
        <>
          {/* Selector de modo de práctica */}
          <div className="bg-white/80 rounded-xl p-3 border-2 border-amber-200">
            <p className="text-xs font-semibold text-amber-800 mb-2">
              Elige cómo quieres practicar:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setModoPractica('tutor')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                  modoPractica === 'tutor'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-600 shadow-lg'
                    : 'bg-white text-purple-700 border-purple-300 hover:border-purple-400'
                }`}
              >
                <MdSchool size={24} />
                <div className="text-left">
                  <p className="text-sm font-bold">Tutor Interactivo</p>
                  <p className="text-xs opacity-90">Palabra por palabra</p>
                </div>
              </button>

              <button
                onClick={() => setModoPractica('ejercicios')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                  modoPractica === 'ejercicios'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-600 shadow-lg'
                    : 'bg-white text-amber-700 border-amber-300 hover:border-amber-400'
                }`}
              >
                <MdMic size={24} />
                <div className="text-left">
                  <p className="text-sm font-bold">Práctica Libre</p>
                  <p className="text-xs opacity-90">A tu ritmo</p>
                </div>
              </button>
            </div>
          </div>

          {/* MODO TUTOR INTERACTIVO */}
          {modoPractica === 'tutor' && palabrasParaTutor.length > 0 && (
            <TutorInteractivoPronunciacion
              palabrasParaPracticar={palabrasParaTutor}
              nombreEstudiante={nombreEstudiante || 'Campeón'}
              onAnalizarPalabra={manejarAnalizarPalabra}
              onCompletarPractica={manejarCompletarPractica}
            />
          )}

          {/* MODO EJERCICIOS TRADICIONAL */}
          {modoPractica === 'ejercicios' && (
            <div className="space-y-3">
              <p className="text-sm text-slate-700 bg-white/60 rounded-xl p-3 border border-amber-100">
                <span className="font-semibold">✨ ¡Hora de practicar!</span> Elige un ejercicio, 
                lee en voz alta y yo te diré cómo lo hiciste. ¡Vamos a mejorar juntos! 🚀
              </p>

              <div className="grid md:grid-cols-2 gap-3">
                {ejercicios.map((ej) => {
                  const activo = ejercicioActivo?.id === ej.id;
                  return (
                    <div
                      key={ej.id}
                      className={`border-2 rounded-2xl p-4 text-sm transition-all duration-200 ${
                        activo
                          ? "border-amber-500 bg-white shadow-lg scale-105"
                          : "border-amber-200 bg-white/80 hover:border-amber-400 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">
                              {ej.tipo_ejercicio === "palabra_especifica" ? "📝" : 
                               ej.tipo_ejercicio === "fragmento_problematico" ? "📖" : "✏️"}
                            </span>
                            <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                              {ej.tipo_ejercicio === "palabra_especifica" ? "Palabra especial" : 
                               ej.tipo_ejercicio === "fragmento_problematico" ? "Frase para practicar" : "Ejercicio"}
                            </span>
                          </div>
                          
                          <p className="font-semibold text-slate-800 mb-2 text-base">
                            "{ej.texto_practica ?? "Ejercicio de práctica"}"
                          </p>
                          
                          {ej.palabras_objetivo && ej.palabras_objetivo.length > 0 && (
                            <div className="bg-amber-50 rounded-lg px-3 py-2 mb-2">
                              <p className="text-xs font-semibold text-amber-800 mb-1">
                                🎯 Palabras importantes:
                              </p>
                              <p className="text-xs text-slate-700 font-medium">
                                {ej.palabras_objetivo.join(", ")}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => onSelectEjercicio(ej)}
                          className={`text-xs font-bold px-4 py-2 rounded-full border-2 transition-all ${
                            activo
                              ? "border-amber-600 bg-amber-500 text-white shadow-md"
                              : "border-amber-400 bg-white text-amber-700 hover:bg-amber-50"
                          }`}
                        >
                          {activo ? "¡Practicando! 🎤" : "Practicar"}
                        </button>
                      </div>

                      {activo && (
                        <div className="mt-4 space-y-3 border-t-2 border-amber-100 pt-3">
                          <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                            <p className="text-xs font-semibold text-blue-800 mb-1">
                              💡 ¿Cómo practicar?
                            </p>
                            <p className="text-xs text-blue-700">
                              1. Lee este ejercicio en voz alta clara y despacio<br/>
                              2. Graba tu voz o sube un audio<br/>
                              3. ¡Yo te diré qué tan bien lo hiciste! ⭐
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 items-center">
                            {!grabandoPractica ? (
                              <button
                                type="button"
                                onClick={onStartGrabacionPractica}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 shadow-sm"
                              >
                                <MdMic size={16} />
                                🎤 Grabar mi voz
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={onStopGrabacionPractica}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-red-500 bg-red-50 text-red-700 text-xs font-bold animate-pulse"
                              >
                                <MdStop size={16} />
                                ⏹️ Detener grabación
                              </button>
                            )}

                            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-400 bg-white text-slate-700 text-xs font-bold cursor-pointer hover:bg-slate-50">
                              <MdUpload size={16} />
                              📁 Subir audio
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
                              disabled={cargandoPractica}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              <MdSend size={16} />
                              {cargandoPractica ? "⏳ Evaluando..." : "✨ ¡Evalúame!"}
                            </button>
                          </div>

                          {previewPractica && (
                            <div className="border-2 border-purple-200 rounded-xl p-3 bg-purple-50/50">
                              <p className="text-xs font-semibold text-purple-700 mb-2 flex items-center gap-1">
                                <MdVolumeUp /> Tu grabación:
                              </p>
                              <audio controls src={previewPractica} className="w-full" />
                            </div>
                          )}

                          {resultadoPractica && (
                            <div className={`mt-3 rounded-2xl p-4 border-2 ${
                              resultadoPractica.mejora_lograda 
                                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
                                : 'bg-gradient-to-br from-blue-50 to-sky-50 border-blue-300'
                            }`}>
                              <div className="text-center mb-3">
                                <p className="text-4xl mb-2">
                                  {resultadoPractica.mejora_lograda ? "🎉" : "💪"}
                                </p>
                                <p className={`text-base font-bold ${
                                  resultadoPractica.mejora_lograda ? 'text-green-700' : 'text-blue-700'
                                }`}>
                                  {resultadoPractica.mensaje_voz || (
                                    resultadoPractica.mejora_lograda
                                      ? "¡Excelente! ¡Lo hiciste muy bien!"
                                      : "¡Buen intento! Vamos a seguir practicando."
                                  )}
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-white/80 rounded-xl p-3 text-center border border-slate-200">
                                  <p className="text-xs text-slate-600 mb-1">Tu precisión</p>
                                  <p className="text-2xl font-extrabold text-indigo-600">
                                    {resultadoPractica.precision_global != null
                                      ? `${resultadoPractica.precision_global.toFixed(0)}%`
                                      : "—"}
                                  </p>
                                </div>
                                <div className="bg-white/80 rounded-xl p-3 text-center border border-slate-200">
                                  <p className="text-xs text-slate-600 mb-1">Estado</p>
                                  <p className="text-lg font-bold">
                                    {resultadoPractica.mejora_lograda ? "✅ ¡Mejorado!" : "🎯 Practicando"}
                                  </p>
                                </div>
                              </div>

                              {resultadoPractica.mensaje_detallado && (
                                <div className="bg-white/60 rounded-xl p-3 border border-slate-200">
                                  <p className="text-xs text-slate-700 leading-relaxed">
                                    {resultadoPractica.mensaje_detallado}
                                  </p>
                                </div>
                              )}

                              {resultadoPractica.palabras_problema && 
                               resultadoPractica.palabras_problema.length > 0 && (
                                <div className="mt-3 bg-white/60 rounded-xl p-3 border border-orange-200">
                                  <p className="text-xs font-bold text-orange-800 mb-2">
                                    🎯 Palabras para seguir practicando:
                                  </p>
                                  <div className="space-y-1">
                                    {resultadoPractica.palabras_problema.map((p, idx) => (
                                      <div key={idx} className="text-xs bg-orange-50 rounded-lg px-2 py-1">
                                        <span className="font-semibold text-orange-900">
                                          "{p.palabra}"
                                        </span>
                                        {p.sugerencia && (
                                          <span className="text-slate-600 ml-2">
                                            - {p.sugerencia}
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {resultadoPractica.mejora_lograda && (
                                <div className="mt-3 text-center">
                                  <p className="text-xs font-bold text-green-700">
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
            </div>
          )}
        </>
      )}
    </div>
  );
}