import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  IconButton,
  Popover,
  Slider,
  Typography,
  useTheme,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

interface PlayerControlsProps {
  currentSummary: string | null;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ currentSummary }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playedTime, setPlayedTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio());
  const theme = useTheme();

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener('timeupdate', handleProgress);
    audio.addEventListener('ended', handleAudioEnded);
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    return () => {
      audio.src = '';
      audio.removeEventListener('timeupdate', handleProgress);
      audio.removeEventListener('ended', handleAudioEnded);
      URL.revokeObjectURL(audio.src); // Clean up Blob URL
    };
  }, []);

  const handleProgress = () => {
    setPlayedTime(audioRef.current.currentTime);
  };

  // const handleProgress = () => {
  //   setPlayedTime(audioRef.current.currentTime);
  // };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setPlayedTime(0); // Reset the time to start
  };

  const handlePlayClick = async () => {
    console.log(currentSummary);
    if (!audioUrl && currentSummary) {
      setLoading(true);
      try {
        const response = await axios.post(
          'http://localhost:8000/api/generate_audio/',
          { articleContent: currentSummary },
          { responseType: 'blob' },
        );
        const audioBlob = response.data;
        const url = URL.createObjectURL(audioBlob);
        audioRef.current.src = url;
        setAudioUrl(url); // Update state to manage URL
        setLoading(false);
      } catch (error) {
        console.error('Error playing the audio:', error);
        setLoading(false);
      }
    }
    if (audioRef.current.src) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const styles = {
    playerBox: {
      position: 'static',
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
  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const newVolume = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(newVolume);
    audioRef.current.volume = newVolume / 100;
  };

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleVolumeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Box sx={styles.playerBox}>
        <IconButton aria-label="previous" sx={styles.iconButton}>
          <SkipPreviousIcon />
        </IconButton>
        {loading ? (
          <CircularProgress />
        ) : (
          <IconButton
            aria-label="play/pause"
            onClick={handlePlayClick}
            sx={styles.iconButton}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        )}
        <IconButton aria-label="next" sx={styles.iconButton}>
          <SkipNextIcon />
        </IconButton>
        <IconButton
          aria-label="volume"
          onClick={handleVolumeClick}
          sx={styles.iconButton}
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
      <Box
        sx={{
          marginLeft: 5,
          marginRight: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="body2" sx={{ minWidth: 35 }}>
          {formatTime(playedTime)}
        </Typography>
        <Slider
          aria-labelledby="audio-progress"
          sx={{ flex: 1, mx: 2 }}
          value={(playedTime / duration) * 100 || 0}
          onChange={(event, newValue) => {
            const newTime = ((newValue as number) / 100) * duration;
            audioRef.current.currentTime = newTime;
            setPlayedTime(newTime);
          }}
          max={100}
        />
        <Typography variant="body2" sx={{ minWidth: 35 }}>
          {formatTime(duration)}
        </Typography>
      </Box>
    </Box>
  );
};

export default PlayerControls;
