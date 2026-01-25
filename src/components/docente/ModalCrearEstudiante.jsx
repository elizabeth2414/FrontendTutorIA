import { useState } from "react";
import { MdClose, MdPerson } from "react-icons/md";
import Swal from "sweetalert2";
import { crearEstudianteDocente } from "../../services/docentesService";

export default function ModalCrearEstudiante({ cursos, onClose, onCreated }) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    nivel_educativo: "1",
    curso_id: "",
    necesidades_especiales: "",
  });

  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    curso_id: "",
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
        if (edad < 3 || edad > 18) {
          msg = "La edad debe estar entre 3 y 18 años.";
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

  const crear = async (e) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (!form.nombre || !form.apellido || !form.fecha_nacimiento || !form.curso_id) {
      Swal.fire({
        title: "Campos requeridos",
        text: "Debe completar todos los campos obligatorios (*).",
        icon: "warning",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    // Validar errores existentes
    if (errors.nombre || errors.apellido || errors.fecha_nacimiento) {
      Swal.fire({
        title: "Error de validación",
        text: "Por favor corrige los errores antes de guardar.",
        icon: "warning",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    setSaving(true);

    try {
      await crearEstudianteDocente({
        ...form,
        nivel_educativo: Number(form.nivel_educativo),
        curso_id: Number(form.curso_id),
      });

      await Swal.fire({
        title: "¡Estudiante creado!",
        text: "El estudiante ha sido creado exitosamente",
        icon: "success",
        confirmButtonColor: "#9333ea",
        timer: 2000,
        showConfirmButton: false,
      });

      onCreated();
      onClose();

    } catch (error) {
      console.error("Error creando estudiante:", error);
      setSaving(false);
      
      Swal.fire({
        title: "Error",
        text: "No se pudo crear el estudiante. Intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
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

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      {/* MODAL PRINCIPAL */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slideIn">
          
          {/* Header con gradiente morado */}
          <div className="relative overflow-hidden sticky top-0 bg-white z-10 rounded-t-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 opacity-10"></div>
            <div className="relative flex items-center justify-between p-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg">
                  <MdPerson className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Nuevo Estudiante
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded-lg transition"
                disabled={saving}
              >
                <MdClose size={24} className="text-slate-600" />
              </button>
            </div>
          </div>

          {/* Contenido */}
          <form onSubmit={crear} className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del estudiante"
                  disabled={saving}
                  className={`w-full px-4 py-2.5 rounded-xl border-2 outline-none transition ${
                    errors.nombre
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  } disabled:bg-slate-50 disabled:cursor-not-allowed`}
                />
                {errors.nombre && (
                  <p className="text-red-600 text-xs mt-2 ml-1">
                    {errors.nombre}
                  </p>
                )}
              </div>

              {/* Apellido */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  placeholder="Apellido del estudiante"
                  disabled={saving}
                  className={`w-full px-4 py-2.5 rounded-xl border-2 outline-none transition ${
                    errors.apellido
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  } disabled:bg-slate-50 disabled:cursor-not-allowed`}
                />
                {errors.apellido && (
                  <p className="text-red-600 text-xs mt-2 ml-1">
                    {errors.apellido}
                  </p>
                )}
              </div>

              {/* Fecha nacimiento */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Fecha de Nacimiento <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={form.fecha_nacimiento}
                  onChange={handleChange}
                  disabled={saving}
                  className={`w-full px-4 py-2.5 rounded-xl border-2 outline-none transition ${
                    errors.fecha_nacimiento
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  } disabled:bg-slate-50 disabled:cursor-not-allowed`}
                />
                {errors.fecha_nacimiento && (
                  <p className="text-red-600 text-xs mt-2 ml-1">
                    {errors.fecha_nacimiento}
                  </p>
                )}
              </div>

              {/* Nivel */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nivel <span className="text-red-500">*</span>
                </label>
                <select
                  name="nivel_educativo"
                  value={form.nivel_educativo}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>Nivel {n}</option>
                  ))}
                </select>
              </div>

              {/* Curso */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Curso <span className="text-red-500">*</span>
                </label>
                <select
                  name="curso_id"
                  value={form.curso_id}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
                >
                  <option value="">Seleccione un curso</option>
                  {cursos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} — Nivel {c.nivel}
                    </option>
                  ))}
                </select>
              </div>

              {/* Necesidades especiales */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Necesidades Especiales (Opcional)
                </label>
                <textarea
                  name="necesidades_especiales"
                  value={form.necesidades_especiales}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe si el estudiante tiene alguna necesidad especial..."
                  disabled={saving}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition resize-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Footer con botones */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 -mx-5 -mb-5 px-5 py-5 mt-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || !form.nombre || !form.apellido || !form.fecha_nacimiento || !form.curso_id || Object.values(errors).some(e => e)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white font-semibold hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Guardando...
                    </span>
                  ) : (
                    "Guardar Estudiante"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
