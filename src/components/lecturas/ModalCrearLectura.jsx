import { useState } from "react";
import { MdClose, MdLibraryBooks } from "react-icons/md";
import Swal from "sweetalert2";
import { crearLectura } from "../../services/lecturasService";

export default function ModalCrearLectura({
  categorias,
  cursos,
  onClose,
  onCreated,
}) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    categoria_id: "",
    curso_id: "",
    nivel_dificultad: 1,
    edad_recomendada: 7,
    etiquetas: [],
    audio_url: "",
  });

  const [errors, setErrors] = useState({
    titulo: "",
    contenido: "",
    edad_recomendada: "",
  });

  // Validación en tiempo real
  const validateField = (name, value) => {
    let msg = "";

    if (name === "titulo") {
      if (value.trim().length > 0 && value.trim().length < 3) {
        msg = "El título debe tener al menos 3 caracteres.";
      } else if (value.trim().length > 200) {
        msg = "El título no puede exceder 200 caracteres.";
      }
    }

    if (name === "contenido") {
      if (value.trim().length > 0 && value.trim().length < 10) {
        msg = "El contenido debe tener al menos 10 caracteres.";
      }
    }

    if (name === "edad_recomendada") {
      const edad = Number(value);
      if (edad < 7 || edad > 10) {
        msg = "La edad debe estar entre 7 y 10 años.";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación especial para edad
    if (name === "edad_recomendada") {
      const edad = Number(value);
      if (edad < 7 || edad > 10) return;
    }

    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones finales
    if (!form.titulo.trim()) {
      Swal.fire({
        title: "Campo requerido",
        text: "El título es obligatorio.",
        icon: "warning",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    if (form.titulo.trim().length < 3) {
      Swal.fire({
        title: "Título muy corto",
        text: "El título debe tener al menos 3 caracteres.",
        icon: "warning",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    if (!form.contenido.trim()) {
      Swal.fire({
        title: "Campo requerido",
        text: "El contenido es obligatorio.",
        icon: "warning",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    if (form.contenido.trim().length < 10) {
      Swal.fire({
        title: "Contenido muy corto",
        text: "El contenido debe tener al menos 10 caracteres.",
        icon: "warning",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    if (!form.categoria_id || !form.curso_id) {
      Swal.fire({
        title: "Campos requeridos",
        text: "Debes seleccionar una categoría y un curso.",
        icon: "warning",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    if (errors.titulo || errors.contenido || errors.edad_recomendada) {
      Swal.fire({
        title: "Error de validación",
        text: "Por favor corrige los errores antes de guardar.",
        icon: "warning",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    setSaving(true);

    // Preparar payload
    const payload = {
      titulo: form.titulo.trim(),
      contenido: form.contenido.trim(),
      categoria_id: Number(form.categoria_id),
      curso_id: Number(form.curso_id),
      nivel_dificultad: Number(form.nivel_dificultad),
      edad_recomendada: Number(form.edad_recomendada),
      etiquetas: Array.isArray(form.etiquetas) ? form.etiquetas : [],
      audio_url: form.audio_url.trim() || null,
    };

    console.log("📤 Creando lectura:", payload);

    try {
      await crearLectura(payload);
      
      await Swal.fire({
        title: "¡Lectura creada!",
        text: "La lectura ha sido creada exitosamente",
        icon: "success",
        confirmButtonColor: "#9333ea",
        timer: 2000,
        showConfirmButton: false,
      });

      onCreated();
      onClose();

    } catch (err) {
      console.error("❌ Error:", err);
      console.error("❌ Response:", err.response?.data);
      setSaving(false);

      let errorMsg = "Error al crear la lectura. Intenta nuevamente.";

      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMsg = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          errorMsg = err.response.data.detail.map(e => e.msg).join(', ');
        }
      }

      Swal.fire({
        title: "Error",
        text: errorMsg,
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
        <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slideIn">
          
          {/* Header con gradiente morado */}
          <div className="relative overflow-hidden sticky top-0 bg-white z-10 rounded-t-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 opacity-10"></div>
            <div className="relative flex items-center justify-between p-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg">
                  <MdLibraryBooks className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Nueva Lectura
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
          <form onSubmit={handleSubmit} className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Vista Previa */}
              <div className="md:col-span-2 mb-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Vista Previa
                </label>
                <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 rounded-xl p-4 border-2 border-purple-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {form.titulo || 'Título de la lectura'}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {form.curso_id && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold">
                        {cursos.find(c => c.id === Number(form.curso_id))?.nombre || 'Curso'}
                      </span>
                    )}
                    {form.categoria_id && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-semibold">
                        {categorias.find(c => c.id === Number(form.categoria_id))?.nombre || 'Categoría'}
                      </span>
                    )}
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-semibold">
                      {form.edad_recomendada} años
                    </span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-semibold">
                      Nivel {form.nivel_dificultad}
                    </span>
                  </div>
                  {form.contenido && (
                    <p className="text-sm text-slate-600 bg-white/60 rounded-lg p-3 line-clamp-3">
                      {form.contenido}
                    </p>
                  )}
                </div>
              </div>

              {/* Título */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  placeholder="Ingresa el título de la lectura"
                  disabled={saving}
                  className={`w-full px-4 py-2.5 rounded-xl border-2 outline-none transition ${
                    errors.titulo
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  } disabled:bg-slate-50 disabled:cursor-not-allowed`}
                />
                {errors.titulo && (
                  <p className="text-red-600 text-xs mt-2 ml-1">
                    {errors.titulo}
                  </p>
                )}
              </div>

              {/* Contenido */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Contenido <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="contenido"
                  value={form.contenido}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Escribe el contenido de la lectura..."
                  disabled={saving}
                  className={`w-full px-4 py-2.5 rounded-xl border-2 outline-none transition resize-none ${
                    errors.contenido
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  } disabled:bg-slate-50 disabled:cursor-not-allowed`}
                />
                {errors.contenido && (
                  <p className="text-red-600 text-xs mt-2 ml-1">
                    {errors.contenido}
                  </p>
                )}
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoria_id"
                  value={form.categoria_id}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Curso */}
              <div>
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
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Edad Recomendada */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Edad Recomendada <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="edad_recomendada"
                  value={form.edad_recomendada}
                  onChange={handleChange}
                  min={7}
                  max={10}
                  disabled={saving}
                  className={`w-full px-4 py-2.5 rounded-xl border-2 outline-none transition ${
                    errors.edad_recomendada
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                  } disabled:bg-slate-50 disabled:cursor-not-allowed`}
                />
                {errors.edad_recomendada && (
                  <p className="text-red-600 text-xs mt-2 ml-1">
                    {errors.edad_recomendada}
                  </p>
                )}
              </div>

              {/* Nivel de Dificultad */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nivel de Dificultad <span className="text-red-500">*</span>
                </label>
                <select
                  name="nivel_dificultad"
                  value={form.nivel_dificultad}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
                >
                  <option value="1">1 - Muy Fácil</option>
                  <option value="2">2 - Fácil</option>
                  <option value="3">3 - Medio</option>
                  <option value="4">4 - Difícil</option>
                  <option value="5">5 - Muy Difícil</option>
                </select>
              </div>

              {/* URL de Audio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  URL de Audio <span className="text-slate-500 text-sm">(opcional)</span>
                </label>
                <input
                  type="url"
                  name="audio_url"
                  value={form.audio_url}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/audio.mp3"
                  disabled={saving}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
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
                  disabled={saving || !form.titulo.trim() || !form.contenido.trim() || !form.categoria_id || !form.curso_id || Object.values(errors).some(e => e)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white font-semibold hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Guardando...
                    </span>
                  ) : (
                    "Crear Lectura"
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
