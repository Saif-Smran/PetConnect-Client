import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import {
    FaChartBar,
    FaPlus,
    FaPaw,
    FaDonate,
    FaBullhorn,
    FaHeart,
    FaHandshake,
    FaUser,
    FaHome,
    FaSignOutAlt
} from 'react-icons/fa';
import { showConfirmation, showSuccess } from '../utils/notifications';
import { useNavigate } from 'react-router-dom';

const UserDashboardLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const userMenuItems = [
        {
            id: 'overview',
            name: 'Overview',
            path: '/dashboard',
            icon: FaChartBar
        },
        {
            id: 'add-pet',
            name: 'Add a Pet',
            path: '/dashboard/add-pet',
            icon: FaPlus
        },
        {
            id: 'my-pets',
            name: 'My Added Pets',
            path: '/dashboard/my-pets',
            icon: FaPaw
        },
        {
            id: 'adoption-requests',
            name: 'Adoption Request',
            path: '/dashboard/adoption-requests',
            icon: FaHandshake
        },
        {
            id: 'create-donation',
            name: 'Create Donation Campaign',
            path: '/dashboard/create-donation-campaign',
            icon: FaDonate
        },
        {
            id: 'my-donation-campaigns',
            name: 'My Donation Campaigns',
            path: '/dashboard/my-donation-campaigns',
            icon: FaBullhorn
        },
        {
            id: 'my-donations',
            name: 'My Donations',
            path: '/dashboard/my-donations',
            icon: FaHeart
        }
    ];

    const handleLogout = async () => {
        const result = await showConfirmation(
            'Logout Confirmation',
            'Are you sure you want to logout?',
            'Yes, Logout'
        );

        if (result.isConfirmed) {
            try {
                await logout();
                navigate('/');
                showSuccess('Logged Out', 'You have been successfully logged out.');
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-base-200">
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-base-100 shadow-lg min-h-screen">
                    <div className="p-4">
                        {/* User Profile Section */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="avatar">
                                <div className="w-12 h-12 rounded-full">
                                    <img 
                                        src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email)}&background=3B82F6&color=ffffff&size=48&rounded=true`} 
                                        alt="User" 
                                    />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-base-content">{user?.displayName || 'User'}</h2>
                                <p className="text-sm text-base-content/70">Dashboard</p>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="space-y-2">
                            {userMenuItems.map((item) => (
                                <Link
                                    key={item.id}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        isActive(item.path)
                                            ? 'bg-primary text-primary-content'
                                            : 'text-base-content hover:bg-base-200'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* Footer Actions */}
                        <div className="mt-8 pt-4 border-t border-base-300">
                            <Link
                                to="/"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base-content hover:bg-base-200 transition-colors mb-2"
                            >
                                <FaHome className="w-5 h-5" />
                                <span>Back to Home</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error/10 transition-colors w-full"
                            >
                                <FaSignOutAlt className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default UserDashboardLayout;
