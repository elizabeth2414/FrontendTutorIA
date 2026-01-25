import { useState, useEffect } from "react";
import { MdClose, MdPerson, MdEmail, MdSchool } from "react-icons/md";
import { actualizarDocenteAdmin } from "../../services/adminService";
import Swal from "sweetalert2";

export default function ModalEditarDocente({ open, docente, onClose, onUpdated }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    especialidad: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (docente && open) {
      setForm({
        nombre: docente.usuario.nombre || "",
        apellido: docente.usuario.apellido || "",
        email: docente.usuario.email || "",
        especialidad: docente.especialidad || "",
      });
      setErrors({});
    }
  }, [docente, open]);

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
      await actualizarDocenteAdmin(docente.id, form);
      
      // PRIMERO recargar la lista
      await onUpdated();
      
      // LUEGO cerrar el modal
      onClose();
      
      // FINALMENTE mostrar mensaje de éxito
      Swal.fire({
        title: "¡Docente Actualizado!",
        text: "Los datos del docente han sido actualizados exitosamente",
        icon: "success",
        confirmButtonColor: "#f97316",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error actualizando docente:", error);
      
      let errorMessage = "No se pudo actualizar el docente";
      
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

  if (!open || !docente) return null;

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
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-600 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Editar Docente</h2>
                <p className="text-amber-100 text-sm">Actualiza los datos del profesor</p>
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
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500">
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
                      : "border-slate-300 focus:ring-amber-500"
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
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500">
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
                      : "border-slate-300 focus:ring-amber-500"
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
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500">
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
                      : "border-slate-300 focus:ring-amber-500"
                  }`}
                  placeholder="Ej: docente@escuela.com"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Especialidad */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Especialidad (opcional)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500">
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
                      : "border-slate-300 focus:ring-amber-500"
                  }`}
                  placeholder="Ej: Matemáticas"
                  disabled={loading}
                />
              </div>
              {errors.especialidad && (
                <p className="text-red-500 text-xs mt-1">{errors.especialidad}</p>
              )}
            </div>

            {/* Info adicional */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs text-slate-600">
                <span className="font-semibold text-amber-700">Nota:</span> La contraseña no se puede modificar desde aquí. Si el docente necesita cambiar su contraseña, deberá hacerlo desde su perfil.
              </p>
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
                className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:via-orange-600 hover:to-yellow-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Actualizando..." : "Actualizar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
