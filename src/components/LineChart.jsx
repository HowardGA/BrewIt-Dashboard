import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const LineChart = () => {
  const [seriesData, setSeriesData] = useState([]);
  const [startDateTime, setStartDateTime] = useState(''); // State to store StartDateTime
  const phone = localStorage.getItem("accessToken");

  const userId = phone ||"6648531588";

  const fetchData = () => {
    // Replace this with the actual API endpoint to fetch the data
    fetch(`https://brewiy-back.vercel.app/api/users/${userId}`)
      .then(response => response.json())
      .then(data => {
        // Assuming the data array is already sorted by date in ascending order, you can get the last item directly
        const lastItem = data.data[data.data.length - 1];

        // Process the last item and generate the series array for Highcharts
        const processedData = lastItem.ArrayHistory.map(item => ({
          x: new Date(item.DATE_TIME).getTime(),
          y: item.T,
        }));
        setSeriesData(processedData);
        // Set the StartDateTime
        const startDate = new Date(lastItem.StartDateTime);
        setStartDateTime(startDate.toLocaleDateString()); // Format the date to display only the date portion
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchData(); // Fetch data initially

    const interval = setInterval(() => {
      fetchData(); // Fetch data at specified interval (every 1 minute)
    }, 10000);

    return () => {
      clearInterval(interval); // Clean up the interval on component unmount
    };
  }, []);

  const chartOptions = {
    chart: {
      type: 'spline',
      backgroundColor: '#B73E3E', // Set the background color to a dark color
    },
    title: {
      text: `Temperature from Brewer- ${startDateTime}`,
      style: {
        color: '#FFF', // Set the text color to white
      },
    },
    subtitle: {
      text: 'BrewIt!',
      style: {
        color: '#DDD', // Set the text color to a light color
      },
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Time',
        style: {
          color: '#DDD', // Set the text color to a light color
        },
      },
      labels: {
        style: {
          color: '#DDD', // Set the text color to a light color
        },
        formatter: function () {
          const date = new Date(this.value);
          const time = date.toLocaleTimeString();
          return time;
        },
      },
    },
    yAxis: {
      title: {
        text: 'Temperature (\u00B0 C)',
        style: {
          color: '#DDD', // Set the text color to a light color
        },
      },
      labels: {
        format: '{text}\u00B0',
        style: {
          color: '#DDD', // Set the text color to a light color
        },
      },
    },
    tooltip: {
      formatter: function () {
        const temperature = this.y.toFixed(2);
        const time = new Date(this.x).toLocaleTimeString();
        return `Time: ${time}<br>Temperature: ${temperature}\u00B0C`;
      },
    },
    plotOptions: {
      spline: {
        dataLabels: {
          enabled: false,
        },
        marker: {
          enabled: false,
        },
      },
    },
    series: [
      {
        name: 'Temperature',
        data: seriesData,
        color: '#F1C93B',
        lineWidth: 3, // Set the series color to green
      },
    ],
    scrollbar: {
      enabled: true, // Enable the scrollbar
    },
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default LineChart;
