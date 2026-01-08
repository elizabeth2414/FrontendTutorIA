import { useState } from "react";
import { MdClose } from "react-icons/md";
import { crearEstudianteDocente } from "../../services/docentesService";

export default function ModalCrearEstudiante({ cursos, onClose, onCreated }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  const crear = async (e) => {
    e.preventDefault();
    setError("");

    // Validar campos obligatorios
    if (!form.nombre || !form.apellido || !form.fecha_nacimiento || !form.curso_id) {
      setError("Debe completar todos los campos obligatorios (*).");
      return;
    }

    // Validar errores existentes
    if (errors.nombre || errors.apellido || errors.fecha_nacimiento) {
      setError("Por favor corrige los errores antes de guardar.");
      return;
    }

    setSaving(true);

    try {
      await crearEstudianteDocente({
        ...form,
        nivel_educativo: Number(form.nivel_educativo),
        curso_id: Number(form.curso_id),
      });

      onCreated();
      onClose();
    } catch (error) {
      console.error("Error creando estudiante:", error);
      setError("No se pudo crear el estudiante.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-xl border border-blue-100 relative animate-fade">

        {/* Cerrar */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={() => !saving && onClose()}
        >
          <MdClose size={26} />
        </button>

        {/* Título */}
        <h2 className="text-3xl text-blue-700 font-extrabold mb-6 text-center drop-shadow-sm">
          Nuevo Estudiante
        </h2>

        {error && <p className="text-red-600 mb-3 text-center">{error}</p>}

        <form onSubmit={crear} className="grid grid-cols-2 gap-5">

          {/* Nombre */}
          <div>
            <label className="font-semibold text-gray-700">Nombre *</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className={`w-full px-3 py-2 mt-1 rounded-xl border bg-white/60 shadow-sm focus:ring-2 outline-none ${
                errors.nombre
                  ? "border-red-400 focus:ring-red-300"
                  : "border-blue-200 focus:ring-blue-300"
              }`}
              placeholder="Nombre"
            />
            {errors.nombre && (
              <p className="text-red-600 text-xs mt-1">{errors.nombre}</p>
            )}
          </div>

          {/* Apellido */}
          <div>
            <label className="font-semibold text-gray-700">Apellido *</label>
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              className={`w-full px-3 py-2 mt-1 rounded-xl border bg-white/60 shadow-sm focus:ring-2 outline-none ${
                errors.apellido
                  ? "border-red-400 focus:ring-red-300"
                  : "border-blue-200 focus:ring-blue-300"
              }`}
              placeholder="Apellido"
            />
            {errors.apellido && (
              <p className="text-red-600 text-xs mt-1">{errors.apellido}</p>
            )}
          </div>

          {/* Fecha nacimiento */}
          <div>
            <label className="font-semibold text-gray-700">Fecha nacimiento *</label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={form.fecha_nacimiento}
              onChange={handleChange}
              className={`w-full px-3 py-2 mt-1 rounded-xl border bg-white/60 shadow-sm focus:ring-2 outline-none ${
                errors.fecha_nacimiento
                  ? "border-red-400 focus:ring-red-300"
                  : "border-blue-200 focus:ring-blue-300"
              }`}
            />
            {errors.fecha_nacimiento && (
              <p className="text-red-600 text-xs mt-1">{errors.fecha_nacimiento}</p>
            )}
          </div>

          {/* Nivel */}
          <div>
            <label className="font-semibold text-gray-700">Nivel *</label>
            <select
              name="nivel_educativo"
              value={form.nivel_educativo}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 rounded-xl border border-blue-200 bg-white/60 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Curso */}
          <div className="col-span-2">
            <label className="font-semibold text-gray-700">Curso *</label>
            <select
              name="curso_id"
              value={form.curso_id}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 rounded-xl border border-blue-200 bg-white/60 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none"
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
          <div className="col-span-2">
            <label className="font-semibold text-gray-700">
              Necesidades especiales (opcional)
            </label>
            <textarea
              name="necesidades_especiales"
              value={form.necesidades_especiales}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 mt-1 rounded-xl border border-blue-200 bg-white/60 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none resize-none"
              placeholder="Escriba si aplica..."
            />
          </div>

          {/* Botones */}
          <div className="col-span-2 flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => !saving && onClose()}
              className="px-5 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 shadow"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-blue-600 text-white shadow hover:bg-blue-700 transition"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
