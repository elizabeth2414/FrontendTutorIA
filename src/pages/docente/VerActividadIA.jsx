// src/pages/docente/VerActividadIA.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { obtenerActividadIA } from "../../services/iaActividadesService";

import {
  MdArrowBack,
  MdQuiz,
  MdHelp,
  MdCheckCircle,
  MdClose,
} from "react-icons/md";

export default function VerActividadIA() {
  const { actividadId } = useParams();
  const navigate = useNavigate();

  const [actividad, setActividad] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================================
  // Cargar actividad al entrar
  // ================================
  useEffect(() => {
    cargarActividad();
  }, []);

  const cargarActividad = async () => {
    try {
      setLoading(true);
      const data = await obtenerActividadIA(actividadId);
      setActividad(data);
    } catch (error) {
      console.error("Error obteniendo actividad IA:", error);
      alert("No se pudo cargar la actividad.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Cargando actividad...</p>
      </div>
    );
  }

  if (!actividad) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Actividad no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg"
        >
          <MdArrowBack size={22} />
        </button>

        <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
          <MdQuiz size={32} />
          {actividad.titulo}
        </h1>
      </div>

      {/* INFO GENERAL */}
      <div className="bg-white p-5 rounded-xl shadow-md mb-6">
        <p className="text-gray-700"><strong>Descripción:</strong> {actividad.descripcion}</p>
        <p className="text-gray-700 mt-2">
          <strong>Total de preguntas:</strong> {actividad.preguntas.length}
        </p>
        <p className="text-gray-700 mt-1">
          <strong>Dificultad:</strong> {actividad.dificultad}
        </p>
        <p className="text-gray-700 mt-1">
          <strong>Puntos máximos:</strong> {actividad.puntos_maximos}
        </p>
      </div>

      {/* LISTADO DE PREGUNTAS */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">
          Preguntas
        </h2>

        <div className="space-y-5">
          {actividad.preguntas.map((p) => (
            <div
              key={p.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow transition"
            >
              <h3 className="text-lg font-bold text-blue-600 flex items-center gap-2">
                <MdHelp size={22} />
                {p.orden}. {p.texto_pregunta}
              </h3>

              {/* OPCIONES */}
              {p.opciones && Array.isArray(p.opciones) && (
                <ul className="mt-3 ml-6 list-disc text-gray-700">
                  {p.opciones.map((op, idx) => (
                    <li key={idx}>{op}</li>
                  ))}
                </ul>
              )}

              {/* RESPUESTA CORRECTA */}
              {p.respuesta_correcta && (
                <div className="mt-3 flex items-center gap-2 text-green-700 font-semibold">
                  <MdCheckCircle size={20} />
                  Respuesta correcta: {p.respuesta_correcta}
                </div>
              )}

              {/* EXPLICACIÓN */}
              {p.explicacion && (
                <p className="mt-2 text-gray-600 text-sm italic">
                  💡 {p.explicacion}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
