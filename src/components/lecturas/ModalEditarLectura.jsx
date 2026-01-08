import { useState } from "react";
import { MdClose, MdSave, MdEdit } from "react-icons/md";
import { actualizarLectura } from "../../services/lecturasService";

export default function ModalEditarLectura({
  lectura,
  categorias,
  cursos,
  onClose,
  onUpdated,
}) {
  const [form, setForm] = useState({ ...lectura });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await actualizarLectura(lectura.id, form);
      onUpdated();
      onClose();
    } catch (err) {
      console.error("Error editando lectura", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-xl animate-scale">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-yellow-600 flex items-center gap-2">
            <MdEdit size={24} />
            Editar Lectura
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600">
            <MdClose size={24} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2"
          />

          <textarea
            name="contenido"
            value={form.contenido}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-xl px-4 py-2"
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              name="curso_id"
              value={form.curso_id}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2"
            >
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>

            <select
              name="categoria_id"
              value={form.categoria_id}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2"
            >
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <input
            name="edad_recomendada"
            type="number"
            value={form.edad_recomendada}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2"
          />

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
              className="bg-yellow-500 text-black px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-yellow-600"
            >
              <MdSave />
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
