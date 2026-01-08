// src/pages/docente/ActividadDetalle.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  obtenerActividadIA,
  actualizarActividad,
  eliminarPregunta,
} from "../../services/iaActividadesService";
import {
  MdArrowBack,
  MdEdit,
  MdSave,
  MdDelete,
  MdClose,
  MdQuiz,
} from "react-icons/md";

export default function ActividadDetalle() {
  const { actividadId } = useParams();
  const navigate = useNavigate();

  const [actividad, setActividad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [formActividad, setFormActividad] = useState({
    titulo: "",
    descripcion: "",
    dificultad: 1,
    tiempo_estimado: 0,
    puntos_maximos: 0,
  });

  useEffect(() => {
    cargarActividad();
  }, [actividadId]);

  const cargarActividad = async () => {
    try {
      setLoading(true);
      const data = await obtenerActividadIA(actividadId);
      setActividad(data);
      setFormActividad({
        titulo: data.titulo,
        descripcion: data.descripcion || "",
        dificultad: data.dificultad || 1,
        tiempo_estimado: data.tiempo_estimado || 0,
        puntos_maximos: data.puntos_maximos || 0,
      });
    } catch (err) {
      console.error("Error cargando actividad:", err);
      alert("Error cargando actividad");
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarActividad = async () => {
    try {
      await actualizarActividad(actividadId, formActividad);
      alert("✅ Actividad actualizada exitosamente");
      setEditando(false);
      await cargarActividad();
    } catch (err) {
      console.error("Error actualizando actividad:", err);
      alert("Error actualizando actividad");
    }
  };

  const handleEliminarPregunta = async (preguntaId) => {
    if (!confirm("¿Estás seguro de eliminar esta pregunta?")) return;

    try {
      await eliminarPregunta(preguntaId);
      alert("✅ Pregunta eliminada");
      await cargarActividad();
    } catch (err) {
      console.error("Error eliminando pregunta:", err);
      alert("Error eliminando pregunta");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!actividad) {
    return (
      <div className="p-6">
        <p className="text-red-600">Actividad no encontrada</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <MdArrowBack size={24} />
        </button>
        <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
          <MdQuiz size={32} />
          Detalle de Actividad
        </h1>
      </div>

      {/* INFORMACIÓN DE LA ACTIVIDAD */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {editando ? (
              <input
                type="text"
                value={formActividad.titulo}
                onChange={(e) =>
                  setFormActividad({ ...formActividad, titulo: e.target.value })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              />
            ) : (
              actividad.titulo
            )}
          </h2>

          {!editando ? (
            <button
              onClick={() => setEditando(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <MdEdit size={18} />
              Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleGuardarActividad}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <MdSave size={18} />
                Guardar
              </button>
              <button
                onClick={() => {
                  setEditando(false);
                  setFormActividad({
                    titulo: actividad.titulo,
                    descripcion: actividad.descripcion || "",
                    dificultad: actividad.dificultad || 1,
                    tiempo_estimado: actividad.tiempo_estimado || 0,
                    puntos_maximos: actividad.puntos_maximos || 0,
                  });
                }}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <MdClose size={18} />
                Cancelar
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            {editando ? (
              <textarea
                value={formActividad.descripcion}
                onChange={(e) =>
                  setFormActividad({
                    ...formActividad,
                    descripcion: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows={3}
              />
            ) : (
              <p className="text-gray-600">
                {actividad.descripcion || "Sin descripción"}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dificultad (1-5)
              </label>
              {editando ? (
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formActividad.dificultad}
                  onChange={(e) =>
                    setFormActividad({
                      ...formActividad,
                      dificultad: parseInt(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              ) : (
                <p className="text-gray-800 font-semibold">
                  {"★".repeat(actividad.dificultad || 1)}
                  {"☆".repeat(5 - (actividad.dificultad || 1))}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiempo estimado (min)
              </label>
              {editando ? (
                <input
                  type="number"
                  min="0"
                  value={formActividad.tiempo_estimado}
                  onChange={(e) =>
                    setFormActividad({
                      ...formActividad,
                      tiempo_estimado: parseInt(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              ) : (
                <p className="text-gray-800 font-semibold">
                  {actividad.tiempo_estimado || 0} min
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Puntos máximos
              </label>
              {editando ? (
                <input
                  type="number"
                  min="0"
                  value={formActividad.puntos_maximos}
                  onChange={(e) =>
                    setFormActividad({
                      ...formActividad,
                      puntos_maximos: parseInt(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              ) : (
                <p className="text-gray-800 font-semibold">
                  {actividad.puntos_maximos} pts
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PREGUNTAS */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Preguntas ({actividad.preguntas?.length || 0})
        </h3>

        {actividad.preguntas && actividad.preguntas.length > 0 ? (
          <div className="space-y-4">
            {actividad.preguntas.map((pregunta, index) => (
              <div
                key={pregunta.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      Pregunta {index + 1}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({pregunta.tipo_respuesta})
                    </span>
                  </div>
                  <button
                    onClick={() => handleEliminarPregunta(pregunta.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>

                <p className="text-gray-800 font-medium mb-2">
                  {pregunta.texto_pregunta}
                </p>

                {pregunta.opciones && (
                  <div className="ml-4 space-y-1">
                    {pregunta.opciones.map((opcion, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span
                          className={`text-sm ${
                            opcion === pregunta.respuesta_correcta
                              ? "text-green-600 font-semibold"
                              : "text-gray-600"
                          }`}
                        >
                          {opcion === pregunta.respuesta_correcta && "✓ "}
                          {opcion}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {pregunta.explicacion && (
                  <div className="mt-2 bg-gray-50 rounded p-2">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Explicación:</span>{" "}
                      {pregunta.explicacion}
                    </p>
                  </div>
                )}

                <div className="mt-2 text-xs text-gray-500">
                  Puntuación: {pregunta.puntuacion} pts
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-center py-8">
            No hay preguntas en esta actividad
          </p>
        )}
      </div>
    </div>
  );
}
