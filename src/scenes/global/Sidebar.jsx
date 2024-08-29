// Topper.js

import React, { useState } from 'react';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import './Sidebar.css';
import { tokens } from '../../theme';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <div
      className={`topper-item ${selected === title ? 'active' : ''}`}
      onClick={() => setSelected(title)}
    >
      <Link to={to}>
        {icon}
        <Typography>{title}</Typography>
      </Link>
    </div>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState('Dashboard');

  const handleIconClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`topper ${isCollapsed ? 'collapsed' : ''}`}>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Typography variant="h3" color={colors.primary[400]}>
          BrewIt!
        </Typography>
        <IconButton onClick={handleIconClick}>
          <MenuOutlinedIcon />
        </IconButton>
      </Box>
      {!isCollapsed && (
        <Box mb="25px">
          {/* Your profile image and name */}
        </Box>
      )}

      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        <Item
          title="Dashboard"
          to="/"
          icon={<HomeOutlinedIcon />}
          selected={selected}
          setSelected={setSelected}
        />

        <Typography
          variant="h6"
          color={colors.grey[500]}
          sx={{ m: '15px 0 5px 20px' }}
        >
          Data
        </Typography>
        <Item
          title="History"
          to="/history"
          icon={<ReceiptOutlinedIcon />}
          selected={selected}
          setSelected={setSelected}
        />
      </Box>
    </div>
  );
};

export default Sidebar;