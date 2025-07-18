import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { showConfirmation, showSuccess } from '../utils/notifications';
import api from '../utils/api';

import { 
    HiHome, 
    HiInformationCircle,
    HiSun,
    HiMoon,
    HiChevronDown,
    HiChevronUp,
    HiMenu,
    HiX,
    HiLogout,
    HiUser,
    HiCog,
    HiViewGrid
} from 'react-icons/hi';
import { 
    MdPets, 
    MdVolunteerActivism,
    MdDashboard,
    MdPerson,
    MdSettings,
    MdLogout 
} from 'react-icons/md';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const dropdownRef = useRef(null);

    // Fetch user role
    useEffect(() => {
        const fetchUserRole = async () => {
            if (user?.uid) {
                try {
                    const response = await api.get('/auth/profile');
                    if (response.status === 200) {
                        setUserRole(response.data.role);
                    }
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    // Fallback to localStorage token method
                    try {
                        const token = localStorage.getItem('access_token');
                        if (token) {
                            const fallbackResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });
                            if (fallbackResponse.ok) {
                                const userData = await fallbackResponse.json();
                                setUserRole(userData.role);
                            }
                        }
                    } catch (fallbackError) {
                        console.error('Fallback API call also failed:', fallbackError);
                    }
                }
            }
        };

        fetchUserRole();
    }, [user]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Navigation items
    const navItems = [
        { name: 'Home', path: '/', icon: HiHome },
        { name: 'Pet Listing', path: '/pets', icon: MdPets },
        { name: 'Donation Campaigns', path: '/donations', icon: MdVolunteerActivism },
        { name: 'About', path: '/about', icon: HiInformationCircle },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        const result = await showConfirmation(
            'Logout Confirmation',
            'Are you sure you want to logout?',
            'Yes, Logout'
        );

        if (result.isConfirmed) {
            try {
                await logout();
                setIsDropdownOpen(false);
                showSuccess('Logged Out', 'You have been successfully logged out.');
                navigate('/');
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-base-100/80 backdrop-blur-lg border-b border-base-300/50 sticky top-0 z-100 shadow-lg">
            <div className="max-w-11/12 mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-3">
                        <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300 p-2 rounded-xl hover:bg-primary/10">
                            <div className="relative">
                                <img 
                                    src="/Logo.png" 
                                    alt="PetConnect Logo" 
                                    className="h-12 w-12 object-contain transition-transform duration-300"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div 
                                    className="h-12 w-12 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-xl"
                                    style={{ display: 'none' }}
                                >
                                    <MdPets className="w-7 h-7" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-secondary font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    PetConnect
                                </span>
                                <span className="font-primary text-xs text-base-content/70 -mt-1">
                                    Find Your Perfect Companion
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center space-x-2">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`group flex items-center space-x-2 font-medium transition-all duration-300 px-4 py-2.5 rounded-xl relative overflow-hidden ${
                                        isActive(item.path)
                                            ? 'text-white bg-gradient-to-r from-primary to-secondary shadow-lg scale-105'
                                            : 'text-base-content hover:text-primary hover:bg-primary/10 hover:scale-105'
                                    }`}
                                >
                                    <IconComponent className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                                    <span className="relative z-10">{item.name}</span>
                                    {isActive(item.path) && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side - Auth, Mobile Menu */}
                    <div className="flex items-center space-x-4">
                        {/* Authentication Section */}
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={toggleDropdown}
                                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-primary/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <div className="relative">
                                        <img
                                            src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=3B82F6&color=ffffff&size=40&rounded=true`}
                                            alt={user.displayName || 'User'}
                                            className="h-10 w-10 rounded-full object-cover border-2 border-primary/20 hover:border-primary/50 transition-all duration-300"
                                        />
                                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-success rounded-full border-2 border-base-100"></div>
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="font-secondary font-medium text-sm">
                                            {user.displayName || 'User'}
                                        </p>
                                        <p className="font-primary text-xs opacity-70">
                                            {userRole === 'admin' ? '👑 Admin' : userRole === 'user' ? '👤 User' : '⏳ Loading...'}
                                        </p>
                                    </div>
                                    <HiChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-base-100 rounded-xl shadow-elevated border border-base-300/50 py-2 dropdown-menu">
                                        <div className="px-4 py-3 border-b border-base-300/50 bg-primary/5 rounded-t-xl">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=3B82F6&color=ffffff&size=40&rounded=true`}
                                                    alt={user.displayName || 'User'}
                                                    className="h-10 w-10 rounded-full object-cover border-2 border-primary/30"
                                                />
                                                <div>
                                                    <p className="font-secondary font-semibold text-sm">
                                                        {user.displayName || 'User'}
                                                    </p>
                                                    <p className="font-primary text-xs opacity-70 truncate max-w-[180px]">
                                                        {user.email}
                                                    </p>
                                                    {userRole && (
                                                        <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full mt-1 ${
                                                            userRole === 'admin' 
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {userRole === 'admin' ? '👑 Admin' : '👤 User'}
                                                        </span>
                                                    )}
                                                    {!userRole && (
                                                        <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full mt-1 bg-gray-100 text-gray-600">
                                                            ⏳ Loading...
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <Link
                                            to={userRole === 'admin' ? '/admin/dashboard' : '/dashboard'}
                                            className="flex items-center space-x-3 px-4 py-3 hover:bg-primary/10 transition-colors duration-200 group"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <MdDashboard className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                            <span className="font-primary font-medium">
                                                {userRole === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                                            </span>
                                            <span className="ml-auto text-xs opacity-50">⌘D</span>
                                        </Link>
                                        
                                        <Link
                                            to="/profile"
                                            className="flex items-center space-x-3 px-4 py-3 hover:bg-primary/10 transition-colors duration-200 group"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <HiUser className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                            <span className="font-primary font-medium">Profile</span>
                                            <span className="ml-auto text-xs opacity-50">⌘P</span>
                                        </Link>
                                        
                                        <Link
                                            to="/settings"
                                            className="flex items-center space-x-3 px-4 py-3 hover:bg-primary/10 transition-colors duration-200 group"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <HiCog className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                            <span className="font-primary font-medium">Settings</span>
                                            <span className="ml-auto text-xs opacity-50">⌘S</span>
                                        </Link>
                                        
                                        <div className="border-t border-base-300/50 mt-2 pt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center cursor-pointer space-x-3 px-4 py-3 w-full text-left hover:bg-error/10 hover:text-error transition-colors duration-200 group rounded-lg mx-2"
                                            >
                                                <HiLogout className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                                <span className="font-primary font-medium">Logout</span>
                                                <span className="ml-auto text-xs opacity-50">⌘Q</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login">
                                    <button className="btn-pet btn-pet-outline cursor-pointer !px-4 !py-2 text-sm flex items-center space-x-2">
                                        <FiLogIn className="w-4 h-4" />
                                        <span>Login</span>
                                    </button>
                                </Link>
                                {/* <Link to="/register">
                                    <button className="btn-pet btn-pet-primary !px-4 !py-2 text-sm flex items-center space-x-2">
                                        <FiUserPlus className="w-4 h-4" />
                                        <span>Register</span>
                                    </button>
                                </Link> */}
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="lg:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            {isMobileMenuOpen ? (
                                <HiX className="w-6 h-6" />
                            ) : (
                                <HiMenu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden mt-4 pb-4 border-t border-base-300/50 pt-4 mobile-menu">
                        <div className="flex flex-col space-y-2">
                            {navItems.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center space-x-3 font-primary font-medium transition-all duration-300 px-4 py-3 rounded-xl ${
                                            isActive(item.path)
                                                ? 'text-primary bg-primary/10 shadow-sm'
                                                : 'hover:text-primary hover:bg-primary/5'
                                        }`}
                                    >
                                        <IconComponent className="w-5 h-5" />
                                        <span>{item.name}</span>
                                        {isActive(item.path) && (
                                            <span className="ml-auto text-primary">•</span>
                                        )}
                                    </Link>
                                );
                            })}
                            
                            {!user && (
                                <div className="flex flex-col space-y-2 pt-4 border-t border-base-300/50 mt-4">
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <button className="btn-pet btn-pet-outline w-full justify-center flex items-center cursor-pointer space-x-2">
                                            <FiLogIn className="w-4 h-4" />
                                            <span>Login</span>
                                        </button>
                                    </Link>
                                    {/* <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                        <button className="btn-pet btn-pet-primary w-full justify-center flex items-center space-x-2">
                                            <FiUserPlus className="w-4 h-4" />
                                            <span>Register</span>
                                        </button>
                                    </Link> */}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;