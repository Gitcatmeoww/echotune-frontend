import React from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

type TagProps = {
  label: string;
  onDelete: () => void;
};

const Tag: React.FC<TagProps> = ({ label, onDelete }) => {
  return (
    <div className="flex items-center space-x-2 border rounded-full px-4 py-1">
      <span>{label}</span>
      <IconButton size="small" onClick={onDelete}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

export default Tag;
