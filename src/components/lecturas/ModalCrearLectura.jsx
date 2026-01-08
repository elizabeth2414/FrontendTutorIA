import { useState } from "react";
import { MdClose, MdSave, MdLibraryBooks } from "react-icons/md";
import { crearLectura } from "../../services/lecturasService";

export default function ModalCrearLectura({
  categorias,
  cursos,
  onClose,
  onCreated,
}) {
  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    categoria_id: "",
    curso_id: "",
    edad_recomendada: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
      } else if (value.length > 100) {
        msg = "El título no puede exceder 100 caracteres.";
      }
    }

    if (name === "contenido") {
      if (value.trim().length > 0 && value.trim().length < 10) {
        msg = "El contenido debe tener al menos 10 caracteres.";
      }
    }

    if (name === "edad_recomendada") {
      if (value && (value < 5 || value > 15)) {
        msg = "La edad debe estar entre 5 y 15 años.";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validar campos obligatorios
    if (!form.titulo || !form.contenido || !form.categoria_id || !form.curso_id) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }

    // Validar errores existentes
    if (errors.titulo || errors.contenido || errors.edad_recomendada) {
      setError("Por favor corrige los errores antes de guardar.");
      return;
    }

    try {
      setSaving(true);
      await crearLectura(form);
      onCreated();
      onClose();
    } catch (err) {
      console.error("Error creando lectura", err);
      setError("Error al crear la lectura. Inténtalo nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-xl animate-scale">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
            <MdLibraryBooks size={24} />
            Nueva Lectura
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600">
            <MdClose size={24} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <input
              name="titulo"
              placeholder="Título de la lectura *"
              value={form.titulo}
              onChange={handleChange}
              required
              className={`w-full border rounded-xl px-4 py-2 focus:ring-2 outline-none ${
                errors.titulo
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.titulo && (
              <p className="text-red-600 text-xs mt-1 ml-1">{errors.titulo}</p>
            )}
          </div>

          <div>
            <textarea
              name="contenido"
              placeholder="Contenido de la lectura *"
              value={form.contenido}
              onChange={handleChange}
              rows={4}
              required
              className={`w-full border rounded-xl px-4 py-2 focus:ring-2 outline-none resize-none ${
                errors.contenido
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.contenido && (
              <p className="text-red-600 text-xs mt-1 ml-1">{errors.contenido}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              name="curso_id"
              value={form.curso_id}
              onChange={handleChange}
              required
              className="border rounded-xl px-3 py-2"
            >
              <option value="">Curso</option>
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>

            <select
              name="categoria_id"
              value={form.categoria_id}
              onChange={handleChange}
              required
              className="border rounded-xl px-3 py-2"
            >
              <option value="">Categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <input
              name="edad_recomendada"
              type="number"
              placeholder="Edad recomendada (5-15 años)"
              value={form.edad_recomendada}
              onChange={handleChange}
              min="5"
              max="15"
              className={`w-full border rounded-xl px-4 py-2 focus:ring-2 outline-none ${
                errors.edad_recomendada
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.edad_recomendada && (
              <p className="text-red-600 text-xs mt-1 ml-1">{errors.edad_recomendada}</p>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700"
            >
              <MdSave />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
