import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoPage: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/landing');
  };

  return (
    <div
      className="flex h-screen justify-center items-center cursor-pointer"
      onClick={handleClick}
    >
      <img
        src="/EchoTune_logo.svg"
        alt="EchoTune Logo"
        className="max-w-xs md:max-w-sm"
      />
    </div>
  );
};

export default LogoPage;
