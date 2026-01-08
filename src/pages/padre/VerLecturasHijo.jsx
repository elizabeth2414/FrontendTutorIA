import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLecturasHijo } from "../../services/padresService";
import { MdArrowBack, MdMenuBook } from "react-icons/md";

export default function VerLecturasHijo() {
  const { hijoId } = useParams();
  const navigate = useNavigate();

  const [lecturas, setLecturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hijoId) return;

    const cargarLecturas = async () => {
      try {
        const data = await getLecturasHijo(hijoId);
        setLecturas(data);
      } catch (error) {
        console.error("❌ Error cargando lecturas:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarLecturas();
  }, [hijoId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500">Cargando lecturas...</p>
        </div>
      </div>
    );
  }

  // 🔹 Agrupar lecturas por nivel
  const lecturasPorNivel = lecturas.reduce((acc, lectura) => {
    const nivel = lectura.nivel_dificultad;
    if (!acc[nivel]) acc[nivel] = [];
    acc[nivel].push(lectura);
    return acc;
  }, {});

  // 🔹 Determinar niveles desbloqueados
  const niveles = Object.keys(lecturasPorNivel)
    .map(Number)
    .sort((a, b) => a - b);

  const nivelesDesbloqueados = {};
  let nivelAnteriorCompleto = true;

  niveles.forEach((nivel) => {
    const todasCompletas = lecturasPorNivel[nivel].every(
      (l) => l.completada
    );
    nivelesDesbloqueados[nivel] = nivelAnteriorCompleto;
    nivelAnteriorCompleto = todasCompletas;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col gap-4">

          {/* VOLVER */}
          <button
            onClick={() => navigate(-1)}
            className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-xl
                       bg-white text-blue-700 font-medium
                       hover:bg-blue-50 transition shadow-sm"
          >
            <MdArrowBack size={18} />
            Volver
          </button>

          {/* TÍTULO */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white
                              flex items-center justify-center shadow-lg">
                <MdMenuBook size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-blue-700">
                  Lecturas del hijo
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Selecciona una lectura para iniciar la práctica de pronunciación
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MENSAJE SI NO HAY LECTURAS */}
        {lecturas.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-lg">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay lecturas disponibles
            </h3>
            <p className="text-gray-500">
              El docente aún no ha asignado lecturas para este estudiante.
            </p>
          </div>
        ) : (
          /* LISTA POR NIVELES */
          <div className="space-y-6">
            {niveles.map((nivel) => {
              const bloqueado = !nivelesDesbloqueados[nivel];

              return (
                <div key={nivel} className="space-y-3">

                  {/* NIVEL */}
                  <div className="flex items-center gap-3">
                    <div className={`px-4 py-2 rounded-xl font-bold text-lg ${
                      bloqueado 
                        ? "bg-gray-200 text-gray-500" 
                        : "bg-blue-600 text-white"
                    }`}>
                      Nivel {nivel}
                    </div>
                    {bloqueado && (
                      <span className="text-2xl">🔒</span>
                    )}
                  </div>

                  {/* TARJETAS */}
                  <div className="space-y-4">
                    {lecturasPorNivel[nivel].map((l) => (
                      <div
                        key={l.id}
                        className={`rounded-2xl border-2 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4
                          transition-all duration-300 ${
                            bloqueado
                              ? "bg-gray-100 border-gray-300 opacity-60"
                              : "bg-white border-blue-200 hover:border-blue-400 hover:shadow-xl"
                          }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg text-slate-800">
                              {l.titulo}
                            </h3>
                            {l.completada && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                ✅ Completada
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-slate-600 mb-2">
                            {l.contenido?.substring(0, 100)}
                            {l.contenido?.length > 100 ? "..." : ""}
                          </p>

                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                              📘 {l.curso || "Curso general"}
                            </span>
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                              🎯 Edad: {l.edad_recomendada} años
                            </span>
                            {l.actividades && l.actividades.length > 0 && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                🧩 {l.actividades.length} actividad{l.actividades.length > 1 ? "es" : ""}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            navigate(`/padre/menu/hijos/${hijoId}/practica-ia`, {
                              state: {
                                estudianteId: hijoId,
                                lecturaId: l.id,
                                // 🔥 PASAR TODA LA INFORMACIÓN DE LA LECTURA
                                lectura: {
                                  id: l.id,
                                  titulo: l.titulo,
                                  contenido: l.contenido,
                                  nivel_dificultad: l.nivel_dificultad,
                                  edad_recomendada: l.edad_recomendada,
                                  curso: l.curso,
                                  actividades: l.actividades
                                }
                              },
                            })
                          }
                          disabled={bloqueado}
                          className={`px-6 py-3 rounded-xl font-semibold text-sm
                            transition-all whitespace-nowrap flex items-center gap-2 ${
                              bloqueado
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            }`}
                        >
                          🧠 Iniciar práctica
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
