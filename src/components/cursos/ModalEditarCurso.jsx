import { useState } from "react";
import { MdClose } from "react-icons/md";
import { actualizarCurso } from "../../services/cursosService";

export default function ModalEditarCurso({ curso, onClose, onUpdated }) {
  const [nombre, setNombre] = useState(curso.nombre);
  const [nivel, setNivel] = useState(curso.nivel);
  const [descripcion, setDescripcion] = useState(curso.descripcion || "");

  const [error, setError] = useState("");
  const [errorNombre, setErrorNombre] = useState("");

  // Validación en tiempo real
  const handleNombreChange = (value) => {
    setNombre(value);

    if (value.trim().length > 0 && value.trim().length < 3) {
      setErrorNombre("El nombre debe tener al menos 3 caracteres.");
    } else if (value.length > 50) {
      setErrorNombre("El nombre no puede exceder 50 caracteres.");
    } else {
      setErrorNombre("");
    }
  };

  const actualizar = async () => {
    setError("");

    if (!nombre.trim()) {
      setError("El nombre del curso es obligatorio.");
      return;
    }

    if (errorNombre) {
      setError("Por favor corrige los errores antes de guardar.");
      return;
    }

    try {
      await actualizarCurso(curso.id, {
        nombre,
        nivel: Number(nivel),
        descripcion,
      });

      onUpdated();
      onClose();
    } catch (error) {
      console.error("Error actualizando curso:", error);
      setError("Hubo un error al actualizar el curso.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade">

      {/* CARD */}
      <div
        className="
          bg-white/90 backdrop-blur-xl 
          w-full max-w-md rounded-3xl shadow-2xl border border-white/40
          p-8 relative animate-fadeIn
        "
      >

        {/* CERRAR */}
        <button
          className="absolute right-4 top-4 text-gray-600 hover:text-gray-900 transition"
          onClick={onClose}
        >
          <MdClose size={26} />
        </button>

        {/* TÍTULO */}
        <h2 className="text-3xl font-extrabold text-blue-700 text-center mb-6">
          Editar Curso
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {/* FORMULARIO */}
        <div className="space-y-5">

          {/* Nombre */}
          <div>
            <label className="block text-gray-700 font-semibold">
              Nombre del Curso <span className="text-red-500">*</span>
            </label>
            <input
              className={`
                w-full mt-1 px-4 py-3 rounded-xl border bg-white/70
                focus:ring-4 outline-none shadow-inner
                ${
                  errorNombre
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-300"
                }
              `}
              value={nombre}
              onChange={(e) => handleNombreChange(e.target.value)}
              placeholder="Nombre del curso"
            />
            {errorNombre && (
              <p className="text-red-600 text-sm mt-1">{errorNombre}</p>
            )}
          </div>

          {/* Nivel */}
          <div>
            <label className="block text-gray-700 font-semibold">
              Nivel (1 - 6)
            </label>
            <select
              className="
                w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 bg-white/70
                focus:ring-4 focus:ring-blue-300 outline-none shadow-inner
              "
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-gray-700 font-semibold">
              Descripción
            </label>
            <textarea
              rows="3"
              className="
                w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 bg-white/70
                focus:ring-4 focus:ring-blue-300 outline-none shadow-inner resize-none
              "
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción breve del curso..."
            ></textarea>
          </div>

        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="
              px-5 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 
              transition font-semibold
            "
          >
            Cancelar
          </button>

          <button
            onClick={actualizar}
            className="
              px-6 py-2 rounded-xl bg-blue-600 text-white 
              hover:bg-blue-700 hover:scale-105 
              transition font-semibold shadow-md
            "
          >
            Guardar Cambios
          </button>
        </div>

      </div>
    </div>
  );
}
