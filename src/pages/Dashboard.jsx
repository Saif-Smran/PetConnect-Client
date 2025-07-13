import React, { useState, useEffect } from 'react';
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

    // Fetch user role from database
    useEffect(() => {
        const fetchUserRole = async () => {
            if (user?.uid) {
                try {
                    const token = localStorage.getItem('access_token');
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
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
    }, [user]);

    const handleMenuClick = (menuId) => {
        setActiveMenuItem(menuId);
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
                                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="text-2xl">👋</span>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-base-content">
                                        Welcome back, {user?.displayName || 'User'}!
                                    </h1>
                                    <p className="text-base-content/70">
                                        Manage your pets and help make a difference
                                    </p>
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
                                <h3 className="text-2xl font-bold text-base-content mb-1">0</h3>
                                <p className="text-base-content/70 text-sm">My Pets</p>
                            </div>

                            <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                                        <FaHeart className="w-6 h-6 text-secondary" />
                                    </div>
                                    <span className="text-sm text-base-content/60">Pending</span>
                                </div>
                                <h3 className="text-2xl font-bold text-base-content mb-1">0</h3>
                                <p className="text-base-content/70 text-sm">Adoption Requests</p>
                            </div>

                            <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                                        <FaBullhorn className="w-6 h-6 text-accent" />
                                    </div>
                                    <span className="text-sm text-base-content/60">Active</span>
                                </div>
                                <h3 className="text-2xl font-bold text-base-content mb-1">0</h3>
                                <p className="text-base-content/70 text-sm">Campaigns</p>
                            </div>

                            <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                                        <FaDonate className="w-6 h-6 text-success" />
                                    </div>
                                    <span className="text-sm text-base-content/60">Total</span>
                                </div>
                                <h3 className="text-2xl font-bold text-base-content mb-1">$0</h3>
                                <p className="text-base-content/70 text-sm">Donated</p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold text-base-content mb-6">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <button 
                                    onClick={() => handleMenuClick('add-pet')}
                                    className="btn btn-primary btn-lg gap-3 hover:scale-105 transition-all duration-300"
                                >
                                    <FaPlusCircle className="w-5 h-5" />
                                    Add a Pet
                                </button>
                                <button 
                                    onClick={() => handleMenuClick('create-donation')}
                                    className="btn btn-secondary btn-lg gap-3 hover:scale-105 transition-all duration-300"
                                >
                                    <FaBullhorn className="w-5 h-5" />
                                    Create Campaign
                                </button>
                                <button 
                                    onClick={() => handleMenuClick('my-pets')}
                                    className="btn btn-outline btn-lg gap-3 hover:scale-105 transition-all duration-300"
                                >
                                    <FaPaw className="w-5 h-5" />
                                    View My Pets
                                </button>
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
