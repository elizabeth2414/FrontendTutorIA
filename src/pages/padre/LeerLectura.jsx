// src/pages/padre/LeerLectura.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLecturasHijo } from "../../services/padresService";

export default function LeerLectura() {
  const { hijoId, lecturaId } = useParams();
  const navigate = useNavigate();

  const [lectura, setLectura] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarLectura();
  }, []);

  const cargarLectura = async () => {
    try {
      const lista = await getLecturasHijo(hijoId);
      const encontrada = lista.find((l) => l.id === Number(lecturaId));
      setLectura(encontrada || null);
    } catch (error) {
      console.error("❌ Error obteniendo lectura:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando lectura...</div>;
  }

  if (!lectura) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-700 text-lg">No se encontró esta lectura.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          ⬅ Volver
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 flex flex-col">

      <div className="pt-20 text-center">
        <h1 className="text-4xl font-extrabold text-orange-700">
          📖 {lectura.titulo}
        </h1>
        <p className="text-gray-700 mt-2 italic">Curso: {lectura.curso}</p>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition shadow-md"
        >
          ⬅ Volver
        </button>
      </div>

      <main className="flex-1 px-8 py-6 md:px-32">

        <div className="bg-white/90 p-8 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">📝 Contenido</h2>

          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
            {lectura.contenido}
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <button
            onClick={() =>
              navigate(`/padre/menu/hijos/${hijoId}/actividades?lectura=${lectura.id}`)
            }
            className="py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition"
          >
            🎯 Ver actividades
          </button>

          <button
            onClick={() =>
              navigate(`/padre/menu/hijos/${hijoId}/practica/${lectura.id}`)
            }
            className="py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition"
          >
            🧠 Iniciar práctica de lectura
          </button>
        </div>
      </main>
    </div>
  );
}
