import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&display=swap');
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>

      <nav
        className={`
          w-full fixed top-0 left-0 z-50 transition-all duration-300
          ${scrolled 
            ? 'bg-white/90 backdrop-blur-2xl shadow-lg shadow-slate-200/50 py-3' 
            : 'bg-white/70 backdrop-blur-xl py-4'
          }
          px-6 md:px-10 flex justify-between items-center border-b border-white/40
        `}
      >
        {/* LOGO */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600" style={{fontFamily: 'Poppins, sans-serif'}}>
            ReadSmartIA
          </h1>
        </div>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center gap-2 text-base font-medium">

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Inicio
          </button>

          <button
            onClick={() => navigate("/sobre-nosotros")}
            className="px-4 py-2 rounded-xl text-slate-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
          >
            Sobre Nosotros
          </button>

          <button
            onClick={() => navigate("/mision")}
            className="px-4 py-2 rounded-xl text-slate-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
          >
            Misión
          </button>

          <button
            onClick={() => navigate("/objetivo")}
            className="px-4 py-2 rounded-xl text-slate-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
          >
            Objetivo
          </button>

          <button
            onClick={() => navigate("/contacto")}
            className="px-4 py-2 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
          >
            Contacto
          </button>

          {/* Separador */}
          <div className="w-px h-8 bg-slate-200 mx-2"></div>

          {/* Botones Auth */}
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2.5 rounded-xl text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-200"
          >
            Iniciar Sesión
          </button>

          <button
            onClick={() => navigate("/register-padre")}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Registrarse
          </button>
        </div>

        {/* ÍCONO MENÚ MÓVIL */}
        <button
          className="md:hidden text-3xl text-slate-700 hover:text-blue-600 transition-colors p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <MdClose /> : <MdMenu />}
        </button>

        {/* MENU MÓVIL */}
        {open && (
          <div
            className="
              absolute top-full left-0 w-full 
              bg-white/95 backdrop-blur-2xl shadow-2xl
              flex flex-col items-center py-6 gap-3
              animate-slide-down border-b border-slate-200
            "
          >
            {/* Links con íconos */}
            <button 
              onClick={() => {navigate("/"); setOpen(false);}} 
              className="flex items-center gap-3 text-slate-700 text-lg w-4/5 px-6 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Inicio
            </button>

            <button 
              onClick={() => {navigate("/sobre-nosotros"); setOpen(false);}} 
              className="text-slate-700 text-lg w-4/5 px-6 py-3 rounded-xl hover:bg-purple-50 hover:text-purple-600 transition-all text-left"
            >
              Sobre Nosotros
            </button>

            <button 
              onClick={() => {navigate("/mision"); setOpen(false);}} 
              className="text-slate-700 text-lg w-4/5 px-6 py-3 rounded-xl hover:bg-green-50 hover:text-green-600 transition-all text-left"
            >
              Misión
            </button>

            <button 
              onClick={() => {navigate("/objetivo"); setOpen(false);}} 
              className="text-slate-700 text-lg w-4/5 px-6 py-3 rounded-xl hover:bg-pink-50 hover:text-pink-600 transition-all text-left"
            >
              Objetivo
            </button>

            <button 
              onClick={() => {navigate("/contacto"); setOpen(false);}} 
              className="text-slate-700 text-lg w-4/5 px-6 py-3 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all text-left"
            >
              Contacto
            </button>

            {/* Separador */}
            <div className="w-4/5 h-px bg-slate-200 my-2"></div>

            {/* Botones Auth Mobile */}
            <button
              onClick={() => {navigate("/login"); setOpen(false);}}
              className="w-4/5 px-6 py-3 rounded-xl text-blue-600 font-semibold border-2 border-blue-200 hover:bg-blue-50 transition-all"
            >
              Iniciar Sesión
            </button>

            <button
              onClick={() => {navigate("/register-padre"); setOpen(false);}}
              className="w-4/5 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
            >
              Registrarse
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
