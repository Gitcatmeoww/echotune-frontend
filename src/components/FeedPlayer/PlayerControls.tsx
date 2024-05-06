import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  IconButton,
  Popover,
  Slider,
  Typography,
  useTheme,
} from '@mui/material';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import SkipNextOutlinedIcon from '@mui/icons-material/SkipNextOutlined';
import SkipPreviousOutlinedIcon from '@mui/icons-material/SkipPreviousOutlined';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import VolumeOffOutlinedIcon from '@mui/icons-material/VolumeOffOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

interface PlayerControlsProps {
  currentSummary: string | null;
  imageUrl?: string;
  title?: string;
  onNextClick: () => void;
  onPreviousClick: () => void;
}

interface AudioControlState {
  audioUrl: string | null;
  isPlaying: boolean;
  loading: boolean;
  playedTime: number;
  duration: number;
  muted: boolean;
  autoplay: boolean;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  currentSummary,
  imageUrl,
  title,
  onNextClick,
  onPreviousClick,
}) => {
  const [audioControl, setAudioControl] = useState<AudioControlState>({
    audioUrl: null,
    isPlaying: false,
    loading: false,
    playedTime: 0,
    duration: 0,
    muted: false,
    autoplay: true,
  });

  const placeholderAudioUrl = `${process.env.PUBLIC_URL}/intro2.mp3`;
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const {
    audioUrl,
    isPlaying,
    loading,
    playedTime,
    duration,
    muted,
    autoplay,
  } = audioControl;

  useEffect(() => {
    // Automatically load and play audio when currentSummary changes
    const loadAndPlayAudio = async () => {
      if (currentSummary && audioControl.autoplay && title) {
        // Set loading state and start placeholder audio
        setAudioControl((prev) => ({ ...prev, loading: true }));
        try {
          audioRef.current.src = placeholderAudioUrl;
          audioRef.current.loop = false;
          await audioRef.current
            .play()
            .catch((e) => console.error('Error playing placeholder audio:', e));

          // Fetch and prepare main audio
          const response = await axios.post(
            'http://localhost:8000/api/generate_audio/',
            { articleContent: currentSummary, articleTitle: title },
            { responseType: 'blob' },
          );
          const url = URL.createObjectURL(response.data);
          console.log('here');

          // Ensure audio element is not playing before switching source

          audioRef.current.pause();
          audioRef.current.src = url;
          audioRef.current.loop = false;
          audioRef.current.load(); // Important to reload the audio element after source change

          // Attempt to play the loaded audio
          audioRef.current.onloadedmetadata = async () => {
            try {
              await audioRef.current.play();
              setAudioControl((prev) => ({
                ...prev,
                audioUrl: url,
                isPlaying: true,
                loading: false,
                playedTime: 0,
                duration: audioRef.current.duration,
              }));
            } catch (error) {
              console.error('Error playing the main audio:', error);
              setAudioControl((prev) => ({ ...prev, loading: false }));
            }
          };
        } catch (error) {
          console.error('Error fetching or playing audio:', error);
          setAudioControl((prev) => ({ ...prev, loading: false }));
        }
      }
    };

    loadAndPlayAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, [currentSummary]);
  // const [audioUrl, setAudioUrl] = useState<string | null>(null);
  // const [isPlaying, setIsPlaying] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [playedTime, setPlayedTime] = useState(0);
  // const [duration, setDuration] = useState(0);
  // const [autoplay, setAutoplay] = useState(true);
  // const [muted, setMuted] = useState(false);

  const audioRef = useRef(new Audio());
  const theme = useTheme();

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener('loadedmetadata', () => {
      setAudioControl((prev) => ({
        ...prev,
        duration: audioRef.current.duration,
      }));

      // setDuration(audio.duration);
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
    setAudioControl((prev) => ({
      ...prev,
      duration: audioRef.current.duration,
    }));
    // setDuration(audioRef.current.duration);
  };

  // const handleProgress = () => {
  //   const currentTime = audioRef.current.currentTime;
  //   setPlayedTime(currentTime);
  // };

  const handleProgress = useCallback(() => {
    const currentTime = audioRef.current.currentTime;
    setAudioControl((prev) => ({
      ...prev,
      playedTime: currentTime,
    }));
  }, []);

  const handleAudioEnded = () => {
    setAudioControl((prev) => ({
      ...prev,
      isPlaying: false,
      playedTime: 0,
    }));
    onNextClick();

    console.log('Audio playback ended, moving to the next track.');
    // setIsPlaying(false);
    // setPlayedTime(0);
  };

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      URL.revokeObjectURL(audioRef.current.src);
    };
  }, []);

  // useEffect(() => {
  //   const playAudio = async () => {
  //     console.log('audioUrl', audioUrl);
  //     if (!audioUrl && currentSummary) {
  //       setLoading(true);
  //       console.log(imageUrl);
  //       try {
  //         const response = await axios.post(
  //           'http://localhost:8000/api/generate_audio/',
  //           { articleContent: currentSummary, articleURL: imageUrl },
  //           { responseType: 'blob' },
  //         );
  //         const audioBlob = response.data;
  //         const url = URL.createObjectURL(audioBlob);
  //         audioRef.current.src = url;
  //         setAudioUrl(url);
  //         setLoading(false);
  //         if (autoplay) {
  //           audioRef.current.play();
  //           setIsPlaying(true);
  //         }
  //       } catch (error) {
  //         console.error('Error playing the audio:', error);
  //         setLoading(false);
  //       }
  //     }
  //   };

  //   playAudio();

  //   return () => {
  //     audioRef.current.pause();
  //     audioRef.current.currentTime = 0;
  //     setIsPlaying(false);
  //     setAutoplay(false);
  //     setAudioUrl(null);
  //   };
  // }, [currentSummary]);

  // const handlePlayClick = async () => {
  //   console.log(currentSummary);
  //   if (!audioUrl && currentSummary) {
  //     setLoading(true);
  //     try {
  //       const response = await axios.post(
  //         'http://localhost:8000/api/generate_audio/',
  //         { articleContent: currentSummary },
  //         { responseType: 'blob' },
  //       );
  //       const audioBlob = response.data;
  //       const url = URL.createObjectURL(audioBlob);
  //       audioRef.current.src = url;
  //       setAudioUrl(url); // Update state to manage URL
  //       setLoading(false);
  //       audioRef.current.play();
  //       setIsPlaying(true);
  //     } catch (error) {
  //       console.error('Error playing the audio:', error);
  //       setLoading(false);
  //     }
  //   }
  //   if (audioRef.current.src) {
  //     if (isPlaying) {
  //       audioRef.current.pause();
  //     } else {
  //       audioRef.current.play();
  //     }
  //     setIsPlaying(!isPlaying);
  //   }
  // };

  const handlePlayClick = () => {
    // Toggle play or pause
    if (audioRef.current.src) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setAudioControl((prev) => ({ ...prev, isPlaying: true }));
      } else {
        audioRef.current.pause();
        setAudioControl((prev) => ({ ...prev, isPlaying: false }));
      }
    }
  };

  // const handlePlayClick = useCallback(async () => {
  //   if (!audioControl.audioUrl && currentSummary) {
  //     setAudioControl((prev) => ({ ...prev, loading: true }));
  //     try {
  //       const response = await axios.post(
  //         'http://localhost:8000/api/generate_audio/',
  //         { articleContent: currentSummary },
  //         { responseType: 'blob' },
  //       );
  //       const url = URL.createObjectURL(response.data);
  //       audioRef.current.src = url;
  //       audioRef.current.onloadedmetadata = () => {
  //         setAudioControl((prev) => ({
  //           ...prev,
  //           audioUrl: url,
  //           isPlaying: true,
  //           loading: false,
  //           playedTime: 0,
  //           duration: audioRef.current.duration,
  //           muted: prev.muted, // Maintain the current mute state
  //         }));
  //         audioRef.current.play();
  //       };
  //     } catch (error) {
  //       console.error('Error playing the audio:', error);
  //       setAudioControl((prev) => ({ ...prev, loading: false }));
  //     }
  //   } else if (audioRef.current.src) {
  //     if (audioRef.current.paused) {
  //       audioRef.current.play();
  //       setAudioControl((prev) => ({ ...prev, isPlaying: true }));
  //     } else {
  //       audioRef.current.pause();
  //       setAudioControl((prev) => ({ ...prev, isPlaying: false }));
  //     }
  //   }
  // }, [currentSummary, audioControl.audioUrl]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // const handleVolumeClick = () => {
  //   setMuted(!muted);
  //   if (!muted) {
  //     audioRef.current.volume = 0;
  //   } else {
  //     audioRef.current.volume = 1;
  //   }
  // };

  const handleVolumeClick = () => {
    setAudioControl((prev) => ({
      ...prev,
      muted: !prev.muted,
    }));
    audioRef.current.volume = muted ? 1 : 0;
  };

  // Log the change for debugging or analytics
  // console.log(`Audio is now ${audioControl.muted ? 'muted' : 'unmuted'}.`);

  // const styles = {
  //   playerBox: {
  //     position: 'static',
  //     bottom: 0,
  //     left: 0,
  //     right: 0,
  //     display: 'flex',
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     padding: '20px',
  //     gap: '24px',
  //     backgroundColor: '#252A41',
  //     boxShadow: theme.shadows[2],
  //   },
  //   iconButton: {
  //     color: '#FFFFFF',
  //   },
  // };

  // const [volume, setVolume] = useState(100);

  // const handleVolumeChange = (event: Event, newValue: number | number[]) => {
  //   const newVolume = Array.isArray(newValue) ? newValue[0] : newValue;
  //   setVolume(newVolume);
  //   audioRef.current.volume = newVolume / 100;
  // };

  // const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  // const open = Boolean(anchorEl);
  // const id = open ? 'simple-popover' : undefined;
  // const handleVolumeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  const handleSliderChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (typeof newValue === 'number') {
      const newTime = (newValue / 100) * audioControl.duration;
      audioRef.current.currentTime = newTime;

      // Update the played time in the audioControl state object
      setAudioControl((prev) => ({
        ...prev,
        playedTime: newTime,
      }));
    }
  };

  // const handleSliderChange = (
  //   event: Event,
  //   newValue: number | number[],
  //   activeThumb: number,
  // ) => {
  //   if (typeof newValue === 'number') {
  //     const newTime = (newValue / 100) * duration;
  //     audioRef.current.currentTime = newTime;
  //     setPlayedTime(newTime);
  //   }
  // };

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: '#252A41',
        padding: '2px',
        borderRadius: '12px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          // p: 1,
          bgcolor: '#252A41',
        }}
      >
        {/* Thumbnail on the left */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Article Thumbnail"
            style={{
              width: '36px',
              height: '36px',
              objectFit: 'cover',
              borderRadius: '6px',
              marginLeft: '15px',
            }}
          />
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
          }}
        >
          <IconButton
            aria-label="previous"
            onClick={onPreviousClick}
            sx={{ color: '#FFFFFF' }}
          >
            <SkipPreviousOutlinedIcon fontSize="large" />
          </IconButton>
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <IconButton
              aria-label="play/pause"
              onClick={handlePlayClick}
              sx={{ color: '#FFFFFF' }}
            >
              {isPlaying ? (
                <PauseIcon />
              ) : (
                <PlayArrowOutlinedIcon fontSize="large" />
              )}
            </IconButton>
          )}
          <IconButton
            aria-label="next"
            onClick={onNextClick}
            sx={{ color: '#FFFFFF' }}
          >
            <SkipNextOutlinedIcon fontSize="large" />
          </IconButton>
        </Box>

        {/* Volume control on the right */}
        <IconButton
          aria-label="volume"
          onClick={handleVolumeClick}
          sx={{ color: '#FFFFFF' }}
        >
          {muted ? (
            <VolumeOffOutlinedIcon fontSize="medium" />
          ) : (
            <VolumeUpOutlinedIcon fontSize="medium" />
          )}
        </IconButton>
      </Box>

      {/* <IconButton
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
        </Popover> */}
      {/* </Box> */}
      {/* Timing and Progress Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Slider
          value={playedTime}
          onChange={handleSliderChange}
          aria-labelledby="audio-progress"
          sx={{ flex: 1, mx: 3, color: '#FFFFFF' }}
          max={duration}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // minWidth: '35px',
            height: '20px',
            bgcolor: '#3B3F54',
            borderRadius: '40px',
            px: 1,
            marginRight: 1,
          }}
        >
          <Typography sx={{ minWidth: '35px', fontSize: 'small' }}>
            {/* {formatTime(duration)} */}-{formatTime(duration - playedTime)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PlayerControls;
