import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLearningGoal } from '../../contexts/LearningGoalContext';

import {
  Box,
  Button,
  TextareaAutosize,
  Typography,
  Chip,
  Stack,
  IconButton,
} from '@mui/material';

import NorthWestIcon from '@mui/icons-material/NorthWest';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CloseIcon from '@mui/icons-material/Close';

const LearningGoalForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // const {
  //   learningGoal,
  //   setLearningGoal,
  //   generatedTags,
  //   setGeneratedTags,
  //   selectedTags,
  //   setSelectedTags,
  // } = useLearningGoal();

  const [learningGoal, setLearningGoal] = useState<string>('');
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [hashTag, sethashTag] = useState<string>('');

  // Track initial learning goal for comparison
  const initialLearningGoal = useRef(learningGoal);

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
    hashTag: string,
  ) => {
    const payload = {
      is_guest: isGuest,
      session_id: sessionId,
      topics: Array.from(selectedTags),
      sources: sources,
    };

    console.log('HashTag at savePreferences:', hashTag);

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
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const handleExampleClick = async (example: string) => {
    setLearningGoal(example);
    await handleSubmit(example); // Call handleSubmit with the example string
  };

  const buttonStyle = {
    opacity: generatedTags.length > 0 ? '0.3' : '1',
  };

  const getHashtag = async () => {
    try {
      const hashtagResponse = await axios.post(
        'http://localhost:8000/api/getHashtag/',
        { learningGoal },
      );
      if (hashtagResponse.data.status === 'success') {
        const generatedHashtag = hashtagResponse.data.generatedHashtag;
        console.log('HASHTAG generated:', generatedHashtag);
        return generatedHashtag; // Return the hashtag from the function
      } else {
        console.error('Error fetching hashtags:', hashtagResponse.data);
        return null; // Return null if the hashtag was not successfully retrieved
      }
    } catch (error) {
      console.error('An error occurred while fetching hashtags:', error);
      return null;
    }
  };

  const handleContinue = async () => {
    console.log(Array.from(selectedTags));
    console.log(sources);
    const isGuest = checkIfGuest();
    const sessionId = localStorage.getItem('guestSessionId');
    const token = localStorage.getItem('token');

    const generatedHashtag = await getHashtag(); // Get hashtag and wait for it

    if (generatedHashtag) {
      sethashTag(generatedHashtag); // Set hashtag in state
      // savePreferences(isGuest, sessionId, token, generatedHashtag);

      await savePreferences(
        checkIfGuest(),
        localStorage.getItem('guestSessionId'),
        localStorage.getItem('token'),
        generatedHashtag,
      );
      navigate('/explore', { state: { hashTag: generatedHashtag } }); // Navigate on success with the hashtag
      //     savePreferences(isGuest, sessionId, token, generatedHashtag);
      //   } else {
      //     console.error('Error fetching hashtags:', hashtagResponse.data);
      //   }
      // } catch (error) {
      //   console.error('An error occurred while fetching hashtags:', error);
      // }
    }
  };

  const handleSubmit = async (learningGoal: string) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/learning-goal/',
        { learningGoal },
      );
      if (response.data.status === 'success') {
        console.log('response.data.GeneratedTags');
        const tagsArray = Array.isArray(response.data.GeneratedTags)
          ? response.data.GeneratedTags
          : response.data.GeneratedTags.split(', ');
        setGeneratedTags(tagsArray);
        processTags(tagsArray);
        // setSelectedTags(new Set());
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
    //default selection
    setSelectedTags(new Set(tagsArray.slice(0, 5)));
  };

  useEffect(() => {
    // Check if learning goal has changed from its initial value
    if (learningGoal !== initialLearningGoal.current) {
      setGeneratedTags([]);
      // Clear selected tags
      setSelectedTags(new Set());
    }
    // Update reference for future comparisons
    initialLearningGoal.current = learningGoal;
  }, [learningGoal]);

  const exampleStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const onBackClick = async () => {
    navigate('/home');
  };

  return (
    <div className="container2">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(learningGoal);
        }}
      >
        <div className="header">
          <IconButton sx={{ color: '#FFFFFF' }} onClick={onBackClick}>
            <KeyboardBackspaceIcon />
          </IconButton>
          <button className="back-button">Back</button>
          {/* first login */}
          {/* other text  */}
        </div>
        <h1 className="title">What do you want to stay informed about?</h1>

        <div className="input-group">
          <textarea
            id="learningGoal"
            value={learningGoal}
            onChange={(e) => setLearningGoal(e.target.value)}
            placeholder="Tell us what you're curious about"
            className="input-field"
            wrap="soft"
          />

          {/* <button
            type="submit"
            // onSubmit={handleSubmit}
            className="add-button"
            disabled={generatedTags.length > 0}
            style={buttonStyle}
          > */}
          <button
            type="submit"
            className="add-button"
            disabled={generatedTags.length > 0}
            style={{
              opacity: generatedTags.length > 0 ? '0.3' : '1',
            }}
            onClick={() => handleSubmit(learningGoal)}
          >
            + Add
          </button>
        </div>
      </form>

      {generatedTags.length > 0 ? (
        <>
          <div className="tags-output">
            <p>You can select upto 5 relevant keywords</p>
            {generatedTags.map((tag, index) => (
              <div
                key={index}
                className={`tag ${selectedTags.has(tag) ? 'selected' : ''}`}
                onClick={() => handleSelectTag(tag)}
              >
                {tag}
                {selectedTags.has(tag) && ( // Only show close icon if tag is selected
                  <span
                    className="tag-close"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTag(tag);
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </span>
                )}
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
          <div
            className="example"
            style={exampleStyle}
            onClick={() =>
              handleExampleClick(
                'I want to learn about top product updates in the generative AI space',
              )
            }
          >
            I want to learn about top product updates in the generative AI space{' '}
            <NorthWestIcon />
          </div>
          <div
            className="example"
            style={exampleStyle}
            onClick={() =>
              handleExampleClick('What is Billie Eilish up to these days?')
            }
          >
            What is Billie Eilish up to these days? <NorthWestIcon />
          </div>
          <div
            className="example"
            style={exampleStyle}
            onClick={() =>
              handleExampleClick(
                'I want to learn about bird species in the Caribbean Islands',
              )
            }
          >
            I want to learn about bird species in the Caribbean Islands{' '}
            <NorthWestIcon />
          </div>
          <div
            className="example"
            style={exampleStyle}
            onClick={() =>
              handleExampleClick('Give me trending tips for composting at home')
            }
          >
            Give me trending tips for composting at home <NorthWestIcon />
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningGoalForm;
