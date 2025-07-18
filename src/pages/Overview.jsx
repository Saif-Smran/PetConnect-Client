import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
    FaPaw, 
    FaHeart, 
    FaDonate, 
    FaBullhorn,
    FaHandHoldingHeart
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

const Overview = () => {
    const { user } = useAuth();
    const [userStats, setUserStats] = useState({
        myPetsCount: 0,
        myCampaignsCount: 0,
        totalDonated: 0,
        pendingAdoptionRequests: 0,
        activeCampaigns: 0,
        recentDonations: 0,
        recentAdoptionRequests: 0
    });
    const [statsLoading, setStatsLoading] = useState(true);

    // Fetch user dashboard statistics
    const fetchUserStats = useCallback(async () => {
        if (!user) return;
        
        try {
            setStatsLoading(true);
            const token = await user.getIdToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/user-stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const stats = await response.json();
                setUserStats(stats);
            } else {
                console.error('Failed to fetch user stats');
            }
        } catch (error) {
            console.error('Error fetching user stats:', error);
        } finally {
            setStatsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchUserStats();
    }, [fetchUserStats]);

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="backdrop-blur-lg bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-base-content/10 rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                        <span className="text-2xl">👋</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-base-content">
                            Welcome back, {user?.displayName || 'User'}!
                        </h1>
                        <p className="text-base-content/70">
                            Manage your pets, create campaigns, and help make a difference
                        </p>
                    </div>
                </div>
                
                {/* Quick Info */}
                <div className="mt-6 p-4 bg-base-100/20 rounded-xl border border-base-content/5">
                    <div className="flex items-center gap-2 text-sm text-base-content/60">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                        <span>Dashboard updated • {new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <FaPaw className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-sm text-base-content/60">Total</span>
                    </div>
                    <h3 className="text-2xl font-bold text-base-content mb-1">
                        {statsLoading ? (
                            <div className="animate-pulse w-8 h-8 bg-base-content/20 rounded"></div>
                        ) : (
                            userStats.myPetsCount
                        )}
                    </h3>
                    <p className="text-base-content/70 text-sm">My Added Pets</p>
                </div>

                <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                            <FaHeart className="w-6 h-6 text-secondary" />
                        </div>
                        <span className="text-sm text-base-content/60">Pending</span>
                    </div>
                    <h3 className="text-2xl font-bold text-base-content mb-1">
                        {statsLoading ? (
                            <div className="animate-pulse w-8 h-8 bg-base-content/20 rounded"></div>
                        ) : (
                            userStats.pendingAdoptionRequests
                        )}
                    </h3>
                    <p className="text-base-content/70 text-sm">Adoption Requests</p>
                </div>

                <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                            <FaBullhorn className="w-6 h-6 text-accent" />
                        </div>
                        <span className="text-sm text-base-content/60">Active</span>
                    </div>
                    <h3 className="text-2xl font-bold text-base-content mb-1">
                        {statsLoading ? (
                            <div className="animate-pulse w-8 h-8 bg-base-content/20 rounded"></div>
                        ) : (
                            userStats.activeCampaigns
                        )}
                    </h3>
                    <p className="text-base-content/70 text-sm">Campaigns</p>
                </div>

                <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                            <FaDonate className="w-6 h-6 text-success" />
                        </div>
                        <span className="text-sm text-base-content/60">Total</span>
                    </div>
                    <h3 className="text-2xl font-bold text-base-content mb-1">
                        {statsLoading ? (
                            <div className="animate-pulse w-8 h-8 bg-base-content/20 rounded"></div>
                        ) : (
                            `$${userStats.totalDonated.toFixed(2)}`
                        )}
                    </h3>
                    <p className="text-base-content/70 text-sm">Donated</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <HiSparkles className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold text-base-content">Quick Actions</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="group p-6 bg-base-100/50 rounded-2xl border border-base-content/10 hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FaPaw className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base-content">Add New Pet</h3>
                                <p className="text-sm text-base-content/70">List a pet for adoption</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="group p-6 bg-base-100/50 rounded-2xl border border-base-content/10 hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FaBullhorn className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base-content">Create Campaign</h3>
                                <p className="text-sm text-base-content/70">Start a donation campaign</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="group p-6 bg-base-100/50 rounded-2xl border border-base-content/10 hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FaHandHoldingHeart className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base-content">Browse Pets</h3>
                                <p className="text-sm text-base-content/70">Find pets to adopt</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-base-content mb-6">Recent Activity</h2>
                <div className="space-y-4">
                    {statsLoading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-base-content/20 rounded w-3/4"></div>
                            <div className="h-4 bg-base-content/20 rounded w-1/2"></div>
                            <div className="h-4 bg-base-content/20 rounded w-2/3"></div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-base-content/10 flex items-center justify-center mx-auto mb-4">
                                <FaPaw className="w-8 h-8 text-base-content/40" />
                            </div>
                            <p className="text-base-content/70">
                                {!statsLoading && userStats.activeCampaigns > 0 ? 
                                    `${userStats.activeCampaigns} active campaign${userStats.activeCampaigns > 1 ? 's' : ''}` : 
                                    'No active campaigns'
                                }
                            </p>
                            <div className="text-sm text-base-content/60">
                                {!statsLoading && userStats.totalDonated > 0 && (
                                    <span>${userStats.totalDonated.toFixed(2)} total contributed</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Overview;
