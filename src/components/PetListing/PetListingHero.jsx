import React from 'react';
import { MdPets } from 'react-icons/md';

const PetListingHero = ({ totalPets }) => {
  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary font-medium mb-6">
        <MdPets className="w-5 h-5" />
        <span>Pet Adoption</span>
      </div>
      <h1 className="font-secondary font-bold text-5xl md:text-7xl mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
        Find Your Perfect Companion
      </h1>
      <p className="font-primary text-xl md:text-2xl text-base-content/70 max-w-4xl mx-auto leading-relaxed mb-8">
        Discover amazing pets looking for their forever homes. Each one has a unique story and is waiting to become part of your family.
      </p>
      
      {/* Stats */}
      <div className="flex flex-wrap justify-center gap-8 mb-12">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-1">{totalPets}+</div>
          <div className="text-base-content/70">Available Pets</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-secondary mb-1">50+</div>
          <div className="text-base-content/70">Partner Shelters</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-accent mb-1">500+</div>
          <div className="text-base-content/70">Happy Adoptions</div>
        </div>
      </div>
    </div>
  );
};

export default PetListingHero;
