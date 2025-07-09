import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaHeart, FaBullseye, FaDonate, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import DonationModal from '../components/Donation/DonationModal';
import RecommendedDonations from '../components/Donation/RecommendedDonations';
import LoadingSpinner from '../components/PetListing/LoadingSpinner';
import ErrorMessage from '../components/PetListing/ErrorMessage';
import { useAuth } from '../hooks/useAuth';
import Swal from 'sweetalert2';

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDonateClick = () => {
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
    setIsModalOpen(true);
  };

  const { data: donation, isLoading, error } = useQuery({
    queryKey: ['donation', id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/donations/${id}`);
      return response.data;
    },
    enabled: !!id
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load donation details" />;
  if (!donation) return <ErrorMessage message="Donation not found" />;

  // Handle both old and new data formats
  const title = donation.title || donation.petName || 'Untitled Campaign';
  const image = donation.image || donation.petImage || '/placeholder.jpg';
  const target = donation.target || donation.maxDonation || 0;
  const raised = donation.raised || donation.donatedAmount || 0;
  const organizer = donation.organizer || 'Unknown';
  const location = donation.location || 'Unknown Location';
  const deadline = donation.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const status = donation.status || 'active';
  const category = donation.category || 'Pet Care';
  const description = donation.description || 'Help this pet in need.';

  const progressPercentage = target > 0 ? Math.min((raised / target) * 100, 100) : 0;
  const daysLeft = Math.max(0, Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {status}
                  </span>
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {category}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <FaUser className="text-blue-300" />
                    <span>By {organizer}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MdLocationOn className="text-red-300" />
                    <span>{location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt className="text-yellow-300" />
                    <span>{daysLeft} days left</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Donation Progress */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Raised</span>
                  <span className="text-sm font-medium text-gray-600">Goal</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    ${raised.toLocaleString()}
                  </span>
                  <span className="text-xl font-semibold text-gray-700">
                    ${target.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{progressPercentage.toFixed(1)}% funded</span>
                  <span>{donation.donorsCount || 0} donors</span>
                </div>
              </div>

              <button
                onClick={handleDonateClick}
                className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <FaDonate className="text-xl" />
                {user ? 'Donate Now' : 'Login to Donate'}
              </button>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">About This Campaign</h2>
              <div className="prose max-w-none text-gray-600 leading-relaxed">
                <p>{description}</p>
              </div>
            </div>

            {/* Campaign Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Campaign Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <FaBullseye className="text-blue-500 text-xl" />
                  <div>
                    <p className="font-semibold text-gray-800">Target Amount</p>
                    <p className="text-gray-600">${target.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-green-500 text-xl" />
                  <div>
                    <p className="font-semibold text-gray-800">Deadline</p>
                    <p className="text-gray-600">
                      {new Date(deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaUser className="text-purple-500 text-xl" />
                  <div>
                    <p className="font-semibold text-gray-800">Organizer</p>
                    <p className="text-gray-600">{organizer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MdLocationOn className="text-red-500 text-xl" />
                  <div>
                    <p className="font-semibold text-gray-800">Location</p>
                    <p className="text-gray-600">{location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Donations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Recent Donations</h3>
              {donation.recentDonations && donation.recentDonations.length > 0 ? (
                <div className="space-y-3">
                  {donation.recentDonations.slice(0, 5).map((recentDonation, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {recentDonation.donorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{recentDonation.donorName}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(recentDonation.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-green-600">
                        ${recentDonation.amount}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No donations yet. Be the first!</p>
              )}
            </div>

            {/* Campaign Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Campaign Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Raised</span>                    <span className="font-bold text-green-600">
                      ${raised.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Donors</span>
                    <span className="font-bold">{donation.donorsCount || 0}</span>
                  </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days Remaining</span>
                  <span className="font-bold text-blue-600">{daysLeft}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-bold text-purple-600">
                    {progressPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Donations */}
        <div className="mt-12">
          <RecommendedDonations currentDonationId={id} />
        </div>

        {/* Donation Modal */}
        <DonationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          donation={donation}
        />
      </div>
    </div>
  );
};

export default DonationDetails;
