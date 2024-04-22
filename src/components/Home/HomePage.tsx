import React from 'react';
import Header from './Header';
import SearchBar from './SearchBar';
import NewsFeed from '../FeedPlayer/NewsFeed';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen text-white py-4">
      <Header />
      <div className="px-4 py-2">
        <p className="text-xl font-semibold my-4 text-white">
          Discover something new
        </p>
        <SearchBar />
      </div>

      <div className="px-4 py-2">
        <p className="text-xl font-semibold my-4 text-white">
          Top stories for you
        </p>
        <NewsFeed />
      </div>
    </div>
  );
};

export default HomePage;
