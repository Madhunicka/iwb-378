import React from 'react';

const SearchBar = ({ setSearchTerm }) => {
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value); // Update the search term based on input
  };

  return (
    <div className="bg-gray-800 p-4 flex justify-between items-center">
      <input
        type="text"
        placeholder="Search sessions"
        className="p-2 rounded bg-gray-700 text-white focus:outline-none"
        onChange={handleInputChange} // Handle input changes
      />
     
    </div>
  );
};

export default SearchBar;
