import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaPaw, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Error Icon */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-error/20 rounded-full mb-4">
                        <FaExclamationTriangle className="w-12 h-12 text-error" />
                    </div>
                    <h1 className="text-6xl font-bold text-error mb-2">404</h1>
                    <h2 className="text-2xl font-semibold text-base-content mb-4">Page Not Found</h2>
                    <p className="text-base-content/70 mb-8">
                        Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <Link 
                        to="/" 
                        className="btn btn-primary btn-lg w-full gap-2 hover:scale-105 transition-transform"
                    >
                        <FaHome className="w-5 h-5" />
                        Go Back Home
                    </Link>
                    
                    <Link 
                        to="/pets" 
                        className="btn btn-secondary btn-lg w-full gap-2 hover:scale-105 transition-transform"
                    >
                        <FaPaw className="w-5 h-5" />
                        Browse Pets
                    </Link>

                    <Link 
                        to="/donations" 
                        className="btn btn-accent btn-lg w-full gap-2 hover:scale-105 transition-transform"
                    >
                        <FaSearch className="w-5 h-5" />
                        View Donations
                    </Link>
                </div>

                {/* Help Text */}
                <div className="mt-8 text-sm text-base-content/60">
                    <p>Need help? <Link to="/about" className="link link-primary">Contact Support</Link></p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
