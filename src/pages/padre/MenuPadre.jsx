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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 to-purple-50">
        {/* Header fijo superior */}
        <header className="bg-white shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 transition active:scale-95"
          >
            <MdMenu size={24} />
          </button>

          <div className="flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/194/194938.png"
              className="w-9 h-9 rounded-full border-2 border-pink-400"
              alt="Avatar"
            />
            <div className="text-sm">
              <p className="font-bold text-pink-700 leading-tight">
                {padre ? `${padre.nombre}` : "Cargando..."}
              </p>
              <p className="text-gray-500 text-xs">{padre?.apellido || ""}</p>
            </div>
          </div>

          <div className="w-10"></div>
        </header>

        {/* Overlay */}
        {open && (
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
            onClick={() => setOpen(false)}
          ></div>
        )}

        {/* Menú lateral deslizante */}
        <div
          className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header del menú */}
          <div className="bg-gradient-to-br from-pink-400 to-purple-400 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://cdn-icons-png.flaticon.com/512/194/194938.png"
                className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
                alt="Avatar"
              />
              <div className="text-white">
                <h2 className="text-lg font-bold">
                  {padre ? padre.nombre : "Cargando..."}
                </h2>
                <p className="text-sm opacity-90">{padre?.apellido}</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition"
            >
              <MdClose size={22} className="text-white" />
            </button>
          </div>

          {/* Opciones del menú */}
          <nav className="p-4">
            <ul className="space-y-2">
              {opciones.map((opc, index) => {
                const activo = location.pathname.includes(opc.ruta);

                return (
                  <li
                    key={index}
                    onClick={() => handleNavigate(opc.ruta)}
                    className={`
                      flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all
                      ${
                        activo
                          ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg scale-[1.02]"
                          : "hover:bg-gray-100 text-gray-700"
                      }
                    `}
                  >
                    <span className={`transition ${activo ? "scale-110" : ""}`}>
                      {opc.icono}
                    </span>
                    <span className="font-medium text-sm">{opc.titulo}</span>
                  </li>
                );
              })}
            </ul>

            {/* Logout */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3.5 w-full rounded-xl cursor-pointer hover:bg-red-50 transition text-red-600 font-medium"
              >
                <MdLogout size={24} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </nav>

          {/* Footer del menú */}
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-3 rounded-xl text-center">
            
              <p className="text-xs text-gray-500">v1.0.0</p>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    );
  }

  // 🖥️ DISEÑO WEB/TABLET
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Overlay solo móvil web */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Menu lateral */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen bg-white shadow-xl border-r border-gray-200
          transition-all duration-300
          ${open ? "w-64" : "w-20"}
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Botón Abrir/Cerrar */}
        <button
          onClick={() => setOpen(!open)}
          className="absolute -right-3 top-6 bg-pink-500 text-white rounded-full p-1 shadow-md hover:bg-pink-600 transition"
        >
          {open ? <MdClose size={20} /> : <MdMenu size={20} />}
        </button>

        <div className="p-5">
          {/* Información del Padre */}
          <div className="flex items-center mb-8 border-b pb-5">
            <img
              src="https://cdn-icons-png.flaticon.com/512/194/194938.png"
              className="w-12 h-12 rounded-full border"
              alt="Avatar"
            />
            {open && (
              <div className="ml-3">
                <h2 className="text-xl font-bold text-pink-700">
                  {padre ? padre.nombre : "Cargando..."}
                </h2>
                <p className="text-gray-500 text-sm">{padre?.apellido}</p>
              </div>
            )}
          </div>

          {/* Opciones */}
          <ul className="space-y-3">
            {opciones.map((opc, index) => {
              const activo = location.pathname.includes(opc.ruta);

              return (
                <li
                  key={index}
                  onClick={() => handleNavigate(opc.ruta)}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                    ${activo ? "bg-pink-100 border-l-4 border-pink-600" : "hover:bg-gray-100"}
                  `}
                >
                  <span
                    className={`transition ${
                      activo ? "text-pink-700 scale-110" : "text-pink-600"
                    }`}
                  >
                    {opc.icono}
                  </span>

                  {open && (
                    <span
                      className={`font-medium transition ${
                        activo ? "text-pink-700" : "text-gray-700"
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
              className="flex items-center gap-3 p-3 mt-6 rounded-xl cursor-pointer hover:bg-red-100 transition"
            >
              <MdLogout size={24} className="text-red-600" />
              {open && <span className="font-medium text-red-600">Cerrar sesión</span>}
            </li>
          </ul>
        </div>
      </aside>

      {/* Contenido */}
      <main
        className={`
          transition-all duration-300
          pt-6 p-6
          ${open ? "md:ml-64" : "md:ml-20"}
          ml-0
        `}
      >
        <Outlet />
      </main>
    </div>
  );
}