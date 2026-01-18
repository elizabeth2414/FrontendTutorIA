import { useState, useEffect } from "react";
import { MdClose, MdCheckCircle, MdError, MdEdit } from "react-icons/md";
import { actualizarCurso } from "../../services/cursosService";

export default function ModalEditarCurso({ curso, onClose, onUpdated }) {
  const [nombre, setNombre] = useState("");
  const [nivel, setNivel] = useState(1);
  const [descripcion, setDescripcion] = useState("");
  const [activo, setActivo] = useState(true);

  const [errorNombre, setErrorNombre] = useState("");
  const [guardando, setGuardando] = useState(false);
  
  // Modal de resultado
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultType, setResultType] = useState(""); // 'success' o 'error'
  const [resultMessage, setResultMessage] = useState("");

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
      setResultType("error");
      setResultMessage("El nombre del curso es obligatorio.");
      setShowResultModal(true);
      return;
    }

    if (errorNombre) {
      setResultType("error");
      setResultMessage("Por favor corrige los errores antes de guardar.");
      setShowResultModal(true);
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

      setResultType("success");
      setResultMessage("Curso actualizado exitosamente");
      setShowResultModal(true);
      
      // Esperar un momento antes de cerrar para que se vea el mensaje
      setTimeout(() => {
        onUpdated();
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error("Error actualizando curso:", error);
      setGuardando(false);
      setResultType("error");
      setResultMessage("Hubo un error al actualizar el curso. Intenta nuevamente.");
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
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <MdEdit className="text-yellow-700" size={20} />
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
              <MdClose size={24} />
            </button>
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
                className={`w-full px-4 py-2.5 rounded-lg border-2 outline-none transition ${
                  errorNombre
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                } disabled:bg-slate-50 disabled:cursor-not-allowed`}
              />
              {errorNombre && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <MdError size={14} />
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
                className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition disabled:bg-slate-50 disabled:cursor-not-allowed"
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
                className="w-full px-4 py-2.5 rounded-lg border-2 border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Estado Activo/Inactivo */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <p className="text-sm font-semibold text-slate-700">Estado del Curso</p>
                <p className="text-xs text-slate-500">
                  {activo ? 'Los estudiantes pueden acceder' : 'Los estudiantes no pueden acceder'}
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
                <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-disabled:cursor-not-allowed peer-disabled:opacity-50"></div>
              </label>
            </div>
          </div>

          {/* Footer con botones */}
          <div className="flex gap-3 p-5 border-t border-slate-200">
            <button
              onClick={onClose}
              disabled={guardando}
              className="flex-1 px-4 py-2.5 rounded-lg border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={actualizar}
              disabled={guardando || !nombre.trim() || errorNombre}
              className="flex-1 px-4 py-2.5 rounded-lg bg-yellow-600 text-white font-semibold hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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
