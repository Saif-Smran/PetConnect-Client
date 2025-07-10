import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdPets } from 'react-icons/md';
import { FaCat, FaDog, FaFish } from 'react-icons/fa';
import { GiRabbit } from 'react-icons/gi';
import axios from 'axios';

const categories = [
  { name: 'All', value: 'all', icon: <MdPets className="w-5 h-5" /> },
  { name: 'Cat', value: 'cat', icon: <FaCat className="w-5 h-5" /> },
  { name: 'Dog', value: 'dog', icon: <FaDog className="w-5 h-5" /> },
  { name: 'Rabbit', value: 'rabbit', icon: <GiRabbit className="w-5 h-5" /> },
  { name: 'Fish', value: 'fish', icon: <FaFish className="w-5 h-5" /> },
];

const Category = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPets = async (categoryValue) => {
    setLoading(true);
    try {
      const url = categoryValue && categoryValue !== 'all'
        ? `${import.meta.env.VITE_API_URL}/pets?category=${categoryValue}`
        : `${import.meta.env.VITE_API_URL}/pets`;

      console.log('🔍 Fetching pets from:', url);
      const response = await axios.get(url);
      let petsData = response.data;
      
      console.log('📊 Received pets data:', petsData.length, 'pets');
      
      // Shuffle and limit pets based on category
      if (categoryValue === 'all') {
        // Show 16 random pets when "All" is selected
        const shuffled = petsData.sort(() => 0.5 - Math.random());
        petsData = shuffled.slice(0, 12);
      } else {
        // Show 8 pets for specific categories
        petsData = petsData.slice(0, 8);
      }
      
      setPets(petsData);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets(selectedCategory);
  }, [selectedCategory]);

  return (
    <section className="py-16 bg-gradient-to-br from-base-100 via-base-200/50 to-base-100">
      <div className="max-w-11/12 mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary font-medium mb-4">
            <MdPets className="w-5 h-5" />
            <span>Pet Categories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-secondary bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Browse by Category
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Find your perfect companion by exploring our different pet categories
          </p>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`btn btn-lg gap-3 transition-all duration-300 hover:scale-105 ${
                selectedCategory === cat.value
                  ? 'bg-gradient-to-r from-primary to-secondary text-white border-0 shadow-xl'
                  : 'btn-outline border-2 border-base-content/20 hover:border-primary hover:bg-primary hover:text-white'
              }`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center my-12">
            <div className="flex flex-col items-center gap-4">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-base-content/70">Loading pets...</p>
            </div>
          </div>
        )}

        {/* Pet Cards */}
        {!loading && pets.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {pets.map((pet) => (
              <div
                key={pet._id}
                className="group card bg-base-100 shadow-xl border border-base-content/10 hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <figure className="h-64 overflow-hidden relative">
                  <img
                    src={pet.petImage || pet.image || '/placeholder.jpg'}
                    alt={pet.petName || pet.name || 'Pet'}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className="badge badge-primary text-white font-medium px-3 py-2 capitalize">
                      {pet.petCategory || pet.category || 'Pet'}
                    </span>
                  </div>
                  {pet.adopted && (
                    <div className="absolute top-4 left-4">
                      <span className="badge badge-success text-white font-medium px-3 py-2">
                        Adopted
                      </span>
                    </div>
                  )}
                </figure>
                <div className="card-body p-6">
                  <h3 className="card-title text-xl font-bold text-base-content mb-2">
                    {pet.petName || pet.name || 'Unknown Pet'}
                  </h3>
                  <p className="text-base-content/70 font-medium mb-2">
                    {pet.petAge ? `${pet.petAge} years old` : 'Age unknown'}
                  </p>
                  <p className="text-sm text-base-content/80 leading-relaxed mb-4">
                    {pet.shortDescription || pet.descriptionShort || 'No description available'}
                  </p>
                  <div className="card-actions justify-between items-center">
                    <div className="flex items-center gap-2">
                      <MdPets className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-base-content/70">
                        {pet.petLocation || pet.location || 'Location unknown'}
                      </span>
                    </div>
                    <Link
                      to={`/pet/${pet._id}`}
                      className="btn btn-primary btn-sm gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      See Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && pets.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <MdPets className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-base-content mb-2">No pets found</h3>
              <p className="text-base-content/70">
                No pets available in the "{categories.find(cat => cat.value === selectedCategory)?.name || 'selected'}" category at the moment.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Category;
