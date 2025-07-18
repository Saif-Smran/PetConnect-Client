import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaSync, FaBug } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    // eslint-disable-next-line no-unused-vars
    static getDerivedStateFromError(_error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console or error reporting service
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center px-4">
                    <div className="max-w-lg w-full text-center">
                        {/* Error Icon */}
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-error/20 rounded-full mb-4">
                                <FaBug className="w-12 h-12 text-error" />
                            </div>
                            <h1 className="text-4xl font-bold text-error mb-2">Something went wrong</h1>
                            <h2 className="text-xl font-semibold text-base-content mb-4">Application Error</h2>
                            <p className="text-base-content/70 mb-8">
                                We're sorry, but something unexpected happened. Our team has been notified and is working on a fix.
                            </p>
                        </div>

                        {/* Error Details (only in development) */}
                        {import.meta.env.MODE === 'development' && this.state.error && (
                            <div className="bg-base-100 rounded-lg p-4 mb-6 border border-error/20 text-left">
                                <h3 className="font-semibold text-error mb-2">Error Details:</h3>
                                <pre className="text-sm text-base-content/70 overflow-auto max-h-32">
                                    {this.state.error.toString()}
                                </pre>
                                {this.state.errorInfo && (
                                    <details className="mt-2">
                                        <summary className="cursor-pointer text-sm text-base-content/60 hover:text-base-content">
                                            Component Stack
                                        </summary>
                                        <pre className="text-xs text-base-content/50 mt-2 overflow-auto max-h-24">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <button 
                                onClick={this.handleReload}
                                className="btn btn-primary btn-lg w-full gap-2 hover:scale-105 transition-transform"
                            >
                                <FaSync className="w-5 h-5" />
                                Reload Page
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
                            <p>If this problem persists, please <Link to="/about" className="link link-primary">contact our support team</Link></p>
                            <p className="mt-2">We apologize for the inconvenience and appreciate your patience.</p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
