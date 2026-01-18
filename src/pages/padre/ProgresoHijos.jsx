import { useEffect, useState } from "react";
import {
  getHistorialPronunciacionHijo,
  getPracticasPronunciacionHijo,
} from "../../services/historialService";
import { getMisHijos } from "../../services/padresService";
import { useNavigate } from "react-router-dom";

import PronunciacionChart from "../../components/charts/PronunciacionChart";
import PracticasChart from "../../components/charts/PracticasChart";

import { MdInsights, MdTrendingUp, MdFlag, MdArrowBack } from "react-icons/md";

export default function ProgresoHijos() {
  const navigate = useNavigate();
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
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 text-center shadow-lg border border-slate-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <div className="text-4xl">❌</div>
          </div>
          <h3 className="text-lg font-bold text-red-700 mb-2">Error</h3>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const hijoActual = hijos.find(h => h.id === activo);
  const sinDatos = pron.length === 0 && prac.length === 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      {/* VERSIÓN MÓVIL */}
      <div className="md:hidden min-h-screen bg-white">
        {/* Header móvil fijo */}
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-4 shadow-lg z-30">
          
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MdInsights size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white mb-0.5">Progreso Académico</h1>
              <p className="text-xs text-blue-100">Seguimiento de avances</p>
            </div>
          </div>
        </div>

        {/* Contenido móvil */}
        <main className="pt-32 px-4 pb-8 space-y-4">
          {/* Selector de hijos móvil */}
          <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200">
            <p className="text-sm font-semibold text-slate-700 mb-3">
              Selecciona un hijo
            </p>

            {hijos.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                </div>
                <p className="text-sm text-slate-600 font-medium mb-1">
                  No tienes hijos registrados
                </p>
                <p className="text-xs text-slate-500">
                  Registra a tus hijos para ver su progreso
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {hijos.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => cargarProgreso(h.id)}
                    disabled={loadingProgreso}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition ${
                      activo === h.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-blue-100 text-blue-700 active:bg-blue-200"
                    } ${loadingProgreso ? "opacity-50" : ""}`}
                  >
                    {h.nombre}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Contenido móvil */}
          {activo ? (
            loadingProgreso ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center border border-slate-200">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mx-auto mb-3"></div>
                <p className="text-sm text-slate-600">
                  Cargando progreso...
                </p>
              </div>
            ) : sinDatos ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center border border-slate-200">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">📚</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {hijoActual?.nombre} aún no tiene progreso
                </h3>
                <p className="text-sm text-slate-500">
                  Los datos aparecerán cuando comience a practicar
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Nombre del hijo móvil */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-xs text-blue-600 font-medium mb-0.5">
                    Mostrando progreso de:
                  </p>
                  <p className="text-base font-bold text-blue-900">
                    {hijoActual?.nombre}
                  </p>
                </div>

                {/* Pronunciación móvil */}
                <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <MdTrendingUp size={18} />
                      </div>
                      <h2 className="text-sm font-bold text-slate-900">
                        Pronunciación
                      </h2>
                    </div>
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {pron.length}
                    </span>
                  </div>

                  {pron.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">
                      No hay datos aún
                    </p>
                  ) : (
                    <PronunciacionChart data={pron} />
                  )}
                </div>

                {/* Prácticas móvil */}
                <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <MdFlag size={18} />
                      </div>
                      <h2 className="text-sm font-bold text-slate-900">
                        Prácticas
                      </h2>
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {prac.length}
                    </span>
                  </div>

                  {prac.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">
                      No hay prácticas aún
                    </p>
                  ) : (
                    <PracticasChart data={prac} />
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-slate-200">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">👆</span>
              </div>
              <p className="text-sm font-medium text-slate-700">
                Selecciona un hijo arriba
              </p>
            </div>
          )}
        </main>
      </div>

      {/* VERSIÓN DESKTOP */}
      <div className="hidden md:block min-h-screen bg-white pt-6">
        <main className="max-w-6xl mx-auto px-6 py-6 space-y-6">
          {/* Header desktop */}
          <div className="mb-6">
          

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                <MdInsights size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  Progreso Académico
                </h1>
                <p className="text-sm text-slate-600">
                  Seguimiento del avance en pronunciación y prácticas
                </p>
              </div>
            </div>
          </div>

          {/* Selector de hijos desktop */}
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-200">
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
                    className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition ${
                      activo === h.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    } ${loadingProgreso ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {h.nombre}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Contenido desktop */}
          {activo ? (
            loadingProgreso ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-slate-600">
                  Cargando progreso de {hijoActual?.nombre}...
                </p>
              </div>
            ) : sinDatos ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📚</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {hijoActual?.nombre} aún no tiene progreso registrado
                </h3>
                <p className="text-slate-500">
                  Los datos aparecerán aquí cuando comience a practicar
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Nombre del hijo desktop */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <p className="text-sm text-blue-600 font-medium mb-1">
                    Mostrando progreso de:
                  </p>
                  <p className="text-xl font-bold text-blue-900">
                    {hijoActual?.nombre}
                  </p>
                </div>

                {/* Pronunciación desktop */}
                <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <MdTrendingUp size={22} />
                      </div>
                      <h2 className="text-base font-bold text-slate-900">
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
                </div>

                {/* Prácticas desktop */}
                <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <MdFlag size={22} />
                      </div>
                      <h2 className="text-base font-bold text-slate-900">
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
                </div>
              </div>
            )
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👆</span>
              </div>
              <p className="text-lg font-medium text-slate-700">
                Selecciona un hijo para visualizar su progreso académico
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
