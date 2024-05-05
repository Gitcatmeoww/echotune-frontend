import React, { useState } from 'react';
import Header from './Header';
import SearchBar from './SearchBar';
import NewsFeed from '../FeedPlayer/NewsFeed';

const HomePage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  console.log(`currently selected ${selectedTopic}`);

  return (
    <div className="min-h-screen text-white py-4">
      <Header onTopicSelect={setSelectedTopic} selectedTopic={selectedTopic} />

      <div className="px-4">
        <NewsFeed />
      </div>
    </div>
  );
};

export default HomePage;
