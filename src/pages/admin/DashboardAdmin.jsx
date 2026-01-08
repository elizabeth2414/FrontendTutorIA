import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import {
  MdPeople,
  MdSchool,
  MdAutoStories,
  MdAssessment,
} from "react-icons/md";

import { obtenerDashboardAdmin } from "../../services/adminDashboardService";
import AdminBarChart from "../../components/admin/charts/AdminBarChart";
import AdminDonutChart from "../../components/admin/charts/AdminDonutChart";

export default function DashboardAdmin() {
  const isMobile = Capacitor.isNativePlatform();

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

  // 📱 Tarjeta para MÓVIL (más compacta)
  const CardMobile = ({ bgColor, icon: Icon, title, value, textColor }) => (
    <div className="bg-white/95 backdrop-blur-lg border border-gray-100 p-4 rounded-2xl shadow-md active:scale-[0.98] transition">
      <div className="flex items-center gap-3">
        <div className={`${bgColor} p-3 rounded-xl`}>
          <Icon className={textColor} size={28} />
        </div>
        <div className="flex-1">
          <p className="text-gray-600 text-xs font-medium">{title}</p>
          <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
        </div>
      </div>
    </div>
  );

  // 🖥️ Tarjeta para WEB
  const CardDesktop = ({ bgColor, icon: Icon, title, value, textColor }) => (
    <div className="bg-white/80 backdrop-blur-lg border border-white/40 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition">
      <div className="flex items-center gap-4">
        <div className={`${bgColor} p-4 rounded-2xl`}>
          <Icon className={textColor} size={36} />
        </div>
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        </div>
      </div>
    </div>
  );

  const Card = isMobile ? CardMobile : CardDesktop;

  // 📱 DISEÑO MÓVIL
  if (isMobile) {
    return (
      <div className="animate-fadeIn pb-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 mb-1">
            Panel Admin
          </h1>
          <p className="text-sm text-gray-600">
            Resumen general del sistema
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 rounded-lg shadow-md mb-4 text-sm">
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        ) : (
          <>
            {/* Tarjetas de estadísticas - Grid 2x2 en móvil */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Card
                bgColor="bg-blue-100"
                icon={MdSchool}
                title="Docentes"
                value={stats.docentes}
                textColor="text-blue-600"
              />

              <Card
                bgColor="bg-purple-100"
                icon={MdPeople}
                title="Estudiantes"
                value={stats.estudiantes}
                textColor="text-purple-600"
              />

              <Card
                bgColor="bg-pink-100"
                icon={MdAutoStories}
                title="Lecturas"
                value={stats.lecturas}
                textColor="text-pink-600"
              />

              <Card
                bgColor="bg-green-100"
                icon={MdAssessment}
                title="Actividades"
                value={stats.actividades}
                textColor="text-green-600"
              />
            </div>

            {/* Gráficos - Stack vertical en móvil */}
            <div className="space-y-4">
              {/* Gráfico de barras */}
              <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-lg font-bold text-indigo-600 mb-3">
                  Resumen General
                </h2>
                <div className="overflow-x-auto">
                  <AdminBarChart stats={stats} />
                </div>
              </div>

              {/* Gráfico donut */}
              <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-lg font-bold text-indigo-600 mb-3">
                  Distribución
                </h2>
                <div className="flex justify-center">
                  <AdminDonutChart stats={stats} />
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="mt-6 bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-2xl border border-indigo-100">
              <h3 className="text-sm font-semibold text-indigo-700 mb-2">
                ℹ️ Actividad del Sistema
              </h3>
              <p className="text-xs text-gray-600">
                Los datos se actualizan en tiempo real desde el servidor.
              </p>
            </div>
          </>
        )}
      </div>
    );
  }

  // 🖥️ DISEÑO WEB (ORIGINAL MEJORADO)
  return (
    <div className="animate-fade">
      <h1 className="text-4xl font-extrabold text-indigo-600 drop-shadow-sm mb-6">
        Panel Administrativo
      </h1>

      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-xl shadow-md mb-6">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="text-xl text-gray-700 animate-pulse">Cargando datos...</div>
      ) : (
        <>
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card
              bgColor="bg-blue-100"
              icon={MdSchool}
              title="Docentes"
              value={stats.docentes}
              textColor="text-blue-600"
            />

            <Card
              bgColor="bg-purple-100"
              icon={MdPeople}
              title="Estudiantes"
              value={stats.estudiantes}
              textColor="text-purple-600"
            />

            <Card
              bgColor="bg-pink-100"
              icon={MdAutoStories}
              title="Lecturas"
              value={stats.lecturas}
              textColor="text-pink-600"
            />

            <Card
              bgColor="bg-green-100"
              icon={MdAssessment}
              title="Actividades"
              value={stats.actividades}
              textColor="text-green-600"
            />
          </div>

          {/* Sección de actividad */}
          <div className="mt-10 bg-white/80 backdrop-blur-md border border-white/40 p-6 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">
              Actividad reciente del sistema
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              {/* Gráfico de barras */}
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl">
                <h2 className="text-xl font-bold text-indigo-700 mb-4">
                  Resumen general
                </h2>
                <AdminBarChart stats={stats} />
              </div>

              {/* Gráfico donut */}
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl">
                <h2 className="text-xl font-bold text-indigo-700 mb-4">
                  Distribución del sistema
                </h2>
                <AdminDonutChart stats={stats} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}