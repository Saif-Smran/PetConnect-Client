import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  FaPlusCircle, FaPaw, FaHeart, FaDonate, FaBullhorn,
  FaHandHoldingHeart, FaBars, FaTimes, FaUser, FaBell, FaCog, FaSignOutAlt, FaHome, FaChevronRight
} from 'react-icons/fa';

const menuItems = [
  { id: 'overview', label: 'Overview', icon: FaHome, path: '/dashboard' },
  { id: 'add-pet', label: 'Add a Pet', icon: FaPlusCircle, path: '/dashboard/add-pet' },
  { id: 'my-pets', label: 'My Added Pets', icon: FaPaw, path: '/dashboard/my-pets' },
  { id: 'adoption-requests', label: 'Adoption Request', icon: FaHeart, path: '/dashboard/adoption-requests' },
  { id: 'create-donation', label: 'Create Donation Campaign', icon: FaBullhorn, path: '/dashboard/create-donation' },
  { id: 'my-campaigns', label: 'My Donation Campaigns', icon: FaDonate, path: '/dashboard/my-campaigns' },
  { id: 'my-donations', label: 'My Donations', icon: FaHandHoldingHeart, path: '/dashboard/my-donations' }
];

const DashboardLayout = ({ children, activeMenuId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Determine active menu item
  const currentMenuId = activeMenuId || menuItems.find(item => item.path === location.pathname)?.id || 'overview';

  const handleMenuClick = (item) => {
    setSidebarOpen(false);
    navigate(item.path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 backdrop-blur-lg bg-base-100/90 border-r border-base-content/10 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-6 border-b border-base-content/10">
          <div className="flex items-center gap-3">
            <img src="/Logo.png" alt="PetConnect" className="w-8 h-8" />
            <span className="text-xl font-bold text-base-content">Dashboard</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden btn btn-ghost btn-sm"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                currentMenuId === item.id
                  ? 'bg-primary text-primary-content shadow-lg'
                  : 'hover:bg-base-content/5 text-base-content/80 hover:text-base-content'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {currentMenuId === item.id && (
                <FaChevronRight className="w-4 h-4 ml-auto" />
              )}
            </button>
          ))}
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Navbar */}
        <header className="backdrop-blur-lg bg-base-100/90 border-b border-base-content/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden btn btn-ghost btn-sm"
              >
                <FaBars className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-base-content capitalize">
                  {menuItems.find(item => item.id === currentMenuId)?.label || 'Dashboard'}
                </h1>
                <p className="text-base-content/60 text-sm">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <FaBell className="w-5 h-5" />
                  <span className="badge badge-xs badge-primary indicator-item"></span>
                </div>
              </button>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full" />
                    ) : (
                      <FaUser className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </div>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                  <li>
                    <a className="justify-between">
                      Profile
                      <span className="badge">New</span>
                    </a>
                  </li>
                  <li><a><FaCog className="w-4 h-4" /> Settings</a></li>
                  <li><a><FaSignOutAlt className="w-4 h-4" /> Logout</a></li>
                </ul>
              </div>
            </div>
          </div>
        </header>
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout; 