// src/components/lectura/ZonaPracticaIA.jsx
import {
  MdMic,
  MdStop,
  MdUpload,
  MdSend,
} from "react-icons/md";

export default function ZonaPracticaIA({
  ejercicios,
  ejercicioActivo,
  grabandoPractica,
  previewPractica,
  cargandoPractica,
  resultadoPractica,
  onSelectEjercicio,
  onStartGrabacionPractica,
  onStopGrabacionPractica,
  onArchivoPractica,
  onEnviarPractica,
}) {
  // Si todavía no hay ejercicios, mostramos igual la tarjeta,
  // pero con un mensajito en vez de ocultarla.
  const hayEjercicios = Array.isArray(ejercicios) && ejercicios.length > 0;

  return (
    <div className="bg-white/90 border border-amber-100 rounded-2xl p-4 shadow-sm space-y-4">
      <h3 className="text-sm font-semibold text-slate-800">
        Zona de práctica (ejercicios generados por la IA)
      </h3>
      <p className="text-xs text-slate-500">
        El estudiante elige un ejercicio, practica leyendo solo ese fragmento y la IA le dice si mejoró.
      </p>

      {!hayEjercicios && (
        <div className="border border-dashed border-amber-200 rounded-2xl p-3 bg-amber-50/40 text-xs text-amber-800">
          Aún no hay ejercicios recomendados para esta lectura.
          Cuando la IA detecte errores relevantes, aquí aparecerán
          ejercicios de práctica de palabras y frases. ✨
        </div>
      )}

      {hayEjercicios && (
        <div className="grid md:grid-cols-2 gap-3">
          {ejercicios.map((ej) => {
            const activo = ejercicioActivo?.id === ej.id;
            return (
              <div
                key={ej.id}
                className={`border rounded-2xl p-3 text-sm transition ${
                  activo
                    ? "border-amber-400 bg-amber-50/80 shadow-md"
                    : "border-amber-100 bg-amber-50/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">
                      {ej.tipo_ejercicio ?? "Ejercicio"}
                    </span>
                    <p className="mt-1 font-medium text-slate-800">
                      {ej.texto_practica ?? "Ejercicio de práctica"}
                    </p>
                    {ej.palabras_objetivo && ej.palabras_objetivo.length > 0 && (
                      <p className="mt-1 text-[11px] text-slate-600">
                        Palabras objetivo:{" "}
                        {ej.palabras_objetivo.join(", ")}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectEjercicio(ej)}
                    className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${
                      activo
                        ? "border-amber-500 bg-amber-500 text-white"
                        : "border-amber-300 bg-white text-amber-700 hover:bg-amber-100"
                    }`}
                  >
                    {activo ? "Practicando..." : "Practicar ahora"}
                  </button>
                </div>

                {activo && (
                  <div className="mt-3 space-y-2 border-t border-amber-100 pt-2">
                    <p className="text-[11px] text-slate-600">
                      Pídele al estudiante que lea en voz alta solo
                      este ejercicio. Luego graba o sube el audio y
                      la IA le dirá si mejoró.
                    </p>
                    <div className="flex flex-wrap gap-2 items-center">
                      {!grabandoPractica ? (
                        <button
                          type="button"
                          onClick={onStartGrabacionPractica}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-400 bg-emerald-50 text-emerald-700 text-[11px] font-medium"
                        >
                          <MdMic />
                          Grabar práctica
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={onStopGrabacionPractica}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-red-400 bg-red-50 text-red-700 text-[11px] font-medium"
                        >
                          <MdStop />
                          Detener
                        </button>
                      )}

                      <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-700 text-[11px] cursor-pointer">
                        <MdUpload />
                        <span>Subir audio</span>
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
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-[11px] font-semibold disabled:opacity-60"
                      >
                        <MdSend />
                        {cargandoPractica ? "Evaluando..." : "Evaluar práctica"}
                      </button>
                    </div>

                    {previewPractica && (
                      <div className="border border-slate-200 rounded-xl px-2 py-1 bg-white">
                        <audio controls src={previewPractica} className="w-full" />
                      </div>
                    )}

                    {resultadoPractica && (
                      <div className="mt-1 text-[11px] space-y-1">
                        <p className="font-semibold text-emerald-700">
                          {resultadoPractica.mejora_lograda
                            ? "¡Genial! La IA detecta mejora en esta práctica 🎉"
                            : "Todavía podemos mejorar un poco más en esta parte."}
                        </p>
                        <p className="text-slate-600">
                          Precisión en este ejercicio:{" "}
                          {resultadoPractica.precision_global != null
                            ? `${resultadoPractica.precision_global.toFixed(1)}%`
                            : "—"}
                        </p>
                        {resultadoPractica.mensaje_practica && (
                          <p className="text-slate-600">
                            {resultadoPractica.mensaje_practica}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
