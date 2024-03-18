import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

type TagInputProps = {
  onAddTag: (tag: string) => void;
};

const TagInput: React.FC<TagInputProps> = ({ onAddTag }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddClick = () => {
    if (inputValue.trim()) {
      onAddTag(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="flex items-center border-b-2">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="flex-grow p-2"
        placeholder="Add a tag"
      />
      <IconButton onClick={handleAddClick} className="p-2">
        <AddIcon />
      </IconButton>
    </div>
  );
};

export default TagInput;
