import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function PracticasChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No hay prácticas registradas.
      </p>
    );
  }

  const chartData = data.map((p, index) => ({
    intento: `#${index + 1}`,
    puntuacion: p.puntuacion,
    errores: p.errores_corregidos ?? 0,
  }));

  // Detectar si es móvil o desktop
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const chartWidth = isMobile ? Math.max(window.innerWidth - 80, 300) : 750;
  const chartHeight = 280;

  return (
    <div className="w-full overflow-x-auto">
      <BarChart 
        width={chartWidth} 
        height={chartHeight} 
        data={chartData} 
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="intento" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="puntuacion" fill="#22c55e" />
        <Bar dataKey="errores" fill="#ef4444" />
      </BarChart>
    </div>
  );
}
