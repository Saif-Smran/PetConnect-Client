import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="flex items-center gap-3 text-primary">
        <FaSpinner className="w-6 h-6 animate-spin" />
        <span className="text-lg font-medium">Loading more pets...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
