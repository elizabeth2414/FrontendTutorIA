import { useState } from "react";
import { MdClose, MdColorLens } from "react-icons/md";
import { crearCategoria } from "../../services/categoriasService";

export default function ModalCrearCategoria({ onClose, onCreated }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    edad_minima: 7,
    edad_maxima: 10,
    color: "#3B82F6", // azul bebé
    icono: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Validación nombre (solo letras y espacios)
    if (name === "nombre") {
      if (!/^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s]{0,40}$/.test(value)) return;
    }

    // Icono: 1 caracter máximo (emoji o texto breve)
    if (name === "icono" && value.length > 2) return;

    // Validación edades 7–10
    if (name === "edad_minima") {
      value = Number(value);
      if (value < 7 || value > 10) return;
      if (value > form.edad_maxima) value = form.edad_maxima;
    }

    if (name === "edad_maxima") {
      value = Number(value);
      if (value < 7 || value > 10) return;
      if (value < form.edad_minima) value = form.edad_minima;
    }

    setForm({ ...form, [name]: value });
  };

  const crear = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Validaciones finales
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      setSaving(false);
      return;
    }

    if (form.edad_minima > form.edad_maxima) {
      setError("La edad mínima no puede ser mayor que la edad máxima.");
      setSaving(false);
      return;
    }

    try {
      await crearCategoria(form);
      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Error creando categoría");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className="
          bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl 
          w-full max-w-xl relative border border-blue-200
        "
      >

        {/* Botón cerrar */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={() => !saving && onClose()}
        >
          <MdClose size={26} />
        </button>

        {/* Título */}
        <h2 className="text-3xl font-extrabold text-blue-700 text-center mb-6">
          Nueva Categoría
        </h2>

        {error && (
          <p className="text-red-600 text-center mb-3 font-medium">{error}</p>
        )}

        <form onSubmit={crear} className="grid grid-cols-2 gap-5">

          {/* Nombre */}
          <div className="col-span-2">
            <label className="font-semibold text-gray-700">Nombre *</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="
                w-full px-3 py-2 mt-1 rounded-xl border border-blue-200 
                bg-white/70 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none
              "
              placeholder="Ej: Lecturas Básicas"
            />
          </div>

          {/* Descripción */}
          <div className="col-span-2">
            <label className="font-semibold text-gray-700">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows="2"
              className="
                w-full px-3 py-2 mt-1 rounded-xl border border-blue-200 
                bg-white/70 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none resize-none
              "
              placeholder="Descripción breve de la categoría..."
            />
          </div>

          {/* Edad mínima */}
          <div>
            <label className="font-semibold text-gray-700">Edad mínima *</label>
            <input
              type="number"
              name="edad_minima"
              value={form.edad_minima}
              onChange={handleChange}
              className="
                w-full px-3 py-2 mt-1 rounded-xl border border-blue-200 
                bg-white/70 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none
              "
              min={7}
              max={10}
            />
          </div>

          {/* Edad máxima */}
          <div>
            <label className="font-semibold text-gray-700">Edad máxima *</label>
            <input
              type="number"
              name="edad_maxima"
              value={form.edad_maxima}
              onChange={handleChange}
              className="
                w-full px-3 py-2 mt-1 rounded-xl border border-blue-200 
                bg-white/70 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none
              "
              min={7}
              max={10}
            />
          </div>

          {/* Color */}
          <div>
            <label className="font-semibold text-gray-700 flex items-center gap-2">
              <MdColorLens /> Color
            </label>
            <input
              type="color"
              name="color"
              value={form.color}
              onChange={handleChange}
              className="w-16 h-10 mt-1 rounded-xl border border-blue-200 cursor-pointer shadow-sm"
            />
          </div>

          {/* Icono */}
          <div>
            <label className="font-semibold text-gray-700">Icono (1 caracter)</label>
            <input
              name="icono"
              value={form.icono}
              onChange={handleChange}
              className="
                w-full px-3 py-2 mt-1 rounded-xl border border-blue-200 
                bg-white/70 shadow-sm focus:ring-2 focus:ring-blue-300 outline-none
              "
              placeholder="📚"
              maxLength={2}
            />
          </div>

          {/* Botones */}
          <div className="col-span-2 flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => !saving && onClose()}
              className="
                px-5 py-2 rounded-xl bg-gray-300 text-gray-700 
                hover:bg-gray-400 shadow
              "
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="
                px-6 py-2 rounded-xl bg-blue-600 text-white 
                shadow hover:bg-blue-700 transition disabled:opacity-60
              "
            >
              {saving ? "Guardando..." : "Guardar categoría"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
