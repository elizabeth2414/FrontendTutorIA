import { useEffect, useState } from "react";
import {
  getMiHistorialPronunciacion,
  getMisPracticasPronunciacion,
} from "../../services/historialService";

export default function ProgresoPronunciacion() {
  const [pronunciacion, setPronunciacion] = useState([]);
  const [practicas, setPracticas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [p, pr] = await Promise.all([
          getMiHistorialPronunciacion(),
          getMisPracticasPronunciacion()
        ]);
        
        // Asegurar que siempre sean arrays
        setPronunciacion(Array.isArray(p) ? p : []);
        setPracticas(Array.isArray(pr) ? pr : []);
        
        console.log("Pronunciación:", p);
        console.log("Prácticas:", pr);
      } catch (err) {
        console.error("Error al cargar progreso:", err);
        setError(err.message || "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando progreso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">Error al cargar datos</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const sinDatos = pronunciacion.length === 0 && practicas.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-24 max-w-6xl mx-auto p-6 space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow">
            <span className="text-2xl">📈</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-600">
              Mi progreso de pronunciación
            </h1>
            <p className="text-sm text-slate-600">
              Seguimiento de tu avance en lectura y prácticas
            </p>
          </div>
        </div>

        {/* SIN DATOS */}
        {sinDatos ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              Aún no tienes progreso registrado
            </h3>
            <p className="text-slate-500">
              Comienza a practicar para ver tu evolución aquí
            </p>
          </div>
        ) : (
          <>
            {/* ================= PRONUNCIACIÓN ================= */}
            <section className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <span className="text-xl">📖</span>
                </div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Lecturas evaluadas ({pronunciacion.length})
                </h2>
              </div>

              {pronunciacion.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                  No hay lecturas evaluadas aún
                </p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pronunciacion.map((h) => (
                    <div
                      key={h.id}
                      className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-5 hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl font-bold text-indigo-600">
                          {h.puntuacion_global ?? "-"}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(h.fecha).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Fluidez:</span>
                          <span className="font-semibold text-slate-800">
                            {h.fluidez ?? "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Velocidad:</span>
                          <span className="font-semibold text-slate-800">
                            {h.velocidad ?? "-"}
                          </span>
                        </div>
                        {h.palabras_por_minuto && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">PPM:</span>
                            <span className="font-semibold text-slate-800">
                              {h.palabras_por_minuto}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ================= PRÁCTICAS ================= */}
            <section className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <span className="text-xl">🎯</span>
                </div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Prácticas de pronunciación ({practicas.length})
                </h2>
              </div>

              {practicas.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                  No hay prácticas registradas aún
                </p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {practicas.map((p) => (
                    <div
                      key={p.id}
                      className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-xl p-5 hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl font-bold text-emerald-600">
                          {p.puntuacion ?? "-"}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(p.fecha).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Errores detectados:</span>
                          <span className="font-semibold text-slate-800">
                            {p.errores_detectados ?? 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Corregidos:</span>
                          <span className="font-semibold text-emerald-600">
                            {p.errores_corregidos ?? 0}
                          </span>
                        </div>
                        {p.tiempo_practica && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">Tiempo:</span>
                            <span className="font-semibold text-slate-800">
                              {Math.round(p.tiempo_practica / 60)} min
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

      </div>
    </div>
  );
}