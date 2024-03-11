import React, { useState } from 'react';
import axios from 'axios';
import { AxiosError } from 'axios';
import { IUserData } from '../interfaces/IUserData';

const RegistrationForm: React.FC = () => {
  const [userData, setUserData] = useState<IUserData>({
    username: '',
    email: '',
    password: '',
  });

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
      // Handle post-registration logic here (e.g., redirecting to login)
    } catch (error: unknown) {
      // Check if 'error' is an instance of an Error and has 'response' property
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as AxiosError; // Assuming you're using Axios
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 shadow-md">
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Username:
        </label>
        <input
          type="text"
          name="username"
          value={userData.username}
          onChange={handleChange}
          id="username"
          autoComplete="username"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Email:
        </label>
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          id="email"
          autoComplete="email"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Password:
        </label>
        <input
          type="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
          id="password"
          autoComplete="new-password"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Register
      </button>
    </form>
  );
};

export default RegistrationForm;
