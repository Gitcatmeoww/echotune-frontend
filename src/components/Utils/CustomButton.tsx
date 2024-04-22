import React from 'react';
import { ButtonProps } from '../../interfaces/IButtonProps';

const CustomButton: React.FC<ButtonProps> = ({ label, Icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-1.5 px-4 rounded-lg flex items-center justify-center space-x-2 w-4/5 mx-auto"
    >
      {Icon && <Icon className="text-white" style={{ fontSize: 20 }} />}
      <span>{label}</span>
    </button>
  );
};

export default CustomButton;
