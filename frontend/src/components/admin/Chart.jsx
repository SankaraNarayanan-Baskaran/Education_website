import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { config } from "../../App";
const ChartComponent = () => {
  const [chartData, setChartData] = useState({
    labels: ["June", "May", "April"],
    series: [71, 63, 77],
  });
  const [barChart, setBarChart] = useState({
    labels: [],
    series: [],
  });
  const fetchData = async (username) => {
    try {
      const response = await axios.get(`${config.endpoint}/admin/data`, {
        withCredentials:true
      });

      if (response && response.data) {
        const data = response.data;

        const courseCounts = data.reduce((acc, entry) => {
          const courseName = entry.course_name;
          acc[courseName] = (acc[courseName] || 0) + 1;
          return acc;
        }, {});
        console.log(courseCounts);
        const newBarChart = {
          labels: Object.keys(courseCounts),
          series: Object.values(courseCounts),
        };
        console.log(newBarChart.labels, newBarChart.series);
        setBarChart(newBarChart);
        setChartOptions((prevOptions) => ({
          ...prevOptions,
          series: [
            {
              name: "Courses",
              data: newBarChart.series, // Use dynamic data here
            },
          ],
          xaxis: {
            ...prevOptions.xaxis,
            categories: newBarChart.labels, // Use dynamic data here
          },
        }));

        console.log("167", newBarChart);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [chartOptions, setChartOptions] = useState({
    chart: {
      height: 450,
      width: "100%",
      type: "bar",
      background: "#f4f4f4",
      foreColor: "black",
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    yaxis: {
      title: {
        text: "Number of Students",
        style: {
          color: "black",
        },
      },
      labels: {
        formatter: function (value) {
          return value.toFixed(0);
        },
        style: {
          colors: "black",
        },
      },
    },
    series: [
      {
        name: "Courses",
        data: barChart.series,
      },
    ],
    xaxis: {
      title: {
        text: "Courses",
        style: {
          color: "black",
        },
      },
      categories: barChart.labels,
    },
    fill: {
      colors: ["#F44336"],
    },
    dataLabels: {
      enabled: false,
    },
    title: {
      text: "Frequently Purchased Courses",
      align: "center",
      margin: 20,
      offsetY: 20,
      style: {
        fontSize: "25px",
      },
    },
  });

  const options = {
    chart: {
      type: "radialBar",
      height: 350,
      width: "100%",
    },
    plotOptions: {
      radialBar: {
        size: undefined,
        inverseOrder: true,
        hollow: {
          margin: 5,
          size: "48%",
          background: "transparent",
        },
        track: {
          show: false,
        },
        startAngle: -180,
        endAngle: 180,
      },
    },
    stroke: {
      lineCap: "round",
    },
    series: chartData.series,
    labels: chartData.labels,
    legend: {
      show: true,
      floating: true,
      position: "right",
      offsetX: 70,
      offsetY: 240,
    },
  };
  const handleDataChange = () => {
    setChartData((prevData) => ({
      ...prevData,
      series: prevData.series.map(() => Math.floor(Math.random() * 100)),
    }));
  };
  const handleOrientationChange = () => {
    setChartOptions((prevOptions) => {
      const newOptions = {
        ...prevOptions,
        plotOptions: {
          bar: {
            horizontal: !prevOptions.plotOptions.bar.horizontal,
          },
        },
      };

      
      newOptions.yaxis.labels = {
        formatter: function (value) {
          return parseFloat(value).toFixed(0);
        },
        style: {
          colors: "black",
        },
      };
      console.log("Current x-axis categories:", newOptions.xaxis.categories);
      newOptions.xaxis.categories = barChart.labels;
      console.log("182",barChart.labels)
      console.log("Updated x-axis categories:", newOptions.xaxis.categories);

      return newOptions;
    });
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    fetchData(username);
  }, []);
  

  return (
    <div>
      <ReactApexChart
        options={chartOptions}
        series={chartOptions.series}
        type="bar"
        height={450}
      />
      <button onClick={handleOrientationChange}>Change Orientation</button>
      <ReactApexChart
        options={options}
        series={options.series}
        type="radialBar"
        height={450}
      />

      <button onClick={handleDataChange}>Change Data</button>
    </div>
  );
};

export default ChartComponent;
