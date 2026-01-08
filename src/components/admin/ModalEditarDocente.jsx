import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { actualizarDocenteAdmin } from "../../services/adminService";

export default function ModalEditarDocente({ open, onClose, docente, onUpdated }) {
  const [form, setForm] = useState({
    especialidad: "",
    grado_academico: "",
    institucion: "",
    activo: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (docente) {
      setForm({
        especialidad: docente.especialidad || "",
        grado_academico: docente.grado_academico || "",
        institucion: docente.institucion || "",
        activo: docente.activo,
      });
    }
  }, [docente]);

  if (!open) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Validaciones
  const validar = () => {
    let temp = {};
    const soloLetras = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]*$/;

    if (form.especialidad && !soloLetras.test(form.especialidad))
      temp.especialidad = "Solo se permiten letras.";

    if (form.grado_academico && !soloLetras.test(form.grado_academico))
      temp.grado_academico = "Solo se permiten letras.";

    if (form.institucion && !soloLetras.test(form.institucion))
      temp.institucion = "Solo se permiten letras.";

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async () => {
    if (!validar()) return;

    try {
      await actualizarDocenteAdmin(docente.id, form);
      Swal.fire("Actualizado", "Docente actualizado correctamente", "success");
      onUpdated();
      onClose();
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el docente", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      {/* CARD */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl border border-gray-200 
                      max-h-[85vh] flex flex-col">

        {/* HEADER */}
        <div className="px-7 pt-6 pb-3 border-b border-gray-200">
          <h2 className="text-2xl font-extrabold text-blue-700">
            Editar Docente
          </h2>
        </div>

        {/* CONTENIDO SCROLLEABLE */}
        <div className="px-7 py-6 overflow-y-auto">

          <div className="grid grid-cols-2 gap-6">

            {/* Especialidad */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold">
                Especialidad
              </label>
              <input
                className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 bg-white/70 
                           focus:ring-4 focus:ring-blue-300 outline-none"
                name="especialidad"
                value={form.especialidad}
                onChange={handleChange}
                placeholder="Ej: Lengua y Literatura"
              />
              {errors.especialidad && (
                <p className="text-red-600 text-sm mt-1">{errors.especialidad}</p>
              )}
            </div>

            {/* Grado Académico */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold">
                Grado Académico
              </label>
              <input
                className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 bg-white/70 
                           focus:ring-4 focus:ring-blue-300 outline-none"
                name="grado_academico"
                value={form.grado_academico}
                onChange={handleChange}
                placeholder="Ej: Licenciatura / Maestría"
              />
              {errors.grado_academico && (
                <p className="text-red-600 text-sm mt-1">{errors.grado_academico}</p>
              )}
            </div>

            {/* Institución */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold">
                Institución
              </label>
              <input
                className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 bg-white/70 
                           focus:ring-4 focus:ring-blue-300 outline-none"
                name="institucion"
                value={form.institucion}
                onChange={handleChange}
                placeholder="Ej: Universidad del Azuay"
              />
              {errors.institucion && (
                <p className="text-red-600 text-sm mt-1">{errors.institucion}</p>
              )}
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="px-7 py-4 border-t border-gray-200 flex justify-end gap-3 bg-white">
          <button
            className="px-5 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 transition font-semibold"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition font-semibold shadow-md"
            onClick={handleSubmit}
          >
            Actualizar
          </button>
        </div>

      </div>
    </div>
  );
}
