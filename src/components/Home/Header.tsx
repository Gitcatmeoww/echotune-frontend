import React, { useState, useEffect } from 'react';
import { ITopicData } from '../../interfaces/ITopicData';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import { red } from '@mui/material/colors';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Header: React.FC = () => {
  const [topics, setTopics] = useState<ITopicData[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Separate the topics into the first three and the rest
  const firstThreeTopics = topics.slice(0, 3);
  const remainingTopics = topics.slice(3);

  useEffect(() => {
    // Get the stored token from local storage
    const token = localStorage.getItem('token');

    const fetchTopics = async () => {
      if (token) {
        try {
          // Include the token in the Authorization header
          const response = await axios.get(
            'http://localhost:8000/api/get_user_topics/',
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            },
          );
          setTopics(response.data);
        } catch (error) {
          console.error('Error fetching topics:', error);
        }
      } else {
        console.log('No token found');
      }
    };

    fetchTopics();
  }, []);

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-2">
        {/* User Avatar */}
        <Avatar sx={{ bgcolor: red[500], fontWeight: 'bold', fontSize: 18 }}>
          U
        </Avatar>
        <p className="text-base font-semibold text-white">Picked for you</p>
      </div>

      <div className="flex items-center space-x-2">
        {firstThreeTopics.map((topic) => (
          <div
            key={topic.id}
            className="flex items-center justify-center text-sm text-white py-2 px-4 rounded-full capitalize"
            style={{
              height: '36px',
              backgroundColor: '#424867',
            }}
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
                  onClick={handleClose}
                  style={{
                    fontSize: '0.875rem',
                    color: '#9ea3b8',
                  }}
                >
                  {capitalizeFirstLetter(topic.name)}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </div>

      {/* Plus Icon wrapped in a circle */}
      {/* <IconButton
        sx={{
          color: 'white',
          backgroundColor: grey[600],
          '&:hover': { backgroundColor: grey[600] },
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
