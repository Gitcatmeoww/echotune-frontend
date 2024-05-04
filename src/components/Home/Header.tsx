import React, { useState, useEffect } from 'react';
import { ITopicData } from '../../interfaces/ITopicData';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import { red } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [topics, setTopics] = useState<ITopicData[]>([]);
  const navigate = useNavigate();

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

  const handleAddTopic = () => {
    navigate('/learning-goal');
  };

  return (
    <div className="flex items-center justify-start p-4 space-x-2 text-sm font-medium">
      {/* User Avatar */}
      <Avatar sx={{ bgcolor: red[500], fontWeight: 'bold', fontSize: 18 }}>
        U
      </Avatar>

      {/* Topics */}
      {topics.map((topic) => (
        <div
          key={topic.id}
          className="flex items-center justify-center bg-gray-700 text-white py-2 px-4 rounded-full capitalize"
          style={{ height: '36px' }} // Match height with the Avatar size
        >
          {capitalizeFirstLetter(topic.name)}
        </div>
      ))}

      {/* Plus Icon wrapped in a circle */}
      <IconButton
        onClick={handleAddTopic}
        sx={{
          color: 'white',
          backgroundColor: 'gray',
          '&:hover': { backgroundColor: 'gray' },
          width: 36, // Match size with the Avatar
          height: 36, // Match size with the Avatar
        }}
      >
        <AddIcon />
      </IconButton>
    </div>
  );
};

export default Header;
