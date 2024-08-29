import React from 'react';
import { Box, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import Header from '../../components/Header.jsx';
import HistoryLineChart from '../../components/HistoryLineChart';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

const History = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { username } = useContext(UserContext);
  console.log(username);
  const phone = localStorage.getItem("accessToken");

  // State to store dashboard data received from the server
  const [dashboardData, setDashboardData] = useState(null);
  const userId = phone || "6648531588";

  // Function to fetch dashboard data from the server
  const fetchDashboardData = () => {
    // Replace with your actual API endpoint to fetch the dashboard data
    fetch(`https://brewiy-back.vercel.app/api/users/${userId}/filtered`)
      .then((response) => response.json())
      .then((data) => {
        // Reverse the order of data to show the newest chart first
        const reversedData = data.data.reverse();
        setDashboardData(reversedData);
      })
      .catch((error) => console.error('Error fetching dashboard data:', error));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // If dashboardData is not available, display "Loading..."
  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  const DEL = {
    phone: `${userId}`,
  };

  const deleteAllCharts = () => {
    axios.post('https://brewiy-back.vercel.app/api/deleteAllCharts', DEL)
      .then((response) => {
        console.log(response.data.message);
        // Update state to remove all charts
        setDashboardData([]);
      })
      .catch((error) => {
        console.error('Error deleting charts:', error);
      });
  }


  const handleDeleteChart = (indexToDelete) => {
    // Update state to remove the deleted chart
    setDashboardData((prevData) => {
      const updatedData = [...prevData];
      updatedData.splice(indexToDelete, 1);
      return updatedData;
    });
  };
  console.log({username})

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="History" subtitle="Welcome to your History" />
        <button style={{background:'#B73E3E',color:'#fff',fontWeight:'bold'}} onClick={deleteAllCharts}>DROP ALL CHARTS</button>
      </Box>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px">
        {dashboardData.map((dataObj, index) => (
          <Box key={index} gridColumn="span 12">
            {dataObj.StartDateTime && (
              <Box mt={3}>
                <HistoryLineChart
                  data={dataObj.ArrayHistory}
                  index={index}
                  startDateTime={dataObj.StartDateTime}
                  userId={userId}
                  onDeleteChart={() => handleDeleteChart(index)}
                />
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default History;
