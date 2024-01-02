import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const BarGraph = () => {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: ["January", "February", "March", "April", "May"],
      },
    },
    series: [
      {
        name: "Sales",
        data: [65, 59, 80, 81, 56],
      },
    ],
  });

  return (
    <div>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default BarGraph;
