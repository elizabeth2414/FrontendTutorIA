import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { registrarPadre } from "../../services/authService";

const RegisterPadre = () => {
  const navigate = useNavigate();
  const isMobile = Capacitor.isNativePlatform();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  });

  // Validación de campos
  const validateField = (name, value) => {
    let msg = "";
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;

    if (name === "nombre") {
      if (value.trim().length < 2) msg = "Ingresa un nombre válido.";
      else if (!soloLetras.test(value)) msg = "Solo se permiten letras.";
    }

    if (name === "apellido") {
      if (value.trim().length < 2) msg = "Ingresa un apellido válido.";
      else if (!soloLetras.test(value)) msg = "Solo se permiten letras.";
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) msg = "Correo electrónico no válido.";
    }

    if (name === "password") {
      if (value.length < 6) msg = "Debe tener mínimo 6 caracteres.";
    }

    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  // Manejar cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  // Enviar formulario
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await registrarPadre(form);
      setSuccessMsg("Cuenta creada con éxito. Redirigiendo...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setErrorMsg("No se pudo completar el registro.");
    }

    setLoading(false);
  };

  // Bloquear si hay errores o campos vacíos
  const formInvalido =
    Object.values(errors).some((e) => e !== "") ||
    !form.nombre ||
    !form.apellido ||
    !form.email ||
    !form.password;

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

        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex flex-col relative overflow-hidden">
          {/* Decoración de fondo mejorada */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-10 left-10 w-48 h-48 bg-pink-200/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-blue-200/40 rounded-full blur-3xl"></div>
          </div>

          <div className="flex-1 flex flex-col justify-start px-6 py-8 relative z-10 safe-area overflow-y-auto">
            {/* Header con logo */}
            <div className="text-center mb-6 animate-fadeIn">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-pink-500/30">
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
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight" style={{fontFamily: 'Poppins, sans-serif'}}>
                Crear Cuenta
              </h2>
              <p className="text-slate-600 text-base" style={{fontFamily: 'DM Sans, sans-serif'}}>
                Regístrate como Padre / Tutor
              </p>
            </div>

            {/* Formulario */}
            <div className="bg-white/90 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white/60 animate-slideUp mb-6">
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

              {successMsg && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl mb-5 flex items-start text-sm shadow-sm">
                  <svg
                    className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span style={{fontFamily: 'DM Sans, sans-serif'}}>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Nombre */}
                <div>
                  <label className="text-slate-700 font-semibold text-sm block mb-2" style={{fontFamily: 'DM Sans, sans-serif'}}>
                    Nombre
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      className={`w-full px-4 py-3.5 pl-12 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all text-base ${
                        errors.nombre
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  {errors.nombre && (
                    <p className="text-red-600 text-xs mt-2 ml-1" style={{fontFamily: 'DM Sans, sans-serif'}}>{errors.nombre}</p>
                  )}
                </div>

                {/* Apellido */}
                <div>
                  <label className="text-slate-700 font-semibold text-sm block mb-2" style={{fontFamily: 'DM Sans, sans-serif'}}>
                    Apellido
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="apellido"
                      value={form.apellido}
                      onChange={handleChange}
                      placeholder="Tu apellido"
                      className={`w-full px-4 py-3.5 pl-12 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all text-base ${
                        errors.apellido
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  {errors.apellido && (
                    <p className="text-red-600 text-xs mt-2 ml-1" style={{fontFamily: 'DM Sans, sans-serif'}}>{errors.apellido}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-slate-700 font-semibold text-sm block mb-2" style={{fontFamily: 'DM Sans, sans-serif'}}>
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="correo@ejemplo.com"
                      autoComplete="email"
                      className={`w-full px-4 py-3.5 pl-12 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all text-base ${
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
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                      minLength="6"
                      autoComplete="new-password"
                      className={`w-full px-4 py-3.5 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all text-base pr-12 ${
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

                {/* Botón */}
                <button
                  type="submit"
                  disabled={loading || formInvalido}
                  className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all mt-6 ${
                    loading || formInvalido
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 active:scale-95 shadow-pink-500/30"
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
                      Registrando...
                    </span>
                  ) : (
                    "Crear Cuenta"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-600 text-sm" style={{fontFamily: 'DM Sans, sans-serif'}}>
                  ¿Ya tienes cuenta?{" "}
                  <Link
                    to="/login"
                    className="text-purple-600 font-bold hover:underline"
                  >
                    Inicia sesión
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer info */}
            <div className="text-center text-slate-500 text-xs pb-4" style={{fontFamily: 'DM Sans, sans-serif'}}>
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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-purple-50/50 flex flex-col">
        <Navbar />

        <main className="pt-28 flex-1 flex items-center justify-center p-6">
          <div className="relative bg-white/80 backdrop-blur-xl p-10 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 max-w-2xl w-full border border-white/60 overflow-hidden">
            
            {/* Elementos decorativos de fondo */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-pink-500/30">
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
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                  Registro de Padre / Tutor
                </h2>
                <p className="text-slate-600 text-base">
                  Crea tu cuenta para seguir el progreso de tus hijos
                </p>
              </div>

              {/* Mensajes */}
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

              {successMsg && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl mb-6 flex items-start shadow-sm">
                  <svg
                    className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{successMsg}</span>
                </div>
              )}

              {/* Formulario */}
              <form
                onSubmit={handleRegister}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                {/* Nombre */}
                <div>
                  <label className="text-slate-700 font-semibold text-sm block mb-2">
                    Nombre
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Ingresa tu nombre"
                      className={`w-full px-4 py-3.5 pl-12 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all ${
                        errors.nombre
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  {errors.nombre && (
                    <p className="text-red-600 text-xs mt-2 ml-1">{errors.nombre}</p>
                  )}
                </div>

                {/* Apellido */}
                <div>
                  <label className="text-slate-700 font-semibold text-sm block mb-2">
                    Apellido
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="apellido"
                      value={form.apellido}
                      onChange={handleChange}
                      placeholder="Ingresa tu apellido"
                      className={`w-full px-4 py-3.5 pl-12 rounded-2xl border-2 bg-slate-50 focus:bg-white outline-none transition-all ${
                        errors.apellido
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  {errors.apellido && (
                    <p className="text-red-600 text-xs mt-2 ml-1">{errors.apellido}</p>
                  )}
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="text-slate-700 font-semibold text-sm block mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="correo@ejemplo.com"
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
                <div className="md:col-span-2">
                  <label className="text-slate-700 font-semibold text-sm block mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                      minLength="6"
                      autoComplete="new-password"
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

                {/* Botón */}
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={loading || formInvalido}
                    className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all mt-4 ${
                      loading || formInvalido
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 hover:scale-[1.02] shadow-pink-500/30"
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
                        Registrando...
                      </span>
                    ) : (
                      "Crear Cuenta"
                    )}
                  </button>
                </div>
              </form>

              {/* Link login */}
              <div className="mt-8 text-center">
                <p className="text-slate-600 text-sm">
                  ¿Ya tienes una cuenta?{" "}
                  <Link to="/login" className="text-purple-600 font-bold hover:underline">
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default RegisterPadre;