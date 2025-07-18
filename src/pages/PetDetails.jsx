import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { 
  FaArrowLeft, 
  FaHeart, 
  FaShare, 
  FaMapMarkerAlt, 
  FaBirthdayCake, 
  FaWeight, 
  FaVenus, 
  FaMars,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaShieldAlt,
  FaMedkit,
  FaRuler,
  FaSpinner
} from 'react-icons/fa';
import { MdPets } from 'react-icons/md';
import AdoptionRequestForm from '../components/AdoptionRequestForm';
import Swal from 'sweetalert2';

const fetchPetDetails = async (petId) => {
  const response = await axios.get(`https://pet-connect-server-one.vercel.app/pets/${petId}`);
  return response.data;
};

const PetDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  
  const { data: pet, isLoading, error } = useQuery({
    queryKey: ['pet', id],
    queryFn: () => fetchPetDetails(id),
    enabled: !!id,
  });

  // Helper functions to support both naming conventions
  const getName = () => pet?.petName || pet?.name || 'Unknown Pet';
  const getImage = () => pet?.petImage || pet?.image || '/placeholder.jpg';
  const getLocation = () => pet?.petLocation || pet?.location || 'Unknown Location';
  const getAge = () => {
    const age = pet?.petAge || pet?.age;
    return age ? `${age} years old` : 'Age unknown';
  };
  const getCategory = () => pet?.petCategory || pet?.category || 'Unknown';
  const getGender = () => pet?.petGender || pet?.gender || '';
  const getWeight = () => pet?.petWeight || pet?.weight || '';
  const getBreed = () => pet?.petBreed || pet?.breed || '';
  const getSize = () => pet?.petSize || pet?.size || '';
  const getDescription = () => pet?.longDescription || pet?.shortDescription || pet?.description || '';
  const getAdopted = () => pet?.adopted || false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg text-base-content/70">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-error/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-error/20">
            <div className="text-error text-6xl mb-4">🐾</div>
            <h2 className="font-secondary font-bold text-2xl mb-4 text-error">
              Pet Not Found
            </h2>
            <p className="text-base-content/70 mb-6">
              The pet you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/pets"
              className="btn btn-primary btn-lg rounded-full font-medium hover:shadow-lg transition-all duration-300"
            >
              <FaArrowLeft className="mr-2" />
              Browse All Pets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getGenderIcon = (gender) => {
    return gender?.toLowerCase() === 'female' ? FaVenus : FaMars;
  };

  const getGenderColor = (gender) => {
    return gender?.toLowerCase() === 'female' ? 'text-pink-500' : 'text-blue-500';
  };

  const handleAdoptionRequest = () => {
    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to submit an adoption request.',
        icon: 'warning',
        confirmButtonColor: '#3B82F6',
        confirmButtonText: 'Login'
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect to login page
          window.location.href = '/login';
        }
      });
      return;
    }

    if (getAdopted()) {
      Swal.fire({
        title: 'Pet Already Adopted',
        text: 'This pet has already been adopted by another family.',
        icon: 'info',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    setShowAdoptionForm(true);
  };

  const closeAdoptionForm = () => {
    setShowAdoptionForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/pets"
            className="flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors"
          >
            <FaArrowLeft className="w-5 h-5" />
            <span>Back to Pet Listing</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <button className="btn btn-outline btn-circle">
              <FaHeart className="w-5 h-5" />
            </button>
            <button className="btn btn-outline btn-circle">
              <FaShare className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pet Image */}
          <div className="lg:col-span-2">
            <div className="bg-base-100/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-base-content/10 mb-6">
              <div className="relative">
                <img
                  src={getImage()}
                  alt={getName()}
                  className="w-full h-96 lg:h-[600px] object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder.jpg';
                  }}
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`
                    px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm
                    ${getAdopted() ? 'bg-success/80 text-success-content' : 'bg-primary/80 text-primary-content'}
                  `}>
                    {getAdopted() ? 'Adopted' : 'Available for Adoption'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-base-100/50 backdrop-blur-sm rounded-2xl p-6 border border-base-content/10">
              <h3 className="font-secondary font-bold text-2xl mb-4 text-base-content">
                About {getName()}
              </h3>
              <div className="text-base-content/80 leading-relaxed">
                {getDescription() ? (
                  <div dangerouslySetInnerHTML={{ __html: getDescription() }} />
                ) : (
                  <p>{getName()} is a wonderful {getCategory().toLowerCase()} looking for a loving home. They are full of energy and love to play, making them a perfect companion for the right family.</p>
                )}
              </div>
            </div>
          </div>

          {/* Pet Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-base-100/50 backdrop-blur-sm rounded-2xl p-6 border border-base-content/10">
              <div className="flex items-center gap-2 mb-4">
                <MdPets className="w-6 h-6 text-primary" />
                <h2 className="font-secondary font-bold text-3xl text-base-content">
                  {getName()}
                </h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="w-5 h-5 text-primary" />
                  <span className="text-base-content/80">{getLocation()}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaBirthdayCake className="w-5 h-5 text-secondary" />
                  <span className="text-base-content/80">{getAge()}</span>
                </div>

                {getWeight() && (
                  <div className="flex items-center gap-3">
                    <FaWeight className="w-5 h-5 text-accent" />
                    <span className="text-base-content/80">{getWeight()}</span>
                  </div>
                )}

                {getGender() && (
                  <div className="flex items-center gap-3">
                    {React.createElement(getGenderIcon(getGender()), { 
                      className: `w-5 h-5 ${getGenderColor(getGender())}` 
                    })}
                    <span className="text-base-content/80">{getGender()}</span>
                  </div>
                )}

                {getBreed() && (
                  <div className="flex items-center gap-3">
                    <MdPets className="w-5 h-5 text-info" />
                    <span className="text-base-content/80">{getBreed()}</span>
                  </div>
                )}
                
                {getSize() && (
                  <div className="flex items-center gap-3">
                    <FaRuler className="w-5 h-5 text-warning" />
                    <span className="text-base-content/80">{getSize()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Health & Care */}
            <div className="bg-base-100/50 backdrop-blur-sm rounded-2xl p-6 border border-base-content/10">
              <h3 className="font-secondary font-bold text-xl mb-4 text-base-content flex items-center gap-2">
                <FaMedkit className="w-5 h-5 text-primary" />
                Health & Care
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="w-4 h-4 text-success" />
                  <span className="text-base-content/80">Vaccinated</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaMedkit className="w-4 h-4 text-success" />
                  <span className="text-base-content/80">Health Checked</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="w-4 h-4 text-success" />
                  <span className="text-base-content/80">Spayed/Neutered</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-base-100/50 backdrop-blur-sm rounded-2xl p-6 border border-base-content/10">
              <h3 className="font-secondary font-bold text-xl mb-4 text-base-content">
                Contact Information
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <FaPhone className="w-4 h-4 text-primary" />
                  <span className="text-base-content/80">+1 (555) 123-4567</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaEnvelope className="w-4 h-4 text-primary" />
                  <span className="text-base-content/80">adopt@petconnect.com</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="w-4 h-4 text-primary" />
                  <span className="text-base-content/80">Available 9 AM - 6 PM</span>
                </div>
              </div>
              
              <button 
                onClick={handleAdoptionRequest}
                disabled={getAdopted()}
                className={`w-full btn btn-lg rounded-lg font-medium hover:shadow-lg transition-all duration-300 ${
                  getAdopted() 
                    ? 'btn-disabled bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'btn-primary'
                }`}
              >
                <FaHeart className="mr-2" />
                {getAdopted() ? 'Already Adopted' : `Adopt ${getName()}`}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Adoption Request Form Modal */}
      {showAdoptionForm && (
        <AdoptionRequestForm
          pet={pet}
          onClose={closeAdoptionForm}
        />
      )}
    </div>
  );
};

export default PetDetails;
