import { useState } from "react";
import { generarActividadesIA } from "../../services/iaActividadesService";
import { 
  MdAutoFixHigh, 
  MdClose, 
  MdSmartToy, 
  MdCheckCircle, 
  MdError,
  MdWarning,
  MdHelp,
  MdAutoAwesome,
  MdLightbulb,
  MdSpeed
} from "react-icons/md";

export default function GenerarActividadesIAButton({ contenidoId, onGenerado }) {
  const [loading, setLoading] = useState(false);
  
  // Modales
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [resultType, setResultType] = useState(""); // 'success' o 'error'
  const [resultMessage, setResultMessage] = useState("");

  const handleGenerar = async () => {
    if (!contenidoId) {
      setResultType("error");
      setResultMessage("No se recibió el ID de la lectura.");
      setShowResultModal(true);
      return;
    }

    setShowConfirmModal(false);

    try {
      setLoading(true);

      // Opciones que enviamos a la IA
      const opciones = {
        num_preguntas: 5,
        incluir_verdadero_falso: true,
        incluir_multiple_choice: true,
        dificultad: 1,
        idioma: "es",
      };

      await generarActividadesIA(contenidoId, opciones);

      setResultType("success");
      setResultMessage("Actividades generadas correctamente con IA");
      setShowResultModal(true);

      // Notificar al padre después de un momento
      setTimeout(() => {
        if (onGenerado) onGenerado();
      }, 1500);

    } catch (error) {
      console.error("Error generando actividades:", error);
      
      let errorMsg = "Error generando actividades IA. Intenta nuevamente.";
      
      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          errorMsg = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          errorMsg = error.response.data.detail.map(e => e.msg).join(', ');
        }
      }
      
      setResultType("error");
      setResultMessage(errorMsg);
      setShowResultModal(true);
    } finally {
      setLoading(false);
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

      {/* BOTONES - GENERAR + AYUDA */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowConfirmModal(true)}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg font-semibold shadow-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdAutoFixHigh size={20} />
          <span className="hidden sm:inline">Generar Actividades IA</span>
          <span className="sm:hidden">Generar IA</span>
        </button>

        <button
          onClick={() => setShowHelpModal(true)}
          className="p-2.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
          title="¿Cómo funciona la IA?"
        >
          <MdHelp size={20} />
        </button>
      </div>

      {/* LOADER DURANTE GENERACIÓN */}
      {loading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center max-w-sm mx-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Generando actividades
            </h3>
            <p className="text-slate-600 text-center text-sm">
              La IA está creando preguntas personalizadas. Por favor espera...
            </p>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <MdSmartToy className="text-purple-600" size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Generar con IA
                </h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition"
              >
                <MdClose size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-slate-700 mb-3">
                ¿Deseas que la IA genere nuevas actividades para esta lectura?
              </p>
              <div className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-500">
                <p className="text-sm text-purple-700">
                  <strong>Se generarán:</strong>
                </p>
                <ul className="text-sm text-purple-700 mt-1 ml-4 list-disc">
                  <li>5 preguntas de comprensión</li>
                  <li>Opciones múltiples y verdadero/falso</li>
                  <li>Explicaciones automáticas</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleGenerar}
                className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition shadow-md"
              >
                Generar
              </button>
            </div>
          </div>
        </div>
      )}

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

              <button
                onClick={() => {
                  setShowResultModal(false);
                  if (resultType === 'success' && onGenerado) {
                    // Ya se llamó en el timeout, pero por si acaso
                  }
                }}
                className={`w-full px-4 py-2.5 rounded-lg font-semibold transition ${
                  resultType === 'success'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {resultType === 'success' ? 'Continuar' : 'Cerrar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE AYUDA */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <MdSmartToy className="text-purple-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    ¿Cómo funciona la IA?
                  </h2>
                  <p className="text-sm text-slate-600">
                    Generación automática de actividades
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition"
              >
                <MdClose size={24} />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-6">
              {/* ¿Qué es? */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <MdAutoAwesome className="text-purple-600" size={20} />
                  ¿Qué es la generación con IA?
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  La Inteligencia Artificial analiza el contenido de tu lectura y crea 
                  automáticamente preguntas de comprensión adaptadas al nivel de dificultad 
                  que elijas. Es como tener un asistente educativo que diseña actividades 
                  personalizadas en segundos.
                </p>
              </div>

              {/* ¿Cómo funciona? */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <MdLightbulb className="text-blue-600" size={20} />
                  ¿Cómo funciona?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 mb-1">
                        Haz clic en "Generar con IA"
                      </p>
                      <p className="text-sm text-slate-600">
                        Presiona el botón morado para comenzar
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 mb-1">
                        La IA analiza el contenido
                      </p>
                      <p className="text-sm text-slate-600">
                        En pocos segundos, la IA lee y comprende tu lectura
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 mb-1">
                        Genera preguntas inteligentes
                      </p>
                      <p className="text-sm text-slate-600">
                        Crea 5 preguntas de comprensión con opciones múltiples y explicaciones
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 mb-1">
                        ¡Listo para usar!
                      </p>
                      <p className="text-sm text-slate-600">
                        Las actividades están listas para que tus estudiantes las resuelvan
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Beneficios */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <MdSpeed className="text-green-600" size={20} />
                  Beneficios
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <MdCheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-green-700 font-medium">
                      Ahorra tiempo en crear actividades
                    </p>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <MdCheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-green-700 font-medium">
                      Preguntas adaptadas al nivel
                    </p>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <MdCheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-green-700 font-medium">
                      Explicaciones automáticas
                    </p>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <MdCheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-green-700 font-medium">
                      Variedad de tipos de preguntas
                    </p>
                  </div>
                </div>
              </div>

              {/* Nota */}
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-sm text-purple-700">
                  <strong>💡 Consejo:</strong> Puedes generar múltiples actividades para 
                  la misma lectura. Cada generación creará preguntas diferentes basadas 
                  en distintos aspectos del texto.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
