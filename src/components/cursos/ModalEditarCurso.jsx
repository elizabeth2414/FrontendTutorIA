import { useState, useEffect } from "react";
import { MdClose, MdEdit } from "react-icons/md";
import Swal from "sweetalert2";
import { actualizarCurso } from "../../services/cursosService";

export default function ModalEditarCurso({ curso, onClose, onUpdated }) {
  const [nombre, setNombre] = useState("");
  const [nivel, setNivel] = useState(1);
  const [descripcion, setDescripcion] = useState("");
  const [activo, setActivo] = useState(true);

  const [errorNombre, setErrorNombre] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Cargar datos del curso al montar
  useEffect(() => {
    if (curso) {
      setNombre(curso.nombre || "");
      setNivel(curso.nivel || 1);
      setDescripcion(curso.descripcion || "");
      setActivo(curso.activo !== false);
    }
  }, [curso]);

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
      
      await actualizarCurso(curso.id, {
        nombre,
        nivel: Number(nivel),
        descripcion,
        activo,
      });

      await Swal.fire({
        title: "¡Curso actualizado!",
        text: "Los cambios han sido guardados exitosamente",
        icon: "success",
        confirmButtonColor: "#9333ea",
        timer: 2000,
        showConfirmButton: false,
      });
      
      onUpdated();
      onClose();
      
    } catch (error) {
      console.error("Error actualizando curso:", error);
      setGuardando(false);
      
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el curso. Intenta nuevamente.",
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
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slideIn max-h-[90vh] overflow-y-auto">
          
          {/* Header con gradiente morado */}
          <div className="relative overflow-hidden sticky top-0 bg-white z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 opacity-10"></div>
            <div className="relative flex items-center justify-between p-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <MdEdit className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Editar Curso
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

            {/* Estado Activo/Inactivo */}
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Estado del Curso</p>
                  <p className="text-xs text-slate-600">
                    {activo 
                      ? '✓ Los estudiantes pueden acceder' 
                      : '✕ Los estudiantes no pueden acceder'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activo}
                    onChange={(e) => setActivo(e.target.checked)}
                    disabled={guardando}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-violet-600 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-disabled:cursor-not-allowed peer-disabled:opacity-50 shadow-inner"></div>
                </label>
              </div>
            </div>

            {/* Info del código de acceso */}
            {curso?.codigo_acceso && (
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Código de acceso</p>
                <p className="font-mono text-sm font-bold text-purple-600">
                  {curso.codigo_acceso}
                </p>
              </div>
            )}
          </div>

          {/* Footer con botones */}
          <div className="sticky bottom-0 bg-white border-t border-slate-200">
            <div className="flex flex-col sm:flex-row gap-3 p-5">
              <button
                onClick={onClose}
                disabled={guardando}
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={actualizar}
                disabled={guardando || !nombre.trim() || errorNombre}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold hover:from-violet-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {guardando ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Guardando...
                  </span>
                ) : (
                  "Guardar Cambios"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
