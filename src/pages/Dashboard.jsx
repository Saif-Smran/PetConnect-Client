import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import AdminDashboard from '../components/Admin/AdminDashboard';
import AddPet from './AddPet';
import MyAddedPets from './MyAddedPets';
import CreateDonationCampaign from './CreateDonationCampaign';
import MyDonationCampaigns from './MyDonationCampaigns';
import DashboardLayout from '../Layout/DashboardLayout';
import { 
    FaPlusCircle, 
    FaPaw, 
    FaHeart, 
    FaDonate, 
    FaBullhorn,
    FaHandHoldingHeart,
    FaBars,
    FaTimes,
    FaUser,
    FaBell,
    FaCog,
    FaSignOutAlt,
    FaHome,
    FaChevronRight
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

const Dashboard = ({ defaultTab }) => {
    const { user } = useAuth();
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeMenuItem, setActiveMenuItem] = useState(defaultTab || 'overview');
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

    // Fetch user role from database
    useEffect(() => {
        const fetchUserRole = async () => {
            if (user?.uid) {
                try {
                    const token = await user.getIdToken();
                    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/profile`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        setUserRole(userData.role);
                    }
                } catch (error) {
                    console.error('Error fetching user role:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUserRole();
        fetchUserStats();
    }, [user, fetchUserStats]);

    const handleMenuClick = (menuId) => {
        setActiveMenuItem(menuId);
        
        // Refresh stats when switching to overview
        if (menuId === 'overview') {
            fetchUserStats();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 via-base-100 to-base-200">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-base-content/70">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Show admin dashboard if user is admin
    if (userRole === 'admin') {
        return <AdminDashboard />;
    }

    const renderContent = () => {
        switch (activeMenuItem) {
            case 'overview':
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
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-base-content">Quick Actions</h2>
                                <button 
                                    onClick={fetchUserStats}
                                    disabled={statsLoading}
                                    className="btn btn-ghost btn-sm hover:btn-primary transition-all duration-300"
                                    title="Refresh statistics"
                                >
                                    {statsLoading ? (
                                        <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                                    ) : (
                                        <>
                                            <span className="text-lg">🔄</span>
                                            <span className="ml-1 text-xs">Refresh</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <button 
                                    onClick={() => handleMenuClick('add-pet')}
                                    className="btn btn-primary btn-lg gap-3 hover:scale-105 transition-all duration-300 group"
                                >
                                    <FaPlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                    Add a Pet
                                </button>
                                <button 
                                    onClick={() => handleMenuClick('create-donation')}
                                    className="btn btn-secondary btn-lg gap-3 hover:scale-105 transition-all duration-300 group"
                                >
                                    <FaBullhorn className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                    Create Campaign
                                </button>
                                <button 
                                    onClick={() => handleMenuClick('my-pets')}
                                    className="btn btn-outline btn-lg gap-3 hover:scale-105 transition-all duration-300 group"
                                >
                                    <FaPaw className="w-5 h-5 group-hover:bounce transition-all duration-300" />
                                    View My Pets
                                </button>
                            </div>
                            
                            {/* Additional Quick Links */}
                            <div className="mt-6 pt-6 border-t border-base-content/10">
                                <h3 className="text-lg font-semibold text-base-content mb-4">Quick Links</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <button 
                                        onClick={() => handleMenuClick('my-campaigns')}
                                        className="btn btn-ghost btn-sm gap-2 hover:btn-accent transition-all duration-300"
                                    >
                                        <FaBullhorn className="w-4 h-4" />
                                        My Campaigns
                                    </button>
                                    <button 
                                        onClick={() => window.location.href = '/donations'}
                                        className="btn btn-ghost btn-sm gap-2 hover:btn-success transition-all duration-300"
                                    >
                                        <FaDonate className="w-4 h-4" />
                                        Donate
                                    </button>
                                    <button 
                                        onClick={() => window.location.href = '/pet-listing'}
                                        className="btn btn-ghost btn-sm gap-2 hover:btn-primary transition-all duration-300"
                                    >
                                        <FaHeart className="w-4 h-4" />
                                        Adopt Pet
                                    </button>
                                    <button 
                                        onClick={() => handleMenuClick('profile')}
                                        className="btn btn-ghost btn-sm gap-2 hover:btn-warning transition-all duration-300"
                                    >
                                        <FaUser className="w-4 h-4" />
                                        Profile
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Summary */}
                        <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-base-content">Recent Activity</h2>
                                <div className="text-sm text-base-content/60">
                                    Last 30 days
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                            <FaDonate className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base-content">Donations Made</h3>
                                            <p className="text-sm text-base-content/70">Your recent contributions</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl font-bold text-primary">
                                            {statsLoading ? (
                                                <div className="animate-pulse w-8 h-8 bg-base-content/20 rounded"></div>
                                            ) : (
                                                userStats.recentDonations
                                            )}
                                        </div>
                                        <div className="text-sm text-base-content/60">
                                            {!statsLoading && userStats.recentDonations > 0 && (
                                                <span className="badge badge-primary badge-sm">Active</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                                            <FaHeart className="w-5 h-5 text-secondary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base-content">Adoption Requests</h3>
                                            <p className="text-sm text-base-content/70">Recent inquiries for your pets</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl font-bold text-secondary">
                                            {statsLoading ? (
                                                <div className="animate-pulse w-8 h-8 bg-base-content/20 rounded"></div>
                                            ) : (
                                                userStats.recentAdoptionRequests
                                            )}
                                        </div>
                                        <div className="text-sm text-base-content/60">
                                            {!statsLoading && userStats.recentAdoptionRequests > 0 && (
                                                <span className="badge badge-secondary badge-sm">New</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Progress Summary */}
                            <div className="mt-6 p-4 bg-base-100/10 rounded-xl border border-base-content/5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                                        <span className="text-sm font-medium text-base-content">
                                            {!statsLoading && userStats.activeCampaigns > 0 ? 
                                                `${userStats.activeCampaigns} active campaign${userStats.activeCampaigns > 1 ? 's' : ''}` : 
                                                'No active campaigns'
                                            }
                                        </span>
                                    </div>
                                    <div className="text-sm text-base-content/60">
                                        {!statsLoading && userStats.totalDonated > 0 && (
                                            <span>${userStats.totalDonated.toFixed(2)} total contributed</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'add-pet':
                return <AddPet showEndpointInfo />;
            case 'my-pets':
                return <MyAddedPets />;
            case 'create-donation':
                return <CreateDonationCampaign />;
            case 'my-campaigns':
                return <MyDonationCampaigns />;
            default:
                return (
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl p-12 max-w-md">
                            <div className="text-6xl mb-6">🚧</div>
                            <h2 className="text-3xl font-bold text-base-content mb-4">Coming Soon</h2>
                            <p className="text-base-content/70 text-lg mb-6">
                                This feature is under development. We're working hard to bring you an amazing experience!
                            </p>
                            <div className="flex items-center justify-center gap-2 text-primary">
                                <HiSparkles className="w-5 h-5" />
                                <span className="font-medium">Stay tuned for updates</span>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    // Regular user dashboard with sidebar layout
    return (
        <DashboardLayout activeMenuId={activeMenuItem}>
            <main className="flex-1 p-6 overflow-y-auto">
                {renderContent()}
            </main>
        </DashboardLayout>
    );
};

export default Dashboard;
