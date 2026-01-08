// src/pages/docente/ActividadesGeneradas.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { obtenerActividadesDeLectura } from "../../services/iaActividadesService";

import { MdArrowBack, MdAutoStories, MdVisibility } from "react-icons/md";

export default function ActividadesGeneradas() {
  const { contenidoId } = useParams();
  const navigate = useNavigate();

  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================================
  // Cargar actividades IA
  // ================================
  useEffect(() => {
    cargarActividades();
  }, []);

  const cargarActividades = async () => {
    try {
      setLoading(true);

      const data = await obtenerActividadesDeLectura(contenidoId);
      setActividades(data);
    } catch (err) {
      console.error("Error cargando actividades:", err);
      alert("No se pudieron cargar las actividades IA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/docente/menu/lecturas")}
          className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg"
        >
          <MdArrowBack size={22} />
        </button>

        <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
          <MdAutoStories size={32} />
          Actividades Generadas por IA
        </h1>
      </div>

      {/* CONTENIDO */}
      <div className="bg-white shadow-md rounded-xl p-5">

        {loading ? (
          <p className="text-gray-500">Cargando actividades...</p>
        ) : actividades.length === 0 ? (
          <p className="text-gray-500 italic">
            No hay actividades generadas aún para esta lectura.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {actividades.map((a) => (
              <div
                key={a.id}
                className="p-5 border rounded-xl shadow hover:shadow-lg transition cursor-pointer"
              >
                <h2 className="text-xl font-semibold text-blue-700">
                  {a.titulo}
                </h2>

                <p className="text-gray-600 mt-2 text-sm">
                  {a.descripcion}
                </p>

                <p className="mt-3 text-gray-700 font-medium">
                  Preguntas: {a.preguntas.length}
                </p>

                <div className="flex justify-end mt-4">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    onClick={() =>
                      navigate(`/docente/menu/actividades/${a.id}`)
                    }
                  >
                    <MdVisibility size={20} />
                    Ver actividad
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
