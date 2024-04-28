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
  imageUrl?: string;
  onNextClick: () => void;
  onPreviousClick: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  currentSummary,
  imageUrl,
  onNextClick,
  onPreviousClick,
}) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playedTime, setPlayedTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const audioRef = useRef(new Audio());
  const theme = useTheme();

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('timeupdate', handleProgress);
    audio.addEventListener('ended', handleAudioEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleMetadata);
      audio.removeEventListener('timeupdate', handleProgress);
      audio.removeEventListener('ended', handleAudioEnded);
      URL.revokeObjectURL(audio.src);
    };
  }, []);

  const handleMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleProgress = () => {
    const currentTime = audioRef.current.currentTime;
    setPlayedTime(currentTime);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setPlayedTime(0);
  };

  useEffect(() => {
    const playAudio = async () => {
      console.log('audioUrl', audioUrl);
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
          setAudioUrl(url);
          setLoading(false);
          if (autoplay) {
            audioRef.current.play();
            setIsPlaying(true);
          }
        } catch (error) {
          console.error('Error playing the audio:', error);
          setLoading(false);
        }
      }
    };

    playAudio();

    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setAutoplay(false);
      setAudioUrl(null);
    };
  }, [currentSummary]);

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
        audioRef.current.play();
        setIsPlaying(true);
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
      padding: '20px',
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

  const handleSliderChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (typeof newValue === 'number') {
      const newTime = (newValue / 100) * duration;
      audioRef.current.currentTime = newTime;
      setPlayedTime(newTime);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: '#252A41',
        padding: '10px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Article Thumbnail"
            style={{ width: '36px', height: '36px', objectFit: 'cover' }}
          />
        )}
        <IconButton
          aria-label="previous"
          sx={{ color: '#FFFFFF' }}
          onClick={onPreviousClick}
        >
          <SkipPreviousIcon />
        </IconButton>
        {loading ? (
          <CircularProgress />
        ) : (
          <IconButton
            aria-label="play/pause"
            onClick={handlePlayClick}
            sx={{ color: '#FFFFFF' }}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        )}
        <IconButton
          aria-label="next"
          sx={{ color: '#FFFFFF' }}
          onClick={onNextClick}
        >
          <SkipNextIcon />
        </IconButton>
        <IconButton
          aria-label="volume"
          sx={{ color: '#FFFFFF' }}
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
      {/* Timing and Progress Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: '35px',
            height: '20px',
            bgcolor: '#3B3F54',
            borderRadius: '40px',
            px: 1,
          }}
        >
          <Typography sx={{ minWidth: '35px', fontSize: 'small' }}>
            {formatTime(playedTime)}
          </Typography>
        </Box>
        <Slider
          value={playedTime}
          onChange={handleSliderChange}
          aria-labelledby="audio-progress"
          sx={{ flex: 1, mx: 2 }}
          max={duration}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: '35px',
            height: '20px',
            bgcolor: '#3B3F54',
            borderRadius: '40px',
            px: 1,
          }}
        >
          <Typography sx={{ minWidth: '35px', fontSize: 'small' }}>
            {/* {formatTime(duration)} */}
            {formatTime(duration - playedTime)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PlayerControls;
