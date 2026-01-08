import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { login, getUsuarioActual } from "../../services/authService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Login() {
  const navigate = useNavigate();
  const isMobile = Capacitor.isNativePlatform();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSplash, setShowSplash] = useState(isMobile);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // 🎬 Splash screen solo en primera carga móvil
  useEffect(() => {
    if (isMobile) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  // Validación de campos en tiempo real
  const validateField = (name, value) => {
    let msg = "";

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        msg = "";
      } else if (!emailRegex.test(value)) {
        msg = "Correo electrónico no válido.";
      }
    }

    if (name === "password") {
      if (value && value.length < 6 && value.length > 0) {
        msg = "La contraseña debe tener mínimo 6 caracteres.";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validar antes de enviar
    if (!form.email.trim() || !form.password.trim()) {
      setErrorMsg("Por favor completa todos los campos.");
      return;
    }

    if (errors.email || errors.password) {
      setErrorMsg("Por favor corrige los errores antes de continuar.");
      return;
    }

    setLoading(true);

    try {
      await login(form.email, form.password);
      const me = await getUsuarioActual();

      const roles = Array.isArray(me.roles)
        ? me.roles
        : me.rol
        ? [me.rol]
        : [];

      if (roles.includes("admin")) navigate("/admin/menu");
      else if (roles.includes("docente")) navigate("/docente/menu");
      else if (roles.includes("padre")) navigate("/padre/menu");
      else navigate("/");
    } catch (error) {
      const status = error?.response?.status;
      console.error("❌ LOGIN ERROR:", error);

      if (status === 401) {
        setErrorMsg("Correo o contraseña incorrectos.");
      } else if (status === 422) {
        setErrorMsg("Datos inválidos enviados al servidor.");
      } else {
        setErrorMsg("Error al conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🎬 SPLASH SCREEN MÓVIL - Diseño mejorado
  if (isMobile && showSplash) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes bounceCustom {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @keyframes zoomIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite; }
          .animate-float-slow { animation: float-slow 7s ease-in-out infinite; }
          .animate-bounceCustom { animation: bounceCustom 2s ease-in-out infinite; }
          .animate-zoomIn { animation: zoomIn 0.6s ease-out; }
        `}</style>

        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
          {/* Decoración de fondo mejorada */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-float-delayed"></div>
            <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-indigo-200/30 rounded-full blur-3xl animate-float-slow"></div>
          </div>

          {/* Contenido */}
          <div className="text-center animate-zoomIn z-10 px-6">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/30 animate-bounceCustom">
              <svg
                className="w-16 h-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-4 tracking-tight" style={{fontFamily: 'Poppins, sans-serif'}}>
              ReadSmartIA
            </h1>
            <p className="text-slate-600 text-lg mb-12 px-4" style={{fontFamily: 'DM Sans, sans-serif'}}>
              Transformando el aprendizaje de la lectura
            </p>
            
            {/* Loader mejorado */}
            <div className="w-14 h-14 mx-auto border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>

          {/* Footer info */}
          <div className="absolute bottom-8 left-0 right-0 text-center text-slate-400 text-sm" style={{fontFamily: 'DM Sans, sans-serif'}}>
            v1.0.0 • © 2025 ReadSmartIA
          </div>
        </div>
      </>
    );
  }

  // 📱 DISEÑO MÓVIL - Mejorado
  if (isMobile) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
          .animate-slideUp { animation: slideUp 0.6s ease-out; }
          .safe-area { padding-bottom: env(safe-area-inset-bottom); }
        `}</style>

        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-10 left-10 w-48 h-48 bg-blue-200/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl"></div>
          </div>

          <div className="flex-1 flex flex-col justify-center px-6 py-8 relative z-10 safe-area">
            {/* Logo y título */}
            <div className="text-center mb-10 animate-fadeIn">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/30">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight" style={{fontFamily: 'Poppins, sans-serif'}}>
                ¡Bienvenido!
              </h2>
              <p className="text-slate-600 text-base" style={{fontFamily: 'DM Sans, sans-serif'}}>
                Inicia sesión para continuar
              </p>
            </div>

            {/* Formulario */}
            <div className="bg-white/90 backdrop-blur-xl p-7 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white/60 animate-slideUp">
              {errorMsg && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-5 flex items-start text-sm shadow-sm">
                  <svg
                    className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span style={{fontFamily: 'DM Sans, sans-serif'}}>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="text-slate-700 font-semibold text-sm block mb-2" style={{fontFamily: 'DM Sans, sans-serif'}}>
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="ejemplo@correo.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      className={`w-full px-4 py-4 pl-12 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all text-base ${
                        errors.email
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      }`}
                      style={{fontFamily: 'DM Sans, sans-serif'}}
                    />
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-2 ml-1" style={{fontFamily: 'DM Sans, sans-serif'}}>{errors.email}</p>
                  )}
                </div>

                {/* Contraseña */}
                <div>
                  <label className="text-slate-700 font-semibold text-sm block mb-2" style={{fontFamily: 'DM Sans, sans-serif'}}>
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      required
                      autoComplete="current-password"
                      className={`w-full px-4 py-4 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all text-base pr-12 ${
                        errors.password
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                      }`}
                      style={{fontFamily: 'DM Sans, sans-serif'}}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-xs mt-2 ml-1" style={{fontFamily: 'DM Sans, sans-serif'}}>{errors.password}</p>
                  )}
                </div>

                {/* Botón Login */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all mt-6 ${
                    loading
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 shadow-blue-500/30"
                  }`}
                  style={{fontFamily: 'Poppins, sans-serif'}}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Ingresando...
                    </span>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-600 text-sm" style={{fontFamily: 'DM Sans, sans-serif'}}>
                  ¿No tienes cuenta?{" "}
                  <span
                    onClick={() => navigate("/register-padre")}
                    className="text-purple-600 font-bold hover:underline cursor-pointer"
                  >
                    Regístrate
                  </span>
                </p>
              </div>
            </div>

            {/* Footer info */}
            <div className="text-center mt-8 text-slate-500 text-xs" style={{fontFamily: 'DM Sans, sans-serif'}}>
              <p>v1.0.0 • ReadSmartIA © 2025</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 🖥️ DISEÑO WEB - Mejorado
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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex flex-col">
        <Navbar />

        <main className="pt-28 flex-1 flex items-center justify-center p-6">
          <div className="relative bg-white/80 backdrop-blur-xl p-10 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 max-w-md w-full border border-white/60 overflow-hidden">
            
            {/* Elementos decorativos de fondo */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/30">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                  Bienvenido de nuevo
                </h2>
                <p className="text-slate-600 text-base">
                  Ingresa para continuar aprendiendo
                </p>
              </div>

              {/* Mensaje de error */}
              {errorMsg && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 flex items-start shadow-sm">
                  <svg
                    className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{errorMsg}</span>
                </div>
              )}

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="text-slate-700 font-semibold text-sm block mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="ejemplo@correo.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      className={`w-full px-4 py-3.5 pl-12 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all ${
                        errors.email
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      }`}
                    />
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-2 ml-1">{errors.email}</p>
                  )}
                </div>

                {/* Contraseña */}
                <div>
                  <label className="text-slate-700 font-semibold text-sm block mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      required
                      autoComplete="current-password"
                      className={`w-full px-4 py-3.5 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all pr-12 ${
                        errors.password
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-xs mt-2 ml-1">{errors.password}</p>
                  )}
                </div>

                {/* Botón Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all mt-6 ${
                    loading
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] shadow-blue-500/30"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Ingresando...
                    </span>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </button>
              </form>

              {/* Link registro */}
              <div className="mt-8 text-center">
                <p className="text-slate-600 text-sm">
                  ¿No tienes una cuenta?{" "}
                  <span
                    onClick={() => navigate("/register-padre")}
                    className="text-purple-600 font-bold hover:underline cursor-pointer"
                  >
                    Regístrate aquí
                  </span>
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
