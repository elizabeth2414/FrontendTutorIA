import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function PronunciacionChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No hay datos suficientes para mostrar la gráfica.
      </p>
    );
  }

  // Normalizamos datos
  const chartData = data.map((d) => ({
    fecha: new Date(d.fecha).toLocaleDateString(),
    puntuacion: d.puntuacion_global,
    fluidez: d.fluidez,
    velocidad: d.velocidad,
  }));

  // Detectar si es móvil o desktop
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const chartWidth = isMobile ? Math.max(window.innerWidth - 80, 300) : 750;
  const chartHeight = 280;

  return (
    <div className="w-full overflow-x-auto">
      <LineChart 
        width={chartWidth} 
        height={chartHeight} 
        data={chartData} 
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="puntuacion"
          stroke="#2563eb"
          strokeWidth={3}
        />
        <Line
          type="monotone"
          dataKey="fluidez"
          stroke="#16a34a"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="velocidad"
          stroke="#f59e0b"
          strokeWidth={2}
        />
      </LineChart>
    </div>
  );
}
