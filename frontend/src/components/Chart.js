import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const ChartComponent = () => {
  const [chartData, setChartData] = useState({
    labels: ["June", "May", "April"],
    series: [71, 63, 77],
  });
  const [circle, setCircle] = useState({
    chart: {
      height: 380,
      type: "bar",
      stacked: true,
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
        horizontal: false,
      },
    },
    series: [
      {
        name: "PRODUCT A",
        data: [14, 25, 21, 17, 12, 13, 11, 19],
      },
      {
        name: "PRODUCT B",
        data: [13, 23, 20, 8, 13, 27, 33, 12],
      },
      {
        name: "PRODUCT C",
        data: [11, 17, 15, 15, 21, 14, 15, 13],
      },
    ],
    xaxis: {
      categories: [
        "2011 Q1",
        "2011 Q2",
        "2011 Q3",
        "2011 Q4",
        "2012 Q1",
        "2012 Q2",
        "2012 Q3",
        "2012 Q4",
      ],
    },
    fill: {
      opacity: 1,
    },
  });
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
    yaxis:{
      title: {
        text: 'Number of Students',
        style: {
          color: 'black', // Optional: You can customize the color
       } },
       labels: {
        formatter: function (value) {
          // Use the toFixed method to remove decimals
          return value.toFixed(0);
        },
        style: {
          colors: 'black',
        },
      },
    },
    
    series: [
      {
        name: "Courses",
        data: [
          4,2,3,1
        ],
      },
    ],
    xaxis: {
      title: {
        text: 'Courses',
        style: {
          color: 'black', // Optional: You can customize the color
       } },
      categories: [
        "mycourse",
        "tech course",
        "social course",
        "Machine Learning",
        
      ],
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
  
      // Update yaxis labels formatter when changing orientation
      newOptions.yaxis.labels = {
        formatter: function (value) {
          return parseFloat(value).toFixed(0);
        },
        style: {
          colors: 'black',
        },
      };
  
      return newOptions;
    });
  
  
  };

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
