import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaHome, FaUserCog, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const Forbidden = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Error Icon */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-error/20 rounded-full mb-4">
                        <FaShieldAlt className="w-12 h-12 text-error" />
                    </div>
                    <h1 className="text-6xl font-bold text-error mb-2">403</h1>
                    <h2 className="text-2xl font-semibold text-base-content mb-4">Access Forbidden</h2>
                    <p className="text-base-content/70 mb-8">
                        You don't have permission to access this resource. This page is restricted to authorized users only.
                    </p>
                </div>

                {/* User Info */}
                {user && (
                    <div className="bg-base-100 rounded-lg p-4 mb-6 border border-base-content/10">
                        <div className="flex items-center gap-3 justify-center">
                            <div className="avatar">
                                <div className="w-10 h-10 rounded-full">
                                    <img 
                                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=3B82F6&color=ffffff&size=40&rounded=true`} 
                                        alt={user.displayName || user.email}
                                    />
                                </div>
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-base-content">
                                    {user.displayName || 'User'}
                                </div>
                                <div className="text-sm text-base-content/70">
                                    {user.email}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4">
                    <Link 
                        to="/" 
                        className="btn btn-primary btn-lg w-full gap-2 hover:scale-105 transition-transform"
                    >
                        <FaHome className="w-5 h-5" />
                        Go Back Home
                    </Link>
                    
                    {user ? (
                        <Link 
                            to="/dashboard" 
                            className="btn btn-secondary btn-lg w-full gap-2 hover:scale-105 transition-transform"
                        >
                            <FaUserCog className="w-5 h-5" />
                            Go to Dashboard
                        </Link>
                    ) : (
                        <Link 
                            to="/login" 
                            className="btn btn-secondary btn-lg w-full gap-2 hover:scale-105 transition-transform"
                        >
                            <FaExclamationTriangle className="w-5 h-5" />
                            Sign In
                        </Link>
                    )}
                </div>

                {/* Help Text */}
                <div className="mt-8 text-sm text-base-content/60">
                    <p>Need different access? <Link to="/about" className="link link-primary">Contact Administrator</Link></p>
                    {user && (
                        <p className="mt-2">If you believe this is an error, please contact support.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Forbidden;
