import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { FaGoogle, FaGithub, FaEye, FaEyeSlash, FaUser, FaCamera, FaEnvelope, FaLock, FaUserCheck } from 'react-icons/fa';
import { showError, showLoading, closeSwal } from '../utils/notifications';
import { uploadImageToImBB, validateImageFile } from '../utils/imageUpload';
import Lottie from 'lottie-react';
import DynamicTitle from '../components/DynamicTitle';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [animationData, setAnimationData] = useState(null);

    const { createUser, updateUserProfile, googleLogin, githubLogin, setAuthError } = useContext(AuthContext);
    const navigate = useNavigate();

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate the file
            const validation = validateImageFile(file);
            if (!validation.isValid) {
                showError('Invalid File', validation.error);
                return;
            }

            setImageFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Full name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase and one lowercase letter';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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
            showLoading('Creating your account...');

            // Create user with email and password
            await createUser(formData.email, formData.password);

            // Prepare profile data
            const profileData = {
                displayName: formData.fullName,
            };

            // Upload image to ImBB if provided
            if (imageFile) {
                setIsUploadingImage(true);
                try {
                    const imageUrl = await uploadImageToImBB(imageFile);
                    profileData.photoURL = imageUrl;
                } catch (imageError) {
                    console.error('Image upload error:', imageError);
                    showError('Image Upload Failed', 'Your account was created but image upload failed. You can update your profile picture later.');
                } finally {
                    setIsUploadingImage(false);
                }
            }

            // Update user profile with name and photo
            await updateUserProfile(profileData);

            closeSwal();
            navigate('/');
        } catch (error) {
            closeSwal();
            console.error('Registration error:', error);
            let errorMessage = 'Registration failed. Please try again.';

            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'An account with this email already exists.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password is too weak. Please choose a stronger password.';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Email/password accounts are not enabled.';
                    break;
                default:
                    errorMessage = error.message || errorMessage;
            }

            showError('Registration Failed', errorMessage);
            setAuthError(errorMessage);
        } finally {
            setIsLoading(false);
            setIsUploadingImage(false);
        }
    };

    const handleGoogleRegister = async () => {
        setIsLoading(true);
        setAuthError(null);

        try {
            showLoading('Signing up with Google...');
            await googleLogin();
            closeSwal();
            navigate('/');
        } catch (error) {
            closeSwal();
            console.error('Google registration error:', error);
            let errorMessage = 'Google registration failed. Please try again.';

            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = 'Registration cancelled by user.';
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

            showError('Google Registration Failed', errorMessage);
            setAuthError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGithubRegister = async () => {
        setIsLoading(true);
        setAuthError(null);

        try {
            showLoading('Signing up with GitHub...');
            await githubLogin();
            closeSwal();
            navigate('/');
        } catch (error) {
            closeSwal();
            console.error('GitHub registration error:', error);
            let errorMessage = 'GitHub registration failed. Please try again.';

            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = 'Registration cancelled by user.';
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

            showError('GitHub Registration Failed', errorMessage);
            setAuthError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center py-12 px-4 relative"
            style={{
                backgroundImage: "url('/BannerBGImage.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <DynamicTitle title="Register - Create Your Account" />
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-base-100/40 backdrop-blur-sm"></div>
            
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
                {/* Animation Section */}
                <div className="hidden lg:flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-float">
                            {animationData && (
                                <Lottie
                                    animationData={animationData}
                                    loop={true}
                                    className="w-80 h-80 mx-auto drop-shadow-2xl"
                                />
                            )}
                        </div>
                        <h2 className="text-3xl font-bold text-base-content mb-4 drop-shadow-lg">
                            Join the PetConnect Family
                        </h2>
                        <p className="text-lg text-base-content/80 drop-shadow-md">
                            Create your account and start your journey with amazing pets
                        </p>
                    </div>
                </div>

                {/* Register Form Section */}
                <div className="w-full max-w-md mx-auto">
                    <div className="bg-base-100/20 backdrop-blur-md border border-base-content/10 rounded-3xl p-8 shadow-2xl">
                        <div className="text-center mb-8">
                            <div className="lg:hidden mb-6">
                                <div className="animate-float">
                                    {animationData && (
                                        <Lottie
                                            animationData={animationData}
                                            loop={true}
                                            className="w-32 h-32 mx-auto drop-shadow-xl"
                                        />
                                    )}
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold text-base-content mb-2">
                                Join PetConnect!
                            </h1>
                            <p className="text-base-content/70">
                                Create your account and start connecting with amazing pets
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Profile Image Upload */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center overflow-hidden bg-base-200/50 backdrop-blur-sm transition-all duration-300 group-hover:border-primary/40">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Profile preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FaUser className="text-primary/60 text-2xl" />
                                        )}
                                    </div>
                                    <label
                                        htmlFor="profileImage"
                                        className={`absolute bottom-0 right-0 btn btn-primary btn-sm btn-circle hover:scale-110 transform transition-all duration-300 shadow-lg ${isLoading || isUploadingImage ? 'opacity-50 cursor-not-allowed scale-100' : ''
                                            }`}
                                    >
                                        <FaCamera className="text-sm" />
                                    </label>
                                    <input
                                        type="file"
                                        id="profileImage"
                                        name="profileImage"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        disabled={isLoading || isUploadingImage}
                                    />
                                </div>
                                <p className="text-sm text-base-content/60 mt-3 text-center">
                                    {isUploadingImage ? (
                                        <span className="flex items-center gap-2 justify-center">
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Uploading...
                                        </span>
                                    ) : (
                                        'Upload your profile picture (optional)'
                                    )}
                                </p>
                            </div>

                            {/* Full Name Field */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base-content font-semibold flex items-center gap-2">
                                        <FaUserCheck className="text-primary" />
                                        Full Name
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full bg-base-100/50 backdrop-blur-sm border-base-content/20 focus:border-primary transition-all duration-300 ${errors.fullName ? 'input-error border-error' : ''}`}
                                    placeholder="Enter your full name"
                                    disabled={isLoading}
                                />
                                {errors.fullName && (
                                    <div className="label">
                                        <span className="label-text-alt text-error flex items-center gap-1">
                                            <span className="text-xs">⚠️</span>
                                            {errors.fullName}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base-content font-semibold flex items-center gap-2">
                                        <FaEnvelope className="text-primary" />
                                        Email Address
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full bg-base-100/50 backdrop-blur-sm border-base-content/20 focus:border-primary transition-all duration-300 ${errors.email ? 'input-error border-error' : ''}`}
                                    placeholder="Enter your email"
                                    disabled={isLoading}
                                />
                                {errors.email && (
                                    <div className="label">
                                        <span className="label-text-alt text-error flex items-center gap-1">
                                            <span className="text-xs">⚠️</span>
                                            {errors.email}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base-content font-semibold flex items-center gap-2">
                                        <FaLock className="text-primary" />
                                        Password
                                    </span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`input input-bordered w-full pr-12 bg-base-100/50 backdrop-blur-sm border-base-content/20 focus:border-primary transition-all duration-300 ${errors.password ? 'input-error border-error' : ''}`}
                                        placeholder="Create a password"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <div className="label">
                                        <span className="label-text-alt text-error flex items-center gap-1">
                                            <span className="text-xs">⚠️</span>
                                            {errors.password}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base-content font-semibold flex items-center gap-2">
                                        <FaLock className="text-primary" />
                                        Confirm Password
                                    </span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`input input-bordered w-full pr-12 bg-base-100/50 backdrop-blur-sm border-base-content/20 focus:border-primary transition-all duration-300 ${errors.confirmPassword ? 'input-error border-error' : ''}`}
                                        placeholder="Confirm your password"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <div className="label">
                                        <span className="label-text-alt text-error flex items-center gap-1">
                                            <span className="text-xs">⚠️</span>
                                            {errors.confirmPassword}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || isUploadingImage}
                                className="btn btn-primary w-full bg-gradient-to-r from-success to-primary border-none hover:scale-[1.02] transform transition-all duration-300 shadow-lg text-primary-content"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Creating Account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="divider text-base-content/60">Or continue with</div>

                        {/* Social Registration Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleGoogleRegister}
                                disabled={isLoading}
                                className="btn btn-outline w-full border-base-content/20 bg-base-100/50 backdrop-blur-sm hover:bg-base-200/50 hover:border-base-content/30 transition-all duration-300"
                            >
                                <FaGoogle className="text-red-500" />
                                Continue with Google
                            </button>

                            <button
                                onClick={handleGithubRegister}
                                disabled={isLoading}
                                className="btn btn-outline w-full border-base-content/20 bg-base-100/50 backdrop-blur-sm hover:bg-base-200/50 hover:border-base-content/30 transition-all duration-300"
                            >
                                <FaGithub className="text-base-content" />
                                Continue with GitHub
                            </button>
                        </div>

                        {/* Login Link */}
                        <div className="text-center mt-8">
                            <p className="text-base-content/70">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="link link-primary font-semibold hover:link-hover transition-all duration-300"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
