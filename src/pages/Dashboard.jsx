import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import AdminDashboard from '../components/Admin/AdminDashboard';

const Dashboard = () => {
    const { user } = useAuth();
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Show admin dashboard if user is admin
    if (userRole === 'admin') {
        return <AdminDashboard />;
    }

    // Regular user dashboard
    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-11/12 mx-auto">
                <div className="mb-12">
                    <h1 className="font-secondary font-bold text-4xl mb-4">
                        📊 Dashboard
                    </h1>
                    <p className="font-primary text-xl opacity-80">
                        Welcome back, {user?.displayName || 'User'}! Manage your pets and activities.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <div className="card-pet p-6 hover-lift">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-secondary font-semibold text-lg">My Pets</h3>
                            <span className="text-2xl">🐾</span>
                        </div>
                        <p className="font-primary text-3xl font-bold text-primary mb-2">0</p>
                        <p className="font-primary text-sm opacity-70">Pets registered</p>
                    </div>

                    <div className="card-pet p-6 hover-lift">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-secondary font-semibold text-lg">Donations</h3>
                            <span className="text-2xl">💝</span>
                        </div>
                        <p className="font-primary text-3xl font-bold text-secondary mb-2">$0</p>
                        <p className="font-primary text-sm opacity-70">Total donated</p>
                    </div>

                    <div className="card-pet p-6 hover-lift">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-secondary font-semibold text-lg">Favorites</h3>
                            <span className="text-2xl">❤️</span>
                        </div>
                        <p className="font-primary text-3xl font-bold text-accent mb-2">0</p>
                        <p className="font-primary text-sm opacity-70">Favorite pets</p>
                    </div>
                </div>

                <div className="card-pet p-12 text-center">
                    <div className="text-6xl mb-6 animate-bounce-gentle">🚧</div>
                    <h2 className="font-secondary font-semibold text-3xl mb-4">
                        Dashboard Under Construction
                    </h2>
                    <p className="font-primary text-lg opacity-70">
                        We're building an amazing dashboard experience for you! 
                        Soon you'll be able to manage your pets, track donations, and much more.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
