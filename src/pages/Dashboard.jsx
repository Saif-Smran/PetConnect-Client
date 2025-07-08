import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto">
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
