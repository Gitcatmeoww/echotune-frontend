import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import { v4 as uuidv4 } from 'uuid';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [error, setError] = useState('');

  // const handleLogin = async (username: string, password: string) => {
  //   try {
  //     const response = await axios.post('http://localhost:8000/api/login/', {
  //       username,
  //       password,
  //     });
  //     if (response.data.token) {
  //       localStorage.setItem('token', response.data.token);
  //       localStorage.removeItem('guestSessionId');
  //       navigate('/learning-goal');
  //     } else {
  //       throw new Error('No token received');
  //     }
  //   } catch (error) {
  //     // setError('Login failed: ' + (error.response?.data || 'Unknown error'));
  //     console.error('Login failed:', error);
  //   }
  // };

  const handleGuest = () => {
    const sessionId = localStorage.getItem('guestSessionId') || uuidv4();
    localStorage.setItem('guestSessionId', sessionId);
    navigate('/preference');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white px-4">
      <div className="w-full max-w-md">
        <RegistrationForm />
        <div className="my-8">
          <hr className="my-2" />
          <div className="text-center text-gray-500 mb-2">or</div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {showLoginForm ? (
          <LoginForm />
        ) : (
          <>
            <button
              onClick={() => setShowLoginForm(true)}
              className="bg-transparent text-black hover:text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded w-full mb-4"
            >
              Log in
            </button>
            <button
              onClick={handleGuest}
              className="bg-transparent text-black hover:text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded w-full"
            >
              Join as a guest
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
