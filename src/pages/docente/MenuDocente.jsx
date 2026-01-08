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
} from "react-icons/md";

import { getUsuarioActual } from "../../services/authService";

export default function MenuDocente() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = Capacitor.isNativePlatform();

  const [open, setOpen] = useState(!isMobile); // En móvil empieza cerrado
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

  const handleNavigate = (ruta) => {
    navigate(ruta);
    if (isMobile) {
      setOpen(false); // Cerrar menú en móvil después de navegar
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 📱 DISEÑO MÓVIL
  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Header fijo con botón menú */}
        <header className="bg-white shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-xl bg-blue-400 text-white hover:bg-blue-500 transition active:scale-95"
          >
            <MdMenu size={24} />
          </button>

          <div className="flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
              className="w-9 h-9 rounded-full border-2 border-blue-400"
              alt="Avatar"
            />
            <div className="text-sm">
              <p className="font-bold text-blue-700 leading-tight">
                {docente ? `${docente.nombre}` : "Cargando..."}
              </p>
              <p className="text-gray-500 text-xs">{docente?.apellido || ""}</p>
            </div>
          </div>

          <div className="w-10"></div> {/* Espaciador para centrar */}
        </header>

        {/* Overlay cuando el menú está abierto */}
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
          <div className="bg-gradient-to-br from-blue-400 to-purple-400 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
                className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
                alt="Avatar"
              />
              <div className="text-white">
                <h2 className="text-lg font-bold">
                  {docente ? docente.nombre : "Cargando..."}
                </h2>
                <p className="text-sm opacity-90">{docente?.apellido}</p>
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
                          ? "bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-lg scale-[1.02]"
                          : "hover:bg-gray-100 text-gray-700"
                      }
                    `}
                  >
                    <span className={`transition ${activo ? "scale-110" : ""}`}>
                      {opc.icono}
                    </span>
                    <span className="font-medium">{opc.titulo}</span>
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
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-xl text-center">
              
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

  // 🖥️ DISEÑO WEB (ORIGINAL)
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ======================= MENU LATERAL ======================= */}
      <div
        className={`${
          open ? "w-64" : "w-20"
        } bg-white shadow-xl transition-all duration-300 p-5 relative border-r border-gray-200`}
      >
        {/* Botón Abrir/Cerrar */}
        <button
          onClick={() => setOpen(!open)}
          className="absolute -right-3 top-6 bg-blue-600 text-white rounded-full p-1 shadow-md hover:bg-blue-700 transition"
        >
          {open ? <MdClose size={20} /> : <MdMenu size={20} />}
        </button>

        {/* Información del Docente */}
        <div className="flex items-center mb-8 border-b pb-5">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
            className="w-12 h-12 rounded-full border"
            alt="Avatar"
          />
          {open && (
            <div className="ml-3">
              <h2 className="text-xl font-bold text-blue-700">
                {docente ? docente.nombre : "Cargando..."}
              </h2>
              <p className="text-gray-500 text-sm">{docente?.apellido}</p>
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
                onClick={() => navigate(opc.ruta)}
                className={`
                  flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                  ${activo ? "bg-blue-100 border-l-4 border-blue-600" : "hover:bg-gray-100"}
                `}
              >
                <span
                  className={`transition ${
                    activo ? "text-blue-700 scale-110" : "text-blue-600"
                  }`}
                >
                  {opc.icono}
                </span>
                {open && (
                  <span
                    className={`font-medium transition ${
                      activo ? "text-blue-700" : "text-gray-700"
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

      {/* ======================= CONTENIDO ======================= */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}