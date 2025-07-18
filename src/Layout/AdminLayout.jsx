import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
    FaChartBar, 
    FaUsers,
    FaPaw, 
    FaHeart, 
    FaHome, 
    FaSignOutAlt, 
    FaBars,
    FaTimes,
    FaUserShield,
    FaPlus,
    FaList,
    FaDonate,
    FaHandshake,
    FaUser,
    FaBullhorn
} from 'react-icons/fa';
import { showConfirmation, showSuccess } from '../utils/notifications';

const AdminLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const adminMenuItems = [
        {
            id: 'dashboard',
            name: 'Dashboard',
            path: '/admin/dashboard',
            icon: FaChartBar
        },
        {
            id: 'users',
            name: 'User Management',
            path: '/admin/users',
            icon: FaUsers
        },
        {
            id: 'pets',
            name: 'Pet Management',
            path: '/admin/pets',
            icon: FaPaw
        },
        {
            id: 'donations',
            name: 'Donations',
            path: '/admin/donations',
            icon: FaHeart
        }
    ];

    const userMenuItems = [
        {
            id: 'add-pet',
            name: 'Add Pet',
            path: '/admin/add-pet',
            icon: FaPlus
        },
        {
            id: 'my-pets',
            name: 'My Added Pets',
            path: '/admin/my-pets',
            icon: FaPaw
        },
        {
            id: 'create-donation',
            name: 'Create Donation',
            path: '/admin/create-donation-campaign',
            icon: FaDonate
        },
        {
            id: 'my-donation-campaigns',
            name: 'My Campaigns',
            path: '/admin/my-donation-campaigns',
            icon: FaBullhorn
        },
        {
            id: 'my-donations',
            name: 'My Donations',
            path: '/admin/my-donations',
            icon: FaHeart
        },
        {
            id: 'adoption-requests',
            name: 'Adoption Requests',
            path: '/admin/adoption-requests',
            icon: FaHandshake
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
        <div className="flex w-full h-full">
            {/* Mobile menu overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-base-100 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:block`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between h-16 px-4 bg-primary">
                        <div className="flex items-center gap-2">
                            <FaUserShield className="w-8 h-8 text-primary-content" />
                            <span className="text-xl font-bold text-primary-content">Admin Panel</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-primary-content hover:text-primary-content/80"
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Admin info */}
                    <div className="p-4 border-b border-base-200">
                        <div className="flex items-center gap-3">
                            <div className="avatar">
                                <div className="w-10 h-10 rounded-full">
                                    <img 
                                        src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email)}&background=3B82F6&color=ffffff&size=40&rounded=true`} 
                                        alt="Admin" 
                                    />
                                </div>
                            </div>
                            <div>
                                <p className="font-medium text-base-content">{user?.displayName || 'Admin'}</p>
                                <p className="text-sm text-base-content/70">Administrator</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                        {/* Admin Menu */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wider mb-2">Admin Functions</h3>
                            <ul className="space-y-2">
                                {adminMenuItems.map((item) => (
                                    <li key={item.id}>
                                        <Link
                                            to={item.path}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                                isActive(item.path)
                                                    ? 'bg-primary text-primary-content'
                                                    : 'text-base-content hover:bg-base-200'
                                            }`}
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <item.icon className="w-5 h-5 flex-shrink-0" />
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* User Menu */}
                        <div>
                            <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wider mb-2">User Functions</h3>
                            <ul className="space-y-2">
                                {userMenuItems.map((item) => (
                                    <li key={item.id}>
                                        <Link
                                            to={item.path}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                                isActive(item.path)
                                                    ? 'bg-secondary text-secondary-content'
                                                    : 'text-base-content hover:bg-base-200'
                                            }`}
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <item.icon className="w-5 h-5 flex-shrink-0" />
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </nav>

                    {/* Footer actions */}
                    <div className="p-4 border-t border-base-200">
                        <Link
                            to="/"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-base-content hover:bg-base-200 transition-colors mb-2"
                        >
                            <FaHome className="w-5 h-5 flex-shrink-0" />
                            <span>Back to Website</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-error hover:bg-error/10 transition-colors w-full"
                        >
                            <FaSignOutAlt className="w-5 h-5 flex-shrink-0" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col lg:ml-0">
                {/* Mobile menu button */}
                <div className="lg:hidden bg-base-100 shadow-sm border-b border-base-200">
                    <div className="flex items-center justify-between h-16 px-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-base-content hover:text-base-content/80"
                        >
                            <FaBars className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-semibold text-base-content">
                            Admin Panel
                        </h1>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-base-200">
                    <div className="w-full h-full">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
