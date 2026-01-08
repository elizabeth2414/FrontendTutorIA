// src/components/lectura/LecturaIAView.jsx
import {
  MdMic,
  MdStop,
  MdUpload,
  MdSend,
  MdPlayArrow,
} from "react-icons/md";

export default function LecturaIAView({
  estudianteId,
  contenidoId,
  grabando,
  audioPreviewUrl,
  cargando,
  resultado,
  errorMsg,
  onChangeEstudianteId,
  onChangeContenidoId,
  onPlayLectura,
  onStartRecording,
  onStopRecording,
  onChangeFile,
  onSubmit,
}) {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Tutor IA de Lectura (Demo)
      </h1>
      <p className="text-gray-600 text-sm">
        1) El niño escucha la lectura. 2) El niño lee y graba su voz. 3) La IA
        analiza errores en palabras y puntuación y genera ejercicios.
      </p>

      {/* Datos básicos */}
      <div className="bg-white shadow rounded-xl p-4 grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Estudiante
          </label>
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={estudianteId}
            onChange={(e) => onChangeEstudianteId(e.target.value)}
            placeholder="Ej: 1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Contenido de Lectura
          </label>
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={contenidoId}
            onChange={(e) => onChangeContenidoId(e.target.value)}
            placeholder="Ej: 1"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={onPlayLectura}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 w-full justify-center"
          >
            <MdPlayArrow />
            Escuchar lectura
          </button>
        </div>
      </div>

      {/* Audio del niño */}
      <div className="bg-white shadow rounded-xl p-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Audio de la lectura del niño
        </h2>

        <div className="flex flex-wrap gap-4 items-center">
          {!grabando ? (
            <button
              type="button"
              onClick={onStartRecording}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-500 text-emerald-600 text-sm font-medium hover:bg-emerald-50"
            >
              <MdMic />
              Grabar con micrófono
            </button>
          ) : (
            <button
              type="button"
              onClick={onStopRecording}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500 text-red-600 text-sm font-medium hover:bg-red-50"
            >
              <MdStop />
              Detener grabación
            </button>
          )}

          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm cursor-pointer hover:bg-gray-50">
            <MdUpload />
            <span>Subir archivo de audio</span>
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={onChangeFile}
            />
          </label>

          <button
            type="button"
            onClick={onSubmit}
            disabled={cargando}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            <MdSend />
            {cargando ? "Analizando..." : "Enviar a la IA"}
          </button>
        </div>

        {audioPreviewUrl && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-1">
              Previsualización del audio del niño:
            </p>
            <audio controls src={audioPreviewUrl} className="w-full" />
          </div>
        )}

        {errorMsg && (
          <p className="mt-2 text-sm text-red-600 font-medium">{errorMsg}</p>
        )}
      </div>

      {/* Resultado */}
      {resultado && (
        <div className="bg-white shadow rounded-xl p-4 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Resultado del análisis
          </h2>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Precisión global</p>
              <p className="text-lg font-semibold text-emerald-600">
                {resultado.precision_global != null
                  ? `${resultado.precision_global.toFixed(1)} %`
                  : "—"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Palabras por minuto</p>
              <p className="text-lg font-semibold text-indigo-600">
                {resultado.palabras_por_minuto != null
                  ? resultado.palabras_por_minuto.toFixed(1)
                  : "—"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Intento</p>
              <p className="text-lg font-semibold text-gray-800">
                {resultado.numero_intento ?? "1"}
              </p>
            </div>
          </div>

          {resultado.retroalimentacion && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-sm text-emerald-900">
              <p className="font-semibold mb-1">Retroalimentación de la IA:</p>
              <p>{resultado.retroalimentacion}</p>
            </div>
          )}

          {/* Errores */}
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-2">
              Errores detectados
            </h3>
            {resultado.errores && resultado.errores.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-2 py-1 border">Tipo</th>
                      <th className="px-2 py-1 border">Original</th>
                      <th className="px-2 py-1 border">Leída</th>
                      <th className="px-2 py-1 border">Posición</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.errores.map((err, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-2 py-1 border">
                          {err.tipo_error ?? "—"}
                        </td>
                        <td className="px-2 py-1 border">
                          {err.palabra_original ?? "—"}
                        </td>
                        <td className="px-2 py-1 border">
                          {err.palabra_leida ?? "—"}
                        </td>
                        <td className="px-2 py-1 border">
                          {err.posicion ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                No se detectaron errores (¡excelente! 🎉).
              </p>
            )}
          </div>

          {/* Ejercicios */}
          {resultado.ejercicios_recomendados &&
            resultado.ejercicios_recomendados.length > 0 && (
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-2">
                  Ejercicios recomendados
                </h3>
                <ul className="space-y-2 text-sm">
                  {resultado.ejercicios_recomendados.map((ej) => (
                    <li
                      key={ej.id}
                      className="border rounded-lg p-2 bg-gray-50 flex flex-col gap-1"
                    >
                      <span className="text-xs text-gray-500">
                        Tipo: {ej.tipo_ejercicio ?? "—"}
                      </span>
                      <span className="font-medium">
                        {ej.texto_practica ?? "Ejercicio de práctica"}
                      </span>
                      {ej.palabras_objetivo &&
                        ej.palabras_objetivo.length > 0 && (
                          <span className="text-xs text-gray-600">
                            Palabras objetivo:{" "}
                            {ej.palabras_objetivo.join(", ")}
                          </span>
                        )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
