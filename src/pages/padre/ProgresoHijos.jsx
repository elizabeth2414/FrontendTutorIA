import { useEffect, useState } from "react";
import {
  getHistorialPronunciacionHijo,
  getPracticasPronunciacionHijo,
} from "../../services/historialService";
import { getMisHijos } from "../../services/padresService";

import PronunciacionChart from "../../components/charts/PronunciacionChart";
import PracticasChart from "../../components/charts/PracticasChart";

import { MdInsights, MdTrendingUp, MdFlag } from "react-icons/md";

export default function ProgresoHijos() {
  const [hijos, setHijos] = useState([]);
  const [activo, setActivo] = useState(null);
  const [pron, setPron] = useState([]);
  const [prac, setPrac] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgreso, setLoadingProgreso] = useState(false);
  const [error, setError] = useState(null);

  // ==========================
  // Cargar hijos al montar
  // ==========================
  useEffect(() => {
    const cargarHijos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getMisHijos();
        const lista = Array.isArray(data) ? data : [];

        // ✅ Los datos YA son estudiantes directamente
        // El endpoint /padres/mis-hijos retorna la lista de estudiantes
        setHijos(lista);
        
        console.log("Hijos cargados:", lista);
        
        // Si hay hijos, seleccionar el primero automáticamente
        if (lista.length > 0) {
          await cargarProgreso(lista[0].id);
        }
      } catch (err) {
        console.error("Error al cargar hijos:", err);
        setError("No se pudieron cargar los hijos");
      } finally {
        setLoading(false);
      }
    };

    cargarHijos();
  }, []);

  // ==========================
  // Cargar progreso del hijo
  // ==========================
  const cargarProgreso = async (id) => {
    try {
      setLoadingProgreso(true);
      setActivo(id);
      
      console.log("Cargando progreso para estudiante:", id);
      
      const [pronunciacionData, practicasData] = await Promise.all([
        getHistorialPronunciacionHijo(id),
        getPracticasPronunciacionHijo(id)
      ]);
      
      // Asegurar que siempre sean arrays
      const pronArray = Array.isArray(pronunciacionData) ? pronunciacionData : [];
      const pracArray = Array.isArray(practicasData) ? practicasData : [];
      
      setPron(pronArray);
      setPrac(pracArray);
      
      console.log("Pronunciación cargada:", pronArray);
      console.log("Prácticas cargadas:", pracArray);
    } catch (err) {
      console.error("Error al cargar progreso:", err);
      setPron([]);
      setPrac([]);
    } finally {
      setLoadingProgreso(false);
    }
  };

  // ==========================
  // Estados de carga
  // ==========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto pt-24">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-semibold mb-2">Error</p>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const hijoActual = hijos.find(h => h.id === activo);
  const sinDatos = pron.length === 0 && prac.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-24 max-w-6xl mx-auto p-6 space-y-8">

        {/* HEADER */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow">
            <MdInsights size={26} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-600">
              Progreso académico
            </h1>
            <p className="text-sm text-slate-600">
              Seguimiento del avance en pronunciación y prácticas
            </p>
          </div>
        </div>

        {/* SELECTOR DE HIJOS */}
        <section className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Selecciona un hijo
          </p>

          {hijos.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👨‍👩‍👧‍👦</span>
              </div>
              <p className="text-slate-600 font-medium mb-2">
                No tienes hijos registrados
              </p>
              <p className="text-sm text-slate-500">
                Registra a tus hijos para ver su progreso
              </p>
            </div>
          ) : (
            <div className="flex gap-3 flex-wrap">
              {hijos.map((h) => (
                <button
                  key={h.id}
                  onClick={() => cargarProgreso(h.id)}
                  disabled={loadingProgreso}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition
                    ${
                      activo === h.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }
                    ${loadingProgreso ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {h.nombre}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* CONTENIDO */}
        {activo ? (
          loadingProgreso ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">
                Cargando progreso de {hijoActual?.nombre}...
              </p>
            </div>
          ) : sinDatos ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                {hijoActual?.nombre} aún no tiene progreso registrado
              </h3>
              <p className="text-slate-500">
                Los datos aparecerán aquí cuando comience a practicar
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Nombre del hijo activo */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-sm text-blue-600 font-medium">
                  Mostrando progreso de:
                </p>
                <p className="text-xl font-bold text-blue-900">
                  {hijoActual?.nombre}
                </p>
              </div>

              {/* PRONUNCIACIÓN */}
              <section className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <MdTrendingUp size={22} />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">
                      Evolución de pronunciación
                    </h2>
                  </div>
                  <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    {pron.length} registros
                  </span>
                </div>

                {pron.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">
                    No hay datos de pronunciación aún
                  </p>
                ) : (
                  <PronunciacionChart data={pron} />
                )}
              </section>

              {/* PRÁCTICAS */}
              <section className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <MdFlag size={22} />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">
                      Prácticas de pronunciación
                    </h2>
                  </div>
                  <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    {prac.length} prácticas
                  </span>
                </div>

                {prac.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">
                    No hay prácticas registradas aún
                  </p>
                ) : (
                  <PracticasChart data={prac} />
                )}
              </section>

            </div>
          )
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-600 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👆</span>
            </div>
            <p className="text-lg font-medium text-slate-700">
              Selecciona un hijo para visualizar su progreso académico
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
