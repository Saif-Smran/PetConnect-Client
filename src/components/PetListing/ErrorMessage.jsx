import React from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="text-center py-16">
      <div className="bg-error/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-error/20">
        <FaExclamationTriangle className="w-16 h-16 text-error mx-auto mb-4" />
        <h3 className="font-secondary font-bold text-xl mb-2 text-error">
          Oops! Something went wrong
        </h3>
        <p className="text-base-content/70 mb-6">
          {message || "We couldn't load the pets. Please try again."}
        </p>
        <button
          onClick={onRetry}
          className="btn btn-error btn-sm rounded-lg font-medium hover:shadow-lg transition-all duration-300"
        >
          <FaRedo className="w-4 h-4 mr-2" />
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
