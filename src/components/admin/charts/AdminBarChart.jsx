import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
  } from "chart.js";
  import { Bar } from "react-chartjs-2";
  
  ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
  );
  
  export default function AdminBarChart({ stats }) {
    // 🔢 Total para porcentajes
    const total =
      stats.docentes +
      stats.estudiantes +
      stats.lecturas +
      stats.actividades;
  
    const labels = ["Docentes", "Estudiantes", "Lecturas", "Actividades"];
  
    const values = [
      stats.docentes,
      stats.estudiantes,
      stats.lecturas,
      stats.actividades,
    ];
  
    const data = {
      labels,
      datasets: [
        {
          label: "Cantidad",
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
          borderRadius: 18,
          barThickness: "flex",
          maxBarThickness: 60,
        },
      ],
    };
  
    const options = {
      responsive: true,
      maintainAspectRatio: false, // 📱 IMPORTANTE para móvil
      animation: {
        duration: 1400,
        easing: "easeOutCubic",
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.75)",
          padding: 12,
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 13,
          },
          callbacks: {
            label: function (context) {
              const value = context.raw;
              const percent =
                total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return ` ${value} (${percent}%)`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: window.innerWidth < 640 ? 10 : 12, // 📱 Responsive
              weight: "500",
            },
          },
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            font: {
              size: window.innerWidth < 640 ? 10 : 12,
            },
          },
          grid: {
            color: "rgba(0,0,0,0.05)",
          },
        },
      },
    };
  
    return (
      <div className="w-full h-72 sm:h-80 md:h-96">
        <Bar data={data} options={options} />
      </div>
    );
  }
  