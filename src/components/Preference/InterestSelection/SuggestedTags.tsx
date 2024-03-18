import React from 'react';

type SuggestedTagsProps = {
  tags: string[];
  onAddTag: (tag: string) => void;
};

const SuggestedTags: React.FC<SuggestedTagsProps> = ({ tags, onAddTag }) => {
  return (
    <div className="flex flex-wrap gap-2 my-2">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onAddTag(tag)}
          className="bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default SuggestedTags;
