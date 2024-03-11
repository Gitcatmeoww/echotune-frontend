import React, { useState } from 'react';
import { ITopicData } from '../interfaces/ITopicData';
import axios from 'axios';

const TopicPreferencesForm: React.FC = () => {
  const [selectedTopics, setSelectedTopics] = useState<number[]>([]);
  const topics: ITopicData[] = [
    { id: 1, name: 'Pre-defined topic 1' },
    { id: 2, name: 'Pre-defined topic 2' },
    { id: 3, name: 'Pre-defined topic N' },
  ];

  const handleChange = (topicId: number) => {
    setSelectedTopics((prevSelectedTopics) =>
      prevSelectedTopics.includes(topicId)
        ? prevSelectedTopics.filter((id) => id !== topicId)
        : [...prevSelectedTopics, topicId],
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/api/preferences/',
        { topics: selectedTopics },
      );
      console.log('Preferences saved:', response.data);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white shadow-md rounded"
    >
      <fieldset>
        <legend className="text-xl font-semibold mb-4">
          Select your topics of interest
        </legend>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {topics.map((topic) => (
            <label key={topic.id} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedTopics.includes(topic.id)}
                onChange={() => handleChange(topic.id)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">{topic.name}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <button
        type="submit"
        className="mt-6 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Save Preferences
      </button>
    </form>
  );
};

export default TopicPreferencesForm;
