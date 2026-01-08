import { useEffect, useState } from "react";
import { getMisHijos } from "../../services/padresService";
import { listarLecturas } from "../../services/lecturasService";
import { getProgresoEstudiante } from "../../services/gamificacionService";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function DashboardPadre() {
  const [stats, setStats] = useState({
    hijos: 0,
    cursos: 0,
    lecturas: 0,
    lecturasDisponibles: 0,
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
      const [hijosData, lecturasDisponiblesData] = await Promise.all([
        getMisHijos(),
        listarLecturas().catch(() => [])
      ]);

      let totalCursos = 0;
      let totalLecturasAsignadas = 0;
      let totalLecturasCompletadas = 0;
      const hijosProgress = [];
      const categorias = {};

      // 🔥 Procesar cada hijo y obtener su progreso de gamificación
      for (const hijo of hijosData) {
        let lecturasAsignadasHijo = 0;
        let lecturasCompletadasHijo = 0;
        let cursosHijo = 0;

        // Contar cursos y lecturas asignadas
        hijo.cursos?.forEach((curso) => {
          cursosHijo++;
          totalCursos++;
          const numLecturas = curso.lecturas?.length || 0;
          lecturasAsignadasHijo += numLecturas;
          totalLecturasAsignadas += numLecturas;

          // Agrupar por categoría
          const categoria = curso.categoria || "General";
          categorias[categoria] = (categorias[categoria] || 0) + 1;
        });

        // 🔥 Obtener progreso real desde gamificación
        try {
          const progreso = await getProgresoEstudiante(hijo.id);
          // Calcular lecturas completadas: cada 100 XP = 1 lectura
          lecturasCompletadasHijo = Math.floor((progreso.xp_actual || 0) / 100);
          totalLecturasCompletadas += lecturasCompletadasHijo;
          
          console.log(`📚 ${hijo.nombre}:`, {
            xp: progreso.xp_actual,
            lecturasCompletadas: lecturasCompletadasHijo,
            lecturasAsignadas: lecturasAsignadasHijo
          });
        } catch (error) {
          console.log(`⚠️ No se pudo obtener progreso de ${hijo.nombre}`);
          lecturasCompletadasHijo = 0;
        }

        hijosProgress.push({
          nombre: hijo.nombre || `Estudiante ${hijo.id}`,
          lecturas: lecturasCompletadasHijo, // ✅ Ahora usa lecturas COMPLETADAS
          cursos: cursosHijo,
          progreso: lecturasAsignadasHijo > 0 
            ? Math.min(100, Math.round((lecturasCompletadasHijo / lecturasAsignadasHijo) * 100))
            : 0
        });
      }

      setHijosData(hijosProgress);

      // Simular datos de lecturas semanales
      const semanas = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
      const lecturasData = semanas.map((dia, i) => ({
        dia,
        lecturas: Math.floor(Math.random() * 5) + (totalLecturasCompletadas > 0 ? 1 : 0)
      }));
      setLecturasSemanales(lecturasData);

      // Convertir categorías a formato para gráfica
      const categoriasArray = Object.entries(categorias).map(([nombre, valor]) => ({
        nombre,
        valor
      }));
      setCursosPorCategoria(categoriasArray);

      const totalLecturasDisponibles = Array.isArray(lecturasDisponiblesData) 
        ? lecturasDisponiblesData.length 
        : 0;

      console.log("📊 RESUMEN:", {
        hijosTotal: hijosData.length,
        cursosTotal: totalCursos,
        lecturasAsignadas: totalLecturasAsignadas,
        lecturasCompletadas: totalLecturasCompletadas,
        lecturasDisponibles: totalLecturasDisponibles
      });

      setStats({
        hijos: hijosData.length,
        cursos: totalCursos,
        lecturas: totalLecturasAsignadas, // ✅ Lecturas ASIGNADAS a los hijos
        lecturasDisponibles: totalLecturasDisponibles, // ✅ Lecturas del SISTEMA
        seguimiento: "Activo",
      });
    } catch (error) {
      console.error("❌ Error cargando dashboard:", error);
      setErrorMsg("No se pudo cargar la información del panel familiar.");
    } finally {
      setLoading(false);
    }
  };

  const Card = ({ icon, title, value, bgColor }) => (
    <div className="bg-white/80 backdrop-blur-lg border border-white/40 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:scale-105">
      <div className="flex items-center gap-4">
        <div className={`${bgColor} p-4 rounded-2xl`}>
          <img src={icon} alt={title} className="w-10 h-10" />
        </div>
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );

  const COLORS = ["#8B5CF6", "#EC4899", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="animate-fade">
      <h1 className="text-4xl font-extrabold text-blue-600 drop-shadow-sm mb-6">
        📊 Panel Familiar
      </h1>

      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-xl shadow-md mb-6">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="text-xl text-gray-700 animate-pulse">
          Cargando información...
        </div>
      ) : (
        <>
          {/* TARJETAS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card
              title="Hijos vinculados"
              value={stats.hijos}
              bgColor="bg-blue-200"
              icon="https://cdn-icons-png.flaticon.com/512/3048/3048122.png"
            />

            <Card
              title="Cursos activos"
              value={stats.cursos}
              bgColor="bg-purple-200"
              icon="https://cdn-icons-png.flaticon.com/512/4762/4762311.png"
            />

            <Card
              title="Lecturas asignadas"
              value={stats.lecturas}
              bgColor="bg-pink-200"
              icon="https://cdn-icons-png.flaticon.com/512/2232/2232688.png"
            />

            <Card
              title="Lecturas disponibles"
              value={stats.lecturasDisponibles}
              bgColor="bg-orange-200"
              icon="https://cdn-icons-png.flaticon.com/512/3330/3330315.png"
            />
          </div>

          {/* GRÁFICAS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Progreso por hijo */}
            <div className="bg-white/80 backdrop-blur-md border border-white/40 p-6 rounded-3xl shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📚 Progreso de Aprendizaje</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hijosData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="nombre" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="lecturas" fill="#8B5CF6" name="Lecturas completadas" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="cursos" fill="#3B82F6" name="Cursos activos" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Actividad semanal */}
            <div className="bg-white/80 backdrop-blur-md border border-white/40 p-6 rounded-3xl shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Actividad de Lectura Semanal</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lecturasSemanales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="dia" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="lecturas" 
                    stroke="#EC4899" 
                    strokeWidth={3}
                    name="Lecturas diarias"
                    dot={{ fill: '#EC4899', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribución de cursos + Tabla de rendimiento */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Gráfica de pastel */}
            {cursosPorCategoria.length > 0 && (
              <div className="bg-white/80 backdrop-blur-md border border-white/40 p-6 rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Distribución de Cursos</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={cursosPorCategoria}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ nombre, percent }) => `${nombre} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="valor"
                    >
                      {cursosPorCategoria.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Tabla de rendimiento */}
            <div className="bg-white/80 backdrop-blur-md border border-white/40 p-6 rounded-3xl shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⭐ Rendimiento Individual</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-2 text-gray-600 font-semibold">Estudiante</th>
                      <th className="text-center py-3 px-2 text-gray-600 font-semibold">Cursos</th>
                      <th className="text-center py-3 px-2 text-gray-600 font-semibold">Lecturas</th>
                      <th className="text-center py-3 px-2 text-gray-600 font-semibold">Progreso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hijosData.map((hijo, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-blue-50 transition">
                        <td className="py-3 px-2 font-medium text-gray-800">{hijo.nombre}</td>
                        <td className="text-center py-3 px-2 text-gray-700">{hijo.cursos}</td>
                        <td className="text-center py-3 px-2 text-gray-700">{hijo.lecturas}</td>
                        <td className="text-center py-3 px-2">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all"
                                style={{ width: `${hijo.progreso}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{hijo.progreso}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* SECCIÓN INFORMATIVA */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-6 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              💡 Resumen del aprendizaje familiar
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              Desde este panel puedes supervisar el progreso académico de tus
              hijos, acceder a sus lecturas asignadas y revisar el seguimiento
              inteligente generado por el sistema.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white/70 p-4 rounded-2xl">
                <div className="text-3xl mb-2">📖</div>
                <h4 className="font-semibold text-gray-800">Lectura activa</h4>
                <p className="text-sm text-gray-600">Fomenta el hábito de lectura diaria</p>
              </div>
              <div className="bg-white/70 p-4 rounded-2xl">
                <div className="text-3xl mb-2">🎓</div>
                <h4 className="font-semibold text-gray-800">Aprendizaje continuo</h4>
                <p className="text-sm text-gray-600">Monitorea el avance en cada curso</p>
              </div>
              <div className="bg-white/70 p-4 rounded-2xl">
                <div className="text-3xl mb-2">🤖</div>
                <h4 className="font-semibold text-gray-800">IA personalizada</h4>
                <p className="text-sm text-gray-600">Seguimiento inteligente y adaptativo</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
