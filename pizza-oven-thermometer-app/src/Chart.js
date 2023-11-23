import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

ChartJS.register(annotationPlugin);

export default function Temperature({ probe1, probe2 }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 100,
    },
    animation: {
      y: {
        type: "number",
        easing: "linear",
        duration: 0,
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 16,
          },
        },
      },

      annotation: {
        annotations: {
          max: {
            type: "line",
            yMin: 600,
            yMax: 600,
            borderColor: "rgb(255, 99, 132)",
            borderWidth: 3,
          },
          min: {
            type: "line",
            yMin: 450,
            yMax: 450,
            borderColor: "rgb(255, 99, 132)",
            borderWidth: 3,
          },
        },
      },
    },
    spanGaps: false,
    scales: {
      x: {
        type: "time",

        time: {
          //  unit: 'month'
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Temp (°C)",
        },
        suggestedMin: 0,
        suggestedMax: 800,
      },
    },
  };

  const formattedData = {
    datasets: [
      {
        label: `Probe 1 ${probe1[probe1.length - 1]?.y || "NA"}°C`,
        data: probe1,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        fill: false,
        cubicInterpolationMode: "monotone",
        tension: 0.4,
      },
      {
        label: `Probe 2 ${probe2[probe2.length - 1]?.y || "NA"}°C`,
        data: probe2,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgb(54, 162, 235, 0.5)",
      },
    ],
  };

  return <Line options={options} data={formattedData} />;
}
