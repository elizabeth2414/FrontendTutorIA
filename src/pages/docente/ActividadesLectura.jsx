// src/pages/docente/ActividadesLectura.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  obtenerActividadesDeLectura,
  eliminarActividad,
  generarActividadesIA,
} from "../../services/iaActividadesService";
import {
  MdArrowBack,
  MdDelete,
  MdEdit,
  MdAdd,
  MdSmartToy,
  MdQuiz,
  MdCheckCircle,
} from "react-icons/md";

export default function ActividadesLectura() {
  const { lecturaId } = useParams();
  const navigate = useNavigate();

  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generandoIA, setGenerandoIA] = useState(false);

  useEffect(() => {
    cargarActividades();
  }, [lecturaId]);

  const cargarActividades = async () => {
    try {
      setLoading(true);
      const data = await obtenerActividadesDeLectura(lecturaId);
      setActividades(data);
    } catch (err) {
      console.error("Error cargando actividades:", err);
      alert("Error cargando actividades");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (actividadId) => {
    if (!confirm("¿Estás seguro de eliminar esta actividad?")) return;

    try {
      await eliminarActividad(actividadId);
      await cargarActividades();
      alert("✅ Actividad eliminada exitosamente");
    } catch (err) {
      console.error("Error eliminando actividad:", err);
      alert("Error eliminando actividad");
    }
  };

  const handleGenerarIA = async () => {
    if (!confirm("¿Deseas generar nuevas actividades con IA?")) return;

    try {
      setGenerandoIA(true);

      await generarActividadesIA(lecturaId, {
        num_preguntas: 5,
        incluir_verdadero_falso: true,
        incluir_multiple_choice: true,
        dificultad: 3,
        idioma: "es",
      });

      alert("✅ Actividades generadas correctamente 🎉");
      await cargarActividades();
    } catch (err) {
      console.error("Error generando actividades:", err);
      const errorMsg = err.message || "Error generando actividades con IA";
      alert(`❌ ${errorMsg}`);
    } finally {
      setGenerandoIA(false);
    }
  };

  const handleVerDetalle = (actividadId) => {
    navigate(`/docente/menu/actividades/${actividadId}/detalle`);
  };

  return (
    <div className="p-6">
      {/* LOADER IA */}
      {generandoIA && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
            <p className="mt-4 text-lg font-semibold text-purple-700">
              Generando actividades con IA...
            </p>
            <p className="text-gray-600 text-sm">Por favor espera</p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/docente/menu/lecturas")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdArrowBack size={24} />
          </button>
          <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
            <MdQuiz size={32} />
            Actividades de la Lectura
          </h1>
        </div>

        <button
          onClick={handleGenerarIA}
          disabled={generandoIA}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <MdSmartToy size={22} />
          Generar con IA
        </button>
      </div>

      {/* CONTENIDO */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="ml-3 text-gray-500">Cargando actividades...</p>
          </div>
        ) : actividades.length === 0 ? (
          <div className="text-center py-12">
            <MdQuiz size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              No hay actividades para esta lectura aún
            </p>
            <button
              onClick={handleGenerarIA}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
            >
              <MdSmartToy size={20} />
              Generar Primera Actividad con IA
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actividades.map((actividad) => (
              <div
                key={actividad.id}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow"
              >
                {/* HEADER DE LA CARD */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">
                      {actividad.titulo}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {actividad.descripcion || "Sin descripción"}
                    </p>
                  </div>
                  
                  {actividad.configuracion?.generado_por_ia && (
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <MdSmartToy size={14} />
                      IA
                    </span>
                  )}
                </div>

                {/* INFO */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MdQuiz size={16} />
                    <span>{actividad.preguntas?.length || 0} preguntas</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MdCheckCircle size={16} />
                    <span>{actividad.puntos_maximos} puntos máx.</span>
                  </div>
                  {actividad.tiempo_estimado && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>⏱️</span>
                      <span>{actividad.tiempo_estimado} min</span>
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-medium text-gray-500">
                      Dificultad:{" "}
                    </span>
                    <span className="text-xs font-bold">
                      {"★".repeat(actividad.dificultad || 1)}
                      {"☆".repeat(5 - (actividad.dificultad || 1))}
                    </span>
                  </div>
                </div>

                {/* ACCIONES */}
                <div className="flex gap-2 pt-3 border-t">
                  <button
                    onClick={() => handleVerDetalle(actividad.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                  >
                    <MdEdit size={16} />
                    Ver/Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(actividad.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
