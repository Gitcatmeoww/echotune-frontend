import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { borders } from '@mui/system';

import {
  Box,
  Button,
  TextareaAutosize,
  Typography,
  Chip,
  Stack,
} from '@mui/material';

const LearningGoalForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [learningGoal, setLearningGoal] = useState('');
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState(new Set<string>());
  const [interests, setInterests] = useState<string[]>(
    location.state?.interests || [],
  );
  const [sources, setSources] = useState<string[]>(
    location.state?.sources || ['CNN', 'New York Times'],
  );

  // const defaultSources = ['CNN', 'New York Times'];

  const checkIfGuest = (): boolean => {
    // Placeholder implementation
    return !!localStorage.getItem('guestSessionId');
  };

  const savePreferences = async (
    isGuest: boolean,
    sessionId: string | null,
    token: string | null,
  ) => {
    const payload = {
      is_guest: isGuest,
      session_id: sessionId,
      topics: Array.from(selectedTags),
      sources: sources,
    };

    try {
      const response = await axios.post(
        'http://localhost:8000/api/save_preferences/',
        payload,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log('Preferences saved successfully:', response.data);
      navigate('/explore'); // Navigate on success
    } catch (error) {
      console.error('Error saving preferences:', error);
      // Handle error
    }
  };

  // const handleContinue = () => {
  //   const interests = Array.from(selectedTags);
  //   const sources = ['CNN'];
  //   // const isGuest = checkIfGuest();
  //   // const sessionId = localStorage.getItem('guestSessionId');
  //   // const token = localStorage.getItem('token');

  //   // savePreferences(isGuest, sessionId, token);

  //   // navigate('/newsfeed');
  // };

  const buttonStyle = {
    opacity: generatedTags.length > 0 ? '0.3' : '1',
  };

  const handleContinue = () => {
    console.log(Array.from(selectedTags));
    console.log(sources);
    const isGuest = checkIfGuest();
    const sessionId = localStorage.getItem('guestSessionId');
    const token = localStorage.getItem('token');

    savePreferences(isGuest, sessionId, token);
  };
  // navigate('/preference', {
  //   state: {
  //     interests: Array.from(selectedTags),
  //     sources: defaultSources,
  //   },
  //   });
  // };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/api/learning-goal/',
        { learningGoal },
      );
      if (response.data.status === 'success') {
        const tagsArray = Array.isArray(response.data.GeneratedTags)
          ? response.data.GeneratedTags
          : response.data.GeneratedTags.split(', ');
        setGeneratedTags(tagsArray);
        processTags(tagsArray);
      } else {
        console.error('API did not return a success status:', response.data);
      }
    } catch (error) {
      console.error('An error occurred while sending data:', error);
    }
  };

  const handleSelectTag = (tag: string) => {
    setSelectedTags((prev) => {
      const updated = new Set(prev);
      if (updated.has(tag)) {
        updated.delete(tag);
      } else {
        if (updated.size < 5) updated.add(tag);
      }
      return updated;
    });
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags((prevSelectedTags) => {
      const newSelectedTags = new Set(prevSelectedTags);
      newSelectedTags.delete(tag);

      return newSelectedTags;
    });
  };

  const processTags = (tagsArray: string[]) => {
    setGeneratedTags(tagsArray);
    console.log(tagsArray);
    setSelectedTags(new Set(tagsArray.slice(0, 5)));
  };

  return (
    <div className="container2">
      <form onSubmit={handleSubmit}>
        <div className="header">
          {/* <button className="back-button">Back</button> */}
          <h1 className="title">What do you want to stay informed about?</h1>
        </div>
        <div className="input-group">
          <textarea
            id="learningGoal"
            value={learningGoal}
            onChange={(e) => setLearningGoal(e.target.value)}
            placeholder="Tell us what you're curious about"
            className="input-field"
            wrap="soft"
          />

          <button
            type="submit"
            // onSubmit={handleSubmit}
            className="add-button"
            disabled={generatedTags.length > 0}
            style={buttonStyle}
          >
            + Add
          </button>
        </div>
      </form>

      {generatedTags.length > 0 ? (
        <>
          <div className="tags-output">
            <p>Select up to 5 keywords</p>
            {generatedTags.map((tag, index) => (
              <div
                key={index}
                className={`tag ${selectedTags.has(tag) ? 'selected' : ''}`}
                onClick={() => handleSelectTag(tag)}
              >
                {tag}
                <span
                  className="tag-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTag(tag);
                  }}
                >
                  x
                </span>
              </div>
            ))}
          </div>
          {/* <div> */}
          <button className="continue-button" onClick={handleContinue}>
            Continue
          </button>
          {/* </div> */}
        </>
      ) : (
        <div className="examples">
          <p>Examples</p>
          <div className="example">
            Keep me updated on the SF Giants games this season
          </div>
          <div className="example">What is Billie Eilish up to these days?</div>
          <div className="example">
            I want to learn about bird species in the Caribbean Islands
          </div>
          <div className="example">
            Give me trending tips for composting at home
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningGoalForm;