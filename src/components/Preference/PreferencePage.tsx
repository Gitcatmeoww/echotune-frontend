import React from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FeedContainer from './FeedsPreview/FeedContainer';
import InterestSelection from './InterestSelection/InterestSelection';

const PreferencePage: React.FC = () => {
  const handleSavePreference = () => {
    console.log('Preferences saved');
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
      <div className="flex-1 overflow-auto">
        <FeedContainer />
      </div>
      <div className="bg-white px-4 py-2 shadow sticky bottom-0 z-10">
        <InterestSelection />
      </div>
    </div>
  );
};

export default PreferencePage;
