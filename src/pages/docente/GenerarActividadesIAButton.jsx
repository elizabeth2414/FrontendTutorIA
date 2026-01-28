import { useState } from "react";
import Swal from "sweetalert2";
import { generarActividadesIA } from "../../services/iaActividadesService";
import { 
  MdAutoFixHigh, 
  MdSmartToy, 
  MdHelp,
} from "react-icons/md";

export default function GenerarActividadesIAButton({ contenidoId, onGenerado }) {
  const [loading, setLoading] = useState(false);

  // ==========================================================
  // MODAL DE AYUDA
  // ==========================================================
  const mostrarAyuda = () => {
    Swal.fire({
      title: "🤖 ¿Cómo funciona la IA?",
      html: `
        <div style="text-align: left; padding: 1rem;">
          <h4 style="color: #7c3aed; font-weight: bold; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.25rem;">✨</span>
            ¿Qué es la generación con IA?
          </h4>
          
          <p style="margin: 0 0 1.25rem 0; color: #475569; font-size: 0.875rem; line-height: 1.5;">
            La Inteligencia Artificial analiza el contenido de tu lectura y crea automáticamente preguntas de comprensión adaptadas al nivel de dificultad. Es como tener un asistente educativo que diseña actividades personalizadas en segundos.
          </p>

          <h4 style="color: #2563eb; font-weight: bold; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.25rem;">💡</span>
            ¿Cómo funciona?
          </h4>

          <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div style="display: flex; align-items: start; gap: 0.75rem; padding: 0.75rem; background-color: #f8fafc; border-radius: 0.5rem;">
              <span style="flex-shrink: 0; width: 1.5rem; height: 1.5rem; background-color: #2563eb; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: bold;">1</span>
              <div style="flex: 1;">
                <p style="margin: 0 0 0.25rem 0; font-weight: 600; color: #1e293b; font-size: 0.875rem;">Haz clic en "Generar con IA"</p>
                <p style="margin: 0; font-size: 0.75rem; color: #64748b;">Presiona el botón morado para comenzar</p>
              </div>
            </div>

            <div style="display: flex; align-items: start; gap: 0.75rem; padding: 0.75rem; background-color: #f8fafc; border-radius: 0.5rem;">
              <span style="flex-shrink: 0; width: 1.5rem; height: 1.5rem; background-color: #2563eb; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: bold;">2</span>
              <div style="flex: 1;">
                <p style="margin: 0 0 0.25rem 0; font-weight: 600; color: #1e293b; font-size: 0.875rem;">La IA analiza el contenido</p>
                <p style="margin: 0; font-size: 0.75rem; color: #64748b;">En pocos segundos, la IA lee y comprende tu lectura</p>
              </div>
            </div>

            <div style="display: flex; align-items: start; gap: 0.75rem; padding: 0.75rem; background-color: #f8fafc; border-radius: 0.5rem;">
              <span style="flex-shrink: 0; width: 1.5rem; height: 1.5rem; background-color: #2563eb; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: bold;">3</span>
              <div style="flex: 1;">
                <p style="margin: 0 0 0.25rem 0; font-weight: 600; color: #1e293b; font-size: 0.875rem;">Genera preguntas inteligentes</p>
                <p style="margin: 0; font-size: 0.75rem; color: #64748b;">Crea 5 preguntas de comprensión con opciones y explicaciones</p>
              </div>
            </div>

            <div style="display: flex; align-items: start; gap: 0.75rem; padding: 0.75rem; background-color: #f8fafc; border-radius: 0.5rem;">
              <span style="flex-shrink: 0; width: 1.5rem; height: 1.5rem; background-color: #2563eb; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: bold;">4</span>
              <div style="flex: 1;">
                <p style="margin: 0 0 0.25rem 0; font-weight: 600; color: #1e293b; font-size: 0.875rem;">¡Listo para usar!</p>
                <p style="margin: 0; font-size: 0.75rem; color: #64748b;">Las actividades están listas para tus estudiantes</p>
              </div>
            </div>
          </div>

          <h4 style="color: #16a34a; font-weight: bold; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.25rem;">🚀</span>
            Beneficios
          </h4>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-bottom: 1.25rem;">
            <div style="display: flex; align-items: start; gap: 0.5rem; padding: 0.625rem; background-color: #f0fdf4; border-radius: 0.5rem; border: 1px solid #bbf7d0;">
              <span style="color: #16a34a; font-size: 1rem;">✓</span>
              <p style="margin: 0; font-size: 0.75rem; color: #166534; font-weight: 500;">Ahorra tiempo</p>
            </div>
            <div style="display: flex; align-items: start; gap: 0.5rem; padding: 0.625rem; background-color: #f0fdf4; border-radius: 0.5rem; border: 1px solid #bbf7d0;">
              <span style="color: #16a34a; font-size: 1rem;">✓</span>
              <p style="margin: 0; font-size: 0.75rem; color: #166534; font-weight: 500;">Preguntas adaptadas</p>
            </div>
            <div style="display: flex; align-items: start; gap: 0.5rem; padding: 0.625rem; background-color: #f0fdf4; border-radius: 0.5rem; border: 1px solid #bbf7d0;">
              <span style="color: #16a34a; font-size: 1rem;">✓</span>
              <p style="margin: 0; font-size: 0.75rem; color: #166534; font-weight: 500;">Explicaciones automáticas</p>
            </div>
            <div style="display: flex; align-items: start; gap: 0.5rem; padding: 0.625rem; background-color: #f0fdf4; border-radius: 0.5rem; border: 1px solid #bbf7d0;">
              <span style="color: #16a34a; font-size: 1rem;">✓</span>
              <p style="margin: 0; font-size: 0.75rem; color: #166534; font-weight: 500;">Variedad de tipos</p>
            </div>
          </div>

          <div style="background-color: #f3e8ff; padding: 0.875rem; border-radius: 0.5rem; border-left: 4px solid #9333ea;">
            <p style="margin: 0; font-size: 0.875rem; color: #6b21a8;">
              <strong>💡 Consejo:</strong> Puedes generar múltiples actividades para la misma lectura. Cada generación creará preguntas diferentes basadas en distintos aspectos del texto.
            </p>
          </div>
        </div>
      `,
      icon: "info",
      confirmButtonText: "Entendido",
      confirmButtonColor: "#9333ea",
      width: "700px",
      customClass: {
        htmlContainer: 'swal-html-container-custom'
      }
    });
  };

  // ==========================================================
  // GENERAR ACTIVIDADES
  // ==========================================================
  const handleGenerar = async () => {
    // Validación
    if (!contenidoId) {
      await Swal.fire({
        title: "Error",
        text: "No se recibió el ID de la lectura. No se pueden generar actividades.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    // Confirmación
    const confirm = await Swal.fire({
      title: "🤖 Generar con IA",
      html: `
        <div style="text-align: left; padding: 1rem;">
          <p style="color: #64748b; font-size: 0.875rem; margin: 0 0 1rem 0;">
            ¿Deseas que la IA genere nuevas actividades de comprensión para esta lectura?
          </p>
          
          <div style="background-color: #f3e8ff; padding: 0.875rem; border-radius: 0.5rem; border-left: 4px solid #9333ea;">
            <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: #6b21a8; font-weight: bold;">
              Se generarán:
            </p>
            <ul style="margin: 0 0 0 1.25rem; font-size: 0.875rem; color: #6b21a8; padding: 0;">
              <li style="margin-bottom: 0.25rem;">✓ 5 preguntas de comprensión lectora</li>
              <li style="margin-bottom: 0.25rem;">✓ Opciones múltiples y verdadero/falso</li>
              <li style="margin-bottom: 0.25rem;">✓ Explicaciones automáticas para cada respuesta</li>
              <li>✓ Adaptadas al nivel de dificultad</li>
            </ul>
          </div>

          <div style="background-color: #fef3c7; padding: 0.875rem; border-radius: 0.5rem; border-left: 4px solid #f59e0b; margin-top: 1rem;">
            <p style="margin: 0; font-size: 0.875rem; color: #92400e;">
              <strong>⏱️ Nota:</strong> Este proceso puede tomar algunos segundos mientras la IA analiza el contenido.
            </p>
          </div>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, generar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#9333ea",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

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

      console.log("📤 Generando actividades IA para contenido:", contenidoId);
      console.log("Opciones:", opciones);

      await generarActividadesIA(contenidoId, opciones);

      console.log("✅ Actividades generadas correctamente");

      await Swal.fire({
        title: "¡Actividades generadas!",
        text: "Las actividades de comprensión han sido creadas exitosamente con IA",
        icon: "success",
        confirmButtonColor: "#9333ea",
        timer: 2000,
        showConfirmButton: false,
      });

      // Notificar al padre después de un momento
      setTimeout(() => {
        if (onGenerado) {
          console.log("📢 Notificando al componente padre...");
          onGenerado();
        }
      }, 2000);

    } catch (error) {
      console.error("❌ Error generando actividades:", error);
      console.error("Response:", error.response?.data);
      
      let errorMsg = "Error generando actividades con IA. Intenta nuevamente.";
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 404) {
          errorMsg = "Servicio de IA no disponible. Verifica la configuración.";
        } else if (status === 500) {
          errorMsg = data?.detail || "Error interno del servidor de IA.";
        } else if (status === 401 || status === 403) {
          errorMsg = "No autorizado. Verifica tu sesión.";
        } else if (status === 400) {
          errorMsg = data?.detail || "Datos inválidos. Verifica el contenido de la lectura.";
        } else if (data?.detail) {
          if (typeof data.detail === 'string') {
            errorMsg = data.detail;
          } else if (Array.isArray(data.detail)) {
            errorMsg = data.detail.map(e => e.msg).join(', ');
          }
        }
      } else if (error.request) {
        errorMsg = "No se pudo conectar con el servicio de IA. Verifica que el backend esté corriendo.";
      }

      await Swal.fire({
        title: "Error",
        text: errorMsg,
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    } finally {
      setLoading(false);
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

        /* Estilos para el contenedor HTML de SweetAlert2 */
        .swal-html-container-custom {
          overflow-y: auto;
          max-height: 60vh;
        }

        /* Estilos para scroll */
        .swal-html-container-custom::-webkit-scrollbar {
          width: 6px;
        }

        .swal-html-container-custom::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .swal-html-container-custom::-webkit-scrollbar-thumb {
          background: #9333ea;
          border-radius: 10px;
        }

        .swal-html-container-custom::-webkit-scrollbar-thumb:hover {
          background: #7e22ce;
        }
      `}</style>

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

      {/* BOTONES - GENERAR + AYUDA */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleGenerar}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-600 text-white rounded-xl font-semibold shadow-lg hover:from-purple-600 hover:via-violet-600 hover:to-fuchsia-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdAutoFixHigh size={20} />
          <span className="hidden sm:inline">Generar Actividades IA</span>
          <span className="sm:hidden">Generar IA</span>
        </button>

        <button
          onClick={mostrarAyuda}
          className="p-2.5 rounded-xl bg-white border-2 border-purple-200 text-purple-600 hover:bg-purple-50 transition-all shadow-sm"
          title="¿Cómo funciona la IA?"
        >
          <MdHelp size={20} />
        </button>
      </div>
    </>
  );
}
