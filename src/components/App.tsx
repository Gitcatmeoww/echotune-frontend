import React from 'react';
import '../styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import RegistrationForm from './RegistrationForm';
import TopicPreferencesForm from './TopicPreferencesForm';

const App = () => {
  return (
    <Router>
      <div>
        {/* Other routes here */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/preference" element={<TopicPreferencesForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
