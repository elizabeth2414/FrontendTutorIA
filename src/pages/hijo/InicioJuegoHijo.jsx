import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdShield,
  MdFlashOn,
  MdSchool,
  MdSecurity,
  MdLocalFireDepartment,
  MdMenuBook,
  MdPsychology,
  MdLock,
  MdArrowBack,
} from "react-icons/md";
import { getProgresoEstudiante } from "../../services/gamificacionService";

export default function InicioJuegoHijo() {
  const { hijoId } = useParams();
  const navigate = useNavigate();

  const [progreso, setProgreso] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🦸 Avatares por nivel
  const avatares = [
    { nivel: 1, nombre: "Explorador", icon: MdShield, color: "bg-blue-600" },
    { nivel: 2, nombre: "Lector Valiente", icon: MdFlashOn, color: "bg-indigo-600" },
    { nivel: 3, nombre: "Maestro Lector", icon: MdSchool, color: "bg-purple-600" },
    { nivel: 4, nombre: "Guardián del Saber", icon: MdSecurity, color: "bg-emerald-600" },
  ];

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getProgresoEstudiante(hijoId);
        setProgreso(data);
      } catch (e) {
        console.error("❌ Error cargando progreso:", e);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [hijoId]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Cargando progreso del estudiante...
      </p>
    );
  }

  if (!progreso) {
    return (
      <p className="text-center text-red-600">
        No se pudo cargar el progreso.
      </p>
    );
  }

  const porcentaje = Math.min(
    (progreso.xp_actual / progreso.xp_para_siguiente_nivel) * 100,
    100
  );

  const avatarActivo =
    avatares.find((a) => a.nivel === progreso.nivel_actual) || avatares[0];

  const AvatarIcon = avatarActivo.icon;

  return (
    <div className="min-h-screen bg-white flex justify-center px-4 py-6">
      <div className="w-full max-w-md space-y-6">

        {/* ===== HEADER ===== */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
          >
            <MdArrowBack size={22} />
          </button>

          <h1 className="text-xl font-extrabold text-indigo-700">
            Zona de Aventuras
          </h1>
        </div>

        <p className="text-sm text-gray-600">
          Aquí puedes ver tu progreso, racha y héroes desbloqueados
        </p>

        {/* ===== AVATAR PRINCIPAL ===== */}
        <div className="border border-indigo-100 rounded-3xl shadow-sm p-6 text-center space-y-2">
          <div
            className={`mx-auto w-24 h-24 rounded-full ${avatarActivo.color} text-white flex items-center justify-center shadow`}
          >
            <AvatarIcon size={42} />
          </div>

          <h2 className="text-2xl font-extrabold text-indigo-700">
            {progreso.nombre}
          </h2>

          <p className="text-sm text-gray-600">
            Nivel {progreso.nivel_actual} – {avatarActivo.nombre}
          </p>
        </div>

        {/* ===== XP ===== */}
        <div className="border rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
            <span>Progreso del nivel</span>
            <span>
              {progreso.xp_actual} / {progreso.xp_para_siguiente_nivel} XP
            </span>
          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>

        {/* ===== RACHA ===== */}
        <div className="flex items-center justify-center gap-2 text-orange-600 font-semibold">
          <MdLocalFireDepartment size={22} />
          Racha de {progreso.racha_actual} días seguidos
        </div>

        {/* ===== ACCIONES ===== */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 flex flex-col items-center font-semibold shadow">
            <MdMenuBook size={26} />
            Leer
          </button>

          <button className="bg-green-600 hover:bg-green-700 text-white rounded-2xl py-4 flex flex-col items-center font-semibold shadow">
            <MdPsychology size={26} />
            Practicar
          </button>
        </div>

        {/* ===== AVATARES DESBLOQUEABLES ===== */}
        <div className="border border-indigo-100 rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-bold text-indigo-700 mb-3">
            Héroes desbloqueables
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {avatares.map((a) => {
              const desbloqueado = progreso.nivel_actual >= a.nivel;
              const Icon = a.icon;

              return (
                <div
                  key={a.nivel}
                  className={`rounded-xl p-3 text-center border ${
                    desbloqueado
                      ? "bg-indigo-50 border-indigo-200"
                      : "bg-gray-100 border-gray-200 opacity-60"
                  }`}
                >
                  <div
                    className={`mx-auto w-12 h-12 rounded-full ${
                      desbloqueado ? a.color : "bg-gray-300"
                    } text-white flex items-center justify-center mb-1`}
                  >
                    {desbloqueado ? <Icon size={22} /> : <MdLock size={20} />}
                  </div>

                  <p className="text-xs font-semibold">Nivel {a.nivel}</p>
                  <p className="text-xs text-gray-500">{a.nombre}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== MENSAJE MOTIVADOR ===== */}
        <div className="bg-indigo-50 text-indigo-700 text-sm rounded-xl p-3 text-center font-medium">
          Sigue leyendo y practicando para desbloquear nuevos héroes
        </div>
      </div>
    </div>
  );
}
