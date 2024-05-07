import React from 'react';
import '../styles/App.css';
import './LearningGoal/LearningGoalForm.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Landing/LandingPage';
import RegistrationForm from './Landing/RegistrationForm';
import PreferencePage from './LearningGoal/PreferencePage';
import ExplorePage from './Explore/ExplorePage';
import LearningGoalForm from './LearningGoal/LearningGoalForm';
import NewsFeed from './FeedPlayer/NewsFeed';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LearningGoalProvider } from '../contexts/LearningGoalContext';
import HomePage from './Home/HomePage';

const theme = createTheme({
  palette: {
    background: {
      default: '#1A1D2D !important',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LearningGoalProvider>
        <Router>
          <div>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<RegistrationForm />} />
              <Route path="/preference" element={<PreferencePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/learning-goal" element={<LearningGoalForm />} />
              {/* <Route path="/newsfeed" element={<NewsFeed />} /> */}
              <Route path="/newsfeed" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
            </Routes>
          </div>
        </Router>
      </LearningGoalProvider>
    </ThemeProvider>
  );
};

export default App;
