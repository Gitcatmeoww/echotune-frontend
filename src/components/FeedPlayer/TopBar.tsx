import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const TopBar = () => {
  return (
    <AppBar
      position="static"
      style={{
        background: 'white',
        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2)',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          style={{ flexGrow: 1, color: 'black', fontWeight: 'bold' }}
        >
          Competitor Research
        </Typography>
        <IconButton color="default">
          <AccountCircleIcon style={{ color: 'black' }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
