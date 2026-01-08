import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
  } from "chart.js";
  import { Doughnut } from "react-chartjs-2";
  
  ChartJS.register(ArcElement, Tooltip, Legend);
  
  export default function AdminDonutChart({ stats }) {
    const labels = ["Docentes", "Estudiantes", "Lecturas", "Actividades"];
  
    const values = [
      stats.docentes,
      stats.estudiantes,
      stats.lecturas,
      stats.actividades,
    ];
  
    const total = values.reduce((acc, val) => acc + val, 0);
  
    const data = {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            "rgba(59, 130, 246, 0.85)",  // Azul
            "rgba(168, 85, 247, 0.85)",  // Morado
            "rgba(236, 72, 153, 0.85)",  // Rosa
            "rgba(34, 197, 94, 0.85)",   // Verde
          ],
          hoverBackgroundColor: [
            "rgba(59, 130, 246, 1)",
            "rgba(168, 85, 247, 1)",
            "rgba(236, 72, 153, 1)",
            "rgba(34, 197, 94, 1)",
          ],
          borderWidth: 0,
        },
      ],
    };
  
    const options = {
      responsive: true,
      maintainAspectRatio: false, // 📱 clave para móvil
      cutout: "68%",
      animation: {
        animateRotate: true,
        duration: 1400,
        easing: "easeOutQuart",
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 18,
            boxWidth: 16,
            font: {
              size: window.innerWidth < 640 ? 11 : 13,
              weight: "500",
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.75)",
          padding: 12,
          callbacks: {
            label: function (context) {
              const value = context.raw;
              const percent =
                total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return ` ${context.label}: ${value} (${percent}%)`;
            },
          },
        },
      },
    };
  
    return (
      <div className="relative w-full h-72 sm:h-80 md:h-96">
        {/* Texto central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-3xl font-extrabold text-blue-700">
            {total}
          </p>
        </div>
  
        <Doughnut data={data} options={options} />
      </div>
    );
  }
  