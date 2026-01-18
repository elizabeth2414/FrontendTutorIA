// src/pages/padre/ActividadesHijos.jsx

import { useEffect, useState } from "react";
import { getMisHijos, getLecturasHijo, obtenerActividadesLectura } from "../../services/padresService";
import { useNavigate } from "react-router-dom";
import { 
  MdQuiz, 
  MdCheckCircle, 
  MdLock, 
  MdPlayArrow,
  MdArrowForward,
  MdBook,
  MdTimer,
  MdStars,
  MdSearch,
  MdArrowBack
} from "react-icons/md";

export default function ActividadesHijos() {
  const [hijos, setHijos] = useState([]);
  const [hijosConActividades, setHijosConActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Filtrar hijos por término de búsqueda
  const hijosFiltrados = hijosConActividades.filter(hijo =>
    `${hijo.nombre} ${hijo.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ==========================
  // Cargar hijos y sus actividades
  // ==========================
  useEffect(() => {
    const cargarHijosYActividades = async () => {
      try {
        console.log("🔄 Cargando hijos y actividades...");
        setLoading(true);
        setError(null);
        
        const data = await getMisHijos();
        console.log("📦 Datos recibidos:", data);
        
        let lista = [];
        
        if (Array.isArray(data)) {
          lista = data;
        } else if (data && Array.isArray(data.hijos)) {
          lista = data.hijos;
        } else if (data && typeof data === 'object') {
          lista = [data];
        }

        const estudiantes = lista.map((item) => {
          const est = item.estudiante || item;
          
          return {
            id: est.id,
            nombre: est.nombre || "",
            apellido: est.apellido || "",
            nivel_educativo: est.nivel_educativo || 1,
            activo: est.activo !== false
          };
        }).filter(est => est.id);

        setHijos(estudiantes);

        // 🔥 CARGAR LECTURAS Y ACTIVIDADES DE CADA HIJO
        const hijosConActividadesTemp = [];

        for (const hijo of estudiantes) {
          try {
            const lecturas = await getLecturasHijo(hijo.id);
            const lecturasArray = Array.isArray(lecturas) ? lecturas : lecturas.lecturas || [];

            // 🔥 PROCESAR CADA LECTURA Y CARGAR SUS ACTIVIDADES
            const lecturasConActividadesPromises = lecturasArray.map(async (lectura) => {
              try {
                const actividades = await obtenerActividadesLectura(lectura.id);
                return {
                  ...lectura,
                  actividades: actividades || [],
                  tieneActividades: actividades && actividades.length > 0
                };
              } catch (error) {
                console.log(`No hay actividades para lectura ${lectura.id}`);
                return {
                  ...lectura,
                  actividades: [],
                  tieneActividades: false
                };
              }
            });

            const lecturasConActividades = await Promise.all(lecturasConActividadesPromises);

            // Separar lecturas completadas con actividades
            const lecturasCompletadasConActividades = lecturasConActividades.filter(
              lectura => lectura.completada && lectura.tieneActividades
            );

            // Lecturas pendientes (sin completar)
            const lecturasPendientes = lecturasConActividades.filter(
              lectura => !lectura.completada
            );

            // Contar actividades totales
            let totalActividades = 0;
            let actividadesCompletadas = 0;

            lecturasCompletadasConActividades.forEach(lectura => {
              totalActividades += lectura.actividades.length;
            });

            hijosConActividadesTemp.push({
              ...hijo,
              lecturasCompletadas: lecturasCompletadasConActividades,
              lecturasPendientes: lecturasPendientes,
              totalActividades,
              actividadesCompletadas,
              progresoActividades: totalActividades > 0 
                ? Math.round((actividadesCompletadas / totalActividades) * 100) 
                : 0
            });

          } catch (error) {
            console.error(`Error cargando lecturas del hijo ${hijo.id}:`, error);
            hijosConActividadesTemp.push({
              ...hijo,
              lecturasCompletadas: [],
              lecturasPendientes: [],
              totalActividades: 0,
              actividadesCompletadas: 0,
              progresoActividades: 0
            });
          }
        }

        setHijosConActividades(hijosConActividadesTemp);
        console.log("✅ Hijos con actividades:", hijosConActividadesTemp);
        
      } catch (err) {
        console.error("❌ Error cargando hijos:", err);
        setError(err.message || "Error al cargar los hijos");
      } finally {
        setLoading(false);
      }
    };

    cargarHijosYActividades();
  }, []);

  // ==========================
  // PANTALLA DE CARGA
  // ==========================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando actividades...</p>
        </div>
      </div>
    );
  }

  // ==========================
  // PANTALLA DE ERROR
  // ==========================
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 text-center shadow-lg border border-slate-200 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <div className="text-4xl">❌</div>
          </div>
          <h3 className="text-lg font-bold text-red-700">Error al cargar</h3>
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition font-semibold shadow-md active:scale-95"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

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
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-3 transition-colors"
          >
            <MdArrowBack size={16} />
            <span className="font-medium text-xs">Volver</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MdQuiz size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white mb-0.5">Actividades</h1>
              <p className="text-xs text-blue-100">{hijosConActividades.length} hijo{hijosConActividades.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        {/* Contenido móvil */}
        <main className="pt-32 px-4 pb-8">
          {/* Buscador móvil */}
          <div className="mb-5">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <MdSearch size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar hijo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none text-sm transition-all"
              />
            </div>
          </div>

          {/* Sin hijos */}
          {hijosConActividades.length === 0 ? (
            <div className="bg-white border-2 border-slate-200 rounded-xl p-8 text-center">
              <div className="text-5xl mb-3">📭</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                No hay hijos vinculados
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Aún no tienes hijos vinculados.
              </p>
              <button
                onClick={() => navigate("/padre/menu/hijos")}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition font-semibold shadow-md active:scale-95"
              >
                Ir a Mis Hijos
              </button>
            </div>
          ) : hijosFiltrados.length === 0 ? (
            <div className="bg-white border-2 border-slate-200 rounded-xl p-8 text-center">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                No se encontraron hijos
              </h3>
              <p className="text-sm text-slate-600">
                Intenta con otro término de búsqueda.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {hijosFiltrados.map((hijo) => (
                <div key={hijo.id} className="space-y-3">
                  
                  {/* Header del hijo móvil */}
                  <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md text-lg">
                        {hijo.nombre?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900">
                          {hijo.nombre} {hijo.apellido}
                        </h2>
                        <p className="text-xs text-slate-600">
                          Nivel {hijo.nivel_educativo}
                        </p>
                      </div>
                    </div>

                    {/* Estadísticas móvil */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center bg-blue-50 border border-blue-200 rounded-lg px-2 py-2">
                        <p className="text-blue-600 font-semibold uppercase text-[10px]">
                          Completadas
                        </p>
                        <p className="font-bold text-blue-700 text-lg">
                          {hijo.lecturasCompletadas.length}
                        </p>
                      </div>
                      <div className="text-center bg-purple-50 border border-purple-200 rounded-lg px-2 py-2">
                        <p className="text-purple-600 font-semibold uppercase text-[10px]">
                          Pendientes
                        </p>
                        <p className="font-bold text-purple-700 text-lg">
                          {hijo.lecturasPendientes.length}
                        </p>
                      </div>
                      <div className="text-center bg-green-50 border border-green-200 rounded-lg px-2 py-2">
                        <p className="text-green-600 font-semibold uppercase text-[10px]">
                          Actividades
                        </p>
                        <p className="font-bold text-green-700 text-lg">
                          {hijo.totalActividades}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lecturas completadas móvil */}
                  {hijo.lecturasCompletadas.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200">
                      <h3 className="text-sm font-bold text-green-700 mb-3 flex items-center gap-2">
                        <MdCheckCircle size={18} />
                        Lecturas completadas
                      </h3>

                      <div className="space-y-3">
                        {hijo.lecturasCompletadas.map((lectura) => (
                          <div
                            key={lectura.id}
                            className="border border-green-200 rounded-lg p-3 bg-green-50"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="text-sm font-bold text-slate-900 mb-1">
                                  {lectura.titulo}
                                </h4>
                                <p className="text-xs text-slate-600 line-clamp-2">
                                  {lectura.contenido?.substring(0, 60)}...
                                </p>
                              </div>
                              <div className="bg-green-100 rounded-full p-1 ml-2 flex-shrink-0">
                                <MdCheckCircle className="text-green-600" size={16} />
                              </div>
                            </div>

                            {/* Actividades */}
                            <div className="space-y-2 mb-3">
                              <p className="font-semibold text-slate-600 uppercase text-[10px]">
                                Actividades ({lectura.actividades.length}):
                              </p>
                              {lectura.actividades.slice(0, 2).map((actividad, idx) => (
                                <div
                                  key={actividad.id || idx}
                                  className="flex items-center gap-2 bg-white border border-green-200 rounded-lg p-2"
                                >
                                  <MdQuiz className="text-green-600 flex-shrink-0" size={14} />
                                  <p className="text-xs font-medium text-slate-800 truncate flex-1">
                                    {actividad.titulo || `Actividad ${idx + 1}`}
                                  </p>
                                </div>
                              ))}
                              {lectura.actividades.length > 2 && (
                                <p className="text-[10px] text-slate-500 text-center">
                                  + {lectura.actividades.length - 2} más
                                </p>
                              )}
                            </div>

                            {/* Botones */}
                            {lectura.actividades.length === 1 ? (
                              <button
                                onClick={() => navigate(
                                  `/padre/menu/hijos/${hijo.id}/lecturas/${lectura.id}/actividades/${lectura.actividades[0].id}`,
                                  { state: { lectura: lectura, estudiante: hijo } }
                                )}
                                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold shadow-md px-3 py-2 text-xs active:scale-95 transition-transform"
                              >
                                <MdArrowForward size={16} />
                                Resolver Actividad
                              </button>
                            ) : (
                              <div className="space-y-2">
                                {lectura.actividades.map((actividad) => (
                                  <button
                                    key={actividad.id}
                                    onClick={() => navigate(
                                      `/padre/menu/hijos/${hijo.id}/lecturas/${lectura.id}/actividades/${actividad.id}`,
                                      { state: { lectura: lectura, estudiante: hijo } }
                                    )}
                                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold shadow-md px-3 py-2 text-xs active:scale-95 transition-transform"
                                  >
                                    <MdQuiz size={14} />
                                    {actividad.titulo || "Actividad"}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lecturas pendientes móvil */}
                  {hijo.lecturasPendientes.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200">
                      <h3 className="text-sm font-bold text-blue-700 mb-3 flex items-center gap-2">
                        <MdBook size={18} />
                        Lecturas pendientes
                      </h3>

                      <div className="space-y-3">
                        {hijo.lecturasPendientes.map((lectura) => (
                          <div
                            key={lectura.id}
                            className="border border-blue-200 rounded-lg p-3 bg-blue-50"
                          >
                            <h4 className="text-sm font-bold text-slate-900 mb-2">
                              {lectura.titulo}
                            </h4>
                            <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                              {lectura.contenido?.substring(0, 50)}...
                            </p>

                            <button
                              onClick={() => navigate(`/padre/menu/hijos/${hijo.id}/practica-ia`, {
                                state: {
                                  estudianteId: hijo.id,
                                  lecturaId: lectura.id,
                                  lectura: lectura
                                }
                              })}
                              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-md px-3 py-2 text-xs active:scale-95 transition-transform"
                            >
                              <MdPlayArrow size={16} />
                              Practicar
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sin lecturas */}
                  {hijo.lecturasCompletadas.length === 0 && hijo.lecturasPendientes.length === 0 && (
                    <div className="bg-white border-2 border-yellow-200 rounded-xl p-6 text-center shadow-md">
                      <MdLock className="text-yellow-600 mx-auto mb-2" size={32} />
                      <h3 className="text-sm font-bold text-yellow-700 mb-1">
                        Sin lecturas asignadas
                      </h3>
                      <p className="text-xs text-yellow-600">
                        El docente aún no ha asignado lecturas.
                      </p>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* VERSIÓN DESKTOP */}
      <div className="hidden md:block min-h-screen bg-white pt-6">
        <main className="max-w-7xl mx-auto px-6 py-6">
          {/* Header desktop */}
          <div className="mb-6">
            

            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                  <MdQuiz size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">
                    Actividades de Comprensión
                  </h1>
                  <p className="text-sm text-slate-600">
                    Practica las lecturas y resuelve actividades generadas por IA
                  </p>
                </div>
              </div>

              {/* Buscador desktop */}
              <div className="w-80">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <MdSearch size={20} className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar hijo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none text-sm transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sin hijos */}
          {hijosConActividades.length === 0 ? (
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-16 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No hay hijos vinculados
              </h3>
              <p className="text-slate-600 mb-6">
                Aún no tienes hijos vinculados a tu cuenta.
              </p>
              <button
                onClick={() => navigate("/padre/menu/hijos")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition font-semibold shadow-md"
              >
                Ir a Mis Hijos
              </button>
            </div>
          ) : hijosFiltrados.length === 0 ? (
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-16 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No se encontraron hijos
              </h3>
              <p className="text-slate-600">
                Intenta con otro término de búsqueda.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {hijosFiltrados.map((hijo) => (
                <div key={hijo.id} className="space-y-4">
                  
                  {/* Header del hijo desktop */}
                  <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg text-xl">
                          {hijo.nombre?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">
                            {hijo.nombre} {hijo.apellido}
                          </h2>
                          <p className="text-sm text-slate-600">
                            Nivel {hijo.nivel_educativo}
                          </p>
                        </div>
                      </div>

                      {/* Estadísticas desktop */}
                      <div className="flex gap-4">
                        <div className="text-center bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
                          <p className="text-blue-600 font-semibold uppercase text-xs">
                            Completadas
                          </p>
                          <p className="font-bold text-blue-700 text-2xl">
                            {hijo.lecturasCompletadas.length}
                          </p>
                        </div>
                        <div className="text-center bg-purple-50 border border-purple-200 rounded-xl px-4 py-2">
                          <p className="text-purple-600 font-semibold uppercase text-xs">
                            Pendientes
                          </p>
                          <p className="font-bold text-purple-700 text-2xl">
                            {hijo.lecturasPendientes.length}
                          </p>
                        </div>
                        <div className="text-center bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                          <p className="text-green-600 font-semibold uppercase text-xs">
                            Actividades
                          </p>
                          <p className="font-bold text-green-700 text-2xl">
                            {hijo.totalActividades}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lecturas completadas desktop */}
                  {hijo.lecturasCompletadas.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-200">
                      <h3 className="text-base font-bold text-green-700 mb-4 flex items-center gap-2">
                        <MdCheckCircle size={22} />
                        Lecturas completadas - Actividades disponibles
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        {hijo.lecturasCompletadas.map((lectura) => (
                          <div
                            key={lectura.id}
                            className="border border-green-200 rounded-xl p-4 bg-green-50 hover:shadow-md transition-all"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="text-base font-bold text-slate-900 mb-1">
                                  {lectura.titulo}
                                </h4>
                                <p className="text-sm text-slate-600 line-clamp-2">
                                  {lectura.contenido?.substring(0, 80)}...
                                </p>
                              </div>
                              <div className="bg-green-100 rounded-full p-1.5 ml-2 flex-shrink-0">
                                <MdCheckCircle className="text-green-600" size={20} />
                              </div>
                            </div>

                            {/* Actividades */}
                            <div className="space-y-2 mb-4">
                              <p className="font-semibold text-slate-600 uppercase text-xs">
                                Actividades ({lectura.actividades.length}):
                              </p>
                              {lectura.actividades.slice(0, 2).map((actividad, idx) => (
                                <div
                                  key={actividad.id || idx}
                                  className="flex items-center gap-2 bg-white border border-green-200 rounded-lg p-2"
                                >
                                  <MdQuiz className="text-green-600 flex-shrink-0" size={16} />
                                  <p className="text-sm font-medium text-slate-800 truncate flex-1">
                                    {actividad.titulo || `Actividad ${idx + 1}`}
                                  </p>
                                </div>
                              ))}
                              {lectura.actividades.length > 2 && (
                                <p className="text-xs text-slate-500 text-center">
                                  + {lectura.actividades.length - 2} más
                                </p>
                              )}
                            </div>

                            {/* Botones */}
                            {lectura.actividades.length === 1 ? (
                              <button
                                onClick={() => navigate(
                                  `/padre/menu/hijos/${hijo.id}/lecturas/${lectura.id}/actividades/${lectura.actividades[0].id}`,
                                  { state: { lectura: lectura, estudiante: hijo } }
                                )}
                                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold shadow-md px-4 py-2.5 text-sm hover:shadow-lg transition-all"
                              >
                                <MdArrowForward size={18} />
                                Resolver Actividad
                              </button>
                            ) : (
                              <div className="space-y-2">
                                {lectura.actividades.map((actividad) => (
                                  <button
                                    key={actividad.id}
                                    onClick={() => navigate(
                                      `/padre/menu/hijos/${hijo.id}/lecturas/${lectura.id}/actividades/${actividad.id}`,
                                      { state: { lectura: lectura, estudiante: hijo } }
                                    )}
                                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold shadow-md px-4 py-2 text-sm hover:shadow-lg transition-all"
                                  >
                                    <MdQuiz size={16} />
                                    {actividad.titulo || "Actividad"}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lecturas pendientes desktop */}
                  {hijo.lecturasPendientes.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-200">
                      <h3 className="text-base font-bold text-blue-700 mb-4 flex items-center gap-2">
                        <MdBook size={22} />
                        Lecturas pendientes - Practica para desbloquear actividades
                      </h3>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {hijo.lecturasPendientes.map((lectura) => (
                          <div
                            key={lectura.id}
                            className="border border-blue-200 rounded-xl p-4 bg-blue-50 hover:shadow-md transition-all"
                          >
                            <h4 className="text-base font-bold text-slate-900 mb-2">
                              {lectura.titulo}
                            </h4>
                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                              {lectura.contenido?.substring(0, 60)}...
                            </p>

                            <button
                              onClick={() => navigate(`/padre/menu/hijos/${hijo.id}/practica-ia`, {
                                state: {
                                  estudianteId: hijo.id,
                                  lecturaId: lectura.id,
                                  lectura: lectura
                                }
                              })}
                              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-md px-4 py-2 text-sm hover:shadow-lg transition-all"
                            >
                              <MdPlayArrow size={18} />
                              Practicar
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sin lecturas */}
                  {hijo.lecturasCompletadas.length === 0 && hijo.lecturasPendientes.length === 0 && (
                    <div className="bg-white border-2 border-yellow-200 rounded-2xl p-8 text-center shadow-lg">
                      <MdLock className="text-yellow-600 mx-auto mb-3" size={48} />
                      <h3 className="text-lg font-bold text-yellow-700 mb-2">
                        Sin lecturas asignadas
                      </h3>
                      <p className="text-yellow-600">
                        El docente aún no ha asignado lecturas a este estudiante.
                      </p>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
