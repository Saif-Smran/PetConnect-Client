import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaSignInAlt, FaUserPlus, FaExclamationTriangle } from 'react-icons/fa';

const Unauthorized = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Error Icon */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-warning/20 rounded-full mb-4">
                        <FaLock className="w-12 h-12 text-warning" />
                    </div>
                    <h1 className="text-6xl font-bold text-warning mb-2">401</h1>
                    <h2 className="text-2xl font-semibold text-base-content mb-4">Unauthorized Access</h2>
                    <p className="text-base-content/70 mb-8">
                        You need to sign in to access this page. Please log in with your account or create a new one to continue.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <Link 
                        to="/login" 
                        className="btn btn-primary btn-lg w-full gap-2 hover:scale-105 transition-transform"
                    >
                        <FaSignInAlt className="w-5 h-5" />
                        Sign In
                    </Link>
                    
                    <Link 
                        to="/register" 
                        className="btn btn-secondary btn-lg w-full gap-2 hover:scale-105 transition-transform"
                    >
                        <FaUserPlus className="w-5 h-5" />
                        Create Account
                    </Link>

                    <Link 
                        to="/" 
                        className="btn btn-ghost btn-lg w-full gap-2 hover:scale-105 transition-transform"
                    >
                        <FaExclamationTriangle className="w-5 h-5" />
                        Go Back Home
                    </Link>
                </div>

                {/* Help Text */}
                <div className="mt-8 text-sm text-base-content/60">
                    <p>Already have an account? <Link to="/login" className="link link-primary">Sign in here</Link></p>
                    <p className="mt-2">Don't have an account? <Link to="/register" className="link link-secondary">Create one for free</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
