import React from 'react';
import FeedContainer from './FeedsPreview/FeedContainer';
import InterestSelection from './InterestSelection/InterestSelection';

const PreferencePage: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-screen p-6">
      <h1 className="text-2xl font-bold mb-8">Preference Profile</h1>
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
