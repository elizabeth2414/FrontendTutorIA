import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";

import bookiImg from "../assets/images/bookismartia.jpeg";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Cierra el menú si cambias de ruta (por ejemplo con Back/Forward)
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // ✅ Bloquea el scroll del body cuando el menú está abierto
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Fredoka:wght@400;500;600;700&display=swap');

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }

        .animate-slide-down { animation: slideDown 0.25s ease-out; }

        .logo-hover:hover .logo-img { animation: wiggle 0.5s ease-in-out; }
        .logo-img { transition: all 0.3s ease; }

        .nav-button { position: relative; overflow: hidden; }
        .nav-button::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 3px;
          background: currentColor;
          transition: all 0.3s ease;
          transform: translateX(-50%);
          border-radius: 2px;
        }
        .nav-button:hover::before { width: 80%; }
      `}</style>

      <nav
        className={`
          w-full fixed top-0 left-0 z-50 transition-all duration-300
          ${scrolled
            ? "bg-white shadow-xl shadow-purple-200/30 py-2.5"
            : "bg-white py-3.5"
          }
          px-4 sm:px-6 md:px-10 flex justify-between items-center border-b-2
        `}
        style={{
          borderImage:
            "linear-gradient(90deg, #10b981, #f59e0b, #ec4899, #8b5cf6) 1",
        }}
      >
        {/* LOGO */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer logo-hover group"
          onClick={() => navigate("/")}
        >
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400/30 via-orange-400/30 to-purple-500/30 group-hover:scale-110 transition-transform duration-300 blur-sm"></div>
            <img
              src={bookiImg}
              alt="BookiSmartIA Logo"
              className="logo-img relative w-11 h-11 sm:w-12 sm:h-12 object-contain rounded-xl group-hover:scale-110 transition-all duration-300 drop-shadow-lg"
            />
          </div>

          <div className="flex flex-col">
            <h1
              className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-orange-500 to-purple-600 leading-tight"
              style={{ fontFamily: "Fredoka, Poppins, sans-serif" }}
            >
              BookiSmartIA
            </h1>
            <span
              className="text-[10px] sm:text-xs text-purple-600 font-medium -mt-1"
              style={{ fontFamily: "Fredoka, sans-serif" }}
            ></span>
          </div>
        </div>

        {/* MENU DESKTOP */}
        <div
          className="hidden md:flex items-center gap-1 text-sm lg:text-base font-semibold"
          style={{ fontFamily: "Fredoka, sans-serif" }}
        >
          <button
            onClick={() => navigate("/")}
            className="nav-button flex items-center gap-2 px-3 lg:px-4 py-2.5 rounded-xl text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Inicio
          </button>

          <button
            onClick={() => navigate("/sobre-nosotros")}
            className="nav-button px-3 lg:px-4 py-2.5 rounded-xl text-slate-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
          >
            Sobre Nosotros
          </button>

          <button
            onClick={() => navigate("/mision")}
            className="nav-button px-3 lg:px-4 py-2.5 rounded-xl text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
          >
            Misión
          </button>

          <button
            onClick={() => navigate("/objetivo")}
            className="nav-button px-3 lg:px-4 py-2.5 rounded-xl text-slate-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
          >
            Objetivo
          </button>

          <button
            onClick={() => navigate("/contacto")}
            className="nav-button px-3 lg:px-4 py-2.5 rounded-xl text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200"
          >
            Contacto
          </button>

          <div className="w-px h-8 mx-2 bg-gradient-to-b from-emerald-400 via-orange-400 to-purple-500 opacity-30"></div>

          <button
            onClick={() => navigate("/login")}
            className="px-4 lg:px-5 py-2.5 rounded-xl text-purple-600 font-bold hover:bg-purple-50 border-2 border-transparent hover:border-purple-200 transition-all duration-200"
          >
            Iniciar Sesión
          </button>

          <button
            onClick={() => navigate("/register-padre")}
            className="px-4 lg:px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 text-white font-bold shadow-md shadow-cyan-500/20 hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Registrarse
          </button>
        </div>

        {/* BOTÓN MENÚ MÓVIL */}
        <button
          className="md:hidden text-3xl text-slate-700 hover:text-purple-600 transition-colors p-2 rounded-xl hover:bg-purple-50"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir/Cerrar menú"
        >
          {open ? <MdClose /> : <MdMenu />}
        </button>
      </nav>

      {/* ✅ MENU MÓVIL FULLSCREEN (FONDO BLANCO, CON X PARA CERRAR) */}
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Overlay (si tocas afuera también cierra) */}
          <button
            className="absolute inset-0 bg-black/25"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
          />

          {/* Panel blanco */}
          <div className="absolute inset-0 bg-white overflow-y-auto">
            {/* ✅ Header del menú con logo + X */}
            <div
              className="sticky top-0 z-[70] bg-white flex items-center justify-between px-4 py-3 border-b-2"
              style={{
                borderImage:
                  "linear-gradient(90deg, #10b981, #f59e0b, #ec4899, #8b5cf6) 1",
              }}
            >
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  navigate("/");
                  setOpen(false);
                }}
              >
                <img
                  src={bookiImg}
                  alt="BookiSmartIA"
                  className="w-10 h-10 object-contain rounded-xl"
                />
                <span
                  className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-orange-500 to-purple-600"
                  style={{ fontFamily: "Fredoka, Poppins, sans-serif" }}
                >
                  BookiSmartIA
                </span>
              </div>

              {/* ✅ X para cerrar */}
              <button
                onClick={() => setOpen(false)}
                className="text-3xl text-slate-700 hover:text-purple-600 transition-colors p-2 rounded-xl hover:bg-purple-50"
                aria-label="Cerrar"
              >
                <MdClose />
              </button>
            </div>

            {/* Contenido del menú */}
            <div className="px-4 pb-8 pt-4 flex flex-col items-center gap-2.5 animate-slide-down">
              <button
                onClick={() => {
                  navigate("/");
                  setOpen(false);
                }}
                className="flex items-center gap-3 text-slate-700 font-semibold text-base w-[92%] px-5 py-3.5 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all border-2 border-transparent hover:border-emerald-200"
                style={{ fontFamily: "Fredoka, sans-serif" }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Inicio</span>
              </button>

              <button
                onClick={() => {
                  navigate("/sobre-nosotros");
                  setOpen(false);
                }}
                className="text-slate-700 font-semibold text-base w-[92%] px-5 py-3.5 rounded-2xl hover:bg-purple-50 hover:text-purple-600 transition-all text-left border-2 border-transparent hover:border-purple-200"
                style={{ fontFamily: "Fredoka, sans-serif" }}
              >
                Sobre Nosotros
              </button>

              <button
                onClick={() => {
                  navigate("/mision");
                  setOpen(false);
                }}
                className="text-slate-700 font-semibold text-base w-[92%] px-5 py-3.5 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all text-left border-2 border-transparent hover:border-emerald-200"
                style={{ fontFamily: "Fredoka, sans-serif" }}
              >
                Misión
              </button>

              <button
                onClick={() => {
                  navigate("/objetivo");
                  setOpen(false);
                }}
                className="text-slate-700 font-semibold text-base w-[92%] px-5 py-3.5 rounded-2xl hover:bg-pink-50 hover:text-pink-600 transition-all text-left border-2 border-transparent hover:border-pink-200"
                style={{ fontFamily: "Fredoka, sans-serif" }}
              >
                Objetivo
              </button>

              <button
                onClick={() => {
                  navigate("/contacto");
                  setOpen(false);
                }}
                className="text-slate-700 font-semibold text-base w-[92%] px-5 py-3.5 rounded-2xl hover:bg-orange-50 hover:text-orange-600 transition-all text-left border-2 border-transparent hover:border-orange-200"
                style={{ fontFamily: "Fredoka, sans-serif" }}
              >
                Contacto
              </button>

              <div className="w-[92%] h-0.5 bg-gradient-to-r from-emerald-400 via-orange-400 to-purple-500 my-2 rounded-full"></div>

              <button
                onClick={() => {
                  navigate("/login");
                  setOpen(false);
                }}
                className="w-[92%] px-5 py-3.5 rounded-2xl text-purple-600 font-bold border-2 border-purple-300 hover:bg-purple-50 transition-all shadow-sm"
                style={{ fontFamily: "Fredoka, sans-serif" }}
              >
                Iniciar Sesión
              </button>

              <button
                onClick={() => {
                  navigate("/register-padre");
                  setOpen(false);
                }}
                className="w-[92%] px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 text-white font-bold shadow-md shadow-cyan-500/20 hover:shadow-lg hover:scale-[1.02] transition-all"
                style={{ fontFamily: "Fredoka, sans-serif" }}
              >
                ¡Registrarse Ahora! 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
