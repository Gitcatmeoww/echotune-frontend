import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // TODO: Handle search
  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      console.log('Searching for:', searchTerm);
    }
  };

  return (
    <div className="flex items-center max-w-md mx-auto w-11/12 bg-gray-700 text-white rounded-lg overflow-hidden">
      <div className="pl-4">
        <SearchIcon className="h-5 w-5" />
      </div>
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleSearch}
        className="w-full px-4 py-2 bg-transparent outline-none placeholder-gray-400 text-white font-medium text-md"
      />
    </div>
  );
};

export default SearchBar;
