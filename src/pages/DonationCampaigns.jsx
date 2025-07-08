import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaInfoCircle, FaDonate, FaHeart, FaBullseye } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

const fetchDonations = async ({ pageParam = 0 }) => {
  const limit = 6;
  const response = await axios.get(`http://localhost:3000/donations?skip=${pageParam}&limit=${limit}`);
  return response.data;
};

const DonationCampaigns = () => {
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
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-secondary/3"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
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
                const progressPercentage = Math.min((donation.donatedAmount / donation.maxDonation) * 100, 100);
                
                return (
                  <div
                    key={`${donation._id}-${index}`}
                    className="group backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
                  >
                    {/* Campaign Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={donation.petImage}
                        alt={donation.petName}
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
                        Help {donation.petName}
                      </h3>
                      
                      {/* Donation Stats */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-base-content/70">
                            <FaBullseye className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">Goal:</span>
                          </div>
                          <span className="text-lg font-bold text-primary">${donation.maxDonation.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-base-content/70">
                            <FaHeart className="w-4 h-4 text-secondary" />
                            <span className="text-sm font-medium">Raised:</span>
                          </div>
                          <span className="text-lg font-bold text-secondary">${donation.donatedAmount.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-base-content/70">
                            <span className="text-sm font-medium">Remaining:</span>
                          </div>
                          <span className="text-sm font-medium text-base-content/80">
                            ${(donation.maxDonation - donation.donatedAmount).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Link
                          to={`/donations/${donation._id}`}
                          className="flex-1 btn btn-outline btn-sm gap-2 hover:btn-primary transition-all duration-300"
                        >
                          <FaInfoCircle className="w-4 h-4" />
                          Details
                        </Link>
                        <button className="flex-1 btn btn-primary btn-sm gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                          <FaDonate className="w-4 h-4" />
                          Donate Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
          </>
        )}
      </div>
    </div>
  );
};

export default DonationCampaigns;
