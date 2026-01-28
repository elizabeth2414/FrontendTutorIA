import { useState, useEffect } from "react";
import { MdClose, MdColorLens, MdEdit } from "react-icons/md";
import Swal from "sweetalert2";
import { actualizarCategoria } from "../../services/categoriasService";

export default function ModalEditarCategoria({ categoria, onClose, onUpdated }) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    edad_minima: 7,
    edad_maxima: 10,
    color: "#9333ea",
    icono: "",
  });

  const [errors, setErrors] = useState({
    nombre: "",
    edad: "",
  });

  // Cargar datos de la categoría al montar
  useEffect(() => {
    if (categoria) {
      setForm({
        nombre: categoria.nombre || "",
        descripcion: categoria.descripcion || "",
        edad_minima: categoria.edad_minima || 7,
        edad_maxima: categoria.edad_maxima || 10,
        color: categoria.color || "#9333ea",
        icono: categoria.icono || "",
      });
    }
  }, [categoria]);

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Validación nombre (solo letras y espacios)
    if (name === "nombre") {
      if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]{0,40}$/.test(value)) return;
      
      if (value.trim().length > 0 && value.trim().length < 3) {
        setErrors({ ...errors, nombre: "El nombre debe tener al menos 3 caracteres." });
      } else {
        setErrors({ ...errors, nombre: "" });
      }
    }

    // Icono: 1-2 caracteres máximo (emoji)
    if (name === "icono" && value.length > 2) return;

    // Validación edades 7–10
    if (name === "edad_minima") {
      value = Number(value);
      if (value < 7 || value > 10) return;
      if (value > form.edad_maxima) {
        setErrors({ ...errors, edad: "La edad mínima no puede ser mayor que la máxima." });
      } else {
        setErrors({ ...errors, edad: "" });
      }
    }

    if (name === "edad_maxima") {
      value = Number(value);
      if (value < 7 || value > 10) return;
      if (value < form.edad_minima) {
        setErrors({ ...errors, edad: "La edad máxima no puede ser menor que la mínima." });
      } else {
        setErrors({ ...errors, edad: "" });
      }
    }

    setForm({ ...form, [name]: value });
  };

  const actualizar = async (e) => {
    e.preventDefault();

    // Validaciones finales
    if (!form.nombre.trim()) {
      Swal.fire({
        title: "Campo requerido",
        text: "El nombre es obligatorio.",
        icon: "warning",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    if (form.nombre.trim().length < 3) {
      Swal.fire({
        title: "Nombre muy corto",
        text: "El nombre debe tener al menos 3 caracteres.",
        icon: "warning",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    if (form.edad_minima > form.edad_maxima) {
      Swal.fire({
        title: "Error en edades",
        text: "La edad mínima no puede ser mayor que la edad máxima.",
        icon: "warning",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    if (errors.nombre || errors.edad) {
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
      await actualizarCategoria(categoria.id, form);
      
      await Swal.fire({
        title: "¡Categoría actualizada!",
        text: "Los cambios han sido guardados exitosamente",
        icon: "success",
        confirmButtonColor: "#9333ea",
        timer: 2000,
        showConfirmButton: false,
      });

      onUpdated();
      onClose();

    } catch (err) {
      console.error(err);
      setSaving(false);
      
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar la categoría. Intenta nuevamente.",
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
          
          {/* Header con gradiente violeta */}
          <div className="relative overflow-hidden sticky top-0 bg-white z-10 rounded-t-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-600 opacity-10"></div>
            <div className="relative flex items-center justify-between p-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <MdEdit className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Editar Categoría
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
          <form onSubmit={actualizar} className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Vista Previa */}
              <div className="md:col-span-2 mb-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Vista Previa
                </label>
                <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 rounded-xl p-4 border-2 border-purple-100">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-xl shadow-lg flex items-center justify-center text-3xl transition-all"
                      style={{ backgroundColor: form.color }}
                    >
                      {form.icono || '📁'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {form.nombre || 'Nombre de la categoría'}
                      </h3>
                      <p className="text-sm text-slate-600">
                        Edad: {form.edad_minima} - {form.edad_maxima} años
                      </p>
                    </div>
                  </div>
                  {form.descripcion && (
                    <p className="mt-3 text-sm text-slate-600 bg-white/60 rounded-lg p-2">
                      {form.descripcion}
                    </p>
                  )}
                </div>
              </div>

              {/* Nombre */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Lecturas Básicas"
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

              {/* Descripción */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Descripción (Opcional)
                </label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Descripción breve de la categoría..."
                  disabled={saving}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition resize-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Edad mínima */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Edad Mínima <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="edad_minima"
                  value={form.edad_minima}
                  onChange={handleChange}
                  min={7}
                  max={10}
                  disabled={saving}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Edad máxima */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Edad Máxima <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="edad_maxima"
                  value={form.edad_maxima}
                  onChange={handleChange}
                  min={7}
                  max={10}
                  disabled={saving}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Error de edad */}
              {errors.edad && (
                <div className="md:col-span-2">
                  <p className="text-red-600 text-sm bg-red-50 rounded-lg p-3">
                    {errors.edad}
                  </p>
                </div>
              )}

              {/* Color */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <MdColorLens size={18} className="text-purple-500" />
                  Color <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    disabled={saving}
                    className="w-16 h-12 rounded-xl border-2 border-slate-200 cursor-pointer shadow-sm disabled:cursor-not-allowed"
                  />
                  <div className="flex-1 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-mono text-sm">
                    {form.color}
                  </div>
                </div>
              </div>

              {/* Icono */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Icono (1-2 caracteres)
                </label>
                <input
                  type="text"
                  name="icono"
                  value={form.icono}
                  onChange={handleChange}
                  placeholder="📚"
                  maxLength={2}
                  disabled={saving}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition disabled:bg-slate-50 disabled:cursor-not-allowed text-center text-2xl"
                />
                <p className="text-xs text-slate-500 mt-1">Usa un emoji como icono</p>
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
                  disabled={saving || !form.nombre.trim() || errors.nombre || errors.edad}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold hover:from-violet-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Guardando...
                    </span>
                  ) : (
                    "Guardar Cambios"
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
