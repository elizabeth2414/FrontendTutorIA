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
  // Cada héroe tiene su COLOR PROPIO (identidad del personaje).
  // Si quieres usar IMÁGENES en lugar de iconos, reemplaza "icon" por "imagen":
  //
  //   { nivel: 1, nombre: "Explorador", imagen: "/assets/heroes/explorador.png", color: "..." }
  //
  // Y en el render cambias <Icon size={20} /> por:
  //   <img src={a.imagen} alt={a.nombre} className="w-5 h-5 object-contain" />
  //
  const avatares = [
    { nivel: 1, nombre: "Explorador",          icon: MdShield,   color: "from-blue-500 to-blue-600"       },
    { nivel: 2, nombre: "Lector Valiente",     icon: MdFlashOn,  color: "from-indigo-500 to-indigo-600"   },
    { nivel: 3, nombre: "Maestro Lector",      icon: MdSchool,   color: "from-purple-500 to-purple-600"   },
    { nivel: 4, nombre: "Guardián del Saber",  icon: MdSecurity, color: "from-emerald-500 to-emerald-600" },
  ];

  useEffect(() => {
    const cargar = async () => {
      try {
        // ✅ El nombre del hijo viene aquí: progreso.nombre
        // Viene del API getProgresoEstudiante(hijoId)
        // No necesitas hacer nada extra, ya está disponible.
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

  // ─────────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando tu aventura...</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // ERROR
  // ─────────────────────────────────────────────
  if (!progreso) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8 max-w-sm mx-4 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-slate-900 font-bold text-lg mb-1">¡Oops!</p>
          <p className="text-slate-500 text-sm mb-5">No se pudo cargar el progreso.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // CÁLCULOS
  // ─────────────────────────────────────────────
  const porcentaje = Math.min(
    (progreso.xp_actual / progreso.xp_para_siguiente_nivel) * 100,
    100
  );

  const avatarActivo =
    avatares.find((a) => a.nivel === progreso.nivel_actual) || avatares[0];

  const AvatarIcon = avatarActivo.icon;

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
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

      {/* ====================================================
          📱 VERSIÓN MÓVIL
          ==================================================== */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 animate-fadeIn">

        {/* Header móvil */}
        <div className="bg-white rounded-b-3xl shadow-lg p-4 mb-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 mb-3 transition-colors"
          >
            <MdArrowBack size={16} />
            <span className="font-medium text-sm">Volver</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <MdPsychology size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">¡Tu Aventura!</h1>
              <p className="text-slate-500 text-xs">Zona de juegos y práctica</p>
            </div>
          </div>
        </div>

        {/* Contenido móvil */}
        <main className="px-4 pb-8 space-y-4">

          {/* Avatar principal */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 text-center">
            <div
              className={`mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br ${avatarActivo.color} text-white flex items-center justify-center shadow-lg mb-3`}
            >
              <AvatarIcon size={36} />
            </div>

            {/* ✅ Nombre del hijo — viene de progreso.nombre */}
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              {progreso.nombre}
            </h2>

            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              <span className="text-emerald-700 text-xs font-bold">Nivel {progreso.nivel_actual}</span>
              <span className="text-emerald-300">•</span>
              <span className="text-emerald-700 text-xs font-bold">{avatarActivo.nombre}</span>
            </div>
          </div>

          {/* XP */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-700">⭐ Progreso del nivel</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                {progreso.xp_actual} / {progreso.xp_para_siguiente_nivel} XP
              </span>
            </div>

            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1.5 text-right font-medium">{Math.round(porcentaje)}% completado</p>
          </div>

          {/* Racha */}
          <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-3.5 flex items-center justify-center gap-2 text-white font-bold shadow-md">
            <MdLocalFireDepartment size={22} />
            <span className="text-sm">¡{progreso.racha_actual} días seguidos! 🔥</span>
          </div>

          {/* Botones de acción */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 text-white rounded-2xl p-4 flex flex-col items-center font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
              <MdMenuBook size={28} className="mb-1.5" />
              <span className="text-sm">Leer</span>
            </button>

            <button className="bg-gradient-to-br from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-2xl p-4 flex flex-col items-center font-bold shadow-lg shadow-teal-500/20 active:scale-95 transition-all">
              <MdPsychology size={28} className="mb-1.5" />
              <span className="text-sm">Practicar</span>
            </button>
          </div>

          {/* Héroes desbloqueables */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <h3 className="text-sm font-bold text-emerald-700 mb-3 flex items-center gap-2">
              <span>🏆</span> Héroes desbloqueables
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {avatares.map((a) => {
                const desbloqueado = progreso.nivel_actual >= a.nivel;
                const Icon = a.icon;

                return (
                  <div
                    key={a.nivel}
                    className={`rounded-xl p-3 text-center border transition-all ${
                      desbloqueado
                        ? "bg-emerald-50 border-emerald-200 shadow-sm"
                        : "bg-slate-50 border-slate-200 opacity-50"
                    }`}
                  >
                    <div
                      className={`mx-auto w-12 h-12 rounded-xl ${
                        desbloqueado ? `bg-gradient-to-br ${a.color}` : "bg-slate-300"
                      } text-white flex items-center justify-center mb-2 shadow-sm`}
                    >
                      {desbloqueado ? <Icon size={22} /> : <MdLock size={18} />}
                    </div>

                    <p className="text-xs font-bold text-slate-900">Nivel {a.nivel}</p>
                    <p className="text-xs text-slate-500">{a.nombre}</p>

                    {desbloqueado && (
                      <span className="inline-block text-xs text-emerald-600 font-bold mt-1">✓ Desbloqueado</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mensaje motivador */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-orange-200 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-orange-800 font-bold text-sm">💪 ¡Sigue leyendo para desbloquear nuevos héroes!</p>
          </div>

        </main>
      </div>

      {/* ====================================================
          🖥️ VERSIÓN DESKTOP
          ==================================================== */}
      <div className="hidden md:block min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 animate-fadeIn">
        <main className="max-w-5xl mx-auto px-6 py-6">

          {/* Header desktop */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:border-emerald-300 hover:text-emerald-700 transition-all text-sm mb-5 shadow-sm"
            >
              <MdArrowBack size={18} />
              Volver
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                <MdPsychology size={30} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-0.5">
                  ¡Tu Zona de Aventuras!
                </h1>
                <p className="text-sm text-slate-500">
                  Mira tu progreso, racha y héroes desbloqueados
                </p>
              </div>
            </div>
          </div>

          {/* Grid principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Columna izquierda (2/3) */}
            <div className="lg:col-span-2 space-y-5">

              {/* Avatar principal */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
                <div
                  className={`mx-auto w-28 h-28 rounded-2xl bg-gradient-to-br ${avatarActivo.color} text-white flex items-center justify-center shadow-xl mb-4`}
                >
                  <AvatarIcon size={52} />
                </div>

                {/* ✅ Nombre del hijo */}
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {progreso.nombre}
                </h2>

                <div className="inline-flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full">
                  <span className="text-emerald-700 font-bold">Nivel {progreso.nivel_actual}</span>
                  <span className="text-emerald-300">•</span>
                  <span className="text-emerald-700 font-bold">{avatarActivo.nombre}</span>
                </div>
              </div>

              {/* XP */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-base font-bold text-slate-700">⭐ Progreso del nivel</span>
                  <span className="text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    {progreso.xp_actual} / {progreso.xp_para_siguiente_nivel} XP
                  </span>
                </div>

                <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>
                <p className="text-sm text-slate-400 mt-2 text-right font-medium">{Math.round(porcentaje)}% completado</p>
              </div>

              {/* Racha */}
              <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-5 flex items-center justify-center gap-3 text-white font-bold text-base shadow-lg">
                <MdLocalFireDepartment size={30} />
                ¡Racha de {progreso.racha_actual} días seguidos! 🔥
              </div>

              {/* Botones de acción */}
              <div className="grid grid-cols-2 gap-5">
                <button className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 text-white rounded-2xl p-6 flex flex-col items-center font-bold shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all">
                  <MdMenuBook size={36} className="mb-2" />
                  <span className="text-lg">Leer</span>
                  <span className="text-xs opacity-70 mt-0.5">Lectura interactiva</span>
                </button>

                <button className="bg-gradient-to-br from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-2xl p-6 flex flex-col items-center font-bold shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition-all">
                  <MdPsychology size={36} className="mb-2" />
                  <span className="text-lg">Practicar</span>
                  <span className="text-xs opacity-70 mt-0.5">Actividades de práctica</span>
                </button>
              </div>

            </div>

            {/* Columna derecha (1/3) */}
            <div className="space-y-5">

              {/* Héroes desbloqueables */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-base font-bold text-emerald-700 mb-4 flex items-center gap-2">
                  <span>🏆</span> Héroes desbloqueables
                </h3>

                <div className="space-y-3">
                  {avatares.map((a) => {
                    const desbloqueado = progreso.nivel_actual >= a.nivel;
                    const Icon = a.icon;

                    return (
                      <div
                        key={a.nivel}
                        className={`rounded-xl p-3.5 flex items-center gap-3 border transition-all ${
                          desbloqueado
                            ? "bg-emerald-50 border-emerald-200 shadow-sm"
                            : "bg-slate-50 border-slate-200 opacity-50"
                        }`}
                      >
                        <div
                          className={`w-14 h-14 rounded-xl ${
                            desbloqueado ? `bg-gradient-to-br ${a.color}` : "bg-slate-300"
                          } text-white flex items-center justify-center shadow-md flex-shrink-0`}
                        >
                          {desbloqueado ? <Icon size={26} /> : <MdLock size={22} />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-bold text-slate-900">Nivel {a.nivel}</p>
                            {desbloqueado && (
                              <span className="text-xs text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded-full flex-shrink-0">✓ Desbloqueado</span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 truncate">{a.nombre}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mensaje motivador */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-orange-200 rounded-2xl p-5 text-center shadow-sm">
                <p className="text-2xl mb-1">💪</p>
                <p className="text-orange-800 font-bold text-sm">¡Sigue leyendo y practicando!</p>
                <p className="text-orange-600 text-xs mt-1">Desbloquea nuevos héroes avanzando de nivel</p>
              </div>

            </div>
          </div>
        </main>
      </div>
    </>
  );
}
