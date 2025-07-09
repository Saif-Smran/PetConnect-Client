import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaBullseye, FaDonate } from 'react-icons/fa';
import LoadingSpinner from '../PetListing/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import Swal from 'sweetalert2';

const RecommendedDonations = ({ currentDonationId }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommended-donations', currentDonationId],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/donations/recommended/${currentDonationId}`);
      return response.data;
    },
    enabled: !!currentDonationId
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          More Ways to Help
        </h2>
        <p className="text-gray-600">
          Discover other active campaigns that need your support
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((donation) => {
          const progressPercentage = Math.min((donation.raised / donation.target) * 100, 100);
          const daysLeft = Math.max(0, Math.ceil((new Date(donation.deadline) - new Date()) / (1000 * 60 * 60 * 24)));

          return (
            <div
              key={donation._id}
              className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-48">
                <img
                  src={donation.image}
                  alt={donation.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {donation.status}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2">
                    <FaHeart className="text-red-500 text-lg" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                  {donation.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {donation.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold">{progressPercentage.toFixed(1)}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1">
                      <FaBullseye className="text-blue-500" />
                      <span className="text-gray-600">
                        ${donation.raised.toLocaleString()} raised
                      </span>
                    </div>
                    <span className="text-gray-600">
                      {daysLeft} days left
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/donations/${donation._id}`}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 text-center text-sm"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => {
                      if (!user) {
                        Swal.fire({
                          title: 'Login Required',
                          text: 'Please log in to make a donation',
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonText: 'Go to Login',
                          cancelButtonText: 'Cancel',
                          confirmButtonColor: '#3085d6',
                          cancelButtonColor: '#d33'
                        }).then((result) => {
                          if (result.isConfirmed) {
                            navigate('/login');
                          }
                        });
                        return;
                      }
                      navigate(`/donations/${donation._id}`);
                    }}
                    className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-1 text-sm"
                  >
                    <FaDonate />
                    {user ? 'Donate' : 'Login'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedDonations;
