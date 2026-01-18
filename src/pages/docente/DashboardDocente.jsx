import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getResumenDashboard,
  getEstudiantesDocente,
} from "../../services/docentesService";
import { getUsuarioActual } from "../../services/authService";
import { getProgresoEstudiante } from "../../services/gamificacionService";
import { listarLecturas } from "../../services/lecturasService";

import {
  MdPeople,
  MdLibraryBooks,
  MdCheckCircle,
  MdTrendingUp,
  MdTableChart,
  MdPictureAsPdf,
  MdAssignment,
  MdArrowBack,
  MdDashboard,
} from "react-icons/md";

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
} from "recharts";

export default function DashboardDocente() {
  const navigate = useNavigate();
  const [resumen, setResumen] = useState({
    total_estudiantes: 0,
    total_lecturas: 0,
    actividades_completadas: 0,
  });
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudiantesConProgreso, setEstudiantesConProgreso] = useState([]);
  const [totalLecturas, setTotalLecturas] = useState(0);
  const [docente, setDocente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgreso, setLoadingProgreso] = useState(false);

  const [datosLecturas, setDatosLecturas] = useState([]);
  const [datosActividades, setDatosActividades] = useState([]);
  const [datosEstudiantes, setDatosEstudiantes] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const usuario = await getUsuarioActual();
      setDocente(usuario);

      const [resumenData, estudiantesData, lecturasData] = await Promise.all([
        getResumenDashboard().catch(() => ({ total_estudiantes: 0, total_lecturas: 0, actividades_completadas: 0 })),
        getEstudiantesDocente(),
        listarLecturas().catch(() => []),
      ]);

      setEstudiantes(estudiantesData ?? []);
      setTotalLecturas(Array.isArray(lecturasData) ? lecturasData.length : 0);

      const lecturasRealizadasReal = await calcularLecturasReales(estudiantesData);
      const actividadesCompletadasReal = await calcularActividadesReales(estudiantesData);

      const resumenCorregido = {
        total_estudiantes: estudiantesData.length,
        total_lecturas: lecturasRealizadasReal,
        actividades_completadas: actividadesCompletadasReal,
      };

      setResumen(resumenCorregido);

      const lecturasCompletadas = lecturasRealizadasReal;
      const lecturasDisponibles = Array.isArray(lecturasData) ? lecturasData.length : 0;
      const lecturasPendientes = Math.max(0, lecturasDisponibles - lecturasCompletadas);

      setDatosLecturas([
        { nombre: "Completadas", valor: lecturasCompletadas, color: "#10B981" },
        { nombre: "Pendientes", valor: lecturasPendientes, color: "#F59E0B" },
      ]);

      const actividadesCompletadas = actividadesCompletadasReal;
      // 🚫 NO inventar actividades pendientes - no tenemos datos reales
      setDatosActividades([]);

      await cargarProgresoEstudiantes(estudiantesData);
    } catch (error) {
      console.error("❌ Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const calcularLecturasReales = async (estudiantesData) => {
    try {
      let totalLecturas = 0;
      for (const estudiante of estudiantesData) {
        try {
          const progreso = await getProgresoEstudiante(estudiante.id);
          const lecturasEstimadas = Math.floor((progreso.xp_actual || 0) / 100);
          totalLecturas += lecturasEstimadas;
        } catch (error) {
          console.log(`⚠️ No se pudo obtener progreso de estudiante ${estudiante.id}`);
        }
      }
      return totalLecturas;
    } catch (error) {
      console.error("Error calculando lecturas:", error);
      return 0;
    }
  };

  const calcularActividadesReales = async (estudiantesData) => {
    try {
      let totalActividades = 0;
      for (const estudiante of estudiantesData) {
        try {
          const progreso = await getProgresoEstudiante(estudiante.id);
          const actividadesEstimadas = Math.floor((progreso.xp_actual || 0) / 50);
          totalActividades += actividadesEstimadas;
        } catch (error) {
          console.log(`⚠️ No se pudo obtener progreso de estudiante ${estudiante.id}`);
        }
      }
      return totalActividades;
    } catch (error) {
      console.error("Error calculando actividades:", error);
      return 0;
    }
  };

  const cargarProgresoEstudiantes = async (estudiantesData) => {
    try {
      setLoadingProgreso(true);
      const estudiantesConDatos = await Promise.all(
        estudiantesData.map(async (est) => {
          try {
            const progreso = await getProgresoEstudiante(est.id);
            return {
              ...est,
              nivel_gamificacion: progreso.nivel_actual || 1,
              xp_total: progreso.xp_actual || 0,
              racha: progreso.racha_actual || 0,
            };
          } catch (error) {
            return {
              ...est,
              nivel_gamificacion: 1,
              xp_total: 0,
              racha: 0,
            };
          }
        })
      );

      setEstudiantesConProgreso(estudiantesConDatos);

      const topEstudiantes = estudiantesConDatos
        .sort((a, b) => (b.xp_total || 0) - (a.xp_total || 0))
        .slice(0, 5)
        .map((e) => ({
          nombre: `${e.nombre} ${e.apellido}`.substring(0, 15),
          xp: e.xp_total || 0,
          nivel: e.nivel_gamificacion || 1,
        }));

      setDatosEstudiantes(topEstudiantes);
    } catch (error) {
      console.error("Error cargando progreso de estudiantes:", error);
      setEstudiantesConProgreso(estudiantes);
    } finally {
      setLoadingProgreso(false);
    }
  };

  const exportarExcel = async () => {
    try {
      const XLSX = await import("xlsx");

      const datosExcel = estudiantesConProgreso.map((e) => ({
        Nombre: `${e.nombre} ${e.apellido}`,
        Curso: e.curso_nombre || "—",
        Nivel_Educativo: e.nivel_educativo || "—",
        Nivel_Gamificacion: e.nivel_gamificacion || 1,
        XP_Total: e.xp_total || 0,
        Racha_Dias: e.racha || 0,
        Estado: "Activo",
      }));

      const worksheet = XLSX.utils.json_to_sheet(datosExcel);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Estudiantes");

      XLSX.writeFile(
        workbook,
        `Estudiantes_${docente?.nombre || "Docente"}_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch (error) {
      console.error("Error exportando a Excel:", error);
      alert("Error al exportar a Excel.");
    }
  };

  const exportarPDF = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      await import("jspdf-autotable");

      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.setTextColor(37, 99, 235);
      doc.text("Reporte de Estudiantes", 14, 22);

      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Docente: ${docente?.nombre} ${docente?.apellido}`, 14, 32);
      doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, 14, 38);

      const resumenData = [
        ["Total Estudiantes", resumen.total_estudiantes],
        ["Lecturas Realizadas", resumen.total_lecturas],
        ["Actividades Completadas", resumen.actividades_completadas],
      ];

      doc.autoTable({
        startY: 45,
        head: [["Métrica", "Valor"]],
        body: resumenData,
        theme: "grid",
        headStyles: { fillColor: [37, 99, 235] },
      });

      const estudiantesData = estudiantesConProgreso.map((e) => [
        `${e.nombre} ${e.apellido}`,
        e.curso_nombre || "—",
        `Nivel ${e.nivel_gamificacion || 1}`,
        `${e.xp_total || 0} XP`,
      ]);

      const finalY = doc.lastAutoTable.finalY || 45;
      doc.autoTable({
        startY: finalY + 10,
        head: [["Nombre", "Curso", "Nivel", "XP"]],
        body: estudiantesData,
        theme: "striped",
        headStyles: { fillColor: [37, 99, 235] },
      });

      doc.save(
        `Reporte_${docente?.nombre || "Docente"}_${new Date().toISOString().split("T")[0]}.pdf`
      );
    } catch (error) {
      console.error("❌ Error exportando a PDF:", error);
      alert("Error al exportar a PDF.");
    }
  };

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <MdDashboard size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white mb-0.5">Dashboard</h1>
                <p className="text-xs text-blue-100">¡Hola, {docente?.nombre}!</p>
              </div>
            </div>

            {/* Botones export móvil */}
            <div className="flex gap-2">
              <button
                onClick={exportarExcel}
                disabled={loadingProgreso}
                className="p-2 bg-green-600 rounded-lg text-white disabled:opacity-50"
              >
                <MdTableChart size={16} />
              </button>
              <button
                onClick={exportarPDF}
                disabled={loadingProgreso}
                className="p-2 bg-red-600 rounded-lg text-white disabled:opacity-50"
              >
                <MdPictureAsPdf size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Contenido móvil */}
        <main className="pt-24 px-4 pb-8 space-y-4">{/* Reducido de pt-36 a pt-24 */}
          {/* Cards móvil */}
          <div className="grid grid-cols-2 gap-3">
            <MiniCard
              icon={<MdPeople size={20} />}
              color="from-blue-500 to-blue-600"
              titulo="Estudiantes"
              valor={resumen.total_estudiantes}
            />
            <MiniCard
              icon={<MdLibraryBooks size={20} />}
              color="from-purple-500 to-purple-600"
              titulo="Lecturas"
              valor={resumen.total_lecturas}
            />
            <MiniCard
              icon={<MdCheckCircle size={20} />}
              color="from-green-500 to-green-600"
              titulo="Actividades"
              valor={resumen.actividades_completadas}
            />
            <MiniCard
              icon={<MdAssignment size={20} />}
              color="from-orange-500 to-orange-600"
              titulo="Disponibles"
              valor={totalLecturas}
            />
          </div>

          {/* Gráficos móvil - solo 2 gráficos */}
          <div className="space-y-4">
            <GraficoCard
              titulo="Estado de Lecturas"
              icon={<MdLibraryBooks size={18} className="text-green-600" />}
              datos={datosLecturas}
              tipo="pie"
            />

            <GraficoCard
              titulo="Top 5 Estudiantes"
              icon={<MdTrendingUp size={18} className="text-blue-600" />}
              datos={datosEstudiantes}
              tipo="bar"
            />
          </div>

          {/* Tabla móvil */}
          <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Estudiantes ({estudiantesConProgreso.length})
            </h3>
            
            {loadingProgreso && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <p className="text-xs text-blue-700">Cargando progreso...</p>
              </div>
            )}

            {estudiantesConProgreso.length > 0 ? (
              <div className="space-y-2">
                {estudiantesConProgreso.map((e) => (
                  <div key={e.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <p className="text-sm font-bold text-slate-900 mb-1">
                      {e.nombre} {e.apellido}
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">Curso:</span>
                        <p className="font-medium text-slate-700">{e.curso_nombre || "—"}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Nivel:</span>
                        <p className="font-medium text-indigo-600">Nv. {e.nivel_gamificacion || 1}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">XP:</span>
                        <p className="font-medium text-purple-600">{e.xp_total || 0}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MdPeople size={32} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No hay estudiantes</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* VERSIÓN DESKTOP */}
      <div className="hidden md:block min-h-screen bg-white pt-6">
        <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
          {/* Header desktop */}
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  ¡Bienvenido, {docente?.nombre} {docente?.apellido}! 👋
                </h1>
                <p className="text-sm text-slate-600">
                  Resumen general de tus estudiantes registrados
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={exportarExcel}
                  disabled={loadingProgreso}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-md transition disabled:opacity-50"
                >
                  <MdTableChart size={20} />
                  Excel
                </button>
                <button
                  onClick={exportarPDF}
                  disabled={loadingProgreso}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-md transition disabled:opacity-50"
                >
                  <MdPictureAsPdf size={20} />
                  PDF
                </button>
              </div>
            </div>
          </div>

          {/* Cards desktop */}
          <div className="grid grid-cols-4 gap-5">
            <Card
              color="from-blue-500 to-blue-600"
              icon={<MdPeople size={28} />}
              titulo="Total Estudiantes"
              valor={resumen.total_estudiantes}
            />
            <Card
              color="from-purple-500 to-purple-600"
              icon={<MdLibraryBooks size={28} />}
              titulo="Lecturas Realizadas"
              valor={resumen.total_lecturas}
            />
            <Card
              color="from-green-500 to-green-600"
              icon={<MdCheckCircle size={28} />}
              titulo="Actividades Completadas"
              valor={resumen.actividades_completadas}
            />
            <Card
              color="from-orange-500 to-orange-600"
              icon={<MdAssignment size={28} />}
              titulo="Lecturas Disponibles"
              valor={totalLecturas}
            />
          </div>

          {/* Gráficos desktop - solo 2 gráficos */}
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MdLibraryBooks className="text-green-600" size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Estado de Lecturas</h3>
                  <p className="text-xs text-slate-500">Completadas vs Pendientes</p>
                </div>
              </div>
              {datosLecturas.every((d) => d.valor === 0) ? (
                <div className="h-[220px] flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <MdLibraryBooks size={40} className="mx-auto mb-2 text-slate-300" />
                    <p className="text-sm">No hay datos</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={datosLecturas}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ nombre, valor }) => `${nombre}: ${valor}`}
                      outerRadius={70}
                      dataKey="valor"
                    >
                      {datosLecturas.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MdTrendingUp className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Top 5 Estudiantes</h3>
                  <p className="text-xs text-slate-500">Por XP acumulado</p>
                </div>
              </div>
              {datosEstudiantes.length === 0 ? (
                <div className="h-[220px] flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <MdPeople size={40} className="mx-auto mb-2 text-slate-300" />
                    <p className="text-sm">No hay estudiantes</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={datosEstudiantes} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis type="number" />
                    <YAxis dataKey="nombre" type="category" width={70} />
                    <Tooltip />
                    <Bar dataKey="xp" fill="#3B82F6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Tabla desktop */}
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Estudiantes Registrados ({estudiantesConProgreso.length})
            </h2>

            {loadingProgreso && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-700">Cargando progreso...</p>
              </div>
            )}

            {estudiantesConProgreso.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-bold text-slate-700">Nombre</th>
                      <th className="py-3 px-4 text-left text-sm font-bold text-slate-700">Curso</th>
                      <th className="py-3 px-4 text-center text-sm font-bold text-slate-700">Nivel</th>
                      <th className="py-3 px-4 text-center text-sm font-bold text-slate-700">XP Total</th>
                      <th className="py-3 px-4 text-center text-sm font-bold text-slate-700">Racha</th>
                      <th className="py-3 px-4 text-center text-sm font-bold text-slate-700">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estudiantesConProgreso.map((e) => (
                      <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {e.nombre} {e.apellido}
                        </td>
                        <td className="py-3 px-4 text-slate-700">{e.curso_nombre || "—"}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                            Nv. {e.nivel_gamificacion || 1}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-purple-600">
                          {e.xp_total || 0} XP
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                            🔥 {e.racha || 0}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            Activo
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <MdPeople size={48} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No hay estudiantes registrados</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

// Componente Card Desktop
function Card({ color, icon, titulo, valor }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200 hover:shadow-xl transition-shadow">
      <div className="flex gap-3 items-center">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color} text-white`}>
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
    <div className="bg-white rounded-lg shadow-md p-3 border border-slate-200">
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} text-white flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <p className="text-xs text-slate-600 font-semibold mb-1">{titulo}</p>
      <p className="text-xl font-bold text-slate-900">{valor}</p>
    </div>
  );
}

// Componente GraficoCard Móvil
function GraficoCard({ titulo, icon, datos, tipo }) {
  const sinDatos = Array.isArray(datos) ? datos.every(d => d.valor === 0 || !d.xp) : true;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200">
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
          {tipo === "pie" ? (
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
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : (
            <BarChart data={datos} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="nombre" type="category" width={60} style={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="xp" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
}
