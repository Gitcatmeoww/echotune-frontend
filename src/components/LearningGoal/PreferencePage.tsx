import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import FeedContainer from './FeedsPreview/FeedContainer';
// import LearningGoalForm from './LearningGoalForm';

// const PreferencePage: React.FC = () => {
//   const navigate = useNavigate();

//   const [interests, setInterests] = useState<string[]>(['Tech', 'LLMs']);
//   const [sources, setSources] = useState<string[]>(['CNN', 'New York Times']);

//   const checkIfGuest = (): boolean => {
//     // Placeholder implementation
//     return !!localStorage.getItem('guestSessionId');
//   };

const PreferencePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize with defaults or empty if not provided
  const [interests, setInterests] = useState<string[]>(
    location.state?.interests || [],
  );
  const [sources, setSources] = useState<string[]>(
    location.state?.sources || ['CNN', 'New York Times'],
  );

  const checkIfGuest = (): boolean => {
    // Placeholder implementation
    return !!localStorage.getItem('guestSessionId');
  };

  const savePreferences = async (
    isGuest: boolean,
    sessionId: string | null,
    token: string | null,
  ) => {
    const payload = {
      is_guest: isGuest,
      session_id: sessionId,
      topics: interests,
      sources: sources,
    };

    try {
      const response = await axios.post(
        'http://localhost:8000/api/save_preferences/',
        payload,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log('Preferences saved successfully:', response.data);
      navigate('/explore'); // Navigate on success
    } catch (error) {
      console.error('Error saving preferences:', error);
      // Handle error
    }
  };

  const handleSavePreference = () => {
    const isGuest = checkIfGuest();
    const sessionId = localStorage.getItem('guestSessionId');
    const token = localStorage.getItem('token');

    savePreferences(isGuest, sessionId, token);
  };

  return (
    <div className="flex flex-col justify-between h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold border-b-2 pb-3 flex-grow">
          Preference Profile
        </h1>
        <CheckCircleOutlineIcon
          onClick={handleSavePreference}
          className="cursor-pointer"
        />
      </div>
      {/* <div className="flex-1 overflow-auto">
        <FeedContainer />
      </div> */}
      <div className="bg-white px-4 py-2 shadow sticky bottom-0 z-10">
        {/* <LearningGoalForm */}
        {/* interests={interests}
          sources={sources}
          setInterests={setInterests}
          setSources={setSources}
        /> */}
      </div>
    </div>
  );
};

export default PreferencePage;
