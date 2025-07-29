import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { FaGoogle, FaGithub, FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';
import { showError } from '../utils/notifications';
import Lottie from 'lottie-react';
import DynamicTitle from '../components/DynamicTitle';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [animationData, setAnimationData] = useState(null);

    const { login, googleLogin, githubLogin, setAuthError } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    
    const from = location.state?.from?.pathname || '/';

    // Load animation data
    useEffect(() => {
        fetch('/Animation.json')
            .then(response => response.json())
            .then(data => setAnimationData(data))
            .catch(error => console.error('Error loading animation:', error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        setAuthError(null);

        try {
            await login(formData.email, formData.password);
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Login failed. Please try again.';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email address.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password. Please try again.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Please try again later.';
                    break;
                case 'auth/invalid-credential':
                    errorMessage = 'Invalid email or password. Please check your credentials.';
                    break;
                default:
                    errorMessage = error.message || errorMessage;
            }
            
            showError('Login Failed', errorMessage);
            setAuthError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setAuthError(null);

        try {
            await googleLogin();
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Google login error:', error);
            let errorMessage = 'Google login failed. Please try again.';
            
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = 'Login cancelled by user.';
                    break;
                case 'auth/popup-blocked':
                    errorMessage = 'Popup blocked. Please allow popups for this site.';
                    break;
                case 'auth/account-exists-with-different-credential':
                    errorMessage = 'An account already exists with this email using a different sign-in method.';
                    break;
                case 'auth/cancelled-popup-request':
                    errorMessage = 'Only one popup request is allowed at a time.';
                    break;
                default:
                    errorMessage = error.message || errorMessage;
            }
            
            showError('Google Login Failed', errorMessage);
            setAuthError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGithubLogin = async () => {
        setIsLoading(true);
        setAuthError(null);

        try {
            await githubLogin();
            navigate(from, { replace: true });
        } catch (error) {
            console.error('GitHub login error:', error);
            let errorMessage = 'GitHub login failed. Please try again.';
            
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = 'Login cancelled by user.';
                    break;
                case 'auth/popup-blocked':
                    errorMessage = 'Popup blocked. Please allow popups for this site.';
                    break;
                case 'auth/account-exists-with-different-credential':
                    errorMessage = 'An account already exists with this email using a different sign-in method.';
                    break;
                case 'auth/cancelled-popup-request':
                    errorMessage = 'Only one popup request is allowed at a time.';
                    break;
                default:
                    errorMessage = error.message || errorMessage;
            }
            
            showError('GitHub Login Failed', errorMessage);
            setAuthError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center py-12 px-4 relative"
            style={{
                backgroundImage: "url('/BannerBGImage.jpg')"
            }}
        >
            <DynamicTitle title="Login - Access Your Account" />
            {/* Background overlay */}
            <div className="absolute inset-0 bg-base-100/30 backdrop-blur-sm"></div>
            
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
                {/* Animation Section */}
                <div className="hidden lg:flex items-center justify-center">
                    <div className="text-center bg-base-100/20 backdrop-blur-md rounded-3xl p-8 border border-base-content/10">
                        <div className="floating-animation">
                            <Lottie 
                                animationData={animationData} 
                                loop={true} 
                                className="w-80 h-80 mx-auto" 
                            />
                        </div>
                        <h2 className="text-3xl font-bold text-base-content mb-4">
                            Welcome Back to PetConnect
                        </h2>
                        <p className="text-lg text-base-content/70">
                            Connect with amazing pets and find your perfect companion
                        </p>
                    </div>
                </div>

                {/* Login Form Section */}
                <div className="w-full max-w-md mx-auto">
                    <div className="bg-base-100/20 backdrop-blur-md rounded-3xl p-8 border border-base-content/10 shadow-2xl">
                        <div className="text-center mb-8">
                            <div className="lg:hidden mb-6">
                                <div className="floating-animation">
                                    <Lottie 
                                        animationData={animationData} 
                                        loop={true} 
                                        className="w-32 h-32 mx-auto" 
                                    />
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold text-base-content mb-2">
                                Welcome Back!
                            </h1>
                            <p className="text-base-content/70">
                                Sign in to your PetConnect account
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <FaEnvelope className="text-primary" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 input-glow bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 ${
                                        errors.email ? 'border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-500' : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                                    }`}
                                    placeholder="Enter your email"
                                    disabled={isLoading}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1 error-message">
                                        <span className="text-xs">⚠️</span>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <FaLock className="text-primary" />
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 pr-12 input-glow bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 ${
                                            errors.password ? 'border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-500' : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                                        }`}
                                        placeholder="Enter your password"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1 error-message">
                                        <span className="text-xs">⚠️</span>
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-primary to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-primary/90 hover:to-blue-600/90 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg btn-gradient-hover"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="loading-spinner"></div>
                                        Signing In...
                                    </div>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-8 flex items-center">
                            <div className="flex-1 border-t border-gray-200 dark:border-gray-600"></div>
                            <span className="px-4 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">Or continue with</span>
                            <div className="flex-1 border-t border-gray-200 dark:border-gray-600"></div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed social-btn"
                            >
                                <FaGoogle className="text-red-500 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Continue with Google</span>
                            </button>

                            <button
                                onClick={handleGithubLogin}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed social-btn"
                            >
                                <FaGithub className="text-gray-800 dark:text-gray-200 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Continue with GitHub</span>
                            </button>
                        </div>

                        {/* Register Link */}
                        <div className="text-center mt-8">
                            <p className="text-gray-600 dark:text-gray-300">
                                Don't have an account?{' '}
                                <Link 
                                    to="/register" 
                                    className="text-primary hover:text-primary/80 dark:text-green-400 dark:hover:text-green-300 font-semibold hover:underline transition-all duration-300"
                                >
                                    Sign up here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
