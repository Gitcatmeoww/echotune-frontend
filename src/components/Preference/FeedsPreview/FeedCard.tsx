import React from 'react';

type FeedCardProps = {
  title: string;
  onDelete: () => void;
};

const FeedCard: React.FC<FeedCardProps> = ({ title, onDelete }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg my-2">
      <div className="px-6 py-4 relative">
        <button onClick={onDelete} className="absolute top-0 right-0 mt-2 mr-2">
          <svg
            className="fill-current h-4 w-4 text-black"
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            {/* Path for X icon */}
          </svg>
        </button>
        {/* Placeholder for image */}
        <div className="bg-gray-300 h-20 mb-4"></div>
        <div className="font-bold text-xl mb-2">{title}</div>
        {/* Additional card content */}
      </div>
    </div>
  );
};

export default FeedCard;
