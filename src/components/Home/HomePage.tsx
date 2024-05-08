import React, { useState, useEffect } from 'react';
import Header from './Header';
import SearchBar from './SearchBar';
import NewsFeed from '../FeedPlayer/NewsFeed';
import axios from 'axios';
import { ITopicData } from '../../interfaces/ITopicData';
import { IHashtagData } from '../../interfaces/IHashtagData';

const HomePage: React.FC = () => {
  //   const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [topics, setTopics] = useState<ITopicData[]>([]);

  const handleHashtagsFetched = (hashtags: IHashtagData[]) => {
    if (!selectedHashtag && hashtags.length > 0) {
      setSelectedHashtag(hashtags[0].name); // Set first hashtag if none selected
    }
  };

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
        onHashtagsFetched={handleHashtagsFetched}
      />

      <div className="px-4">
        <NewsFeed topics={topics} />
      </div>
    </div>
  );
};

export default HomePage;
