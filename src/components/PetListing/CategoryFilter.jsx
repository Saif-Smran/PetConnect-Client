import React from 'react';
import { FaDog, FaCat, FaFish, FaPaw } from 'react-icons/fa';

const categoryIcons = {
  Dog: FaDog,
  Cat: FaCat,
  Fish: FaFish,
  
  Rabbit: FaPaw, // Use FaPaw for Rabbit

  All: FaPaw
};

const CategoryFilter = ({ selectedCategory, onCategoryChange, isLoading }) => {
  const categories = ['All', 'Dog', 'Cat', 'Fish', 'Rabbit'];

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-12">
      {categories.map((category) => {
        const IconComponent = categoryIcons[category] || FaPaw;
        const isSelected = selectedCategory === category;
        
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            disabled={isLoading}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300
              ${isSelected 
                ? 'bg-primary text-primary-content shadow-lg transform scale-105' 
                : 'bg-base-200/50 backdrop-blur-sm text-base-content/70 hover:bg-base-300/50 hover:text-base-content hover:transform hover:scale-105'
              }
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              border border-base-content/10 hover:border-primary/30
            `}
          >
            <IconComponent className="w-4 h-4" />
            <span>{category}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
