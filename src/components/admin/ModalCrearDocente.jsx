import { useState } from "react";
import Swal from "sweetalert2";
import { crearDocenteAdmin } from "../../services/adminService";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function ModalCrearDocente({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    especialidad: "",
    grado_academico: "",
    institucion: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Validaciones
  const validar = () => {
    let temp = {};
    const soloLetras = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const soloLetrasOpc = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]*$/;

    if (!form.nombre.trim()) temp.nombre = "El nombre es obligatorio.";
    else if (!soloLetras.test(form.nombre))
      temp.nombre = "Solo se permiten letras.";

    if (!form.apellido.trim()) temp.apellido = "El apellido es obligatorio.";
    else if (!soloLetras.test(form.apellido))
      temp.apellido = "Solo se permiten letras.";

    if (!form.email.trim()) temp.email = "El correo es obligatorio.";
    else if (!emailValido.test(form.email))
      temp.email = "Formato de correo inválido.";

    if (!form.password.trim()) temp.password = "La contraseña es obligatoria.";
    else if (form.password.length < 6)
      temp.password = "Debe tener mínimo 6 caracteres.";

    if (form.especialidad && !soloLetrasOpc.test(form.especialidad))
      temp.especialidad = "Solo se permiten letras.";

    if (form.grado_academico && !soloLetrasOpc.test(form.grado_academico))
      temp.grado_academico = "Solo se permiten letras.";

    if (form.institucion && !soloLetrasOpc.test(form.institucion))
      temp.institucion = "Solo se permiten letras.";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async () => {
    if (!validar()) return;

    try {
      await crearDocenteAdmin(form);
      Swal.fire("Éxito", "Docente creado correctamente", "success");
      onCreated();
      onClose();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.detail || "No se pudo crear el docente.",
        "error"
      );
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
            Crear Docente
          </h2>
        </div>

        {/* CONTENT SCROLLEABLE */}
        <div className="px-7 py-5 overflow-y-auto">

          <div className="grid grid-cols-2 gap-5">

            {/* Nombre */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 bg-white/70 
                           focus:ring-4 focus:ring-blue-300 outline-none"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre"
              />
              {errors.nombre && <p className="text-red-600 text-sm mt-1">{errors.nombre}</p>}
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-gray-700 font-semibold">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 bg-white/70 
                           focus:ring-4 focus:ring-blue-300 outline-none"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                placeholder="Apellido"
              />
              {errors.apellido && <p className="text-red-600 text-sm mt-1">{errors.apellido}</p>}
            </div>

            {/* Email */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 bg-white/70 
                           focus:ring-4 focus:ring-purple-300 outline-none"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password con ojito */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold">
                Contraseña <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <input
                  className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 bg-white/70 
                             focus:ring-4 focus:ring-purple-300 outline-none pr-12"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                />

                {/* Ojito */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
                </button>
              </div>

              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Especialidad */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold">Especialidad</label>
              <input
                className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 bg-white/70 
                           focus:ring-4 focus:ring-blue-300 outline-none"
                name="especialidad"
                value={form.especialidad}
                onChange={handleChange}
                placeholder="Lengua, Matemáticas, etc."
              />
              {errors.especialidad && (
                <p className="text-red-600 text-sm mt-1">{errors.especialidad}</p>
              )}
            </div>

            {/* Grado Académico */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold">Grado Académico</label>
              <input
                className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 bg-white/70 
                           focus:ring-4 focus:ring-blue-300 outline-none"
                name="grado_academico"
                value={form.grado_academico}
                onChange={handleChange}
                placeholder="Licenciatura / Maestría"
              />
              {errors.grado_academico && (
                <p className="text-red-600 text-sm mt-1">{errors.grado_academico}</p>
              )}
            </div>

            {/* Institución */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold">Institución</label>
              <input
                className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 bg-white/70 
                           focus:ring-4 focus:ring-blue-300 outline-none"
                name="institucion"
                value={form.institucion}
                onChange={handleChange}
                placeholder="Universidad del Azuay"
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
            Guardar
          </button>
        </div>

      </div>

    </div>
  );
}
