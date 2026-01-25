import { useState } from "react";
import { MdClose, MdSchool } from "react-icons/md";
import Swal from "sweetalert2";
import { crearCurso } from "../../services/cursosService";

export default function ModalCrearCurso({ onClose, onCreated }) {
  const [nombre, setNombre] = useState("");
  const [nivel, setNivel] = useState(1);
  const [descripcion, setDescripcion] = useState("");

  const [errorNombre, setErrorNombre] = useState("");
  const [guardando, setGuardando] = useState(false);

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

  const crear = async () => {
    // Validaciones
    if (!nombre.trim()) {
      Swal.fire({
        title: "Campo requerido",
        text: "El nombre del curso es obligatorio.",
        icon: "warning",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    if (errorNombre) {
      Swal.fire({
        title: "Error de validación",
        text: "Por favor corrige los errores antes de guardar.",
        icon: "warning",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    try {
      setGuardando(true);
      
      await crearCurso({
        nombre,
        nivel: Number(nivel),
        descripcion,
      });

      await Swal.fire({
        title: "¡Curso creado!",
        text: "El curso ha sido creado exitosamente",
        icon: "success",
        confirmButtonColor: "#9333ea",
        timer: 2000,
        showConfirmButton: false,
      });
      
      onCreated();
      onClose();
      
    } catch (error) {
      console.error("Error creando curso:", error);
      setGuardando(false);
      
      Swal.fire({
        title: "Error",
        text: "No se pudo crear el curso. Intenta nuevamente.",
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
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      {/* BACKDROP */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        
        {/* MODAL */}
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slideIn">
          
          {/* Header con gradiente morado */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 opacity-10"></div>
            <div className="relative flex items-center justify-between p-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg">
                  <MdSchool className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Nuevo Curso
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded-lg transition"
                disabled={guardando}
              >
                <MdClose size={24} className="text-slate-600" />
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-5 space-y-4">
            
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nombre del Curso <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => handleNombreChange(e.target.value)}
                placeholder="Ej: Matemáticas 5to Grado"
                disabled={guardando}
                className={`w-full px-4 py-2.5 rounded-xl border-2 outline-none transition ${
                  errorNombre
                    ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                } disabled:bg-slate-50 disabled:cursor-not-allowed`}
              />
              {errorNombre && (
                <p className="text-red-600 text-xs mt-2 ml-1">
                  {errorNombre}
                </p>
              )}
            </div>

            {/* Nivel */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nivel
              </label>
              <select
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                disabled={guardando}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>Nivel {n}</option>
                ))}
              </select>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Descripción (Opcional)
              </label>
              <textarea
                rows="3"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Breve descripción del curso..."
                disabled={guardando}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition resize-none disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Footer con botones */}
          <div className="flex flex-col sm:flex-row gap-3 p-5 border-t border-slate-200">
            <button
              onClick={onClose}
              disabled={guardando}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={crear}
              disabled={guardando || !nombre.trim() || errorNombre}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white font-semibold hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {guardando ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Creando...
                </span>
              ) : (
                "Crear Curso"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
