import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
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

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="intento" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="puntuacion" fill="#22c55e" />
          <Bar dataKey="errores" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
