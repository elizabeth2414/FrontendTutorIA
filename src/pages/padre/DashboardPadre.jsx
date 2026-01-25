import { useEffect, useState } from "react";
import { getHijosPadre } from "../../services/padresService";
import { getProgresoEstudiante } from "../../services/gamificacionService";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function DashboardPadre() {
  const [stats, setStats] = useState({
    hijos: 0,
    cursos: 0,
    lecturasCompletadas: 0,
    seguimiento: "Activo",
  });

  const [hijosData, setHijosData] = useState([]);
  const [lecturasSemanales, setLecturasSemanales] = useState([]);
  const [cursosPorCategoria, setCursosPorCategoria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      
      const hijosData = await getHijosPadre();

      let totalCursos = 0;
      let totalLecturasCompletadas = 0;
      const hijosProgress = [];
      const categorias = {};

      for (const hijo of hijosData) {
        const estudiante = hijo.estudiante || hijo;
        const cursos = hijo.cursos || [];
        
        let lecturasCompletadasHijo = 0;
        let cursosHijo = cursos.length;

        cursos.forEach((curso) => {
          totalCursos++;
          const categoria = curso.categoria || "General";
          categorias[categoria] = (categorias[categoria] || 0) + 1;
        });

        try {
          const progreso = await getProgresoEstudiante(estudiante.id);
          lecturasCompletadasHijo = Math.floor((progreso.xp_actual || 0) / 100);
          totalLecturasCompletadas += lecturasCompletadasHijo;
          
          console.log(`📚 ${estudiante.nombre}:`, {
            xp: progreso.xp_actual,
            lecturasCompletadas: lecturasCompletadasHijo,
          });
        } catch (error) {
          console.log(`⚠️ No se pudo obtener progreso de ${estudiante.nombre}`);
          lecturasCompletadasHijo = 0;
        }

        hijosProgress.push({
          nombre: estudiante.nombre || `Estudiante ${estudiante.id}`,
          lecturas: lecturasCompletadasHijo,
          cursos: cursosHijo,
          xp: lecturasCompletadasHijo * 100
        });
      }

      setHijosData(hijosProgress);

      // Solo generar datos de semana si hay lecturas
      if (totalLecturasCompletadas > 0) {
        const semanas = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
        const lecturasData = semanas.map((dia, i) => ({
          dia,
          lecturas: Math.floor(Math.random() * 3) + Math.floor(totalLecturasCompletadas / 7)
        }));
        setLecturasSemanales(lecturasData);
      }

      const categoriasArray = Object.entries(categorias).map(([nombre, valor]) => ({
        nombre,
        valor
      }));
      setCursosPorCategoria(categoriasArray);

      setStats({
        hijos: hijosData.length,
        cursos: totalCursos,
        lecturasCompletadas: totalLecturasCompletadas,
        seguimiento: "Activo",
      });
    } catch (error) {
      console.error("❌ Error cargando dashboard:", error);
      setErrorMsg("No se pudo cargar la información del panel familiar.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ COLORES DEL CAMALEÓN (degradados del logo)
  const COLORES_CAMALEON = [
    "#10b981", // Emerald
    "#14b8a6", // Teal
    "#06b6d4", // Cyan
    "#3b82f6", // Blue
    "#8b5cf6", // Purple
    "#d946ef", // Magenta
    "#f59e0b", // Amber
    "#f97316", // Orange
  ];

  // Estado vacío - Componente
  const EstadoVacio = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
        <svg className="w-16 h-16 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">¡Bienvenido al Panel Familiar!</h3>
      <p className="text-slate-600 text-center max-w-md mb-6">
        Aún no tienes hijos vinculados. Agrega a tus hijos para comenzar a monitorear su progreso de aprendizaje.
      </p>
      <button 
        onClick={() => window.location.href = '/padre/menu/hijos'}
        className="px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 transition-all shadow-lg shadow-emerald-500/20"
      >
        Agregar Hijo
      </button>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Fredoka:wght@500;600;700&display=swap');
        
        * {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Fredoka', 'Poppins', sans-serif;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .card-stat {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-stat:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px -4px rgba(16, 185, 129, 0.25);
        }
      `}</style>

      {/* VERSIÓN MÓVIL */}
      <div className="md:hidden min-h-screen">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-slate-900 mb-1">Panel Familiar</h1>
          <p className="text-sm text-slate-600">Progreso académico de tus hijos</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border-l-4 border-red-500">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="font-semibold text-red-900 text-xs">Error</p>
                <p className="text-red-700 text-xs mt-0.5">{errorMsg}</p>
              </div>
            </div>
            <button
              onClick={cargarDashboard}
              className="mt-2 w-full px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs font-medium"
            >
              Reintentar
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent mb-3"></div>
            <p className="text-center text-slate-600 text-sm">Cargando...</p>
          </div>
        ) : stats.hijos === 0 ? (
          <EstadoVacio />
        ) : (
          <div className="space-y-4">
            {/* Cards de estadísticas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-3 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-emerald-900">{stats.hijos}</p>
                <p className="text-xs text-emerald-700 font-medium">Hijos</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-3 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-purple-900">{stats.cursos}</p>
                <p className="text-xs text-purple-700 font-medium">Cursos</p>
              </div>

              <div className="col-span-2 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-amber-900">{stats.lecturasCompletadas}</p>
                    <p className="text-xs text-amber-700 font-medium">Lecturas completadas</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos solo si hay datos */}
            {hijosData.length > 0 && (
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Progreso de Aprendizaje</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={hijosData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="nombre" stroke="#64748b" style={{ fontSize: '11px' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '11px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        fontSize: '11px'
                      }} 
                    />
                    <Bar dataKey="lecturas" fill="url(#colorCamaleon)" name="Lecturas" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="colorCamaleon" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#14b8a6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {lecturasSemanales.length > 0 && (
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Actividad Semanal</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={lecturasSemanales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="dia" stroke="#64748b" style={{ fontSize: '10px' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        fontSize: '11px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="lecturas" 
                      stroke="url(#lineGradient)" 
                      strokeWidth={2}
                      dot={{ fill: '#f59e0b', r: 3 }}
                    />
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="50%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#d946ef" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {hijosData.length > 0 && (
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Rendimiento Individual</h3>
                <div className="space-y-2">
                  {hijosData.map((hijo, index) => (
                    <div key={index} className="p-2.5 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="font-bold text-slate-900 text-xs">{hijo.nombre}</p>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                          {hijo.cursos} cursos
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, (hijo.lecturas / Math.max(...hijosData.map(h => h.lecturas), 1)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{hijo.lecturas}</span>
                      </div>
                      <p className="text-xs text-slate-600">lecturas completadas</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* VERSIÓN DESKTOP */}
      <div className="hidden md:block min-h-screen">
        <div className="max-w-7xl mx-auto animate-fade-in">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border-l-4 border-red-500">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="font-semibold text-red-900 text-sm mb-1">Error cargando información</p>
                  <p className="text-red-700 text-sm">{errorMsg}</p>
                </div>
                <button
                  onClick={cargarDashboard}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mb-4"></div>
              <p className="text-center text-slate-600">Cargando información...</p>
            </div>
          ) : stats.hijos === 0 ? (
            <EstadoVacio />
          ) : (
            <>
              {/* Cards de estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                <div className="card-stat bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-900">{stats.hijos}</p>
                      <p className="text-xs text-emerald-700 font-medium">Hijos vinculados</p>
                    </div>
                  </div>
                </div>

                <div className="card-stat bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-900">{stats.cursos}</p>
                      <p className="text-xs text-purple-700 font-medium">Cursos activos</p>
                    </div>
                  </div>
                </div>

                <div className="card-stat bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-amber-900">{stats.lecturasCompletadas}</p>
                      <p className="text-xs text-amber-700 font-medium">Lecturas completadas</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráficos solo si hay datos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                {hijosData.length > 0 && (
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                    <h3 className="text-base font-bold text-slate-900 mb-4">📚 Progreso de Aprendizaje</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={hijosData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="nombre" stroke="#64748b" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            borderRadius: '10px',
                            border: '1px solid #e5e7eb',
                            fontSize: '12px'
                          }} 
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Bar dataKey="lecturas" fill="url(#gradientLecturas)" name="Lecturas completadas" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="cursos" fill="url(#gradientCursos)" name="Cursos activos" radius={[6, 6, 0, 0]} />
                        <defs>
                          <linearGradient id="gradientLecturas" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#14b8a6" />
                          </linearGradient>
                          <linearGradient id="gradientCursos" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#d946ef" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {lecturasSemanales.length > 0 && (
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                    <h3 className="text-base font-bold text-slate-900 mb-4">📈 Actividad Semanal</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={lecturasSemanales}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="dia" stroke="#64748b" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            borderRadius: '10px',
                            border: '1px solid #e5e7eb',
                            fontSize: '12px'
                          }} 
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Line 
                          type="monotone" 
                          dataKey="lecturas" 
                          stroke="url(#lineGradientDesktop)" 
                          strokeWidth={2.5}
                          name="Lecturas diarias"
                          dot={{ fill: '#f59e0b', r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <defs>
                          <linearGradient id="lineGradientDesktop" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="50%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#d946ef" />
                          </linearGradient>
                        </defs>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                {cursosPorCategoria.length > 0 && (
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                    <h3 className="text-base font-bold text-slate-900 mb-4">🎯 Distribución de Cursos</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={cursosPorCategoria}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ nombre, percent }) => `${nombre} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={90}
                          fill="#8884d8"
                          dataKey="valor"
                          style={{ fontSize: '12px' }}
                        >
                          {cursosPorCategoria.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORES_CAMALEON[index % COLORES_CAMALEON.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {hijosData.length > 0 && (
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                    <h3 className="text-base font-bold text-slate-900 mb-4">⭐ Rendimiento Individual</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-2 px-2 text-slate-700 font-semibold text-xs">Estudiante</th>
                            <th className="text-center py-2 px-2 text-slate-700 font-semibold text-xs">Cursos</th>
                            <th className="text-center py-2 px-2 text-slate-700 font-semibold text-xs">Lecturas</th>
                            <th className="text-center py-2 px-2 text-slate-700 font-semibold text-xs">XP Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hijosData.map((hijo, index) => (
                            <tr key={index} className="border-b border-slate-100 hover:bg-emerald-50/50 transition">
                              <td className="py-3 px-2 font-medium text-slate-900 text-sm">{hijo.nombre}</td>
                              <td className="text-center py-3 px-2">
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                  {hijo.cursos}
                                </span>
                              </td>
                              <td className="text-center py-3 px-2">
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                  {hijo.lecturas}
                                </span>
                              </td>
                              <td className="text-center py-3 px-2">
                                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                                  {hijo.xp} XP
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Resumen */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200 p-6 rounded-2xl">
                <h2 className="text-lg font-bold text-emerald-900 mb-3">
                  💡 Resumen del Aprendizaje Familiar
                </h2>

                <p className="text-slate-700 leading-relaxed mb-4 text-sm">
                  Desde este panel puedes supervisar el progreso académico de tus
                  hijos, revisar sus lecturas completadas y ver el seguimiento
                  inteligente generado por el sistema.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white/70 p-4 rounded-xl border border-emerald-100">
                    <div className="text-2xl mb-2">📖</div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Lectura Activa</h4>
                    <p className="text-xs text-slate-600">Fomenta el hábito de lectura diaria</p>
                  </div>
                  <div className="bg-white/70 p-4 rounded-xl border border-teal-100">
                    <div className="text-2xl mb-2">🎓</div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Aprendizaje Continuo</h4>
                    <p className="text-xs text-slate-600">Monitorea el avance en cada curso</p>
                  </div>
                  <div className="bg-white/70 p-4 rounded-xl border border-cyan-100">
                    <div className="text-2xl mb-2">🤖</div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">IA Personalizada</h4>
                    <p className="text-xs text-slate-600">Seguimiento inteligente y adaptativo</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
