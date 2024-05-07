import React, { useState } from 'react';
import Header from './Header';
import SearchBar from './SearchBar';
import NewsFeed from '../FeedPlayer/NewsFeed';

const HomePage: React.FC = () => {
  //   const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);

  console.log(`currently selected ${selectedHashtag}`);

  return (
    <div className="min-h-screen text-white py-4">
      <Header
        onHashtagSelect={setSelectedHashtag}
        selectedHashtag={selectedHashtag}
      />

      <div className="px-4">
        <NewsFeed />
      </div>
    </div>
  );
};

export default HomePage;
