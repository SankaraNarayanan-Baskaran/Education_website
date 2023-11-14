import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js";

const BarGraph = () => {
  const chartId = 'uniqueChartId';

  useEffect(() => {
    const data = {
      labels: ["January", "February", "March", "April", "May"],
      datasets: [
        {
          label: "Sales",
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(75,192,192,0.4)",
          hoverBorderColor: "rgba(75,192,192,1)",
          data: [65, 59, 80, 81, 56],
        },
      ],
    };

    const chartInstance = new Chart(document.getElementById(chartId), {
      type: 'bar',
      data: data,
    });

    return () => {
      chartInstance.destroy();
    };
  }, [chartId]);

  // Pass the data prop to the Bar component
  return <Bar data={{}} />;
};

export default BarGraph;
