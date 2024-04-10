import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState('Competitor Research');

  const handleExplore = () => {
    navigate('/newsfeed');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfileName(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <div className="text-center mb-8 px-4">
        <h1 className="text-xl font-semibold mb-2">
          Your First Preference Profile Created Successfully!
        </h1>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-gray-300 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <span className="text-lg">📊</span> {/* Emoji placeholder */}
          </div>
          {isEditing ? (
            <input
              type="text"
              value={profileName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={() => setIsEditing(false)} // Save when focus is lost
              autoFocus
              className="text-lg font-bold text-gray-800 mb-2 bg-transparent border-b-2 border-blue-500 outline-none"
            />
          ) : (
            <div className="flex flex-col justify-center items-center">
              <div className="mb-2">
                <span className="text-lg font-bold text-gray-800">
                  {profileName}
                </span>
              </div>
              <button
                onClick={handleEdit}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Edit name
              </button>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={handleExplore}
        className="bg-black text-white hover:bg-gray-800 font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
      >
        Explore
      </button>
    </div>
  );
};

export default ExplorePage;
