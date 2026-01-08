import { useEffect, useState } from "react";
import {
  getHistorialPronunciacionHijo,
  getPracticasPronunciacionHijo,
} from "../../services/historialService";
import { getMisHijos } from "../../services/padresService";

export default function HistorialHijo() {
  const [hijos, setHijos] = useState([]);
  const [hijoActivo, setHijoActivo] = useState(null);
  const [pronunciacion, setPronunciacion] = useState([]);
  const [practicas, setPracticas] = useState([]);

  useEffect(() => {
    getMisHijos().then(setHijos);
  }, []);

  const cargarHistorial = async (id) => {
    setHijoActivo(id);
    setPronunciacion(await getHistorialPronunciacionHijo(id));
    setPracticas(await getPracticasPronunciacionHijo(id));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        👨‍👩‍👧 Progreso de mis hijos
      </h1>

      {/* SELECTOR HIJO */}
      <div className="flex gap-3 flex-wrap">
        {hijos.map((h) => (
          <button
            key={h.id}
            onClick={() => cargarHistorial(h.id)}
            className={`px-4 py-2 rounded-lg ${
              hijoActivo === h.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {h.nombre} {h.apellido}
          </button>
        ))}
      </div>

      {hijoActivo && (
        <>
          <section>
            <h2 className="font-semibold text-lg">
              Lecturas evaluadas
            </h2>

            {pronunciacion.map((p) => (
              <div
                key={p.id}
                className="bg-white shadow p-3 rounded mt-2"
              >
                <p>Puntuación: {p.puntuacion_global}</p>
                <p>Fluidez: {p.fluidez}</p>
                <p className="text-sm text-gray-500">
                  {new Date(p.fecha).toLocaleDateString()}
                </p>
              </div>
            ))}
          </section>

          <section>
            <h2 className="font-semibold text-lg mt-6">
              Prácticas
            </h2>

            {practicas.map((p) => (
              <div
                key={p.id}
                className="bg-green-50 border p-3 rounded mt-2"
              >
                <p>Puntuación: {p.puntuacion}</p>
                <p>Errores corregidos: {p.errores_corregidos}</p>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
