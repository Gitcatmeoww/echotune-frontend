import React, { useState } from 'react';
import axios from 'axios';

const LearningGoalForm = () => {
  const [learningGoal, setLearningGoal] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/api/learning-goal/',
        { learningGoal },
      );
      console.log(response.data);
    } catch (error) {
      console.error('An error occurred while sending data:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white px-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="mb-4">
          <h1 className="text-2xl font-bold border-b-2 pb-3 flex-grow">
            Learning Goal
          </h1>
          <input
            id="learningGoal"
            type="text"
            value={learningGoal}
            onChange={(e) => setLearningGoal(e.target.value)}
            placeholder="Enter your learning goal"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
          />
          <button
            type="submit"
            className="bg-black text-white w-full hover:bg-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default LearningGoalForm;
