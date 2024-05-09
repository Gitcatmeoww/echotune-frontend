import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegistrationForm, setshowRegistrationForm] = useState(true);

  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [event.target.name]: event.target.value });
  };

  const placeholderLogoUrl = `${process.env.PUBLIC_URL}/EchoTune_logo.svg`;

  const handleSubmitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/api/login/',
        loginData,
      );
      localStorage.setItem('token', response.data.token);
      console.log('Login successful:', response.data);
      navigate('/home');
    } catch (error) {
      console.error('Login failed:');
    }
  };

  const handleLogin = () => {
    setShowLoginForm(true); // Toggle the display of the login form
    setshowRegistrationForm(false);
  };

  const handleGuest = () => {
    let sessionId = localStorage.getItem('guestSessionId');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('guestSessionId', sessionId);
    } else {
      localStorage.setItem('guestSessionId', sessionId!);
    }

    console.log(sessionId);
    navigate('/learning-goal');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <div className="fixed top-10 left-0 right-0 z-10 text-center text-red-500 mb-5 flex flex-col items-center justify-center">
        <img
          src={placeholderLogoUrl}
          alt="Echotune"
          style={{ height: '10vh' }}
        />{' '}
      </div>
      <div className="w-full max-w-md">
        {showRegistrationForm && ( // Wrap both elements
          <>
            <RegistrationForm />
            <div className="my-8">
              <hr className="my-2" />
              <div className="text-center text-gray-400 mb-2">or</div>
            </div>
          </>
        )}

        {/* Closing tag for the outer div */}
      </div>
      {showLoginForm ? (
        <form onSubmit={handleSubmitLogin} className="mb-4">
          <input
            type="text"
            name="username"
            value={loginData.username}
            onChange={handleInputChange}
            placeholder="Username"
            required
            className="bg-inherit shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline mb-4 placeholder:text-gray-600"
          />
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleInputChange}
            placeholder="Password"
            required
            className="bg-inherit shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline mb-4 placeholder:text-gray-600"
          />
          <button
            type="submit"
            className="bg-blue-700 text-white w-full hover:bg-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Log in
          </button>
        </form>
      ) : (
        <button
          onClick={handleLogin}
          className="bg-transparent text-white hover:text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded w-full mb-4"
        >
          Log in
        </button>
      )}
      <button
        onClick={handleGuest}
        className="bg-transparent text-white hover:text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded w-full"
      >
        Join as a guest
      </button>
      {/* </div> */}
    </div>
  );
};

export default LandingPage;
