import React from 'react';
import { Link } from 'react-router-dom';
import { FaServer, FaHome, FaSync, FaExclamationTriangle } from 'react-icons/fa';

const ServerError = () => {
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Error Icon */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-error/20 rounded-full mb-4">
                        <FaServer className="w-12 h-12 text-error" />
                    </div>
                    <h1 className="text-6xl font-bold text-error mb-2">500</h1>
                    <h2 className="text-2xl font-semibold text-base-content mb-4">Server Error</h2>
                    <p className="text-base-content/70 mb-8">
                        Something went wrong on our end. Our team has been notified and is working to fix the issue.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <button 
                        onClick={handleRefresh}
                        className="btn btn-primary btn-lg w-full gap-2 hover:scale-105 transition-transform"
                    >
                        <FaSync className="w-5 h-5" />
                        Try Again
                    </button>
                    
                    <Link 
                        to="/" 
                        className="btn btn-secondary btn-lg w-full gap-2 hover:scale-105 transition-transform"
                    >
                        <FaHome className="w-5 h-5" />
                        Go Back Home
                    </Link>

                    <Link 
                        to="/about" 
                        className="btn btn-ghost btn-lg w-full gap-2 hover:scale-105 transition-transform"
                    >
                        <FaExclamationTriangle className="w-5 h-5" />
                        Contact Support
                    </Link>
                </div>

                {/* Help Text */}
                <div className="mt-8 text-sm text-base-content/60">
                    <p>Error persists? <Link to="/about" className="link link-primary">Report this issue</Link></p>
                    <p className="mt-2">We apologize for the inconvenience and appreciate your patience.</p>
                </div>
            </div>
        </div>
    );
};

export default ServerError;
