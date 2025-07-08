import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = ({ searchTerm, onSearchChange, onClearSearch }) => {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="h-5 w-5 text-base-content/50 group-focus-within:text-primary transition-colors" />
      </div>
      <input
        type="text"
        placeholder="Search pets by name, breed, or location..."
        value={searchTerm}
        onChange={onSearchChange}
        className="w-full pl-10 pr-10 py-3 bg-base-200/50 backdrop-blur-sm border border-base-content/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 placeholder:text-base-content/50"
      />
      {searchTerm && (
        <button
          onClick={onClearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/50 hover:text-error transition-colors"
        >
          <FaTimes className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
