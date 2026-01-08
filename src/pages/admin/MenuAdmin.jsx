// src/pages/admin/MenuAdmin.jsx
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  MdMenu,
  MdClose,
  MdDashboard,
  MdSchool,
  MdPeople,
  MdLogout,
} from "react-icons/md";

import { getUsuarioActual } from "../../services/authService";

export default function MenuAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [admin, setAdmin] = useState(null);

  const opciones = [
    {
      titulo: "Dashboard",
      icono: <MdDashboard size={24} />,
      ruta: "/admin/menu/dashboard",
    },
    {
      titulo: "Docentes",
      icono: <MdSchool size={24} />,
      ruta: "/admin/menu/docentes",
    },
    //{
      //titulo: "Estudiantes",
      //icono: <MdPeople size={24} />,
      //ruta: "/admin/menu/estudiantes",
    //},
  ];

  useEffect(() => {
    getUsuarioActual()
      .then((data) => {
        if (!data.roles?.includes("admin")) {
          navigate("/login");
          return;
        }
        setAdmin(data);
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* ======================= MENU LATERAL ======================= */}
      <div
        className={`
          ${open ? "w-64" : "w-20"}
          bg-white shadow-xl border-r border-gray-200
          transition-all duration-300 p-5 relative
        `}
      >
        {/* Botón Abrir/Cerrar */} 
        <button
          onClick={() => setOpen(!open)}
          className="absolute -right-3 top-6 bg-blue-600 text-white rounded-full p-1 shadow-md hover:bg-blue-700 transition"
        >
          {open ? <MdClose size={20} /> : <MdMenu size={20} />}
        </button>

        {/* Información del Admin */}
        <div className="flex items-center mb-8 border-b pb-5">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            className="w-12 h-12 rounded-full border"
          />
          {open && (
            <div className="ml-3">
              <h2 className="text-xl font-bold text-blue-700">
                {admin ? admin.nombre : "Cargando..."}
              </h2>
              <p className="text-gray-500 text-sm">{admin?.apellido}</p>
            </div>
          )}
        </div>

        {/* OPCIONES */}
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
                <span className={`${activo ? "text-blue-700 scale-110" : "text-blue-600"} transition`}>
                  {opc.icono}
                </span>

                {open && (
                  <span className={`font-medium ${activo ? "text-blue-700" : "text-gray-700"} transition`}>
                    {opc.titulo}
                  </span>
                )}
              </li>
            );
          })}

          {/* LOGOUT */}
          <li
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="flex items-center gap-3 p-3 mt-6 rounded-xl cursor-pointer hover:bg-red-100 transition"
          >
            <MdLogout size={24} className="text-red-600" />
            {open && (
              <span className="font-medium text-red-600">
                Cerrar sesión
              </span>
            )}
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
