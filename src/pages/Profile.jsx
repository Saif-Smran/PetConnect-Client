import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FaUser, FaEnvelope, FaCalendar, FaEdit, FaSave, FaTimes, FaCamera } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || ''
  });

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
      
      // Create FormData for image upload
      const imageFormData = new FormData();
      imageFormData.append('image', file);

      // Upload to your image service (replace with your actual endpoint)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload/image`, {
        method: 'POST',
        body: imageFormData,
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const data = await response.json();
      const imageUrl = data.imageUrl;

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
                <h2 className="text-3xl font-bold text-base-content mb-2">
                  {user?.displayName || 'User'}
                </h2>
                <p className="text-base-content/70 mb-4">{user?.email}</p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-base-content/60">
                  <FaCalendar className="w-4 h-4" />
                  <span>Member since {new Date(user?.metadata?.creationTime).toLocaleDateString()}</span>
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
                  <span className="text-base-content">{formData.email}</span>
                  <span className="badge badge-outline badge-sm">Verified</span>
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="mt-8 pt-8 border-t border-base-content/10">
              <h3 className="text-xl font-bold text-base-content mb-6">Account Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl">
                  <div className="text-2xl font-bold text-primary mb-1">0</div>
                  <div className="text-sm text-base-content/70">Donations Made</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl">
                  <div className="text-2xl font-bold text-secondary mb-1">0</div>
                  <div className="text-sm text-base-content/70">Pets Viewed</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl">
                  <div className="text-2xl font-bold text-accent mb-1">0</div>
                  <div className="text-sm text-base-content/70">Campaigns Supported</div>
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
