import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLecturasHijo } from "../../services/padresService";


export default function LecturasHijo() {
  const { hijoId } = useParams();
  const navigate = useNavigate();

  const [lecturas, setLecturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarLecturas();
  }, [hijoId]); // ✔ importante

  const cargarLecturas = async () => {
    try {
      const data = await getLecturasHijo(hijoId);
      setLecturas(data);
    } catch (error) {
      console.error("Error cargando lecturas:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-200 flex flex-col">

      <main className="pt-28 flex-1 p-6">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-10 drop-shadow">
          📘 Lecturas Asignadas
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Cargando lecturas...</p>
        ) : lecturas.length === 0 ? (
          <p className="text-center text-gray-600 text-xl">
            No hay lecturas asignadas a este hijo todavía.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lecturas.map((lec) => (
              <div
                key={lec.id}
                className="bg-white/80 shadow-xl p-6 rounded-3xl backdrop-blur-xl border border-white/30 hover:shadow-2xl transition"
              >
                <h2 className="text-2xl font-bold text-purple-700 text-center">
                  {lec.titulo}
                </h2>

                <p className="mt-3 text-gray-600 text-center text-sm">
                  {lec.descripcion || "Lectura asignada por el docente"}
                </p>

                <div className="mt-6 space-y-3">
                  {/* ✔ RUTA CORREGIDA */}
                  <button
                    onClick={() =>
                      navigate(`/padre/menu/hijos/${hijoId}/lecturas/${lec.id}`)
                    }
                    className="w-full py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 hover:scale-105 transition"
                  >
                    🎤 Hacer Lectura con IA
                  </button>

                  {/* ✔ RUTA CORREGIDA */}
                  <button
                    onClick={() =>
                      navigate(`/padre/menu/hijos/${hijoId}/actividades/${lec.id}`)
                    }
                    className="w-full py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 hover:scale-105 transition"
                  >
                    📘 Actividades
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

 
    </div>
  );
}
