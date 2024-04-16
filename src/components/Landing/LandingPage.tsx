import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [event.target.name]: event.target.value });
  };

  const handleSubmitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/api/login/',
        loginData,
      );
      localStorage.setItem('token', response.data.token);
      console.log('Login successful:', response.data);
      navigate('/learning-goal');
    } catch (error) {
      console.error('Login failed:');
    }
  };

  const handleLogin = () => {
    setShowLoginForm(true); // Toggle the display of the login form
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
        {showLoginForm ? (
          <form onSubmit={handleSubmitLogin} className="mb-4">
            <input
              type="text"
              name="username"
              value={loginData.username}
              onChange={handleInputChange}
              placeholder="Username"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <button
              type="submit"
              className="bg-black text-white w-full hover:bg-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Log in
            </button>
          </form>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-transparent text-black hover:text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded w-full mb-4"
          >
            Log in
          </button>
        )}
        <button
          onClick={handleGuest}
          className="bg-transparent text-black hover:text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded w-full"
        >
          Join as a guest
        </button>
      </div>
    </div>
    // <div className="flex flex-col items-center justify-center h-screen bg-white px-4">
    //   <div className="w-full max-w-md">
    //     <RegistrationForm />
    //     <div className="my-8">
    //       <hr className="my-2" />
    //       <div className="text-center text-gray-500 mb-2">or</div>
    //     </div>
    //     <button
    //       onClick={handleLogin}
    //       className="bg-transparent text-black hover:text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded w-full mb-4"
    //     >
    //       Log in
    //     </button>
    //     <button
    //       onClick={handleGuest}
    //       className="bg-transparent text-black hover:text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded w-full"
    //     >
    //       Join as a guest
    //     </button>
    //   </div>
    // </div>
  );
};

export default LandingPage;
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import RegistrationForm from './RegistrationForm';
// import LoginForm from './LoginForm';
// import { v4 as uuidv4 } from 'uuid';

// const LandingPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [showLoginForm, setShowLoginForm] = useState(false);
//   const [error, setError] = useState('');

//   // const handleLogin = async (username: string, password: string) => {
//   //   try {
//   //     const response = await axios.post('http://localhost:8000/api/login/', {
//   //       username,
//   //       password,
//   //     });
//   //     if (response.data.token) {
//   //       localStorage.setItem('token', response.data.token);
//   //       localStorage.removeItem('guestSessionId');
//   //       navigate('/learning-goal');
//   //     } else {
//   //       throw new Error('No token received');
//   //     }
//   //   } catch (error) {
//   //     // setError('Login failed: ' + (error.response?.data || 'Unknown error'));
//   //     console.error('Login failed:', error);
//   //   }
//   // };

//   const handleGuest = () => {
//     const sessionId = localStorage.getItem('guestSessionId') || uuidv4();
//     localStorage.setItem('guestSessionId', sessionId);
//     navigate('/preference');
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-white px-4">
//       <div className="w-full max-w-md">
//         <RegistrationForm />
//         <div className="my-8">
//           <hr className="my-2" />
//           <div className="text-center text-gray-500 mb-2">or</div>
//         </div>
//         {error && <p className="text-red-500">{error}</p>}
//         {showLoginForm ? (
//           <LoginForm />
//         ) : (
//           <>
//             <button
//               onClick={() => setShowLoginForm(true)}
//               className="bg-transparent text-black hover:text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded w-full mb-4"
//             >
//               Log in
//             </button>
//             <button
//               onClick={handleGuest}
//               className="bg-transparent text-black hover:text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded w-full"
//             >
//               Join as a guest
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LandingPage;
