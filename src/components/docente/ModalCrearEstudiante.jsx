import { useState } from "react";
import { MdClose, MdPerson, MdCheckCircle, MdError } from "react-icons/md";
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

  // Modal de resultado
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultType, setResultType] = useState(""); // 'success' o 'error'
  const [resultMessage, setResultMessage] = useState("");

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

  const crear = async (e) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (!form.nombre || !form.apellido || !form.fecha_nacimiento || !form.curso_id) {
      setResultType("error");
      setResultMessage("Debe completar todos los campos obligatorios (*).");
      setShowResultModal(true);
      return;
    }

    // Validar errores existentes
    if (errors.nombre || errors.apellido || errors.fecha_nacimiento) {
      setResultType("error");
      setResultMessage("Por favor corrige los errores antes de guardar.");
      setShowResultModal(true);
      return;
    }

    setSaving(true);

    try {
      await crearEstudianteDocente({
        ...form,
        nivel_educativo: Number(form.nivel_educativo),
        curso_id: Number(form.curso_id),
      });

      setResultType("success");
      setResultMessage("Estudiante creado exitosamente");
      setShowResultModal(true);

      // Esperar un momento antes de cerrar
      setTimeout(() => {
        onCreated();
        onClose();
      }, 1500);

    } catch (error) {
      console.error("Error creando estudiante:", error);
      setSaving(false);
      setResultType("error");
      setResultMessage("No se pudo crear el estudiante. Intenta nuevamente.");
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
        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <MdPerson className="text-blue-600" size={20} />
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
              <MdClose size={24} />
            </button>
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
                  className={`w-full px-4 py-2.5 rounded-lg border-2 outline-none transition ${
                    errors.nombre
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  } disabled:bg-slate-50 disabled:cursor-not-allowed`}
                />
                {errors.nombre && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <MdError size={14} />
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
                  className={`w-full px-4 py-2.5 rounded-lg border-2 outline-none transition ${
                    errors.apellido
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  } disabled:bg-slate-50 disabled:cursor-not-allowed`}
                />
                {errors.apellido && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <MdError size={14} />
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
                  className={`w-full px-4 py-2.5 rounded-lg border-2 outline-none transition ${
                    errors.fecha_nacimiento
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  } disabled:bg-slate-50 disabled:cursor-not-allowed`}
                />
                {errors.fecha_nacimiento && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <MdError size={14} />
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
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
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
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
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
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none disabled:bg-slate-50 disabled:cursor-not-allowed"
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
                disabled={saving || !form.nombre || !form.apellido || !form.fecha_nacimiento || !form.curso_id || Object.values(errors).some(e => e)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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
