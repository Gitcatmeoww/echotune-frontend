import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomButton from '../Utils/CustomButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExploreCard from './ExploreCard';
import { useLearningGoal } from '../../contexts/LearningGoalContext';

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const [receivedHashtag, setReceivedHashtag] = useState<string>('');

  useEffect(() => {
    const receivedTag = location.state?.hashTag;
    if (receivedTag) {
      setReceivedHashtag(receivedTag);
    }
  }, [location]);

  // const [receivedSelectedTags, setreceivedSelectedTags] = useState<Set<string>>(
  //   new Set(),
  // );

  // // const receivedSelectedTags = location.state?.selectedTags;

  // useEffect(() => {
  //   const receivedTags = location.state?.selectedTags;
  //   if (receivedTags) {
  //     setreceivedSelectedTags(new Set(receivedTags));
  //   }
  // }, [location]);

  // const { selectedTags } = useLearningGoal();

  // function capitalizeFirstLetter(string: string) {
  //   if (!string) return '';
  //   return string.charAt(0).toUpperCase() + string.slice(1);
  // }

  // const firstTag = capitalizeFirstLetter(
  //   receivedSelectedTags.values().next().value,
  // ); // Retrieve the first tag
  // console.log(firstTag);

  const handleExplore = () => {
    navigate('/home');
  };

  return (
    <div className="flex flex-col h-screen p-4">
      {/* Centered Content */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="text-center text-white px-4 mb-8">
          <h1 className="text-xl font-semibold mb-2">Congratulations!</h1>
          <p className="text-white">You have created your podcast!</p>
          {/* 2nd podcast */}
        </div>

        <ExploreCard
          imgSrc="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2969&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          title={receivedHashtag}
          description={`Keep up with ${receivedHashtag}`}
        />
      </div>

      {/* Button at the bottom */}
      <div className="w-full mt-auto mb-8">
        <CustomButton
          label="Continue"
          Icon={ArrowForwardIcon}
          onClick={handleExplore}
        />
      </div>
    </div>
  );
};

export default ExplorePage;
