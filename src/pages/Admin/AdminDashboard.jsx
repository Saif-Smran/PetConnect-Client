import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaPaw, FaHeart, FaEye, FaChartBar, FaDollarSign, FaUserShield, FaCalendarAlt } from 'react-icons/fa';
import api from '../../utils/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPets: 0,
        totalDonations: 0,
        totalRaised: 0,
        recentUsers: [],
        recentPets: [],
        recentDonations: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAdminStats();
    }, []);

    const loadAdminStats = async () => {
        try {
            setLoading(true);
            
            const response = await api.get('/admin/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error loading admin stats:', error);
            // Set default stats if API fails
            setStats({
                totalUsers: 0,
                totalPets: 0,
                totalDonations: 0,
                totalRaised: 0,
                recentUsers: [],
                recentPets: [],
                recentDonations: []
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return (
        <div className="h-full bg-gradient-to-br from-base-200 via-base-100 to-base-200">
            <div className="w-full h-full p-4">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning/20 rounded-full text-warning font-medium mb-4">
                        <FaUserShield className="w-5 h-5" />
                        <span>Admin Dashboard</span>
                    </div>
                    <h1 className="font-secondary font-bold text-3xl md:text-4xl mb-4">
                        Welcome to Admin Panel
                    </h1>
                    <p className="text-base-content/70">
                        Manage users, pets, and donation campaigns
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-primary/80">Total Users</p>
                                <p className="text-2xl font-bold text-primary">{stats.totalUsers}</p>
                            </div>
                            <div className="bg-primary/20 p-3 rounded-full">
                                <FaUsers className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-2xl p-6 border border-secondary/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-secondary/80">Total Pets</p>
                                <p className="text-2xl font-bold text-secondary">{stats.totalPets}</p>
                            </div>
                            <div className="bg-secondary/20 p-3 rounded-full">
                                <FaPaw className="w-6 h-6 text-secondary" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl p-6 border border-accent/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-accent/80">Total Campaigns</p>
                                <p className="text-2xl font-bold text-accent">{stats.totalDonations}</p>
                            </div>
                            <div className="bg-accent/20 p-3 rounded-full">
                                <FaHeart className="w-6 h-6 text-accent" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-success/10 to-success/5 rounded-2xl p-6 border border-success/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-success/80">Total Raised</p>
                                <p className="text-2xl font-bold text-success">${stats.totalRaised}</p>
                            </div>
                            <div className="bg-success/20 p-3 rounded-full">
                                <FaDollarSign className="w-6 h-6 text-success" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link to="/admin/users" className="bg-base-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/20 p-3 rounded-full group-hover:bg-primary/30 transition-colors">
                                <FaUsers className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Manage Users</h3>
                                <p className="text-sm text-base-content/70">View and manage all users</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/admin/pets" className="bg-base-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                        <div className="flex items-center gap-4">
                            <div className="bg-secondary/20 p-3 rounded-full group-hover:bg-secondary/30 transition-colors">
                                <FaPaw className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Manage Pets</h3>
                                <p className="text-sm text-base-content/70">View and manage all pets</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/admin/donations" className="bg-base-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent/20 p-3 rounded-full group-hover:bg-accent/30 transition-colors">
                                <FaHeart className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Manage Donations</h3>
                                <p className="text-sm text-base-content/70">View and manage campaigns</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Users */}
                    <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">Recent Users</h3>
                            <Link to="/admin/users" className="btn btn-sm btn-ghost">
                                <FaEye className="w-4 h-4" />
                                View All
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {stats.recentUsers.map((user, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg">
                                    <div className="avatar">
                                        <div className="w-10 h-10 rounded-full">
                                            <img src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=3B82F6&color=ffffff&size=40&rounded=true`} alt={user.displayName} />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{user.displayName || 'Unnamed User'}</p>
                                        <p className="text-sm text-base-content/70">{user.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-base-content/50">
                                            <FaCalendarAlt className="inline w-3 h-3 mr-1" />
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Pets */}
                    <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">Recent Pets</h3>
                            <Link to="/admin/pets" className="btn btn-sm btn-ghost">
                                <FaEye className="w-4 h-4" />
                                View All
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {stats.recentPets.map((pet, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg">
                                    <div className="avatar">
                                        <div className="w-10 h-10 rounded-full">
                                            <img src={pet.image || '/placeholder.jpg'} alt={pet.name} />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{pet.name}</p>
                                        <p className="text-sm text-base-content/70">{pet.breed} • {pet.age}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-base-content/50">
                                            <FaCalendarAlt className="inline w-3 h-3 mr-1" />
                                            {new Date(pet.dateAdded).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
