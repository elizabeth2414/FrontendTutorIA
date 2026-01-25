import { useState } from "react";
import { MdClose, MdPerson, MdEmail, MdLock, MdSchool, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { crearDocenteAdmin } from "../../services/adminService";
import Swal from "sweetalert2";

export default function ModalCrearDocente({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    especialidad: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};

    // Nombre
    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (form.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.nombre)) {
      newErrors.nombre = "El nombre solo puede contener letras";
    }

    // Apellido
    if (!form.apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio";
    } else if (form.apellido.trim().length < 2) {
      newErrors.apellido = "El apellido debe tener al menos 2 caracteres";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.apellido)) {
      newErrors.apellido = "El apellido solo puede contener letras";
    }

    // Email
    if (!form.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "El email no es válido";
    }

    // Password
    if (!form.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (form.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    // Especialidad (opcional pero si se ingresa debe ser válida)
    if (form.especialidad && form.especialidad.trim().length < 3) {
      newErrors.especialidad = "La especialidad debe tener al menos 3 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      Swal.fire({
        title: "Formulario incompleto",
        text: "Por favor corrige los errores antes de continuar",
        icon: "warning",
        confirmButtonColor: "#f97316",
      });
      return;
    }

    setLoading(true);

    try {
      await crearDocenteAdmin(form);
      
      // Limpiar formulario
      setForm({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        especialidad: "",
      });
      setErrors({});
      setShowPassword(false);
      
      // PRIMERO recargar la lista
      await onCreated();
      
      // LUEGO cerrar el modal
      onClose();
      
      // FINALMENTE mostrar mensaje de éxito
      Swal.fire({
        title: "¡Docente Creado!",
        text: "El docente ha sido registrado exitosamente",
        icon: "success",
        confirmButtonColor: "#f97316",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error creando docente:", error);
      
      let errorMessage = "No se pudo crear el docente";
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.status === 400) {
        errorMessage = "El email ya está registrado en el sistema";
      }

      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#f97316",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  if (!open) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
        .modal-overlay {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      {/* Overlay */}
      <div
        className="modal-overlay fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-600 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Crear Docente</h2>
                <p className="text-orange-100 text-sm">Registra un nuevo profesor</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
                disabled={loading}
              >
                <MdClose size={24} className="text-white" />
              </button>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">
                  <MdPerson size={20} />
                </div>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.nombre
                      ? "border-red-300 focus:ring-red-500"
                      : "border-slate-300 focus:ring-orange-500"
                  }`}
                  placeholder="Ej: Juan"
                  disabled={loading}
                />
              </div>
              {errors.nombre && (
                <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
              )}
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Apellido <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">
                  <MdPerson size={20} />
                </div>
                <input
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.apellido
                      ? "border-red-300 focus:ring-red-500"
                      : "border-slate-300 focus:ring-orange-500"
                  }`}
                  placeholder="Ej: Pérez"
                  disabled={loading}
                />
              </div>
              {errors.apellido && (
                <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">
                  <MdEmail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-red-300 focus:ring-red-500"
                      : "border-slate-300 focus:ring-orange-500"
                  }`}
                  placeholder="Ej: docente@escuela.com"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">
                  <MdLock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500"
                      : "border-slate-300 focus:ring-orange-500"
                  }`}
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Especialidad */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Especialidad (opcional)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">
                  <MdSchool size={20} />
                </div>
                <input
                  type="text"
                  name="especialidad"
                  value={form.especialidad}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.especialidad
                      ? "border-red-300 focus:ring-red-500"
                      : "border-slate-300 focus:ring-orange-500"
                  }`}
                  placeholder="Ej: Matemáticas"
                  disabled={loading}
                />
              </div>
              {errors.especialidad && (
                <p className="text-red-500 text-xs mt-1">{errors.especialidad}</p>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:via-amber-600 hover:to-yellow-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Creando..." : "Crear Docente"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
