import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FaUser, FaEnvelope, FaCalendar, FaEdit, FaSave, FaTimes, FaCamera, FaPaw, FaHeart, FaHandsHelping, FaSync, FaCrown, FaUserShield } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { uploadImageToImBB } from '../utils/imageUpload';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState({
    donationsMade: 0,
    petsViewed: 0,
    campaignsSupported: 0
  });
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || ''
  });

  // Load user profile
  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem('firebase_id_token');
      if (!token) {
        console.log('No token found, skipping profile load');
        return;
      }

      console.log('Making request to:', `${import.meta.env.VITE_API_URL}/user-profile`);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user-profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const profile = await response.json();
        console.log('Profile received:', profile);
        setUserProfile(profile);
      } else {
        console.log('Profile response not ok:', await response.text());
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Load user stats
  const loadUserStats = async () => {
    try {
      const token = localStorage.getItem('firebase_id_token');
      console.log('Token found:', !!token);
      
      if (!token) {
        console.log('No token found, skipping stats load');
        return;
      }

      console.log('Making request to:', `${import.meta.env.VITE_API_URL}/user-stats`);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user-stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const stats = await response.json();
        console.log('Stats received:', stats);
        setUserStats({
          donationsMade: stats.recentDonations || 0,
          petsViewed: stats.myPetsCount || 0,
          campaignsSupported: stats.myCampaignsCount || 0
        });
      } else {
        console.log('Response not ok:', await response.text());
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  useEffect(() => {
    loadUserProfile();
    loadUserStats();
  }, []);

  const handleRefreshStats = () => {
    loadUserProfile();
    loadUserStats();
    Swal.fire({
      title: 'Profile & Stats Refreshed!',
      text: 'Your profile and account stats have been updated',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: 'Invalid File',
        text: 'Please select an image file',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'File Too Large',
        text: 'Please select an image smaller than 5MB',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Upload image to ImBB
      const imageUrl = await uploadImageToImBB(file);

      // Update form data with new image URL
      setFormData(prev => ({
        ...prev,
        photoURL: imageUrl
      }));

      Swal.fire({
        title: 'Image Uploaded!',
        text: 'Profile picture updated successfully',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

    } catch (error) {
      console.error('Image upload error:', error);
      Swal.fire({
        title: 'Upload Failed',
        text: 'Failed to upload image. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Update Firebase profile
      await updateUserProfile({
        displayName: formData.displayName,
        photoURL: formData.photoURL
      });

      setIsEditing(false);
      
      Swal.fire({
        title: 'Profile Updated!',
        text: 'Your profile has been updated successfully',
        icon: 'success',
        confirmButtonColor: '#10b981'
      });

    } catch (error) {
      console.error('Profile update error:', error);
      Swal.fire({
        title: 'Update Failed',
        text: 'Failed to update profile. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: user?.displayName || '',
      email: user?.email || '',
      photoURL: user?.photoURL || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary font-medium mb-6">
            <FaUser className="w-5 h-5" />
            <span>User Profile</span>
          </div>
          <h1 className="font-secondary font-bold text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-lg text-base-content/70">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl overflow-hidden shadow-xl">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
                  {formData.photoURL ? (
                    <img
                      src={formData.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <FaUser className="text-4xl text-white" />
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-primary/80 transition-colors">
                    <FaCamera className="text-white text-sm" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <h2 className="text-3xl font-bold text-base-content">
                    {user?.displayName || userProfile?.displayName || 'User'}
                  </h2>
                  {userProfile?.role === 'admin' && (
                    <div className="badge badge-warning gap-1">
                      <FaCrown className="w-3 h-3" />
                      Admin
                    </div>
                  )}
                  {userProfile?.role === 'moderator' && (
                    <div className="badge badge-info gap-1">
                      <FaUserShield className="w-3 h-3" />
                      Moderator
                    </div>
                  )}
                </div>
                <p className="text-base-content/70 mb-4">{user?.email}</p>
                <div className="flex flex-col gap-2 text-sm text-base-content/60">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <FaCalendar className="w-4 h-4" />
                    <span>Member since {userProfile?.memberSince ? new Date(userProfile.memberSince).toLocaleDateString() : new Date(user?.metadata?.creationTime).toLocaleDateString()}</span>
                  </div>
                  {userProfile?.provider && (
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <FaUser className="w-4 h-4" />
                      <span>Account type: {userProfile.provider === 'google.com' ? 'Google' : userProfile.provider === 'github.com' ? 'GitHub' : 'Email'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <div className="flex gap-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary gap-2"
                  >
                    <FaEdit className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="btn btn-outline gap-2"
                      disabled={isLoading}
                    >
                      <FaTimes className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="btn btn-primary gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave className="w-4 h-4" />
                          Save
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display Name */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Display Name</span>
                </label>
                {isEditing ? (
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="input input-bordered w-full pl-10"
                      placeholder="Enter your name"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg">
                    <FaUser className="text-base-content/50" />
                    <span className="text-base-content">
                      {formData.displayName || 'Not set'}
                    </span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Email Address</span>
                </label>
                <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg">
                  <FaEnvelope className="text-base-content/50" />
                  <span className="text-base-content flex-1">{formData.email}</span>
                  <div className="flex gap-2">
                    <span className="badge badge-outline badge-sm">Verified</span>
                    {userProfile?.role && (
                      <span className={`badge badge-sm ${userProfile.role === 'admin' ? 'badge-warning' : userProfile.role === 'moderator' ? 'badge-info' : 'badge-ghost'}`}>
                        {userProfile.role}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Profile Info */}
              {userProfile && (
                <div className="md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Account Information</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg">
                      <FaUser className="text-base-content/50" />
                      <div>
                        <div className="text-sm text-base-content/70">User ID</div>
                        <div className="text-base-content font-mono text-sm">{userProfile.uid}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg">
                      <FaCalendar className="text-base-content/50" />
                      <div>
                        <div className="text-sm text-base-content/70">Account Created</div>
                        <div className="text-base-content">{new Date(userProfile.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Stats */}
            <div className="mt-8 pt-8 border-t border-base-content/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-base-content">Account Activity</h3>
                <button 
                  onClick={handleRefreshStats}
                  className="btn btn-ghost btn-sm gap-2"
                  title="Refresh Stats"
                >
                  <FaSync className="w-4 h-4" />
                  Refresh
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl">
                  <div className="text-2xl font-bold text-primary mb-1 flex items-center justify-center gap-2">
                    <FaHeart className="text-xl" />
                    {userStats.donationsMade}
                  </div>
                  <div className="text-sm text-base-content/70">Donations Made</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl">
                  <div className="text-2xl font-bold text-secondary mb-1 flex items-center justify-center gap-2">
                    <FaPaw className="text-xl" />
                    {userStats.petsViewed}
                  </div>
                  <div className="text-sm text-base-content/70">Pets Added</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl">
                  <div className="text-2xl font-bold text-accent mb-1 flex items-center justify-center gap-2">
                    <FaHandsHelping className="text-xl" />
                    {userStats.campaignsSupported}
                  </div>
                  <div className="text-sm text-base-content/70">Campaigns Created</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
