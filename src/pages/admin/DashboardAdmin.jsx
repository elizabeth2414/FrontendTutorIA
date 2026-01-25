import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdPeople,
  MdSchool,
  MdAutoStories,
  MdAssessment,
  MdPersonAdd,
  MdTrendingUp,
} from "react-icons/md";

import { obtenerDashboardAdmin } from "../../services/adminDashboardService";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function DashboardAdmin() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    docentes: 0,
    estudiantes: 0,
    lecturas: 0,
    actividades: 0,
  });

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Cargar datos reales del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerDashboardAdmin();

        setStats({
          docentes: data.docentes,
          estudiantes: data.estudiantes,
          lecturas: data.lecturas,
          actividades: data.actividades,
        });
      } catch (error) {
        console.error("Error obteniendo estadísticas:", error);
        setErrorMsg("No se pudieron cargar los datos del sistema.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Preparar datos para gráficos
  const datosBarras = [
    { nombre: "Docentes", valor: stats.docentes },
    { nombre: "Estudiantes", valor: stats.estudiantes },
    { nombre: "Lecturas", valor: stats.lecturas },
    { nombre: "Actividades", valor: stats.actividades },
  ];

  const datosPastel = [
    { nombre: "Docentes", valor: stats.docentes },
    { nombre: "Estudiantes", valor: stats.estudiantes },
    { nombre: "Lecturas", valor: stats.lecturas },
    { nombre: "Actividades", valor: stats.actividades },
  ];

  const totalSistema = stats.docentes + stats.estudiantes + stats.lecturas + stats.actividades;

  // Estado vacío
  const EstadoVacio = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
        <MdSchool className="w-16 h-16 text-orange-600" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">¡Sistema en Espera!</h3>
      <p className="text-slate-600 text-center max-w-md mb-6">
        El sistema está listo para comenzar. Agrega docentes para empezar a gestionar la plataforma educativa.
      </p>
      <button 
        onClick={() => navigate('/admin/menu/docentes')}
        className="px-6 py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:via-amber-600 hover:to-yellow-700 transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
      >
        <MdPersonAdd size={20} />
        Agregar Docentes
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando información...</p>
        </div>
      </div>
    );
  }

  // Si no hay datos, mostrar estado vacío
  if (totalSistema === 0) {
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
        `}</style>
        <EstadoVacio />
      </>
    );
  }

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

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

      {/* VERSIÓN MÓVIL */}
      <div className="md:hidden min-h-screen">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-slate-900 mb-1">Panel Administrativo</h1>
          <p className="text-sm text-slate-600">Resumen general del sistema</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border-l-4 border-red-500">
            <p className="text-red-700 text-xs">{errorMsg}</p>
          </div>
        )}

        {/* Cards móvil */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <MiniCard
            icon={<MdSchool size={20} />}
            color="from-orange-500 to-amber-600"
            titulo="Docentes"
            valor={stats.docentes}
          />
          <MiniCard
            icon={<MdPeople size={20} />}
            color="from-purple-500 to-fuchsia-600"
            titulo="Estudiantes"
            valor={stats.estudiantes}
          />
          <MiniCard
            icon={<MdAutoStories size={20} />}
            color="from-pink-500 to-rose-600"
            titulo="Lecturas"
            valor={stats.lecturas}
          />
          <MiniCard
            icon={<MdAssessment size={20} />}
            color="from-emerald-500 to-teal-600"
            titulo="Actividades"
            valor={stats.actividades}
          />
        </div>

        {/* Gráficos móvil */}
        <div className="space-y-4">
          {totalSistema > 0 && (
            <>
              <GraficoCard
                titulo="Resumen General"
                icon={<MdTrendingUp size={18} className="text-orange-600" />}
                datos={datosBarras}
                tipo="bar"
              />

              <GraficoCard
                titulo="Distribución del Sistema"
                icon={<MdAssessment size={18} className="text-purple-600" />}
                datos={datosPastel}
                tipo="pie"
              />
            </>
          )}
        </div>

        {/* Info adicional móvil */}
        <div className="mt-4 bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100">
          <h3 className="text-sm font-bold text-orange-900 mb-2">
            ℹ️ Actividad del Sistema
          </h3>
          <p className="text-xs text-slate-600">
            Los datos se actualizan en tiempo real desde el servidor.
          </p>
        </div>
      </div>

      {/* VERSIÓN DESKTOP */}
      <div className="hidden md:block min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
          {/* Header desktop */}
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Panel Administrativo 🚀
                </h1>
                <p className="text-sm text-slate-600">
                  Resumen general del sistema educativo
                </p>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm">{errorMsg}</p>
            </div>
          )}

          {/* Cards desktop */}
          <div className="grid grid-cols-4 gap-5">
            <Card
              color="from-orange-50 to-amber-50"
              iconColor="from-orange-500 to-amber-600"
              icon={<MdSchool size={28} />}
              titulo="Total Docentes"
              valor={stats.docentes}
            />
            <Card
              color="from-purple-50 to-fuchsia-50"
              iconColor="from-purple-500 to-fuchsia-600"
              icon={<MdPeople size={28} />}
              titulo="Total Estudiantes"
              valor={stats.estudiantes}
            />
            <Card
              color="from-pink-50 to-rose-50"
              iconColor="from-pink-500 to-rose-600"
              icon={<MdAutoStories size={28} />}
              titulo="Lecturas Registradas"
              valor={stats.lecturas}
            />
            <Card
              color="from-emerald-50 to-teal-50"
              iconColor="from-emerald-500 to-teal-600"
              icon={<MdAssessment size={28} />}
              titulo="Actividades Creadas"
              valor={stats.actividades}
            />
          </div>

          {/* Gráficos desktop */}
          {totalSistema > 0 && (
            <div className="grid lg:grid-cols-2 gap-5">
              {/* Gráfico de barras */}
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <MdTrendingUp className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Resumen General</h3>
                    <p className="text-xs text-slate-500">Estadísticas del sistema</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={datosBarras}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="nombre" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '10px',
                        border: '1px solid #e5e7eb',
                        fontSize: '12px'
                      }} 
                    />
                    <Bar dataKey="valor" fill="url(#gradientBarAdmin)" radius={[6, 6, 0, 0]} />
                    <defs>
                      <linearGradient id="gradientBarAdmin" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#eab308" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfico de pastel */}
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MdAssessment className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Distribución del Sistema</h3>
                    <p className="text-xs text-slate-500">Proporción de recursos</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={datosPastel}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ nombre, percent }) => `${nombre}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      dataKey="valor"
                    >
                      {datosPastel.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORES_ADMIN[index % COLORES_ADMIN.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Info adicional desktop */}
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 border border-orange-200 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-orange-900 mb-3">
              💡 Información del Sistema
            </h2>

            <p className="text-slate-700 leading-relaxed mb-4 text-sm">
              Desde este panel puedes supervisar toda la actividad del sistema educativo,
              gestionar docentes y revisar las estadísticas generales de la plataforma.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white/70 p-4 rounded-xl border border-orange-100">
                <div className="text-2xl mb-2">👨‍🏫</div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Gestión de Docentes</h4>
                <p className="text-xs text-slate-600">Administra los profesores del sistema</p>
              </div>
              <div className="bg-white/70 p-4 rounded-xl border border-amber-100">
                <div className="text-2xl mb-2">📚</div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Control de Contenido</h4>
                <p className="text-xs text-slate-600">Supervisa lecturas y actividades</p>
              </div>
              <div className="bg-white/70 p-4 rounded-xl border border-yellow-100">
                <div className="text-2xl mb-2">📊</div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Estadísticas en Tiempo Real</h4>
                <p className="text-xs text-slate-600">Datos actualizados del sistema</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Colores para el gráfico de pastel (del camaleón)
const COLORES_ADMIN = [
  "#f97316", // Orange
  "#a855f7", // Purple
  "#ec4899", // Pink
  "#10b981", // Emerald
];

// Componente Card Desktop
function Card({ color, iconColor, icon, titulo, valor }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl shadow-sm p-4 border border-slate-200 hover:shadow-md transition-shadow`}>
      <div className="flex gap-3 items-center">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${iconColor} text-white shadow-sm`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-slate-600 font-semibold mb-1">{titulo}</p>
          <p className="text-2xl font-bold text-slate-900">{valor}</p>
        </div>
      </div>
    </div>
  );
}

// Componente MiniCard Móvil
function MiniCard({ icon, color, titulo, valor }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-3 border border-slate-200">
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} text-white flex items-center justify-center mb-2 shadow-sm`}>
        {icon}
      </div>
      <p className="text-xs text-slate-600 font-semibold mb-1">{titulo}</p>
      <p className="text-xl font-bold text-slate-900">{valor}</p>
    </div>
  );
}

// Componente GraficoCard Móvil
function GraficoCard({ titulo, icon, datos, tipo }) {
  const sinDatos = Array.isArray(datos) ? datos.every(d => d.valor === 0) : true;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 bg-slate-100 rounded-lg">{icon}</div>
        <h3 className="text-sm font-bold text-slate-900">{titulo}</h3>
      </div>
      
      {sinDatos ? (
        <div className="h-[180px] flex items-center justify-center text-slate-400">
          <p className="text-xs">No hay datos</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          {tipo === "bar" ? (
            <BarChart data={datos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" style={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="valor" fill="url(#gradMobileBar)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="gradMobileBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#eab308" />
                </linearGradient>
              </defs>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={datos}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nombre, valor }) => `${nombre}: ${valor}`}
                outerRadius={60}
                dataKey="valor"
              >
                {datos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORES_ADMIN[index % COLORES_ADMIN.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
}
