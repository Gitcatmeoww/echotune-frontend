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
      // boxShadow: theme.shadows[2],
    },
    iconButton: {
      color: '#FFFFFF',
    },
  };

  const [volume, setVolume] = useState(100); // Assuming 100 is the max volume
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // const handleVolumeChange = (event: Event, newValue: number | number[]) => {
  //   // If the Slider component allows for a range, newValue could be an array. We expect a single value.
  //   const newVolume = Array.isArray(newValue) ? newValue[0] : newValue;
  //   setVolume(newVolume);
  //   if (audioRef.current) {
  //     audioRef.current.volume = newVolume / 100; // Normalize the volume to a 0-1 range
  //   }
  // };

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
// import React, { useState } from 'react';
// import { Box, IconButton, Slider, useTheme } from '@mui/material';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import PauseIcon from '@mui/icons-material/Pause';
// import SkipNextIcon from '@mui/icons-material/SkipNext';
// import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
// import VolumeUpIcon from '@mui/icons-material/VolumeUp';

// import axios from 'axios';

// interface PlayerControlsProps {
//   currentSummary: string | null;
// }

// const PlayerControls: React.FC<PlayerControlsProps> = ({ currentSummary }) => {
//   const [audioUrl, setAudioUrl] = useState<string | null>(null);

//   const handlePlayClick = async () => {
//     if (currentSummary) {
//       try {
//         const response = await axios.post(
//           'http://localhost:8000/api/generate_audio/',
//           {
//             articleContent: currentSummary,
//           },
//           { responseType: 'blob' },
//         );

//         const audioBlob = response.data;
//         const url = URL.createObjectURL(audioBlob);
//         setAudioUrl(url);
//       } catch (error) {
//         console.error('Error playing the audio:', error);
//       }
//     }
//   };

//   return (
//     <Box
//       sx={{
//         position: 'fixed',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: '10px',
//         gap: '24px',
//       }}
//     >
//       {audioUrl ? (
//         <audio src={audioUrl} controls autoPlay />
//       ) : (
//         <IconButton aria-label="play" onClick={handlePlayClick}>
//           <PlayArrowIcon fontSize="small" />
//         </IconButton>
//       )}
//     </Box>
//   );
// };

// export default PlayerControls;

// -----------works ---------------

// import React from 'react';
// import { IconButton, Box } from '@mui/material';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import axios from 'axios';

// // Define the props interface
// interface PlayerControlsProps {
//   currentSummary: string | null;
// }

// const PlayerControls: React.FC<PlayerControlsProps> = ({ currentSummary }) => {
//   const playAudio = async (summary: string): Promise<string> => {
//     try {
//       const response = await axios.post(
//         'http://localhost:8000/api/generate_audio/',
//         {
//           articleContent: summary,
//         },
//       );
//       return response.data.audioFilePath; // Return the audioFilePath from the response
//     } catch (error) {
//       console.error('Error playing the audio:', error);
//       throw error; // Re-throw the error to handle it outside
//     }
//   };

//   const playAudioFile = (audioFilePath: string) => {
//     console.log(audioFilePath);
//     const audio = new Audio(audioFilePath);
//     audio.play();
//   };

//   const handlePlayClick = async () => {
//     if (currentSummary) {
//       try {
//         const audioFilePath: string = await playAudio(currentSummary); // Wait for the audio file path
//         console.log('E:\\echotune-backend\\echotune\\' + audioFilePath);
//         const audio = new Audio(audioFilePath);
//         console.log('here');

//         audio.play();
//       } catch (error) {
//         console.error('Error playing the audio:', error);
//       }
//     }
//   };

//   return (
//     <Box
//       sx={{
//         position: 'fixed',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: '10px',
//         gap: '24px',
//       }}
//     >
//       <IconButton aria-label="play" onClick={handlePlayClick}>
//         <PlayArrowIcon fontSize="small" />
//       </IconButton>
//     </Box>
//   );
// };

// export default PlayerControls;

// // import React, { useRef } from 'react';
// // import axios from 'axios';
// // import { IconButton, Box } from '@mui/material';
// // import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
// // import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// // import SkipNextIcon from '@mui/icons-material/SkipNext';
// // import FavoriteIcon from '@mui/icons-material/Favorite';
// // import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';

// // // const handlePlayClick = async () => {
// // //   try {
// // //     const response = await axios.post('http://localhost:8000/api/play_audio/');
// // //     console.log(response.data);
// // //     // Additional logic after successful API call
// // //   } catch (error) {
// // //     console.error('Error making the API call:', error);
// // //   }
// // // };

// // const PlayerControls = () => {
// //   const audioRef = useRef(new Audio('/static/audio/output.mp3'));
// //   console.log('here');

// //   const handlePlayClick = () => {
// //     audioRef.current.play();
// //   };

// //   const handlePauseClick = () => {};

// //   return (
// //     <Box
// //       sx={{
// //         position: 'fixed',
// //         bottom: 0,
// //         left: 0,
// //         right: 0,
// //         display: 'flex',
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         padding: '10px',
// //         gap: '24px', // adjust the spacing between the button groups
// //       }}
// //     >
// //       {/* <IconButton aria-label="Play" onClick={handlePlayClick}>
// //       <PlayArrowIcon />
// //     </IconButton>
// //     <IconButton aria-label="Pause" onClick={handlePauseClick}>
// //       <PauseCircleOutlineIcon />
// //     </IconButton> */}

// //       {/* Group of three buttons */}
// //       <IconButton aria-label="Previous">
// //         <SkipPreviousIcon />
// //       </IconButton>
// //       <IconButton aria-label="play" onClick={() => handlePlayClick()}>
// //         <PlayArrowIcon fontSize="small" />
// //       </IconButton>

// //       {/* <IconButton aria-label="Play/Pause" onClick={handlePlayClick}>
// //         <PlayArrowIcon />
// //       </IconButton> */}
// //       <IconButton aria-label="Next">
// //         <SkipNextIcon />
// //       </IconButton>

// //       {/* Separation for the second group of buttons */}
// //       <Box sx={{ width: '48px' }} />

// //       {/* Group of two buttons */}
// //       <IconButton aria-label="Like">
// //         <FavoriteIcon />
// //       </IconButton>
// //       <IconButton aria-label="Pause" onClick={handlePauseClick}>
// //         <PauseCircleOutlineIcon />
// //       </IconButton>
// //     </Box>
// //   );
// // };

// // export default PlayerControls;
