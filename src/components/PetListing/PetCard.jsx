import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaHeart,
  FaMapMarkerAlt,
  FaWeight,
  FaVenus,
  FaMars,
  FaInfoCircle,
  FaPaw
} from 'react-icons/fa';

const PetCard = ({ pet }) => {
  // Support both naming conventions for compatibility
  const getName = () => pet.petName || pet.name || 'Unknown Pet';
  const getImage = () => pet.petImage || pet.image || '/placeholder.jpg';
  const getLocation = () => pet.petLocation || pet.location || 'Unknown Location';
  const getCategory = () => pet.petCategory || pet.category || '';
  const getAge = () => pet.petAge || pet.age || '';
  const getGender = () => pet.petGender || pet.gender || '';
  const getDescription = () => pet.shortDescription || pet.description || '';
  const getAdopted = () => pet.adopted || false;
  const getId = () => pet._id || pet.id || '';

  const getGenderIcon = (gender) => {
    return gender?.toLowerCase() === 'female' ? FaVenus : FaMars;
  };

  const getGenderColor = (gender) => {
    return gender?.toLowerCase() === 'female' ? 'text-pink-500' : 'text-blue-500';
  };

  return (
    <div className="bg-base-100/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-base-content/10 hover:border-primary/30 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl group">
      {/* Pet Image */}
      <div className="relative overflow-hidden">
        <img
          src={getImage()}
          alt={getName()}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.target.src = '/placeholder.jpg';
          }}
        />

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`
              px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm
              ${getAdopted() ? 'bg-success/80 text-success-content' : 'bg-primary/80 text-primary-content'}
            `}
          >
            {getAdopted() ? 'Adopted' : 'Available'}
          </span>
        </div>

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 p-2 rounded-full bg-base-100/80 backdrop-blur-sm hover:bg-base-100 transition-colors group">
          <FaHeart className="w-4 h-4 text-base-content/70 group-hover:text-red-500 transition-colors" />
        </button>
      </div>

      {/* Pet Info */}
      <div className="p-6">
        <h3 className="font-secondary font-bold text-xl mb-2 text-base-content group-hover:text-primary transition-colors">
          {getName()}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-base-content/70">
            <FaMapMarkerAlt className="w-4 h-4 text-primary" />
            <span className="text-sm">{getLocation()}</span>
          </div>

          {getCategory() && (
            <div className="flex items-center gap-1">
              <FaPaw className="w-4 h-4 text-secondary" />
              <span className="text-base-content/70 capitalize">{getCategory()}</span>
            </div>
          )}

          {getAge() && (
            <div className="flex items-center gap-1">
              <FaInfoCircle className="w-4 h-4 text-secondary" />
              <span className="text-base-content/70">{getAge()} years old</span>
            </div>
          )}

          {getGender() && (
            <div className="flex items-center gap-1">
              {React.createElement(getGenderIcon(getGender()), {
                className: `w-4 h-4 ${getGenderColor(getGender())}`
              })}
              <span className="text-base-content/70">{getGender()}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-base-content/70 text-sm mb-4 line-clamp-2">
          {getDescription()}
        </p>

        {/* Action Button */}
        <Link
          to={`/pet/${getId()}`}
          className="w-full btn btn-primary btn-sm rounded-lg font-medium transition-all duration-300 hover:shadow-lg group"
        >
          <FaInfoCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PetCard;
