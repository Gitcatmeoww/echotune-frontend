import React from 'react';

type ExploreCardProps = {
  imgSrc: string;
  title: string;
  description: string;
};

const ExploreCard: React.FC<ExploreCardProps> = ({
  imgSrc,
  title,
  description,
}) => {
  return (
    <div
      className="mx-auto w-2/3 rounded-lg overflow-hidden shadow-lg"
      style={{ backgroundColor: '#1E2235' }}
    >
      <img className="w-full h-32 object-cover" src={imgSrc} alt={title} />
      <div className="px-6 py-2">
        <div className="font-bold text-lg text-white">{title}</div>
        <p className="text-xs font-semibold text-white">{description}</p>
        <p className="text-gray-400 text-xs">Now available daily</p>
      </div>
    </div>
  );
};

export default ExploreCard;
