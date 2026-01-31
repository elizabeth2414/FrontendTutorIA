import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { vincularHijo } from "../../services/padresService";

export default function VincularHijo() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
  });

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
  });

  // ==========================================================
  // VALIDACIONES
  // ==========================================================
  const validateField = (name, value) => {
    let msg = "";
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;

    if (name === "nombre") {
      if (value.trim().length > 0 && value.trim().length < 2) {
        msg = "Debe tener al menos 2 caracteres.";
      } else if (value && !soloLetras.test(value)) {
        msg = "Solo se permiten letras.";
      }
    }

    if (name === "apellido") {
      if (value.trim().length > 0 && value.trim().length < 2) {
        msg = "Debe tener al menos 2 caracteres.";
      } else if (value && !soloLetras.test(value)) {
        msg = "Solo se permiten letras.";
      }
    }

    if (name === "fecha_nacimiento") {
      if (value) {
        const fecha = new Date(value);
        const hoy = new Date();
        const edad = Math.floor((hoy - fecha) / (365.25 * 24 * 60 * 60 * 1000));
        if (edad < 7 || edad > 10) {
          msg = "La edad debe estar entre 7 y 10 años.";
        }
      }
    }

    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const normalizarPayload = () => {
    const fechaIso = form.fecha_nacimiento
      ? new Date(form.fecha_nacimiento).toISOString().split("T")[0]
      : "";

    return {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      fecha_nacimiento: fechaIso,
    };
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos vacíos
    if (!form.nombre || !form.apellido || !form.fecha_nacimiento) {
      await Swal.fire({
        title: "Campos incompletos",
        text: "Por favor completa todos los campos.",
        icon: "warning",
        confirmButtonColor: "#10b981",
      });
      return;
    }

    // Validar errores existentes
    if (errors.nombre || errors.apellido || errors.fecha_nacimiento) {
      await Swal.fire({
        title: "Errores de validación",
        text: "Por favor corrige los errores antes de continuar.",
        icon: "warning",
        confirmButtonColor: "#10b981",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = normalizarPayload();
      
      console.log("📤 Vinculando hijo:", payload);

      await vincularHijo(payload);

      console.log("✅ Hijo vinculado correctamente");

      await Swal.fire({
        title: "¡Hijo vinculado!",
        text: "El hijo ha sido vinculado exitosamente",
        icon: "success",
        confirmButtonColor: "#10b981",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => navigate("/padre/menu/hijos"), 2000);
    } catch (error) {
      console.error("❌ Error vinculando hijo:", error);
      console.error("Response:", error.response?.data);

      let mensaje = "No se pudo vincular al hijo. Verifica los datos e intenta nuevamente.";
      
      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          mensaje = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          mensaje = error.response.data.detail.map(e => e.msg || e.message).join(', ');
        }
      } else if (error.response?.data?.message) {
        mensaje = error.response.data.message;
      } else if (error.message) {
        mensaje = error.message;
      }

      await Swal.fire({
        title: "Error",
        text: mensaje,
        icon: "error",
        confirmButtonColor: "#10b981",
      });
    } finally {
      setLoading(false);
    }
  };

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
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

      {/* VERSIÓN MÓVIL */}
      <div className="md:hidden min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 animate-fadeIn">
        {/* Header móvil */}
        <div className="bg-white rounded-b-3xl shadow-lg p-4 mb-5">
          <button
            onClick={() => navigate("/padre/menu/hijos")}
            className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 mb-3 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium text-sm">Volver</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Vincular Hijo</h1>
              <p className="text-slate-600 text-xs">Completa los datos</p>
            </div>
          </div>
        </div>

        {/* Contenido móvil */}
        <div className="px-4 pb-8">
          {/* FORMULARIO MÓVIL */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Nombre del hijo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                required
                value={form.nombre}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white transition-all duration-300 focus:outline-none text-sm ${
                  errors.nombre
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                } disabled:bg-slate-50 disabled:cursor-not-allowed`}
                placeholder="Ej: Juan"
              />
              {errors.nombre && (
                <div className="mt-2 flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 text-xs font-medium">{errors.nombre}</p>
                </div>
              )}
            </div>

            {/* Apellido */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Apellido del hijo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="apellido"
                required
                value={form.apellido}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white transition-all duration-300 focus:outline-none text-sm ${
                  errors.apellido
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                } disabled:bg-slate-50 disabled:cursor-not-allowed`}
                placeholder="Ej: Pérez"
              />
              {errors.apellido && (
                <div className="mt-2 flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 text-xs font-medium">{errors.apellido}</p>
                </div>
              )}
            </div>

            {/* Fecha */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Fecha de nacimiento <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fecha_nacimiento"
                required
                value={form.fecha_nacimiento}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white transition-all duration-300 focus:outline-none text-sm ${
                  errors.fecha_nacimiento
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                } disabled:bg-slate-50 disabled:cursor-not-allowed`}
              />
              {errors.fecha_nacimiento && (
                <div className="mt-2 flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 text-xs font-medium">{errors.fecha_nacimiento}</p>
                </div>
              )}
              <div className="mt-2 flex items-center gap-2 bg-emerald-50 p-2 rounded-lg">
                <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-emerald-700 text-xs font-medium">Edad válida: 7 a 10 años</p>
              </div>
            </div>

            {/* Info adicional móvil */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-emerald-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-emerald-900 mb-1">Importante</p>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Los datos deben coincidir con los registrados por el docente.
                  </p>
                </div>
              </div>
            </div>

            {/* BOTÓN MÓVIL */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl text-white font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 shadow-emerald-500/20 active:scale-95"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Vinculando...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Vincular Hijo</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* VERSIÓN DESKTOP */}
      <div className="hidden md:flex min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 items-center justify-center p-6 animate-fadeIn">
        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-200 p-10 relative overflow-hidden">
          
          {/* Elementos decorativos sutiles */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-100/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-100/30 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            {/* ENCABEZADO DESKTOP */}
            <div className="text-center mb-8">
              {/* Icono */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-xl shadow-emerald-500/20">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Vincular Hijo
              </h2>
              <p className="text-slate-600">
                Ingresa los datos registrados por el docente
              </p>
            </div>

            {/* FORMULARIO DESKTOP */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Grid 2 columnas */}
              <div className="grid grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Nombre del hijo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="nombre"
                      required
                      value={form.nombre}
                      onChange={handleChange}
                      disabled={loading}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 bg-white transition-all duration-300 focus:outline-none ${
                        errors.nombre
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                      } disabled:bg-slate-50 disabled:cursor-not-allowed`}
                      placeholder="Ej: Juan"
                    />
                  </div>
                  {errors.nombre && (
                    <div className="mt-2 flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-700 text-xs font-medium">{errors.nombre}</p>
                    </div>
                  )}
                </div>

                {/* Apellido */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Apellido del hijo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="apellido"
                      required
                      value={form.apellido}
                      onChange={handleChange}
                      disabled={loading}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 bg-white transition-all duration-300 focus:outline-none ${
                        errors.apellido
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                      } disabled:bg-slate-50 disabled:cursor-not-allowed`}
                      placeholder="Ej: Pérez"
                    />
                  </div>
                  {errors.apellido && (
                    <div className="mt-2 flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-700 text-xs font-medium">{errors.apellido}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Fecha - Ancho completo */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Fecha de nacimiento <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    required
                    value={form.fecha_nacimiento}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 bg-white transition-all duration-300 focus:outline-none ${
                      errors.fecha_nacimiento
                        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    } disabled:bg-slate-50 disabled:cursor-not-allowed`}
                  />
                </div>
                {errors.fecha_nacimiento && (
                  <div className="mt-2 flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-700 text-xs font-medium">{errors.fecha_nacimiento}</p>
                  </div>
                )}
                <div className="mt-2 flex items-center gap-2 bg-emerald-50 p-2 rounded-lg">
                  <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-emerald-700 text-xs font-medium">Edad válida: entre 7 y 10 años</p>
                </div>
              </div>

              {/* BOTÓN DESKTOP */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl text-white font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 shadow-emerald-500/20 hover:scale-[1.02]"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Vinculando...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Vincular Hijo</span>
                  </>
                )}
              </button>
            </form>

            {/* VOLVER - Desktop */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/padre/menu/hijos")}
                className="group inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-semibold transition-all duration-300"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Volver a Mis Hijos</span>
              </button>
            </div>

            {/* Info adicional desktop */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-start gap-3 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-emerald-900 mb-1">Importante</p>
                  <p className="text-sm text-emerald-700 leading-relaxed">
                    Los datos deben coincidir exactamente con los registrados por el docente en el sistema.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
