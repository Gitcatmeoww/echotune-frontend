import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { IUserData } from '../../interfaces/IUserData';

const RegistrationForm: React.FC = () => {
  const [userData, setUserData] = useState<IUserData>({
    username: '',
    email: '',
    password: '',
    // Adding a sessionId to associate guest preferences upon registration
    sessionId: localStorage.getItem('guestSessionId') || '',
  });

  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8000/api/register/',
        userData,
      );
      console.log('User registered:', response.data);

      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);

      // Clear the sessionId from localStorage after successful registration to ensure the user is no longer treated as a guest
      localStorage.removeItem('guestSessionId');

      // Redirect to the preference page
      navigate('/learning-goal');
    } catch (error: unknown) {
      // Check if 'error' is an instance of an Error and has 'response' property
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.error('Registration error:', axiosError.response.data);
        } else {
          console.error(
            'An error occurred, but no server response was received:',
            error,
          );
        }
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center p-6">
      <h1 className="text-2xl font-bold mb-8 text-white">Sign up</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="mb-4">
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            placeholder="Username"
            autoComplete="username"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Email"
            autoComplete="email"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            placeholder="Password"
            autoComplete="new-password"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex flex-col items-center">
          <button
            type="submit"
            className="bg-black text-white w-full hover:bg-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
