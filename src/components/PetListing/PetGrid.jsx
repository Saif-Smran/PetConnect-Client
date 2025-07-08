import React from 'react';
import PetCard from './PetCard';

const PetGrid = ({ pets, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-base-200/50 rounded-2xl overflow-hidden animate-pulse">
            <div className="h-64 bg-base-300/50"></div>
            <div className="p-6 space-y-3">
              <div className="h-6 bg-base-300/50 rounded"></div>
              <div className="h-4 bg-base-300/50 rounded w-3/4"></div>
              <div className="h-4 bg-base-300/50 rounded w-1/2"></div>
              <div className="h-8 bg-base-300/50 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {pets.map((pet) => (
        <PetCard key={pet._id} pet={pet} />
      ))}
    </div>
  );
};

export default PetGrid;
