import React, { useState, useEffect } from 'react';
import Header from './Header';
import SearchBar from './SearchBar';
import NewsFeed from '../FeedPlayer/NewsFeed';
import axios from 'axios';
import { ITopicData } from '../../interfaces/ITopicData';

const HomePage: React.FC = () => {
  //   const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [topics, setTopics] = useState<ITopicData[]>([]);

  useEffect(() => {
    const fetchTopicsForHashtag = async () => {
      if (selectedHashtag) {
        const encodedHashtag = encodeURIComponent(selectedHashtag);
        console.log(`Fetching topics for hashtag: ${encodedHashtag}`);
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/get_topics_for_hashtag/${encodedHashtag}/`,
            {
              headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
              },
            },
          );
          setTopics(response.data);
          console.log(`Fetched topic: ${topics}`);
        } catch (error) {
          console.error('Error fetching topics for hashtag:', error);
        }
      }
    };

    fetchTopicsForHashtag();
  }, [selectedHashtag]);

  return (
    <div className="min-h-screen text-white py-4">
      <Header
        onHashtagSelect={setSelectedHashtag}
        selectedHashtag={selectedHashtag}
      />

      <div className="px-4">
        <NewsFeed topics={topics} />
      </div>
    </div>
  );
};

export default HomePage;
