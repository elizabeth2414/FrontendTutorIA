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
  const [errorType, setErrorType] = useState(""); // 'error', 'warning', 'info'
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
    setErrorType("");

    // Validar antes de enviar
    if (!form.email.trim() || !form.password.trim()) {
      setErrorMsg("Por favor completa todos los campos.");
      setErrorType("error");
      return;
    }

    if (errors.email || errors.password) {
      setErrorMsg("Por favor corrige los errores antes de continuar.");
      setErrorType("error");
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
      const message = error?.response?.data?.detail || "";
      
      console.error("❌ LOGIN ERROR:", error);

      // ✅ VALIDACIÓN 1: Usuario inactivo (403)
      if (status === 403 && message.toLowerCase().includes("inactiva")) {
        setErrorMsg("Tu cuenta está temporalmente inactiva. Por favor contacta al administrador para reactivarla.");
        setErrorType("warning");
      }
      // ✅ VALIDACIÓN 2: Usuario eliminado/deshabilitado (403)
      else if (status === 403 && (message.toLowerCase().includes("deshabilitada") || message.toLowerCase().includes("eliminado"))) {
        setErrorMsg("Tu cuenta ha sido deshabilitada. Si crees que esto es un error, contacta al administrador.");
        setErrorType("warning");
      }
      // ✅ VALIDACIÓN 3: Usuario bloqueado (403)
      else if (status === 403 && message.toLowerCase().includes("bloqueada")) {
        setErrorMsg("Tu cuenta está bloqueada por seguridad. Contacta al administrador para desbloquearla.");
        setErrorType("warning");
      }
      // ✅ VALIDACIÓN 4: Email no verificado (403)
      else if (status === 403 && message.toLowerCase().includes("verifica")) {
        setErrorMsg("Por favor verifica tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.");
        setErrorType("info");
      }
      // ✅ VALIDACIÓN 5: Docente específico (403)
      else if (status === 403 && message.toLowerCase().includes("docente")) {
        setErrorMsg("Tu cuenta de docente está deshabilitada. Contacta al administrador del sistema.");
        setErrorType("warning");
      }
      // ✅ VALIDACIÓN 6: Credenciales incorrectas (401)
      else if (status === 401) {
        setErrorMsg("Correo o contraseña incorrectos. Verifica tus datos e intenta nuevamente.");
        setErrorType("error");
      }
      // ✅ VALIDACIÓN 7: Datos inválidos (422)
      else if (status === 422) {
        setErrorMsg("Los datos enviados no son válidos. Por favor revisa el formulario.");
        setErrorType("error");
      }
      // ✅ VALIDACIÓN 8: Otros errores 403
      else if (status === 403) {
        setErrorMsg(message || "Acceso denegado. Contacta al administrador si el problema persiste.");
        setErrorType("warning");
      }
      // ✅ ERROR GENÉRICO
      else {
        setErrorMsg("Error al conectar con el servidor. Verifica tu conexión e intenta nuevamente.");
        setErrorType("error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Componente de alerta mejorado
  const AlertMessage = ({ message, type }) => {
    const styles = {
      error: {
        bg: "bg-red-50",
        border: "border-red-500",
        text: "text-red-700",
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      warning: {
        bg: "bg-amber-50",
        border: "border-amber-500",
        text: "text-amber-800",
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      info: {
        bg: "bg-blue-50",
        border: "border-blue-500",
        text: "text-blue-800",
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
    };

    const style = styles[type] || styles.error;

    return (
      <div className={`${style.bg} border-l-4 ${style.border} ${style.text} p-4 rounded-xl mb-5 flex items-start text-sm shadow-sm`}>
        <div className="flex-shrink-0 mt-0.5 mr-3">
          {style.icon}
        </div>
        <span style={{fontFamily: 'Poppins, sans-serif'}}>{message}</span>
      </div>
    );
  };

  // 🎬 SPLASH SCREEN MÓVIL - Diseño mejorado con colores suaves
  if (isMobile && showSplash) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&family=Fredoka:wght@600;700&display=swap');
          
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

        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl animate-float-delayed"></div>
            <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-cyan-200/30 rounded-full blur-3xl animate-float-slow"></div>
          </div>

          <div className="text-center animate-zoomIn z-10 px-6">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-500/20 animate-bounceCustom">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 mb-4 tracking-tight" style={{fontFamily: 'Fredoka, Poppins, sans-serif'}}>
              BookiSmartIA
            </h1>
            <p className="text-slate-600 text-lg mb-12 px-4" style={{fontFamily: 'Poppins, sans-serif'}}>
              Transformando el aprendizaje de la lectura
            </p>
            <div className="w-14 h-14 mx-auto border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 text-center text-slate-400 text-sm" style={{fontFamily: 'Poppins, sans-serif'}}>
            v1.0.0 • © 2025 BookiSmartIA
          </div>
        </div>
      </>
    );
  }

  // 📱 DISEÑO MÓVIL con colores suaves
  if (isMobile) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Fredoka:wght@500;600;700&display=swap');
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
          .animate-slideUp { animation: slideUp 0.6s ease-out; }
          .safe-area { padding-bottom: env(safe-area-inset-bottom); }
        `}</style>

        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-10 left-10 w-48 h-48 bg-emerald-200/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-64 h-64 bg-teal-200/40 rounded-full blur-3xl"></div>
          </div>

          <div className="flex-1 flex flex-col justify-center px-6 py-8 relative z-10 safe-area">
            <div className="text-center mb-10 animate-fadeIn">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight" style={{fontFamily: 'Fredoka, Poppins, sans-serif'}}>
                ¡Bienvenido!
              </h2>
              <p className="text-slate-600 text-base" style={{fontFamily: 'Poppins, sans-serif'}}>
                Inicia sesión para continuar
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-xl p-7 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white/60 animate-slideUp">
              {errorMsg && <AlertMessage message={errorMsg} type={errorType || "error"} />}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="text-slate-700 font-semibold text-sm block mb-2" style={{fontFamily: 'Poppins, sans-serif'}}>
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
                          : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                      }`}
                      style={{fontFamily: 'Poppins, sans-serif'}}
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-2 ml-1" style={{fontFamily: 'Poppins, sans-serif'}}>{errors.email}</p>
                  )}
                </div>

                {/* Contraseña */}
                <div>
                  <label className="text-slate-700 font-semibold text-sm block mb-2" style={{fontFamily: 'Poppins, sans-serif'}}>
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
                          : "border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                      }`}
                      style={{fontFamily: 'Poppins, sans-serif'}}
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
                    <p className="text-red-600 text-xs mt-2 ml-1" style={{fontFamily: 'Poppins, sans-serif'}}>{errors.password}</p>
                  )}
                </div>

                {/* Link Recuperar contraseña (MÓVIL) */}
                <div className="flex justify-end -mt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm font-semibold text-teal-600 hover:text-teal-700 hover:underline transition"
                    style={{fontFamily: 'Poppins, sans-serif'}}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {/* Botón Login */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all mt-2 ${
                    loading
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 active:scale-95 shadow-emerald-500/20"
                  }`}
                  style={{fontFamily: 'Fredoka, Poppins, sans-serif'}}
                >
                  {loading ? "Ingresando..." : "Iniciar Sesión"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-600 text-sm" style={{fontFamily: 'Poppins, sans-serif'}}>
                  ¿No tienes cuenta?{" "}
                  <span
                    onClick={() => navigate("/register-padre")}
                    className="text-teal-600 font-bold hover:underline cursor-pointer"
                  >
                    Regístrate
                  </span>
                </p>
              </div>
            </div>

            <div className="text-center mt-8 text-slate-500 text-xs" style={{fontFamily: 'Poppins, sans-serif'}}>
              <p>v1.0.0 • BookiSmartIA © 2025</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 🖥️ DISEÑO WEB
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Fredoka:wght@500;600;700&display=swap');
        * { font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif; }
        h1,h2,h3,h4,h5,h6 { font-family: 'Fredoka', 'Poppins', sans-serif; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/30 flex flex-col">
        <Navbar />

        <main className="pt-24 md:pt-28 flex-1 flex items-center justify-center p-4 md:p-6">
          <div className="relative bg-white/80 backdrop-blur-xl p-8 md:p-10 lg:p-12 rounded-2xl md:rounded-3xl shadow-2xl shadow-slate-200/50 max-w-lg w-full border border-white/60 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-200/15 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-200/15 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="text-center mb-6 md:mb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 md:mb-3 tracking-tight">
                  Bienvenido de nuevo
                </h2>
                <p className="text-slate-600 text-sm md:text-base">
                  Ingresa para continuar aprendiendo
                </p>
              </div>

              {errorMsg && <AlertMessage message={errorMsg} type={errorType || "error"} />}

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
                          : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                      }`}
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-2 ml-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
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
                          : "border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
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

                {/* Link Recuperar contraseña (WEB) */}
                <div className="flex justify-end -mt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm font-semibold text-teal-600 hover:text-teal-700 hover:underline transition"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all mt-2 ${
                    loading
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 hover:scale-[1.02] shadow-emerald-500/20"
                  }`}
                >
                  {loading ? "Ingresando..." : "Iniciar Sesión"}
                </button>
              </form>

              <div className="mt-6 md:mt-8 text-center">
                <p className="text-slate-600 text-sm">
                  ¿No tienes una cuenta?{" "}
                  <span
                    onClick={() => navigate("/register-padre")}
                    className="text-teal-600 font-bold hover:underline cursor-pointer"
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
