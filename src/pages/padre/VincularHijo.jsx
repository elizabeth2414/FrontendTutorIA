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
        if (edad < 5 || edad > 15) {
          msg = "La edad debe estar entre 5 y 15 años.";
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg border border-gray-200 p-8">

        {/* TÍTULO */}
        <h2 className="text-2xl font-bold text-blue-700 mb-1 text-center">
          Vincular Hijo
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Ingresa los datos registrados por el docente
        </p>

        {/* MENSAJES */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-300 text-red-700 text-sm">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-300 text-green-700 text-sm">
            {successMsg}
          </div>
        )}

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              required
              value={form.nombre}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-xl border focus:ring-2 focus:outline-none ${
                errors.nombre
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Ej: Juan"
            />
            {errors.nombre && (
              <p className="text-red-600 text-xs mt-1">{errors.nombre}</p>
            )}
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellido
            </label>
            <input
              type="text"
              name="apellido"
              required
              value={form.apellido}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-xl border focus:ring-2 focus:outline-none ${
                errors.apellido
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Ej: Pérez"
            />
            {errors.apellido && (
              <p className="text-red-600 text-xs mt-1">{errors.apellido}</p>
            )}
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              name="fecha_nacimiento"
              required
              value={form.fecha_nacimiento}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-xl border focus:ring-2 focus:outline-none ${
                errors.fecha_nacimiento
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.fecha_nacimiento && (
              <p className="text-red-600 text-xs mt-1">{errors.fecha_nacimiento}</p>
            )}
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Vinculando..." : "Vincular Hijo"}
          </button>
        </form>

        {/* REGRESAR */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/padre/menu/hijos")}
            className="text-blue-600 font-semibold hover:underline"
          >
            ← Volver a Mis Hijos
          </button>
        </div>
      </div>
    </div>
  );
}
