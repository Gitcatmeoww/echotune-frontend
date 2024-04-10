import React from 'react';
import '../styles/App.css';
import './LearningGoal/LearningGoalForm.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Landing/LandingPage';
import RegistrationForm from './Landing/RegistrationForm';
import PreferencePage from './Preference/PreferencePage';
import ExplorePage from './Explore/ExplorePage';
import LearningGoalForm from './LearningGoal/LearningGoalForm';
import NewsFeed from './FeedPlayer/NewsFeed';

const App = () => {
  return (
    <Router>
      <div>
        {/* Other routes here */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/preference" element={<PreferencePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/learning-goal" element={<LearningGoalForm />} />
          <Route path="/newsfeed" element={<NewsFeed />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
