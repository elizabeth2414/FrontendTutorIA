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
  MdStars
} from "react-icons/md";
import { Capacitor } from "@capacitor/core";

export default function ActividadesHijos() {
  const [hijos, setHijos] = useState([]);
  const [hijosConActividades, setHijosConActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Detectar si es móvil
  const isMobile = Capacitor.isNativePlatform();
  const platform = Capacitor.getPlatform(); // 'ios', 'android', 'web'

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
              // TODO: Agregar lógica para contar completadas cuando tengas ese campo
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
  // PANTALLA DE CARGA MEJORADA
  // ==========================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          {/* Animación de carga mejorada */}
          <div className="relative">
            {/* Círculo exterior rotando */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            {/* Círculo medio pulsando */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-indigo-200 border-b-indigo-600 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
            </div>
            {/* Círculo interior con ícono */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full animate-pulse flex items-center justify-center">
                <MdQuiz className="text-white" size={32} />
              </div>
            </div>
          </div>

          {/* Texto de carga con animación */}
          <div className="mt-32 space-y-2">
            <h3 className={`font-bold text-slate-700 animate-pulse ${isMobile ? 'text-lg' : 'text-xl'}`}>
              Cargando actividades...
            </h3>
            <div className="flex justify-center gap-1">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================
  // PANTALLA DE ERROR MEJORADA
  // ==========================
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <div className="text-4xl sm:text-5xl">❌</div>
          </div>
          <h3 className={`font-bold text-red-700 ${isMobile ? 'text-lg' : 'text-xl'}`}>
            Error al cargar
          </h3>
          <p className={`text-red-600 ${isMobile ? 'text-sm' : 'text-base'}`}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-xl transition font-semibold shadow-lg active:scale-95"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className={`${isMobile ? 'pt-4 px-4 pb-6' : 'pt-24 max-w-7xl mx-auto p-6'} space-y-6 sm:space-y-8`}>

        {/* HEADER - Responsive */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
          <div className={`flex items-center gap-3 sm:gap-4 ${isMobile ? 'flex-col text-center' : ''}`}>
            <div className={`rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg ${isMobile ? 'w-12 h-12' : 'w-14 h-14'}`}>
              <MdQuiz size={isMobile ? 24 : 28} />
            </div>
            <div className={isMobile ? 'w-full' : 'flex-1'}>
              <h1 className={`font-extrabold text-blue-700 ${isMobile ? 'text-xl' : 'text-3xl md:text-4xl'}`}>
                Actividades de Comprensión
              </h1>
              <p className={`text-slate-600 mt-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Practica las lecturas y resuelve actividades generadas por IA
              </p>
            </div>
          </div>
        </div>

        {/* LISTA DE HIJOS */}
        {hijosConActividades.length === 0 ? (
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 sm:p-10 text-center shadow-lg">
            <div className={`mb-4 ${isMobile ? 'text-5xl' : 'text-6xl'}`}>📭</div>
            <h3 className={`font-semibold text-gray-700 mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
              No hay hijos vinculados
            </h3>
            <p className={`text-gray-500 mb-6 ${isMobile ? 'text-sm' : 'text-base'}`}>
              Aún no tienes hijos vinculados a tu cuenta.
            </p>
            <button
              onClick={() => navigate("/padre/menu/hijos")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-xl transition font-semibold shadow-lg active:scale-95"
            >
              Ir a Mis Hijos
            </button>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">

            {hijosConActividades.map((hijo) => (
              <div key={hijo.id} className="space-y-3 sm:space-y-4">
                
                {/* HEADER DEL HIJO - Responsive */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
                  <div className={`flex items-center ${isMobile ? 'flex-col gap-4' : 'justify-between'}`}>
                    
                    {/* Info del hijo */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg ${isMobile ? 'w-12 h-12 text-lg' : 'w-16 h-16 text-2xl'}`}>
                        {hijo.nombre?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <h2 className={`font-bold text-slate-800 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                          {hijo.nombre} {hijo.apellido}
                        </h2>
                        <p className={`text-slate-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          Nivel {hijo.nivel_educativo}
                        </p>
                      </div>
                    </div>

                    {/* ESTADÍSTICAS - Stack en móvil */}
                    <div className={`flex gap-2 sm:gap-4 ${isMobile ? 'w-full justify-between' : ''}`}>
                      <div className={`text-center bg-blue-50 border-2 border-blue-200 rounded-xl ${isMobile ? 'px-3 py-2 flex-1' : 'px-4 py-2'}`}>
                        <p className={`text-blue-600 font-semibold uppercase ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                          Completadas
                        </p>
                        <p className={`font-bold text-blue-700 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                          {hijo.lecturasCompletadas.length}
                        </p>
                      </div>
                      <div className={`text-center bg-purple-50 border-2 border-purple-200 rounded-xl ${isMobile ? 'px-3 py-2 flex-1' : 'px-4 py-2'}`}>
                        <p className={`text-purple-600 font-semibold uppercase ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                          Pendientes
                        </p>
                        <p className={`font-bold text-purple-700 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                          {hijo.lecturasPendientes.length}
                        </p>
                      </div>
                      <div className={`text-center bg-green-50 border-2 border-green-200 rounded-xl ${isMobile ? 'px-3 py-2 flex-1' : 'px-4 py-2'}`}>
                        <p className={`text-green-600 font-semibold uppercase ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                          Actividades
                        </p>
                        <p className={`font-bold text-green-700 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                          {hijo.totalActividades}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🔥 LECTURAS COMPLETADAS - MOSTRAR ACTIVIDADES */}
                {hijo.lecturasCompletadas.length > 0 && (
                  <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
                    <h3 className={`font-bold text-green-700 mb-3 sm:mb-4 flex items-center gap-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
                      <MdCheckCircle size={isMobile ? 20 : 24} />
                      Lecturas completadas - Actividades disponibles
                    </h3>

                    <div className={`grid gap-3 sm:gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                      {hijo.lecturasCompletadas.map((lectura) => (
                        <div
                          key={lectura.id}
                          className="border-2 border-green-200 rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className={`font-bold text-slate-800 mb-1 ${isMobile ? 'text-base' : 'text-lg'}`}>
                                {lectura.titulo}
                              </h4>
                              <p className={`text-slate-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                                {lectura.contenido?.substring(0, isMobile ? 60 : 80)}...
                              </p>
                            </div>
                            <div className={`bg-green-100 rounded-full p-1.5 sm:p-2 ml-2 flex-shrink-0`}>
                              <MdCheckCircle className="text-green-600" size={isMobile ? 20 : 24} />
                            </div>
                          </div>

                          {/* ACTIVIDADES DE ESTA LECTURA */}
                          <div className="space-y-2 mb-4">
                            <p className={`font-semibold text-slate-600 uppercase ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                              Actividades ({lectura.actividades.length}):
                            </p>
                            {lectura.actividades.slice(0, 2).map((actividad, idx) => (
                              <div
                                key={actividad.id || idx}
                                className={`flex items-center gap-2 bg-white border border-green-200 rounded-lg ${isMobile ? 'p-2' : 'p-2.5'}`}
                              >
                                <MdQuiz className="text-green-600 flex-shrink-0" size={isMobile ? 16 : 18} />
                                <div className="flex-1 min-w-0">
                                  <p className={`font-medium text-slate-800 truncate ${isMobile ? 'text-xs' : 'text-sm'}`}>
                                    {actividad.titulo || `Actividad ${idx + 1}`}
                                  </p>
                                  <div className={`flex items-center gap-2 text-slate-500 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                                    {actividad.dificultad && (
                                      <span className="flex items-center gap-1">
                                        <MdStars size={10} />
                                        {actividad.dificultad}
                                      </span>
                                    )}
                                    {actividad.tiempo_estimado && (
                                      <span className="flex items-center gap-1">
                                        <MdTimer size={10} />
                                        {actividad.tiempo_estimado} min
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                            {lectura.actividades.length > 2 && (
                              <p className={`text-slate-500 text-center ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                                + {lectura.actividades.length - 2} más
                              </p>
                            )}
                          </div>

                          {/* 🔥 BOTONES DE ACTIVIDADES - ACTUALIZADO Y RESPONSIVE */}
                          {lectura.actividades.length === 1 ? (
                            // ✅ SI SOLO HAY 1 ACTIVIDAD → IR DIRECTO A RESOLVERLA
                            <button
                              onClick={() => navigate(
                                `/padre/menu/hijos/${hijo.id}/lecturas/${lectura.id}/actividades/${lectura.actividades[0].id}`,
                                {
                                  state: {
                                    lectura: lectura,
                                    estudiante: hijo
                                  }
                                }
                              )}
                              className={`w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all active:scale-95 ${isMobile ? 'px-3 py-2.5 text-sm' : 'px-4 py-3'}`}
                            >
                              <MdArrowForward size={isMobile ? 18 : 20} />
                              Resolver Actividad
                            </button>
                          ) : (
                            // ✅ SI HAY MÚLTIPLES ACTIVIDADES → MOSTRAR LISTA
                            <div className="space-y-2">
                              {lectura.actividades.map((actividad) => (
                                <button
                                  key={actividad.id}
                                  onClick={() => navigate(
                                    `/padre/menu/hijos/${hijo.id}/lecturas/${lectura.id}/actividades/${actividad.id}`,
                                    {
                                      state: {
                                        lectura: lectura,
                                        estudiante: hijo
                                      }
                                    }
                                  )}
                                  className={`w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 ${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-2 text-sm'}`}
                                >
                                  <MdQuiz size={isMobile ? 14 : 16} />
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

                {/* 🔥 LECTURAS PENDIENTES - PRACTICAR */}
                {hijo.lecturasPendientes.length > 0 && (
                  <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
                    <h3 className={`font-bold text-blue-700 mb-3 sm:mb-4 flex items-center gap-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
                      <MdBook size={isMobile ? 20 : 24} />
                      {isMobile ? "Lecturas pendientes" : "Lecturas pendientes - Practica para desbloquear actividades"}
                    </h3>

                    <div className={`grid gap-3 sm:gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
                      {hijo.lecturasPendientes.map((lectura) => (
                        <div
                          key={lectura.id}
                          className="border-2 border-blue-200 rounded-2xl p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-all"
                        >
                          <h4 className={`font-bold text-slate-800 mb-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
                            {lectura.titulo}
                          </h4>
                          <p className={`text-slate-600 mb-3 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                            {lectura.contenido?.substring(0, isMobile ? 50 : 60)}...
                          </p>

                          <button
                            onClick={() => navigate(`/padre/menu/hijos/${hijo.id}/practica-ia`, {
                              state: {
                                estudianteId: hijo.id,
                                lecturaId: lectura.id,
                                lectura: lectura
                              }
                            })}
                            className={`w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 ${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-2 text-sm'}`}
                          >
                            <MdPlayArrow size={isMobile ? 16 : 18} />
                            Practicar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MENSAJE SI NO HAY NADA */}
                {hijo.lecturasCompletadas.length === 0 && hijo.lecturasPendientes.length === 0 && (
                  <div className="bg-white border-2 border-yellow-200 rounded-2xl p-6 sm:p-8 text-center shadow-lg">
                    <MdLock className="text-yellow-600 mx-auto mb-3" size={isMobile ? 40 : 48} />
                    <h3 className={`font-bold text-yellow-700 mb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
                      Sin lecturas asignadas
                    </h3>
                    <p className={`text-yellow-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
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
  );
}
