import React from 'react';
import { FaSearch, FaPaw } from 'react-icons/fa';

const EmptyState = ({ searchTerm, selectedCategory, onClearFilters }) => {
  const hasFilters = searchTerm || selectedCategory !== 'All';

  return (
    <div className="text-center py-16">
      <div className="bg-base-200/30 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-base-content/10">
        <div className="relative mb-6">
          <FaPaw className="w-16 h-16 text-base-content/30 mx-auto" />
          <FaSearch className="w-6 h-6 text-base-content/30 absolute -bottom-1 -right-1" />
        </div>
        
        <h3 className="font-secondary font-bold text-xl mb-2 text-base-content">
          {hasFilters ? 'No pets found' : 'No pets available'}
        </h3>
        
        <p className="text-base-content/70 mb-6">
          {hasFilters 
            ? 'Try adjusting your search criteria or browse all available pets.'
            : 'Check back later for new furry friends looking for homes!'
          }
        </p>
        
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="btn btn-primary btn-sm rounded-lg font-medium hover:shadow-lg transition-all duration-300"
          >
            <FaPaw className="w-4 h-4 mr-2" />
            View All Pets
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
