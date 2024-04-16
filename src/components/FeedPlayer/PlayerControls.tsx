import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Popover, Slider, useTheme } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import axios from 'axios';

interface PlayerControlsProps {
  currentSummary: string | null;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ currentSummary }) => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const theme = useTheme();

  useEffect(() => {
    return () => {
      audioRef.current.src = '';
    };
  }, []);

  const handlePlayClick = async () => {
    if (!audioUrl && currentSummary) {
      try {
        const response = await axios.post(
          'http://localhost:8000/api/generate_audio/',
          {
            articleContent: currentSummary,
          },
          {
            responseType: 'blob',
          },
        );
        const audioBlob = response.data;

        const url = URL.createObjectURL(audioBlob);
        audioRef.current.src = url;
        // setAudioUrl(url);
      } catch (error) {
        console.error('Error playing the audio:', error);
      }
    }
    if (audioRef.current.src) {
      if (isPlaying) {
        console.log('pause');
        audioRef.current.pause();
      } else {
        console.log('play');
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Custom styles to match the uploaded image
  const styles = {
    playerBox: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '10px',
      gap: '24px',
      backgroundColor: '#252A41',
      boxShadow: theme.shadows[2],
    },
    iconButton: {
      color: '#FFFFFF',
    },
  };

  const [volume, setVolume] = useState(100);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleVolumeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const newVolume = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={styles.playerBox}>
      <IconButton aria-label="previous" sx={styles.iconButton}>
        <SkipPreviousIcon />
      </IconButton>
      <IconButton
        aria-label="play/pause"
        onClick={handlePlayClick}
        sx={styles.iconButton}
      >
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <IconButton aria-label="next" sx={styles.iconButton}>
        <SkipNextIcon />
      </IconButton>

      <IconButton
        aria-label="volume"
        sx={styles.iconButton}
        onClick={handleVolumeClick}
      >
        <VolumeUpIcon />
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Box sx={{ height: 100, marginTop: 2, marginBottom: 2 }}>
          <Slider
            orientation="vertical"
            value={volume}
            onChange={handleVolumeChange}
            aria-labelledby="vertical-slider"
            sx={{ height: '100%' }}
          />
        </Box>
      </Popover>
    </Box>
  );
};

export default PlayerControls;
