import { useState, useEffect } from "react";
import { MdClose, MdEdit, MdCheckCircle, MdError } from "react-icons/md";
import { actualizarLectura } from "../../services/lecturasService";

export default function ModalEditarLectura({
  lectura,
  categorias,
  cursos,
  onClose,
  onUpdated,
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

  // Modal de resultado
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultType, setResultType] = useState(""); // 'success' o 'error'
  const [resultMessage, setResultMessage] = useState("");

  // Cargar datos de la lectura al montar
  useEffect(() => {
    if (lectura) {
      setForm({
        titulo: lectura.titulo || "",
        contenido: lectura.contenido || "",
        categoria_id: lectura.categoria_id || "",
        curso_id: lectura.curso_id || "",
        nivel_dificultad: lectura.nivel_dificultad || 1,
        edad_recomendada: lectura.edad_recomendada || 7,
        etiquetas: lectura.etiquetas || [],
        audio_url: lectura.audio_url || "",
      });
    }
  }, [lectura]);

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
      setResultType("error");
      setResultMessage("El título es obligatorio.");
      setShowResultModal(true);
      return;
    }

    if (form.titulo.trim().length < 3) {
      setResultType("error");
      setResultMessage("El título debe tener al menos 3 caracteres.");
      setShowResultModal(true);
      return;
    }

    if (!form.contenido.trim()) {
      setResultType("error");
      setResultMessage("El contenido es obligatorio.");
      setShowResultModal(true);
      return;
    }

    if (form.contenido.trim().length < 10) {
      setResultType("error");
      setResultMessage("El contenido debe tener al menos 10 caracteres.");
      setShowResultModal(true);
      return;
    }

    if (!form.categoria_id || !form.curso_id) {
      setResultType("error");
      setResultMessage("Debes seleccionar una categoría y un curso.");
      setShowResultModal(true);
      return;
    }

    if (errors.titulo || errors.contenido || errors.edad_recomendada) {
      setResultType("error");
      setResultMessage("Por favor corrige los errores antes de guardar.");
      setShowResultModal(true);
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

    console.log("📤 Actualizando lectura:", payload);

    try {
      await actualizarLectura(lectura.id, payload);
      
      setResultType("success");
      setResultMessage("Lectura actualizada exitosamente");
      setShowResultModal(true);

      // Esperar un momento antes de cerrar
      setTimeout(() => {
        onUpdated();
        onClose();
      }, 1500);

    } catch (err) {
      console.error("❌ Error:", err);
      console.error("❌ Response:", err.response?.data);
      setSaving(false);

      let errorMsg = "Error al actualizar la lectura. Intenta nuevamente.";

      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMsg = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          errorMsg = err.response.data.detail.map(e => e.msg).join(', ');
        }
      }

      setResultType("error");
      setResultMessage(errorMsg);
      setShowResultModal(true);
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

      {/* MODAL PRINCIPAL */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <MdEdit className="text-yellow-700" size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Editar Lectura
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-lg transition"
              disabled={saving}
            >
              <MdClose size={24} />
            </button>
          </div>

          {/* Contenido */}
          <form onSubmit={handleSubmit} className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Vista Previa */}
              <div className="md:col-span-2 mb-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Vista Previa
                </label>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border-2 border-slate-200">
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
                  className={`w-full px-4 py-2.5 rounded-lg border-2 outline-none transition ${
                    errors.titulo
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  } disabled:bg-slate-50 disabled:cursor-not-allowed`}
                />
                {errors.titulo && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <MdError size={14} />
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
                  className={`w-full px-4 py-2.5 rounded-lg border-2 outline-none transition resize-none ${
                    errors.contenido
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  } disabled:bg-slate-50 disabled:cursor-not-allowed`}
                />
                {errors.contenido && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <MdError size={14} />
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
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
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
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
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
                  className={`w-full px-4 py-2.5 rounded-lg border-2 outline-none transition ${
                    errors.edad_recomendada
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  } disabled:bg-slate-50 disabled:cursor-not-allowed`}
                />
                {errors.edad_recomendada && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <MdError size={14} />
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
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
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
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Footer con botones */}
            <div className="flex gap-3 pt-5 mt-5 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="flex-1 px-4 py-2.5 rounded-lg border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving || !form.titulo.trim() || !form.contenido.trim() || !form.categoria_id || !form.curso_id || Object.values(errors).some(e => e)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-yellow-600 text-white font-semibold hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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
          </form>
        </div>
      </div>

      {/* MODAL DE RESULTADO */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                resultType === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {resultType === 'success' ? (
                  <MdCheckCircle className="text-green-600" size={32} />
                ) : (
                  <MdError className="text-red-600" size={32} />
                )}
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {resultType === 'success' ? '¡Éxito!' : 'Error'}
              </h3>
              
              <p className="text-slate-600 mb-6">
                {resultMessage}
              </p>

              {resultType === 'error' && (
                <button
                  onClick={() => setShowResultModal(false)}
                  className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Cerrar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
