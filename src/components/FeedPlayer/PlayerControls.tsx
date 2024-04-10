import React from 'react';
import { IconButton, Box } from '@mui/material';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';

const PlayerControls = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
        gap: '24px', // adjust the spacing between the button groups
      }}
    >
      {/* Group of three buttons */}
      <IconButton aria-label="Previous">
        <SkipPreviousIcon />
      </IconButton>
      <IconButton aria-label="Play/Pause">
        <PlayArrowIcon />
      </IconButton>
      <IconButton aria-label="Next">
        <SkipNextIcon />
      </IconButton>

      {/* Separation for the second group of buttons */}
      <Box sx={{ width: '48px' }} />

      {/* Group of two buttons */}
      <IconButton aria-label="Like">
        <FavoriteIcon />
      </IconButton>
      <IconButton aria-label="Pause">
        <PauseCircleOutlineIcon />
      </IconButton>
    </Box>
  );
};

export default PlayerControls;
