import React, { useState } from 'react';
import FeedCard from './FeedCard';

type FeedData = {
  id: number;
  title: string;
};

const FeedContainer: React.FC = () => {
  const [feeds, setFeeds] = useState<FeedData[]>([
    { id: 1, title: 'Article title' },
    { id: 2, title: 'Article title' },
    { id: 3, title: 'Article title' },
    { id: 4, title: 'Article title' },
    { id: 5, title: 'Article title' },
    { id: 6, title: 'Article title' },
  ]);

  const handleDeleteFeed = (id: number) => {
    setFeeds(feeds.filter((feed) => feed.id !== id));
  };

  return (
    <div>
      <h2 className="text-lg leading-6 font-medium text-gray-900">
        Preview Your Feeds
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {feeds.map((feed) => (
          <FeedCard
            key={feed.id}
            title={feed.title}
            onDelete={() => handleDeleteFeed(feed.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedContainer;
