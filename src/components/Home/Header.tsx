import React, { useState, useEffect } from 'react';
import { ITopicData } from '../../interfaces/ITopicData';
import { IHashtagData } from '../../interfaces/IHashtagData';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import { red } from '@mui/material/colors';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ResponsiveText } from 'react-responsive-text';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import HashtagDrawer from './HashtagDrawer';

// interface HeaderProps {
//   onTopicSelect: (topic: string) => void;
//   selectedTopic: string | null;
// }

interface HeaderProps {
  onHashtagSelect: (hashtag: string) => void;
  selectedHashtag: string | null;
}

const Header: React.FC<HeaderProps> = ({
  onHashtagSelect,
  selectedHashtag,
}) => {
  const navigate = useNavigate();

  //   const [topics, setTopics] = useState<ITopicData[]>([]);
  const [hashtags, setHashtags] = useState<IHashtagData[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Separate the topics into the first three and the rest
  //   const firstThreeTopics = topics.slice(0, 3);
  //   const remainingTopics = topics.slice(3);
  // Separate the hashtags into the first three and the rest
  const firstThreeHashtags = hashtags.slice(0, 3);
  const remainingHashtags = hashtags.slice(3);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hashtagDrawerOpen, setHashtagDrawerOpen] = useState(false);

  const handleHashtagDrawerOpen = () => {
    setHashtagDrawerOpen(true);
  };

  const handleHashtagDrawerClose = () => {
    setHashtagDrawerOpen(false);
  };

  const handleAvatarClick = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleAddClick = () => {
    navigate('/learning-goal'); // Replace with your desired route
  };

  //   useEffect(() => {
  //     // Get the stored token from local storage
  //     const token = localStorage.getItem('token');

  //     const fetchTopics = async () => {
  //       if (token) {
  //         try {
  //           // Include the token in the Authorization header
  //           const response = await axios.get(
  //             'http://localhost:8000/api/get_user_topics/',
  //             {
  //               headers: {
  //                 Authorization: `Token ${token}`,
  //               },
  //             },
  //           );
  //           setTopics(response.data);
  //         } catch (error) {
  //           console.error('Error fetching topics:', error);
  //         }
  //       } else {
  //         console.log('No token found');
  //       }
  //     };

  //     fetchTopics();
  //   }, []);
  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchHashtags = async () => {
      if (token) {
        try {
          const response = await axios.get(
            'http://localhost:8000/api/get_user_hashtags/',
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            },
          );
          setHashtags(response.data);
        } catch (error) {
          console.error('Error fetching hashtags:', error);
        }
      } else {
        console.log('No token found');
      }
    };

    fetchHashtags();
  }, []);

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleHashtagDrawerOpen(); // Open the drawer when MoreHorizIcon is clicked
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar
            sx={{ bgcolor: red[500], fontWeight: 'bold', fontSize: 18 }}
            onClick={handleAvatarClick}
          >
            U
          </Avatar>
          <p className="text-base font-semibold text-white">Picked for you</p>
        </div>
        <AddIcon onClick={handleAddClick} />
      </div>

      <NavBar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

      {/* <div className="flex items-center space-x-2">
        {firstThreeTopics.map((topic) => (
          <div
            key={topic.id}
            className="flex items-center justify-center text-white text-sm py-2 px-4 rounded-full capitalize"
            style={{
              fontSize: 10,
              height: '36px',
              backgroundColor:
                topic.name === selectedTopic ? '#2563EB' : '#424867',
              lineHeight: '1.2',
            }}
            onClick={() => onTopicSelect(topic.name)}
          >
            {capitalizeFirstLetter(topic.name)}
          </div>
        ))}

        {remainingTopics.length > 0 && (
          <>
            <IconButton
              className="flex items-center justify-center rounded-full"
              style={{
                height: '36px',
                width: '36px',
                backgroundColor: '#424867',
              }}
              onClick={handleMoreClick}
            >
              <MoreHorizIcon sx={{ color: 'white' }} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'more-button',
                dense: true,
              }}
            >
              {remainingTopics.map((topic) => (
                <MenuItem
                  key={topic.id}
                  onClick={() => {
                    handleClose();
                    onTopicSelect(topic.name);
                  }}
                  style={{
                    fontSize: '0.7rem',
                    color: '#9ea3b8',
                    backgroundColor:
                      topic.name === selectedTopic ? '#2563EB' : 'white',
                  }}
                >
                  {capitalizeFirstLetter(topic.name)}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </div> */}

      <div className="flex items-center space-x-2">
        {firstThreeHashtags.map((hashtag) => (
          <div
            key={hashtag.id}
            className="flex items-center justify-center text-white text-sm py-2 px-4 rounded-full capitalize"
            style={{
              fontSize: 10,
              height: '36px',
              backgroundColor:
                hashtag.name === selectedHashtag ? '#2563EB' : '#424867',
              lineHeight: '1.2',
            }}
            onClick={() => onHashtagSelect(hashtag.name)}
          >
            {capitalizeFirstLetter(hashtag.name)}
          </div>
        ))}

        {remainingHashtags.length > 0 && (
          <>
            <IconButton
              className="flex items-center justify-center rounded-full"
              style={{
                height: '36px',
                width: '36px',
                backgroundColor: '#424867',
              }}
              onClick={handleMoreClick}
            >
              <MoreHorizIcon sx={{ color: 'white' }} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'more-button',
                dense: true,
              }}
            >
              {remainingHashtags.map((hashtag) => (
                <MenuItem
                  key={hashtag.id}
                  onClick={() => {
                    handleClose();
                    onHashtagSelect(hashtag.name);
                  }}
                  style={{
                    fontSize: '0.7rem',
                    color: '#9ea3b8',
                    backgroundColor:
                      hashtag.name === selectedHashtag ? '#2563EB' : 'white',
                  }}
                >
                  {capitalizeFirstLetter(hashtag.name)}
                </MenuItem>
              ))}
            </Menu>

            <HashtagDrawer
              open={hashtagDrawerOpen}
              onClose={handleHashtagDrawerClose}
              hashtags={hashtags}
              onHashtagSelect={onHashtagSelect}
              selectedHashtag={selectedHashtag}
            />
          </>
        )}
      </div>

      {/* <IconButton
        sx={{
          color: 'white',
          backgroundColor: '#424867',
          '&:hover': { backgroundColor: '#424867' },
          width: 36, // Match size with the Avatar
          height: 36, // Match size with the Avatar
        }}
      >
        <AddIcon />
      </IconButton> */}
    </div>
  );
};

export default Header;
