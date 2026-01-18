import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";

import {
  MdMenu,
  MdClose,
  MdDashboard,
  MdFamilyRestroom,
  MdLibraryBooks,
  MdAnalytics,
  MdSettings,
  MdLogout,
} from "react-icons/md";

import { getUsuarioActual } from "../../services/authService";

export default function MenuPadre() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = Capacitor.isNativePlatform();

  // En desktop abierto, en móvil cerrado
  const [open, setOpen] = useState(isMobile ? false : window.innerWidth >= 768);
  const [padre, setPadre] = useState(null);

  const opciones = [
    { titulo: "Dashboard", icono: <MdDashboard size={24} />, ruta: "dashboard" },
    { titulo: "Mis Hijos", icono: <MdFamilyRestroom size={24} />, ruta: "hijos" },
    { titulo: "Actividades Asignadas", icono: <MdLibraryBooks size={24} />, ruta: "actividades" },
    { titulo: "Progreso", icono: <MdAnalytics size={24} />, ruta: "progreso" },
    { titulo: "Configuración", icono: <MdSettings size={24} />, ruta: "configuracion" },
  ];

  useEffect(() => {
    getUsuarioActual()
      .then((data) => setPadre(data))
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

  // 📱 DISEÑO MÓVIL NATIVO
  if (isMobile) {
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

        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
          {/* Header fijo superior */}
          <header className="bg-white/80 backdrop-blur-xl shadow-lg px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-40 border-b border-slate-200">
            <button
              onClick={() => setOpen(!open)}
              className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/30 active:scale-95"
            >
              <MdMenu size={24} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
                {padre ? padre.nombre.charAt(0).toUpperCase() : "?"}
              </div>
              <div className="text-sm">
                <p className="font-bold text-slate-900 leading-tight">
                  {padre ? `${padre.nombre}` : "Cargando..."}
                </p>
                <p className="text-slate-500 text-xs">{padre?.apellido || ""}</p>
              </div>
            </div>

            <div className="w-10"></div>
          </header>

          {/* Overlay */}
          {open && (
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setOpen(false)}
            ></div>
          )}

          {/* Menú lateral deslizante - FIJO y con scroll propio */}
          <div
            className={`fixed top-0 left-0 h-screen w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Header del menú */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 shadow-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {padre ? padre.nombre.charAt(0).toUpperCase() : "?"}
                  </span>
                </div>
                <div className="text-white">
                  <h2 className="text-lg font-bold">
                    {padre ? padre.nombre : "Cargando..."}
                  </h2>
                  <p className="text-sm opacity-90">{padre?.apellido}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
              >
                <MdClose size={24} className="text-white" />
              </button>
            </div>

            {/* Opciones del menú */}
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
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]"
                            : "hover:bg-slate-100 text-slate-700 active:scale-95"
                        }
                      `}
                    >
                      <span className={`transition-transform duration-300 ${activo ? "scale-110" : ""}`}>
                        {opc.icono}
                      </span>
                      <span className="font-semibold text-sm">{opc.titulo}</span>
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

            {/* Footer del menú */}
            <div className="p-5 mt-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl text-center border border-blue-100">
                <p className="text-xs text-slate-600 font-medium">ReadSmartIA • Padres</p>
                <p className="text-xs text-slate-400 mt-1">v1.0.0</p>
              </div>
            </div>
          </div>

          {/* Contenido principal - Ajustado para header fijo */}
          <main className="flex-1 pt-20 p-4 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </>
    );
  }

  // 🖥️ DISEÑO WEB/TABLET
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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30">
        {/* Overlay solo móvil web */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
          />
        )}

        {/* Botón Abrir/Cerrar - COMPLETAMENTE FUERA del sidebar */}
        <button
          onClick={() => setOpen(!open)}
          className={`
            fixed top-6 z-[60] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full p-3 shadow-2xl shadow-blue-500/40 transition-all duration-300 hover:scale-110 border-4 border-white
            ${open ? "left-[16.5rem]" : "left-[3.5rem]"}
          `}
        >
          {open ? <MdClose size={20} /> : <MdMenu size={20} />}
        </button>

        {/* Menu lateral - FIJO con scroll propio */}
        <aside
          className={`
            fixed top-0 left-0 z-50 h-screen bg-white/80 backdrop-blur-xl shadow-2xl border-r border-slate-200
            transition-all duration-300 overflow-y-auto
            ${open ? "w-72" : "w-20"}
            ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >

          <div className="p-6">
            {/* Información del Padre */}
            <div className="flex items-center mb-8 pb-6 border-b border-slate-200 relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30 flex-shrink-0">
                {padre ? padre.nombre.charAt(0).toUpperCase() : "?"}
              </div>
              {open && (
                <div className="ml-4 min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-slate-900 truncate">
                    {padre ? padre.nombre : "Cargando..."}
                  </h2>
                  <p className="text-slate-500 text-sm truncate">{padre?.apellido || ""}</p>
                </div>
              )}
            </div>

            {/* Opciones */}
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
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20" 
                        : "hover:bg-slate-100 text-slate-700"
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
                      <span
                        className={`font-semibold text-sm transition-all duration-300 truncate ${
                          activo ? "" : ""
                        }`}
                      >
                        {opc.titulo}
                      </span>
                    )}
                  </li>
                );
              })}

              {/* Logout */}
              <li
                onClick={handleLogout}
                className="flex items-center gap-4 p-3.5 mt-8 rounded-2xl cursor-pointer hover:bg-red-50 transition-all duration-300 text-red-600 border-t border-slate-200 pt-8"
              >
                <MdLogout size={24} className="flex-shrink-0" />
                {open && <span className="font-semibold text-sm truncate">Cerrar sesión</span>}
              </li>
            </ul>
          </div>

          {/* Footer del sidebar */}
          {open && (
            <div className="p-6 mt-4">
             
            </div>
          )}
        </aside>

        {/* Contenido principal - SE AJUSTA AUTOMÁTICAMENTE cuando el menú se cierra */}
        <main
          className={`
            transition-all duration-300 min-h-screen
            p-6
            ${open ? "md:ml-72" : "md:ml-20"}
            ml-0
          `}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
}
