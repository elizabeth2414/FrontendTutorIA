import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
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

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
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
      </ResponsiveContainer>
    </div>
  );
}
