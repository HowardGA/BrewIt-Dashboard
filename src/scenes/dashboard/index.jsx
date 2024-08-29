import React, { useState, useEffect, useContext } from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header.jsx";
import StatBox from "../../components/StatBox";
import LineChart from "../../components/LineChart";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WaterIcon from "@mui/icons-material/Water";
import SportsBarIcon from "@mui/icons-material/SportsBar";
import CheckList from "@mui/icons-material/Checklist";
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import Countdown from "../../components/CountDown";
import DurationComp from "../../components/duration";
import { UserContext } from '../../context/UserContext';
import { useLocation } from 'react-router-dom';
import { useParams } from "react-router-dom";



const Dashboard = () => {
  const { phone } = useParams();
  let refreshTimer = false;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const degreeSymbol = "\u00B0";
  

  //const { duration } = useContext(DurationContext);
  const [duration, setDuration] = useState(null);
  const [countdownActive, setCountdownActive] = useState(false);

  // State to store dashboard data received from the server
  const [dashboardData, setDashboardData] = useState([]);
  const [brewDuration, setBrewDuration] = useState(Date.now() + 100000);

  const [mode, setMode] = useState('');
  const [beer, setBeer] = useState('');
  const [ingredients, setIngredients] = useState('');
  const phone2 = localStorage.getItem("accessToken");
  
  const userId = phone || phone2;


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://brewiy-back.vercel.app/api/users/${userId}`);
        const userData = await response.json();

        // Fetch the last duration from the data array
        if (userData && userData.data && userData.data.length > 0) {
          const lastData = userData.data[userData.data.length - 1];
          const lastDuration = lastData.duration;

          if (lastData.mode) {
            setMode(lastData.mode);
          }
          if (lastData.beer) {
            setBeer(lastData.beer);
          }
          if (lastData.ingredients) {
            setIngredients(lastData.ingredients);
          }
          
          //Only update the duration state if it's different from the previous duration
          if (duration !== lastDuration) {
            setDuration(lastDuration);
            setBrewDuration(Date.now()+lastDuration);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Fetch user data initially and set up a repeating fetch with a 1-minute interval
    fetchUserData();
    const interval = setInterval(fetchUserData, 60000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [duration]);

  // Function to fetch dashboard data from the server
  const fetchDashboardData = () => {
    fetch(`https://brewiy-back.vercel.app/api/users/${userId}`) // Replace with the actual phone number
      .then((response) => response.json())
      .then((data) => {
        setDashboardData(data?.data || [])
      })
      .catch((error) => console.error("Error fetching dashboard data:", error));
  };

  // UseEffect to fetch dashboard data on component mount and every 10 seconds
  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // If dashboardData is not available, display "Loading..."
  if (!dashboardData) {
    return <div>Loading...</div>;
  }
//add         window.location.reload(); when the BP is Starting

  
  // Extract the latest historical data from the array
  const latestHistoricalData = dashboardData.length > 0 ? dashboardData[dashboardData.length - 1].ArrayHistory || [] : [];
  const latestData = latestHistoricalData.length > 0 ? latestHistoricalData[latestHistoricalData.length - 1] : {};
  const { T, WP, BP, BTemp } = latestData;

  if (BP === 'STARTING' && !countdownActive) {
    setCountdownActive(true); // Start the countdown
  } else if (BP === 'FINISH' && countdownActive) {
    setCountdownActive(false); // Stop the countdown
  }

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your Dashboard" />
        <Typography variant="body1" style={{ color: colors.primary[400], fontSize: 30 }}>
          Countdown Timer:ㅤ
          <Countdown countdownDate={brewDuration}/>
          <DurationComp/>
        </Typography>        
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        {/* StatBox component showing current temperature */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${T || ""}${degreeSymbol}`}
            subtitle="Current Temperature"
            progress="0.75"
            icon={
              <ThermostatIcon
                sx={{ color: colors.greenAccent[700], fontSize: "26px" }}
              />
            }
          />
        </Box>
        {/* StatBox component showing water pump status */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${WP || ""}`}
            subtitle="Water Pump"
            progress="0.60"
            icon={
              <WaterIcon
                sx={{ color: colors.greenAccent[700], fontSize: "26px" }}
              />
            }
          />
        </Box>
        {/* StatBox component showing brewing process status */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${BP || ""}`}
            subtitle="Brewing Process"
            progress="0.30"
            icon={
              <SportsBarIcon
                sx={{ color: colors.greenAccent[700], fontSize: "26px" }}
              />
            }
          />
        </Box>
        {/* StatBox component showing brewing temperature */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${BTemp || ""}${degreeSymbol}`}
            subtitle="Setpoint"
            progress="0.80"
            icon={
              <ThermostatIcon
                sx={{ color: colors.greenAccent[700], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${beer || ""}`}
            subtitle="Beer"
            progress="0.80"
            icon={
              <SportsBarIcon
                sx={{ color: colors.greenAccent[700], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${mode || ""}`}
            subtitle="Running Mode"
            progress="0.80"
            icon={
              <SettingsSuggestIcon
                sx={{ color: colors.greenAccent[700], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 6"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${ingredients || ""}`}
            subtitle="Ingredients"
            progress="0.80"
            icon={
              <CheckList
                sx={{ color: colors.greenAccent[700], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          gridRow="span 3"
          backgroundColor={colors.primary[800]}
        >
          <Box height="250px" m="20px 0 0 0">
            {/* This is where the line chart goes */}
            <LineChart />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
