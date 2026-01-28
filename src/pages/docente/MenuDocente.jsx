import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import {
  MdMenu,
  MdClose,
  MdDashboard,
  MdSchool,
  MdPeople,
  MdLibraryBooks,
  MdLogout,
  MdCategory,
  MdAutoStories,
  MdChevronRight,
} from "react-icons/md";

import { getUsuarioActual } from "../../services/authService";

export default function MenuDocente() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = Capacitor.isNativePlatform();

  // En desktop abierto, en móvil cerrado
  const [open, setOpen] = useState(isMobile ? false : window.innerWidth >= 768);
  const [docente, setDocente] = useState(null);

  const opciones = [
    { titulo: "Dashboard", icono: <MdDashboard size={24} />, ruta: "dashboard" },
    { titulo: "Mis Cursos", icono: <MdSchool size={24} />, ruta: "cursos" },
    { titulo: "Estudiantes", icono: <MdPeople size={24} />, ruta: "estudiantes" },
    { titulo: "Categorías", icono: <MdCategory size={24} />, ruta: "categorias" },
    { titulo: "Lecturas", icono: <MdAutoStories size={24} />, ruta: "lecturas" },
  ];

  useEffect(() => {
    getUsuarioActual()
      .then((data) => setDocente(data))
      .catch(() => navigate("/login"));
  }, []);

  // Detectar resize solo en web
  useEffect(() => {
    if (!isMobile) {
      const handleResize = () => {
        setOpen(window.innerWidth >= 768);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isMobile]);

  const handleNavigate = (ruta) => {
    navigate(ruta);
    if (isMobile || window.innerWidth < 768) {
      setOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    navigate("/login");
  };

  // Obtener título actual de la ruta
  const getTituloActual = () => {
    const rutaActual = opciones.find(opc => location.pathname.includes(opc.ruta));
    return rutaActual ? rutaActual.titulo : "Dashboard";
  };

  // 📱 DISEÑO MÓVIL NATIVO
  if (isMobile) {
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
            animation: fadeIn 0.3s ease-out;
          }
        `}</style>

        <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-fuchsia-50">
          {/* Header fijo superior - MORADO/ROSA */}
          <header className="bg-white/90 backdrop-blur-xl shadow-lg px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-40 border-b border-purple-200/50">
            <button
              onClick={() => setOpen(!open)}
              className="p-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-600 text-white hover:from-purple-600 hover:via-fuchsia-600 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/20 active:scale-95"
            >
              <MdMenu size={24} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 via-fuchsia-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/20">
                {docente ? docente.nombre.charAt(0).toUpperCase() : "?"}
              </div>
              <div className="text-sm">
                <p className="font-bold text-slate-900 leading-tight">
                  {docente ? `${docente.nombre}` : "Cargando..."}
                </p>
                <p className="text-slate-500 text-xs">{docente?.apellido || ""}</p>
              </div>
            </div>

            <div className="w-10"></div>
          </header>

          {/* Overlay */}
          {open && (
            <div
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            ></div>
          )}

          {/* Menú lateral deslizante - MORADO/ROSA */}
          <div
            className={`fixed top-0 left-0 h-screen w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Header del menú - GRADIENTE MORADO/ROSA */}
            <div className="bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-600 p-6 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 shadow-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {docente ? docente.nombre.charAt(0).toUpperCase() : "?"}
                  </span>
                </div>
                <div className="text-white">
                  <h2 className="text-lg font-bold">
                    {docente ? docente.nombre : "Cargando..."}
                  </h2>
                  <p className="text-sm opacity-90">{docente?.apellido}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
              >
                <MdClose size={24} className="text-white" />
              </button>
            </div>

            {/* Opciones del menú - MEJORADAS */}
            <nav className="p-5">
              <ul className="space-y-2">
                {opciones.map((opc, index) => {
                  const activo = location.pathname.includes(opc.ruta);

                  return (
                    <li
                      key={index}
                      onClick={() => handleNavigate(opc.ruta)}
                      className={`
                        flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300
                        ${
                          activo
                            ? "bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-600 text-white shadow-lg shadow-purple-500/20 scale-[1.02]"
                            : "hover:bg-slate-100 text-slate-700 active:scale-95"
                        }
                      `}
                    >
                      <span className={`transition-transform duration-300 ${activo ? "scale-110" : ""}`}>
                        {opc.icono}
                      </span>
                      <span className="font-semibold text-sm flex-1">{opc.titulo}</span>
                      {activo && <MdChevronRight size={20} className="opacity-70" />}
                    </li>
                  );
                })}
              </ul>

              {/* Logout */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 p-4 w-full rounded-2xl cursor-pointer hover:bg-red-50 transition-all duration-300 text-red-600 font-semibold active:scale-95"
                >
                  <MdLogout size={24} />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </nav>

            {/* Footer del menú - ACTUALIZADO */}
            <div className="p-5 mt-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl text-center border border-purple-100">
                <p className="text-xs text-slate-600 font-medium">BookiSmartIA • Docentes</p>
                <p className="text-xs text-slate-400 mt-1">2026</p>
              </div>
            </div>
          </div>

          {/* Contenido principal - FONDO BLANCO LIMPIO */}
          <main className="flex-1 pt-20 p-4 overflow-y-auto">
            {/* Breadcrumb */}
            <div className="mb-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                <span className="text-slate-400">Panel Docente</span>
                <MdChevronRight size={16} className="text-slate-400" />
                <span className="text-purple-600 font-semibold">{getTituloActual()}</span>
              </div>
            </div>

            {/* Contenedor blanco con sombra suave */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 min-h-[calc(100vh-12rem)] border border-slate-100 animate-fadeIn">
              <Outlet />
            </div>
          </main>
        </div>
      </>
    );
  }

  // 🖥️ DISEÑO WEB/TABLET - MORADO/ROSA
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
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-pink-50/30">
        {/* Overlay solo móvil web */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
          />
        )}

        {/* Botón Abrir/Cerrar - MORADO/ROSA */}
        <button
          onClick={() => setOpen(!open)}
          className={`
            fixed top-6 z-[60] bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-600 hover:from-purple-600 hover:via-fuchsia-600 hover:to-pink-700 text-white rounded-full p-3 shadow-2xl shadow-purple-500/30 transition-all duration-300 hover:scale-110 border-4 border-white
            ${open ? "left-[16.5rem]" : "left-[3.5rem]"}
          `}
        >
          {open ? <MdClose size={20} /> : <MdMenu size={20} />}
        </button>

        {/* Menu lateral - MEJORADO CON GRADIENTE SUTIL MORADO */}
        <aside
          className={`
            fixed top-0 left-0 z-50 h-screen bg-white/95 backdrop-blur-xl shadow-2xl border-r border-purple-200/50
            transition-all duration-300 overflow-y-auto
            ${open ? "w-72" : "w-20"}
            ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          {/* Gradiente decorativo superior MORADO */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-purple-500/10 via-fuchsia-500/10 to-pink-500/10 blur-3xl"></div>

          <div className="p-6 relative">
            {/* Información del Docente - MEJORADA */}
            <div className="flex items-center mb-8 pb-6 border-b border-slate-200 relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 via-fuchsia-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/20 flex-shrink-0">
                {docente ? docente.nombre.charAt(0).toUpperCase() : "?"}
              </div>
              {open && (
                <div className="ml-4 min-w-0 flex-1 animate-slideIn">
                  <h2 className="text-lg font-bold text-slate-900 truncate">
                    {docente ? docente.nombre : "Cargando..."}
                  </h2>
                  <p className="text-slate-500 text-sm truncate">{docente?.apellido || ""}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                    <span className="text-xs text-purple-600 font-medium">En línea</span>
                  </div>
                </div>
              )}
            </div>

            {/* Opciones - MEJORADAS */}
            <ul className="space-y-2">
              {opciones.map((opc, index) => {
                const activo = location.pathname.includes(opc.ruta);

                return (
                  <li
                    key={index}
                    onClick={() => handleNavigate(opc.ruta)}
                    className={`
                      flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer transition-all duration-300
                      ${activo 
                        ? "bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-600 text-white shadow-lg shadow-purple-500/20 scale-[1.02]" 
                        : "hover:bg-slate-100 text-slate-700 hover:scale-[1.01]"
                      }
                    `}
                  >
                    <span
                      className={`transition-all duration-300 flex-shrink-0 ${
                        activo ? "scale-110" : ""
                      }`}
                    >
                      {opc.icono}
                    </span>

                    {open && (
                      <span className="font-semibold text-sm transition-all duration-300 truncate flex-1">
                        {opc.titulo}
                      </span>
                    )}
                    
                    {open && activo && (
                      <MdChevronRight size={20} className="opacity-70 flex-shrink-0" />
                    )}
                  </li>
                );
              })}

              {/* Logout */}
              <li
                onClick={handleLogout}
                className="flex items-center gap-4 p-3.5 mt-8 rounded-2xl cursor-pointer hover:bg-red-50 transition-all duration-300 text-red-600 border-t border-slate-200 pt-8 hover:scale-[1.01]"
              >
                <MdLogout size={24} className="flex-shrink-0" />
                {open && <span className="font-semibold text-sm truncate">Cerrar sesión</span>}
              </li>
            </ul>
          </div>

          {/* Footer del sidebar - MEJORADO */}
          {open && (
            <div className="p-6 mt-4 animate-slideIn">
              
            </div>
          )}
        </aside>

        {/* Contenido principal - FONDO BLANCO Y LIMPIO */}
        <main
          className={`
            transition-all duration-300 min-h-screen
            p-6
            ${open ? "md:ml-72" : "md:ml-20"}
            ml-0
          `}
        >
          {/* Breadcrumb y Título - MEJORADO */}
          <div className="mb-6 animate-fadeIn">
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
              <span className="text-slate-400">Panel Docente</span>
              <MdChevronRight size={16} className="text-slate-400" />
              <span className="text-purple-600 font-semibold">{getTituloActual()}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              {getTituloActual()}
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>

          {/* Contenedor blanco con sombra profesional */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-8 min-h-[calc(100vh-12rem)] border border-slate-100 animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
