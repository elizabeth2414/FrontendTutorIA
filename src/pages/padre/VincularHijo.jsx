import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { vincularHijo } from "../../services/padresService";

export default function VincularHijo() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
  });

  // Validación en tiempo real
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validar campos vacíos
    if (!form.nombre || !form.apellido || !form.fecha_nacimiento) {
      setErrorMsg("Por favor completa todos los campos.");
      return;
    }

    // Validar errores existentes
    if (errors.nombre || errors.apellido || errors.fecha_nacimiento) {
      setErrorMsg("Por favor corrige los errores antes de continuar.");
      return;
    }

    setLoading(true);

    try {
      const payload = normalizarPayload();
      await vincularHijo(payload);

      setSuccessMsg("Hijo vinculado correctamente.");
      setTimeout(() => navigate("/padre/menu/hijos"), 1500);
    } catch (error) {
      const mensaje =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "No se pudo vincular al hijo. Verifica los datos.";

      setErrorMsg(mensaje);
    } finally {
      setLoading(false);
    }
  };

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

      {/* VERSIÓN MÓVIL */}
      <div className="md:hidden min-h-screen bg-white">
        {/* Header móvil */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-5 shadow-lg">
          <button
            onClick={() => navigate("/padre/menu/hijos")}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-3 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium text-xs">Volver</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white mb-0.5">Vincular Hijo</h1>
              <p className="text-blue-100 text-xs">Completa los datos</p>
            </div>
          </div>
        </div>

        {/* Contenido móvil */}
        <div className="px-4 py-5">
          {/* MENSAJES */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border-l-4 border-red-500 flex items-start gap-2">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-red-900 text-xs">Error</p>
                <p className="text-red-700 text-xs mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border-l-4 border-green-500 flex items-start gap-2">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-green-900 text-xs">¡Éxito!</p>
                <p className="text-green-700 text-xs mt-0.5">{successMsg}</p>
              </div>
            </div>
          )}

          {/* FORMULARIO MÓVIL */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nombre del hijo
              </label>
              <input
                type="text"
                name="nombre"
                required
                value={form.nombre}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 rounded-lg border-2 bg-white transition-all duration-300 focus:outline-none text-sm ${
                  errors.nombre
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                }`}
                placeholder="Ej: Juan"
              />
              {errors.nombre && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-600 text-xs font-medium">{errors.nombre}</p>
                </div>
              )}
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Apellido del hijo
              </label>
              <input
                type="text"
                name="apellido"
                required
                value={form.apellido}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 rounded-lg border-2 bg-white transition-all duration-300 focus:outline-none text-sm ${
                  errors.apellido
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                }`}
                placeholder="Ej: Pérez"
              />
              {errors.apellido && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-600 text-xs font-medium">{errors.apellido}</p>
                </div>
              )}
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Fecha de nacimiento
              </label>
              <input
                type="date"
                name="fecha_nacimiento"
                required
                value={form.fecha_nacimiento}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 rounded-lg border-2 bg-white transition-all duration-300 focus:outline-none text-sm ${
                  errors.fecha_nacimiento
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                }`}
              />
              {errors.fecha_nacimiento && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-600 text-xs font-medium">{errors.fecha_nacimiento}</p>
                </div>
              )}
              <div className="mt-1.5 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-slate-500 text-xs">Edad válida: 7 a 10 años</p>
              </div>
            </div>

            {/* Info adicional móvil */}
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-2 text-xs text-blue-900">
                <svg className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="leading-relaxed">
                  Los datos deben coincidir con los registrados por el docente.
                </p>
              </div>
            </div>

            {/* BOTÓN MÓVIL */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Vinculando...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className="hidden md:flex min-h-screen bg-white items-center justify-center p-6">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8 relative overflow-hidden">
          
          {/* Elementos decorativos sutiles */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-100/30 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            {/* ENCABEZADO DESKTOP */}
            <div className="text-center mb-8">
              {/* Icono */}
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-1">
                Vincular Hijo
              </h2>
              <p className="text-slate-600 text-sm">
                Ingresa los datos registrados por el docente
              </p>
            </div>

            {/* MENSAJES DESKTOP */}
            {errorMsg && (
              <div className="mb-5 p-4 rounded-xl bg-red-50 border-l-4 border-red-500 flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-red-900 text-sm">Error</p>
                  <p className="text-red-700 text-sm mt-0.5">{errorMsg}</p>
                </div>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-4 rounded-xl bg-green-50 border-l-4 border-green-500 flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-green-900 text-sm">¡Éxito!</p>
                  <p className="text-green-700 text-sm mt-0.5">{successMsg}</p>
                </div>
              </div>
            )}

            {/* FORMULARIO DESKTOP */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Grid 2 columnas */}
              <div className="grid grid-cols-2 gap-5">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nombre del hijo
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="nombre"
                      required
                      value={form.nombre}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-3 rounded-xl border-2 bg-white transition-all duration-300 focus:outline-none text-sm ${
                        errors.nombre
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      }`}
                      placeholder="Ej: Juan"
                    />
                  </div>
                  {errors.nombre && (
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-600 text-xs font-medium">{errors.nombre}</p>
                    </div>
                  )}
                </div>

                {/* Apellido */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Apellido del hijo
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="apellido"
                      required
                      value={form.apellido}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-3 rounded-xl border-2 bg-white transition-all duration-300 focus:outline-none text-sm ${
                        errors.apellido
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      }`}
                      placeholder="Ej: Pérez"
                    />
                  </div>
                  {errors.apellido && (
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-600 text-xs font-medium">{errors.apellido}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Fecha - Ancho completo */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Fecha de nacimiento
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    required
                    value={form.fecha_nacimiento}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 rounded-xl border-2 bg-white transition-all duration-300 focus:outline-none text-sm ${
                      errors.fecha_nacimiento
                        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    }`}
                  />
                </div>
                {errors.fecha_nacimiento && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-600 text-xs font-medium">{errors.fecha_nacimiento}</p>
                  </div>
                )}
                <div className="mt-1.5 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-slate-500 text-xs">Edad válida: entre 7 y 10 años</p>
                </div>
              </div>

              {/* BOTÓN DESKTOP */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl text-white font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Vinculando...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="group inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold transition-all duration-300 text-sm"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Volver a Mis Hijos</span>
              </button>
            </div>

            {/* Info adicional desktop */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="leading-relaxed text-xs">
                  <span className="font-semibold text-slate-700">Importante:</span> Los datos deben coincidir exactamente con los registrados por el docente en el sistema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
