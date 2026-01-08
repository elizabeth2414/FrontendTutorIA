import { useState } from "react";
import { generarActividadesIA } from "../../services/iaActividadesService";
import { MdAutoFixHigh } from "react-icons/md";

export default function GenerarActividadesIAButton({ contenidoId, onGenerado }) {
  const [loading, setLoading] = useState(false);

  const handleGenerar = async () => {
    if (!contenidoId) {
      alert("No se recibió el ID de la lectura.");
      return;
    }

    if (!confirm("¿Deseas que la IA genere nuevas actividades para esta lectura?")) {
      return;
    }

    try {
      setLoading(true);

      // Opciones que enviamos a la IA (puedes personalizar)
      const opciones = {
        cantidad_preguntas: 5,
        incluir_vf: true,
        incluir_completar: true,
        incluir_opcion_multiple: true,
        nivel: 1, // nivel básico por defecto
      };

      await generarActividadesIA(contenidoId, opciones);

      // Notificar al padre que debe recargar actividades
      if (onGenerado) onGenerado();

      alert("✅ Actividades generadas correctamente.");
    } catch (error) {
      console.error(error);
      alert("❌ Error generando actividades IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGenerar}
      disabled={loading}
      className={`px-4 py-2 rounded-lg flex items-center gap-2 text-white 
        ${loading ? "bg-gray-500" : "bg-purple-600 hover:bg-purple-700"}
      `}
    >
      <MdAutoFixHigh size={20} />
      {loading ? "Generando..." : "Generar Actividades IA"}
    </button>
  );
}
