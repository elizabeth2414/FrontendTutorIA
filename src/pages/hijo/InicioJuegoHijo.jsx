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
    { nivel: 1, nombre: "Explorador", icon: MdShield, color: "from-blue-500 to-blue-600" },
    { nivel: 2, nombre: "Lector Valiente", icon: MdFlashOn, color: "from-indigo-500 to-indigo-600" },
    { nivel: 3, nombre: "Maestro Lector", icon: MdSchool, color: "from-purple-500 to-purple-600" },
    { nivel: 4, nombre: "Guardián del Saber", icon: MdSecurity, color: "from-emerald-500 to-emerald-600" },
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
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando tu aventura...</p>
        </div>
      </div>
    );
  }

  if (!progreso) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-center text-red-600 font-medium">
          No se pudo cargar el progreso.
        </p>
      </div>
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
        {/* Header móvil */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-4 shadow-lg">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-3 transition-colors"
          >
            <MdArrowBack size={16} />
            <span className="font-medium text-xs">Volver</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MdPsychology size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white mb-0.5">¡Tu Aventura!</h1>
              <p className="text-xs text-blue-100">Zona de juegos y práctica</p>
            </div>
          </div>
        </div>

        {/* Contenido móvil */}
        <main className="px-4 py-5 space-y-4">
          {/* Avatar principal móvil */}
          <div className="bg-white rounded-xl shadow-md p-4 text-center border border-slate-200">
            <div
              className={`mx-auto w-16 h-16 rounded-xl bg-gradient-to-br ${avatarActivo.color} text-white flex items-center justify-center shadow-md mb-3`}
            >
              <AvatarIcon size={28} />
            </div>

            <h2 className="text-lg font-bold text-slate-900 mb-1">
              {progreso.nombre}
            </h2>

            <p className="text-xs text-slate-600 font-medium">
              Nivel {progreso.nivel_actual} – {avatarActivo.nombre}
            </p>
          </div>

          {/* XP móvil */}
          <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200">
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
              <span>⭐ Progreso del nivel</span>
              <span>
                {progreso.xp_actual} / {progreso.xp_para_siguiente_nivel} XP
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
          </div>

          {/* Racha móvil */}
          <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-xl p-3 flex items-center justify-center gap-2 text-white font-bold shadow-md">
            <MdLocalFireDepartment size={20} />
            <span className="text-sm">¡{progreso.racha_actual} días seguidos! 🔥</span>
          </div>

          {/* Botones de acción móvil */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg p-3 flex flex-col items-center font-bold shadow-md active:scale-95 transition-transform">
              <MdMenuBook size={24} className="mb-1" />
              <span className="text-sm">Leer</span>
            </button>

            <button className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg p-3 flex flex-col items-center font-bold shadow-md active:scale-95 transition-transform">
              <MdPsychology size={24} className="mb-1" />
              <span className="text-sm">Practicar</span>
            </button>
          </div>

          {/* Héroes móvil */}
          <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200">
            <h3 className="text-sm font-bold text-purple-700 mb-3 flex items-center gap-2">
              <span>🏆</span> Héroes desbloqueables
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {avatares.map((a) => {
                const desbloqueado = progreso.nivel_actual >= a.nivel;
                const Icon = a.icon;

                return (
                  <div
                    key={a.nivel}
                    className={`rounded-lg p-3 text-center border ${
                      desbloqueado
                        ? "bg-purple-50 border-purple-200"
                        : "bg-slate-100 border-slate-200 opacity-60"
                    }`}
                  >
                    <div
                      className={`mx-auto w-10 h-10 rounded-lg ${
                        desbloqueado ? `bg-gradient-to-br ${a.color}` : "bg-slate-300"
                      } text-white flex items-center justify-center mb-2 shadow-sm`}
                    >
                      {desbloqueado ? <Icon size={20} /> : <MdLock size={18} />}
                    </div>

                    <p className="text-xs font-bold text-slate-900">Nivel {a.nivel}</p>
                    <p className="text-xs text-slate-600">{a.nombre}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mensaje motivador móvil */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 text-sm rounded-xl p-3 text-center font-medium shadow-md border border-orange-200">
            💪 ¡Sigue leyendo para desbloquear nuevos héroes!
          </div>
        </main>
      </div>

      {/* VERSIÓN DESKTOP */}
      <div className="hidden md:block min-h-screen bg-white pt-6">
        <main className="max-w-5xl mx-auto px-6 py-6">
          {/* Header desktop */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition text-sm mb-4"
            >
              <MdArrowBack size={18} />
              Volver
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg">
                <MdPsychology size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  ¡Tu Zona de Aventuras!
                </h1>
                <p className="text-sm text-slate-600">
                  Mira tu progreso, racha y héroes desbloqueados
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Columna izquierda */}
            <div className="lg:col-span-2 space-y-5">
              {/* Avatar principal desktop */}
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-slate-200">
                <div
                  className={`mx-auto w-24 h-24 rounded-2xl bg-gradient-to-br ${avatarActivo.color} text-white flex items-center justify-center shadow-xl mb-4`}
                >
                  <AvatarIcon size={48} />
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {progreso.nombre}
                </h2>

                <p className="text-base text-slate-600 font-medium">
                  Nivel {progreso.nivel_actual} – {avatarActivo.nombre}
                </p>
              </div>

              {/* XP desktop */}
              <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-200">
                <div className="flex justify-between text-sm font-semibold text-slate-600 mb-3">
                  <span>⭐ Progreso del nivel</span>
                  <span>
                    {progreso.xp_actual} / {progreso.xp_para_siguiente_nivel} XP
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>
              </div>

              {/* Racha desktop */}
              <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl p-5 flex items-center justify-center gap-3 text-white font-bold text-base shadow-lg">
                <MdLocalFireDepartment size={28} />
                ¡Racha de {progreso.racha_actual} días seguidos! 🔥
              </div>

              {/* Botones de acción desktop */}
              
            </div>

            {/* Columna derecha */}
            <div className="space-y-5">
              {/* Héroes desktop */}
              <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-200">
                <h3 className="text-base font-bold text-purple-700 mb-4 flex items-center gap-2">
                  <span>🏆</span> Héroes desbloqueables
                </h3>

                <div className="space-y-3">
                  {avatares.map((a) => {
                    const desbloqueado = progreso.nivel_actual >= a.nivel;
                    const Icon = a.icon;

                    return (
                      <div
                        key={a.nivel}
                        className={`rounded-xl p-3 flex items-center gap-3 border ${
                          desbloqueado
                            ? "bg-purple-50 border-purple-200"
                            : "bg-slate-100 border-slate-200 opacity-60"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-lg ${
                            desbloqueado ? `bg-gradient-to-br ${a.color}` : "bg-slate-300"
                          } text-white flex items-center justify-center shadow-md flex-shrink-0`}
                        >
                          {desbloqueado ? <Icon size={24} /> : <MdLock size={20} />}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-900">Nivel {a.nivel}</p>
                          <p className="text-sm text-slate-600">{a.nombre}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mensaje motivador desktop */}
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 text-sm rounded-xl p-4 text-center font-medium shadow-lg border border-orange-200">
                💪 ¡Sigue leyendo y practicando para desbloquear nuevos héroes!
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
