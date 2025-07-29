import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaInfoCircle, FaDonate, FaHeart, FaBullseye } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/useAuth';
import DonationModal from '../components/Donation/DonationModal';
import DynamicTitle from '../components/DynamicTitle';

const fetchDonations = async ({ pageParam = 0 }) => {
  const limit = 6;
  const response = await axios.get(`https://pet-connect-server-one.vercel.app/donations?skip=${pageParam}&limit=${limit}`);
  return response.data;
};

const DonationCampaigns = () => {
  const [selectedAmount, setSelectedAmount] = React.useState(null);
  const [showCustomAmount, setShowCustomAmount] = React.useState(false);
  const [customAmount, setCustomAmount] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['donations'],
    queryFn: fetchDonations,
    getNextPageParam: (lastPage, allPages) => {
      // Stop if last page was smaller than limit (no more)
      if (lastPage.length < 6) return undefined;
      return allPages.length * 6;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleDonationClick = (amount) => {
    setSelectedAmount(amount);
    setShowCustomAmount(false);
    // Show selection confirmation
    Swal.fire({
      title: 'Amount Selected!',
      text: `You've selected $${amount} for donation`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  const handleCustomAmountClick = () => {
    setShowCustomAmount(true);
    setSelectedAmount(null);
  };

  const handleCustomAmountSubmit = () => {
    if (customAmount && parseFloat(customAmount) > 0) {
      setSelectedAmount(parseFloat(customAmount));
      setShowCustomAmount(false);
      // Show custom amount confirmation
      Swal.fire({
        title: 'Custom Amount Set!',
        text: `You've set $${customAmount} for donation`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } else {
      // Show error for invalid amount
      Swal.fire({
        title: 'Invalid Amount',
        text: 'Please enter a valid amount greater than $0',
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleDonationDetails = (donationId) => {
    navigate(`/donations/${donationId}`);
  };

  const handleMainDonateClick = () => {
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

    // Open the donation modal
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Create a general donation object for the modal
  const generalDonation = {
    _id: 'general-donation',
    title: 'General Pet Care Fund',
    description: 'Support our general fund to help pets in need',
    image: '/api/placeholder/400/300',
    target: 10000,
    raised: 6500,
    petName: 'All Pets',
    petAge: 'Various',
    category: 'General Support'
  };

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allDonations = data?.pages.flat() || [];
  const totalCampaigns = allDonations.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 relative overflow-hidden">
      <DynamicTitle title="Donation Campaigns - Support Pet Care" />
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-secondary/3"></div>
      
      <div className="max-w-11/12 mx-auto px-6 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary font-medium mb-6">
            <FaHeart className="w-5 h-5" />
            <span>Donation Campaigns</span>
          </div>
          <h1 className="font-secondary font-bold text-5xl md:text-7xl mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            Help Save Lives
          </h1>
          <p className="font-primary text-xl md:text-2xl text-base-content/70 max-w-4xl mx-auto leading-relaxed mb-8">
            Every donation makes a difference. Support our rescue missions and help give pets the second chance they deserve.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">{totalCampaigns}+</div>
              <div className="text-base-content/70">Active Campaigns</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-1">$25K+</div>
              <div className="text-base-content/70">Raised This Month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-1">500+</div>
              <div className="text-base-content/70">Lives Saved</div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {status === 'loading' && (
          <div className="text-center my-16">
            <div className="flex flex-col items-center gap-4">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-base-content/70 text-lg">Loading donation campaigns...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="text-center my-16">
            <div className="backdrop-blur-lg bg-base-100/30 border border-red-200 rounded-3xl p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">💔</div>
              <h3 className="text-2xl font-bold text-base-content mb-2">Oops! Something went wrong</h3>
              <p className="text-base-content/70 mb-6">We couldn't load the donation campaigns right now. Please try again.</p>
              <button 
                onClick={() => window.location.reload()}
                className="btn btn-primary gap-2"
              >
                <FaHeart className="w-5 h-5" />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Donation Campaigns Grid */}
        {status === 'success' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allDonations.map((donation, index) => {
                // Handle both old and new data formats
                const title = donation.title || donation.petName || 'Untitled Campaign';
                const image = donation.image || donation.petImage || '/placeholder.jpg';
                const target = donation.target || donation.maxDonation || 0;
                const raised = donation.raised || donation.donatedAmount || 0;
                const progressPercentage = target > 0 ? Math.min((raised / target) * 100, 100) : 0;
                
                return (
                  <div
                    key={`${donation._id}-${index}`}
                    className="group backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
                  >
                    {/* Campaign Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Urgent Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="badge badge-error text-white font-medium px-3 py-2">
                          Urgent
                        </span>
                      </div>
                      {/* Progress Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div className="text-white">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Goal Progress</span>
                            <span className="text-sm">{progressPercentage.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Campaign Content */}
                    <div className="p-6">
                      <h3 className="font-secondary font-bold text-2xl mb-3 text-base-content group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      
                      {/* Donation Stats */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-base-content/70">
                            <FaBullseye className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">Goal:</span>
                          </div>
                          <span className="text-lg font-bold text-primary">${target.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-base-content/70">
                            <FaHeart className="w-4 h-4 text-secondary" />
                            <span className="text-sm font-medium">Raised:</span>
                          </div>
                          <span className="text-lg font-bold text-secondary">${raised.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-base-content/70">
                            <span className="text-sm font-medium">Remaining:</span>
                          </div>
                          <span className="text-sm font-medium text-base-content/80">
                            ${(target - raised).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleDonationDetails(donation._id)}
                          className="flex-1 btn btn-outline btn-sm gap-2 hover:btn-primary transition-all duration-300"
                        >
                          <FaInfoCircle className="w-4 h-4" />
                          Details
                        </button>
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
                            
                            Swal.fire({
                              title: `${title}`,
                              html: `
                                <div class="text-center">
                                  <img src="${image}" alt="${title}" class="w-32 h-32 object-cover rounded-full mx-auto mb-4">
                                  <p class="text-lg mb-2">Support <strong>${title}</strong></p>
                                  <div class="bg-blue-50 p-4 rounded-lg mb-4">
                                    <p class="text-sm"><strong>Goal:</strong> $${target.toLocaleString()}</p>
                                    <p class="text-sm"><strong>Raised:</strong> $${raised.toLocaleString()}</p>
                                    <p class="text-sm"><strong>Remaining:</strong> $${(target - raised).toLocaleString()}</p>
                                  </div>
                                  <p class="text-sm text-gray-600">Every donation helps save lives!</p>
                                </div>
                              `,
                              icon: 'info',
                              showCancelButton: true,
                              confirmButtonText: '💖 Donate Now',
                              cancelButtonText: 'Maybe Later',
                              confirmButtonColor: '#10b981',
                              cancelButtonColor: '#6b7280'
                            }).then((result) => {
                              if (result.isConfirmed) {
                                // Navigate to donation details page
                                handleDonationDetails(donation._id);
                              }
                            });
                          }}
                          className="flex-1 btn btn-primary btn-sm gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                          <FaDonate className="w-4 h-4" />
                          {user ? 'Donate Now' : 'Login to Donate'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Donor Wall Section */}
            <div className="mt-20 mb-16">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full text-secondary font-medium mb-6">
                  <FaHeart className="w-5 h-5" />
                  <span>Our Amazing Donors</span>
                </div>
                <h2 className="font-secondary font-bold text-4xl md:text-5xl mb-4 bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
                  Thank You Heroes
                </h2>
                <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                  These wonderful people are making a difference in pets' lives with their generous donations
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {[
                  { name: "Sarah M.", amount: 250, avatar: "👩‍💼" },
                  { name: "John D.", amount: 500, avatar: "👨‍🔬" },
                  { name: "Emma L.", amount: 150, avatar: "👩‍🎨" },
                  { name: "Michael R.", amount: 300, avatar: "👨‍💻" },
                  { name: "Lisa K.", amount: 400, avatar: "👩‍⚕️" },
                  { name: "David S.", amount: 200, avatar: "👨‍🏫" },
                  { name: "Anna P.", amount: 350, avatar: "👩‍🔬" },
                  { name: "Tom W.", amount: 180, avatar: "👨‍🎨" },
                  { name: "Grace H.", amount: 220, avatar: "👩‍💻" },
                  { name: "Ryan B.", amount: 275, avatar: "👨‍⚕️" },
                  { name: "Sophie C.", amount: 320, avatar: "👩‍🏫" },
                  { name: "Alex T.", amount: 190, avatar: "👨‍💼" }
                ].map((donor, index) => (
                  <div
                    key={index}
                    className="group backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-2xl p-4 text-center hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {donor.avatar}
                    </div>
                    <h4 className="font-semibold text-base-content mb-1">{donor.name}</h4>
                    <p className="text-sm text-primary font-bold">${donor.amount}</p>
                    <div className="flex justify-center mt-2">
                      <FaHeart className="w-3 h-3 text-red-500" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <p className="text-base-content/60 text-sm">
                  Join our donor wall by making a donation today!
                </p>
              </div>
            </div>

            {/* Infinite Scroll Trigger */}
            <div ref={ref} className="py-12 text-center">
              {isFetchingNextPage && (
                <div className="flex flex-col items-center gap-4">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <p className="text-base-content/70">Loading more campaigns...</p>
                </div>
              )}
              {!hasNextPage && status === 'success' && allDonations.length > 0 && (
                <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl p-6 max-w-md mx-auto">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-base-content/70">You've seen all current campaigns!</p>
                  <p className="text-sm text-base-content/50 mt-2">Check back later for new campaigns</p>
                </div>
              )}
              {allDonations.length === 0 && status === 'success' && (
                <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl p-8 max-w-md mx-auto">
                  <div className="text-6xl mb-4">💝</div>
                  <h3 className="text-2xl font-bold text-base-content mb-2">No campaigns yet</h3>
                  <p className="text-base-content/70 mb-6">We're working on new campaigns to help more pets in need.</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="btn btn-outline gap-2"
                  >
                    <HiSparkles className="w-5 h-5" />
                    Refresh Page
                  </button>
                </div>
              )}
            </div>

            {/* Make Your Donation Today CTA Section */}
            <div className="mt-20 mb-16">
              <div className="backdrop-blur-lg bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-base-content/10 rounded-3xl p-12 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full text-accent font-medium mb-6">
                  <FaDonate className="w-5 h-5" />
                  <span>Make a Difference</span>
                </div>
                
                <h2 className="font-secondary font-bold text-4xl md:text-6xl mb-6 bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
                  Make Your Donation Today
                </h2>
                
                <p className="text-xl md:text-2xl text-base-content/70 max-w-3xl mx-auto leading-relaxed mb-8">
                  Every contribution counts. Your generosity can provide food, medical care, and shelter for pets in need. 
                  Together, we can save more lives and give these beautiful animals the love they deserve.
                </p>

                {/* Impact Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-2xl p-6">
                    <div className="text-3xl mb-2">🍽️</div>
                    <h4 className="text-lg font-bold text-base-content mb-1">$25</h4>
                    <p className="text-sm text-base-content/70">Feeds a pet for one month</p>
                  </div>
                  <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-2xl p-6">
                    <div className="text-3xl mb-2">🏥</div>
                    <h4 className="text-lg font-bold text-base-content mb-1">$100</h4>
                    <p className="text-sm text-base-content/70">Covers basic medical care</p>
                  </div>
                  <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-2xl p-6">
                    <div className="text-3xl mb-2">🏠</div>
                    <h4 className="text-lg font-bold text-base-content mb-1">$250</h4>
                    <p className="text-sm text-base-content/70">Provides shelter for a week</p>
                  </div>
                </div>

                {/* Quick Donation Amounts */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {[25, 50, 100, 250, 500].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleDonationClick(amount)}
                      className={`btn transition-all duration-300 hover:scale-105 ${
                        selectedAmount === amount 
                          ? 'btn-primary' 
                          : 'btn-outline hover:btn-primary'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                  <button 
                    onClick={handleCustomAmountClick}
                    className={`btn transition-all duration-300 hover:scale-105 ${
                      showCustomAmount 
                        ? 'btn-accent' 
                        : 'btn-outline hover:btn-accent'
                    }`}
                  >
                    Custom Amount
                  </button>
                </div>

                {/* Custom Amount Input */}
                {showCustomAmount && (
                  <div className="flex justify-center gap-4 mb-8">
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="input input-bordered w-32 text-center"
                      min="1"
                    />
                    <button
                      onClick={handleCustomAmountSubmit}
                      className="btn btn-accent btn-sm"
                    >
                      Set Amount
                    </button>
                  </div>
                )}

                {/* Main CTA Button */}
                <div className="space-y-4">
                  <button 
                    onClick={handleMainDonateClick}
                    className="btn btn-primary btn-lg px-8 gap-3 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                  >
                    <FaHeart className="w-6 h-6" />
                    {user ? 'Donate Now & Save Lives' : 'Login to Donate & Save Lives'}
                    {(selectedAmount || customAmount) && (
                      <span className="badge badge-secondary ml-2">
                        ${selectedAmount || customAmount}
                      </span>
                    )}
                  </button>
                  <p className="text-sm text-base-content/60">
                    Your donation is secure and tax-deductible. 100% goes directly to pet care.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Donation Modal */}
      <DonationModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        donation={generalDonation}
      />
    </div>
  );
};

export default DonationCampaigns;
