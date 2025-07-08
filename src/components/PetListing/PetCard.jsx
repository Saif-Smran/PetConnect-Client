import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaMapMarkerAlt, FaBirthdayCake, FaWeight, FaVenus, FaMars, FaInfoCircle } from 'react-icons/fa';

const PetCard = ({ pet }) => {
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
          src={pet.image}
          alt={pet.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`
            px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm
            ${pet.adopted ? 'bg-success/80 text-success-content' : 'bg-primary/80 text-primary-content'}
          `}>
            {pet.adopted ? 'Adopted' : 'Available'}
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
          {pet.name}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-base-content/70">
            <FaMapMarkerAlt className="w-4 h-4 text-primary" />
            <span className="text-sm">{pet.location}</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <FaBirthdayCake className="w-4 h-4 text-secondary" />
              <span className="text-base-content/70">{pet.age}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <FaWeight className="w-4 h-4 text-accent" />
              <span className="text-base-content/70">{pet.weight}</span>
            </div>
            
            <div className="flex items-center gap-1">
              {React.createElement(getGenderIcon(pet.gender), { 
                className: `w-4 h-4 ${getGenderColor(pet.gender)}` 
              })}
              <span className="text-base-content/70">{pet.gender}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-base-content/70 text-sm mb-4 line-clamp-2">
          {pet.description}
        </p>

        {/* Action Button */}
        <Link
          to={`/pet/${pet._id}`}
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
