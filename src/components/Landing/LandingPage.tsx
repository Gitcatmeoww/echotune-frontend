import React from 'react';
import RegistrationForm from './RegistrationForm';

const LandingPage: React.FC = () => {
  const handleLogin = () => {
    // Logic to redirect to login page or show login form
  };

  const handleGuest = () => {
    // Logic for handling guest access
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white px-4">
      <div className="w-full max-w-md">
        <RegistrationForm />
        <div className="my-8">
          <hr className="my-2" />
          <div className="text-center text-gray-500 mb-2">or</div>
        </div>
        <button
          onClick={handleLogin}
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
      </div>
    </div>
  );
};

export default LandingPage;
