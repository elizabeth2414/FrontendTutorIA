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
  MdDashboard,
  MdPersonAdd,
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

      // Solo crear datos de gráficos si hay estudiantes
      if (estudiantesData.length > 0) {
        const lecturasCompletadas = lecturasRealizadasReal;
        const lecturasDisponibles = Array.isArray(lecturasData) ? lecturasData.length : 0;
        const lecturasPendientes = Math.max(0, lecturasDisponibles - lecturasCompletadas);

        setDatosLecturas([
          { nombre: "Completadas", valor: lecturasCompletadas },
          { nombre: "Pendientes", valor: lecturasPendientes },
        ]);

        await cargarProgresoEstudiantes(estudiantesData);
      } else {
        setDatosLecturas([]);
        setDatosEstudiantes([]);
      }
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

      // 🎨 Header con fondo morado
      doc.setFillColor(147, 51, 234); // purple-600
      doc.rect(0, 0, 210, 40, 'F');

      // Logo/Ícono (simulado con círculo)
      doc.setFillColor(255, 255, 255);
      doc.circle(20, 20, 8, 'F');
      doc.setFillColor(147, 51, 234);
      doc.circle(20, 20, 6, 'F');

      // Título principal
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.setFont(undefined, 'bold');
      doc.text("BookiSmartIA", 35, 18);

      doc.setFontSize(14);
      doc.setFont(undefined, 'normal');
      doc.text("Reporte de Estudiantes", 35, 26);

      // Información del docente
      doc.setFontSize(10);
      doc.setTextColor(240, 240, 255);
      doc.text(`Docente: ${docente?.nombre} ${docente?.apellido}`, 14, 35);
      doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES", { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      })}`, 140, 35);

      // Línea decorativa
      doc.setDrawColor(216, 180, 254); // purple-300
      doc.setLineWidth(0.5);
      doc.line(14, 42, 196, 42);

      // Sección de resumen con cards
      doc.setFontSize(12);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.setFont(undefined, 'bold');
      doc.text("Resumen General", 14, 52);

      // Cards de resumen (3 columnas)
      const cardWidth = 58;
      const cardHeight = 22;
      const cardY = 58;
      
      // Card 1 - Estudiantes
      doc.setFillColor(243, 232, 255); // purple-50
      doc.roundedRect(14, cardY, cardWidth, cardHeight, 3, 3, 'F');
      doc.setDrawColor(216, 180, 254); // purple-300
      doc.setLineWidth(0.3);
      doc.roundedRect(14, cardY, cardWidth, cardHeight, 3, 3, 'S');
      
      doc.setFontSize(24);
      doc.setTextColor(147, 51, 234); // purple-600
      doc.setFont(undefined, 'bold');
      doc.text(String(resumen.total_estudiantes), 25, cardY + 12);
      
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128); // gray-500
      doc.setFont(undefined, 'normal');
      doc.text("Total Estudiantes", 25, cardY + 18);

      // Card 2 - Lecturas
      doc.setFillColor(252, 231, 243); // pink-50
      doc.roundedRect(76, cardY, cardWidth, cardHeight, 3, 3, 'F');
      doc.setDrawColor(251, 207, 232); // pink-300
      doc.roundedRect(76, cardY, cardWidth, cardHeight, 3, 3, 'S');
      
      doc.setFontSize(24);
      doc.setTextColor(219, 39, 119); // pink-600
      doc.setFont(undefined, 'bold');
      doc.text(String(resumen.total_lecturas), 87, cardY + 12);
      
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128);
      doc.setFont(undefined, 'normal');
      doc.text("Lecturas Realizadas", 87, cardY + 18);

      // Card 3 - Actividades
      doc.setFillColor(240, 253, 244); // green-50
      doc.roundedRect(138, cardY, cardWidth, cardHeight, 3, 3, 'F');
      doc.setDrawColor(134, 239, 172); // green-300
      doc.roundedRect(138, cardY, cardWidth, cardHeight, 3, 3, 'S');
      
      doc.setFontSize(24);
      doc.setTextColor(22, 163, 74); // green-600
      doc.setFont(undefined, 'bold');
      doc.text(String(resumen.actividades_completadas), 149, cardY + 12);
      
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128);
      doc.setFont(undefined, 'normal');
      doc.text("Actividades Completadas", 149, cardY + 18);

      // Tabla de estudiantes
      const estudiantesData = estudiantesConProgreso.map((e) => [
        `${e.nombre} ${e.apellido}`,
        e.curso_nombre || "—",
        `Nivel ${e.nivel_gamificacion || 1}`,
        `${e.xp_total || 0} XP`,
        `🔥 ${e.racha || 0}`,
        "Activo"
      ]);

      doc.autoTable({
        startY: 88,
        head: [["Nombre", "Curso", "Nivel", "XP", "Racha", "Estado"]],
        body: estudiantesData,
        theme: "striped",
        headStyles: { 
          fillColor: [147, 51, 234], // purple-600
          textColor: 255,
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: {
          fontSize: 9,
          cellPadding: 4,
          overflow: 'linebreak'
        },
        columnStyles: {
          0: { halign: 'left', fontStyle: 'bold', textColor: [71, 85, 105] }, // Nombre
          1: { halign: 'left' },
          2: { halign: 'center', fillColor: [238, 242, 255], textColor: [99, 102, 241] }, // Nivel
          3: { halign: 'center', fillColor: [250, 245, 255], textColor: [147, 51, 234] }, // XP
          4: { halign: 'center', fillColor: [255, 247, 237], textColor: [234, 88, 12] }, // Racha
          5: { halign: 'center', fillColor: [240, 253, 244], textColor: [22, 163, 74] } // Estado
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251] // gray-50
        },
        margin: { left: 14, right: 14 }
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Línea decorativa
        doc.setDrawColor(216, 180, 254);
        doc.setLineWidth(0.5);
        doc.line(14, 282, 196, 282);
        
        // Texto del footer
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175); // gray-400
        doc.text("BookiSmartIA • Panel de Docentes", 14, 287);
        doc.text(`Página ${i} de ${pageCount}`, 180, 287);
        
        // Logo pequeño
        doc.setFillColor(243, 232, 255);
        doc.circle(190, 287, 2, 'F');
      }

      doc.save(
        `Reporte_${docente?.nombre || "Docente"}_${new Date().toISOString().split("T")[0]}.pdf`
      );
    } catch (error) {
      console.error("❌ Error exportando a PDF:", error);
      alert("Error al exportar a PDF.");
    }
  };

  // Estado vacío
  const EstadoVacio = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
        <MdPeople className="w-16 h-16 text-purple-600" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">¡Comienza a Gestionar tus Estudiantes!</h3>
      <p className="text-slate-600 text-center max-w-md mb-6">
        Aún no tienes estudiantes registrados. Agrega estudiantes para comenzar a monitorear su progreso de aprendizaje.
      </p>
      <button 
        onClick={() => navigate('/docente/menu/estudiantes')}
        className="px-6 py-3 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:via-fuchsia-600 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
      >
        <MdPersonAdd size={20} />
        Agregar Estudiantes
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando información...</p>
        </div>
      </div>
    );
  }

  // Si no hay estudiantes, mostrar estado vacío
  if (resumen.total_estudiantes === 0) {
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
          <h1 className="text-xl font-bold text-slate-900 mb-1">Dashboard Docente</h1>
          <p className="text-sm text-slate-600">¡Hola, {docente?.nombre}! 👋</p>
        </div>

        {/* Botones export móvil */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={exportarExcel}
            disabled={loadingProgreso}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md transition disabled:opacity-50 text-sm"
          >
            <MdTableChart size={18} />
            Excel
          </button>
          <button
            onClick={exportarPDF}
            disabled={loadingProgreso}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-md transition disabled:opacity-50 text-sm"
          >
            <MdPictureAsPdf size={18} />
            PDF
          </button>
        </div>

        {/* Cards móvil */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <MiniCard
            icon={<MdPeople size={20} />}
            color="from-purple-500 to-fuchsia-600"
            titulo="Estudiantes"
            valor={resumen.total_estudiantes}
          />
          <MiniCard
            icon={<MdLibraryBooks size={20} />}
            color="from-pink-500 to-rose-600"
            titulo="Lecturas"
            valor={resumen.total_lecturas}
          />
          <MiniCard
            icon={<MdCheckCircle size={20} />}
            color="from-emerald-500 to-teal-600"
            titulo="Actividades"
            valor={resumen.actividades_completadas}
          />
          <MiniCard
            icon={<MdAssignment size={20} />}
            color="from-amber-500 to-orange-600"
            titulo="Disponibles"
            valor={totalLecturas}
          />
        </div>

        {/* Gráficos móvil */}
        <div className="space-y-4">
          {datosLecturas.length > 0 && (
            <GraficoCard
              titulo="Estado de Lecturas"
              icon={<MdLibraryBooks size={18} className="text-emerald-600" />}
              datos={datosLecturas}
              tipo="pie"
            />
          )}

          {datosEstudiantes.length > 0 && (
            <GraficoCard
              titulo="Top 5 Estudiantes"
              icon={<MdTrendingUp size={18} className="text-purple-600" />}
              datos={datosEstudiantes}
              tipo="bar"
            />
          )}
        </div>

        {/* Tabla móvil */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200 mt-4">
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            Estudiantes ({estudiantesConProgreso.length})
          </h3>
          
          {loadingProgreso && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
              <p className="text-xs text-purple-700">Cargando progreso...</p>
            </div>
          )}

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
                    <p className="font-medium text-purple-600">Nv. {e.nivel_gamificacion || 1}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">XP:</span>
                    <p className="font-medium text-pink-600">{e.xp_total || 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-md transition disabled:opacity-50"
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
              color="from-purple-50 to-fuchsia-50"
              iconColor="from-purple-500 to-fuchsia-600"
              icon={<MdPeople size={28} />}
              titulo="Total Estudiantes"
              valor={resumen.total_estudiantes}
            />
            <Card
              color="from-pink-50 to-rose-50"
              iconColor="from-pink-500 to-rose-600"
              icon={<MdLibraryBooks size={28} />}
              titulo="Lecturas Realizadas"
              valor={resumen.total_lecturas}
            />
            <Card
              color="from-emerald-50 to-teal-50"
              iconColor="from-emerald-500 to-teal-600"
              icon={<MdCheckCircle size={28} />}
              titulo="Actividades Completadas"
              valor={resumen.actividades_completadas}
            />
            <Card
              color="from-amber-50 to-orange-50"
              iconColor="from-amber-500 to-orange-600"
              icon={<MdAssignment size={28} />}
              titulo="Lecturas Disponibles"
              valor={totalLecturas}
            />
          </div>

          {/* Gráficos desktop */}
          <div className="grid lg:grid-cols-2 gap-5">
            {datosLecturas.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <MdLibraryBooks className="text-emerald-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Estado de Lecturas</h3>
                    <p className="text-xs text-slate-500">Completadas vs Pendientes</p>
                  </div>
                </div>
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
                        <Cell key={`cell-${index}`} fill={index === 0 ? "url(#gradientCompletadas)" : "url(#gradientPendientes)"} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <defs>
                      <linearGradient id="gradientCompletadas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#14b8a6" />
                      </linearGradient>
                      <linearGradient id="gradientPendientes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {datosEstudiantes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MdTrendingUp className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Top 5 Estudiantes</h3>
                    <p className="text-xs text-slate-500">Por XP acumulado</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={datosEstudiantes} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis type="number" />
                    <YAxis dataKey="nombre" type="category" width={70} />
                    <Tooltip />
                    <Bar dataKey="xp" fill="url(#gradientBar)" radius={[0, 6, 6, 0]} />
                    <defs>
                      <linearGradient id="gradientBar" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="50%" stopColor="#d946ef" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Tabla desktop */}
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Estudiantes Registrados ({estudiantesConProgreso.length})
            </h2>

            {loadingProgreso && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-purple-700">Cargando progreso...</p>
              </div>
            )}

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
                    <tr key={e.id} className="border-b border-slate-100 hover:bg-purple-50/30 transition">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {e.nombre} {e.apellido}
                      </td>
                      <td className="py-3 px-4 text-slate-700">{e.curso_nombre || "—"}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                          Nv. {e.nivel_gamificacion || 1}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-pink-600">
                        {e.xp_total || 0} XP
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                          🔥 {e.racha || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                          Activo
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

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
  const sinDatos = Array.isArray(datos) ? datos.every(d => d.valor === 0 || !d.xp) : true;

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
                  <Cell key={`cell-${index}`} fill={index === 0 ? "url(#gradMobileComp)" : "url(#gradMobilePend)"} />
                ))}
              </Pie>
              <Tooltip />
              <defs>
                <linearGradient id="gradMobileComp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
                <linearGradient id="gradMobilePend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </PieChart>
          ) : (
            <BarChart data={datos} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="nombre" type="category" width={60} style={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="xp" fill="url(#gradMobileBar)" radius={[0, 4, 4, 0]} />
              <defs>
                <linearGradient id="gradMobileBar" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="50%" stopColor="#d946ef" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
}
