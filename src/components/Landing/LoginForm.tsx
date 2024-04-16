import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { IUserData } from '../../interfaces/IUserData';
import { useNavigate } from 'react-router-dom';

// interface LoginFormProps {
//   onSubmit: (username: string, password: string) => void;
// }

// const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   // const [loginData, setLoginData] = useState({ username: '', password: '' });

const LoginForm: React.FC = () => {
  const [loginData, setLoginData] = useState<IUserData>({
    username: '',
    email: '',
    password: '',
    sessionId: localStorage.getItem('guestSessionId') || '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  //   const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setPassword(event.target.value);
  //   };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/api/login/',
        loginData,
      );
      console.log('User logged in', response.data);

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
          console.error('Login error:', axiosError.response.data);
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
      <h1 className="text-2xl font-bold mb-8">Log in</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="mb-4">
          <input
            type="text"
            name="username"
            value={loginData.username}
            onChange={handleChange}
            placeholder="Username"
            autoComplete="username"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            placeholder="Password"
            autoComplete="current-password"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex flex-col items-center">
          <button
            type="submit"
            className="bg-black text-white w-full hover:bg-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Log in
          </button>
        </div>
      </form>
    </div>
    // <form onSubmit={handleSubmit} className="login-form">
    //   <div className="input-group">
    //     <label htmlFor="username">Username</label>
    //     <input
    //       type="text"
    //       id="username"
    //       name="username"
    //       value={username}
    //       onChange={handleUsernameChange}
    //       required
    //       className="input-field"
    //     />
    //   </div>
    //   <div className="input-group">
    //     <label htmlFor="password">Password</label>
    //     <input
    //       type="password"
    //       id="password"
    //       name="password"
    //       value={password}
    //       onChange={handlePasswordChange}
    //       required
    //       className="input-field"
    //     />
    //   </div>
    //   <button type="submit" className="submit-button">
    //     Log in
    //   </button>
    // </form>
  );
};

export default LoginForm;
