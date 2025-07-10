import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPaw, FaCamera, FaMapMarkerAlt, FaInfoCircle, FaFileAlt, FaTimes, FaSave, FaArrowLeft, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
import TiptapEditor from '../components/TiptapEditor';
import DashboardLayout from '../Layout/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import { getFreshFirebaseToken, isValidFirebaseToken } from '../utils/tokenUtils';

// Pet categories for dropdown
const petCategories = [
  { value: 'dog', label: '🐕 Dog' },
  { value: 'cat', label: '🐱 Cat' },
  // { value: 'bird', label: '🐦 Bird' },
  { value: 'rabbit', label: '🐰 Rabbit' },
  { value: 'fish', label: '🐠 Fish' },
  // { value: 'hamster', label: '🐹 Hamster' },
  // { value: 'guinea-pig', label: '🐹 Guinea Pig' },
  // { value: 'ferret', label: '🦫 Ferret' },
  // { value: 'reptile', label: '🦎 Reptile' },
  { value: 'other', label: '🐾 Other' }
];

// Validation schema
const validationSchema = Yup.object({
  petName: Yup.string()
    .min(2, 'Pet name must be at least 2 characters')
    .max(50, 'Pet name must be less than 50 characters')
    .required('Pet name is required'),
  petAge: Yup.number()
    .min(0, 'Age must be a positive number')
    .max(30, 'Age must be realistic')
    .required('Pet age is required'),
  petCategory: Yup.object()
    .nullable()
    .required('Pet category is required'),
  petLocation: Yup.string()
    .min(3, 'Location must be at least 3 characters')
    .max(100, 'Location must be less than 100 characters')
    .required('Pet location is required'),
  shortDescription: Yup.string()
    .min(10, 'Short description must be at least 10 characters')
    .max(200, 'Short description must be less than 200 characters')
    .required('Short description is required'),
  longDescription: Yup.string()
    .test('minLength', 'Long description must be at least 50 characters', (value) => {
      if (!value) return false;
      const textContent = value.replace(/<[^>]*>/g, '').trim();
      return textContent.length >= 50;
    })
    .test('maxLength', 'Long description must be less than 2000 characters', (value) => {
      if (!value) return false;
      const textContent = value.replace(/<[^>]*>/g, '').trim();
      return textContent.length <= 2000;
    })
    .required('Long description is required'),
  petImage: Yup.mixed()
    .nullable() // Allow null/undefined for updates
    .test('fileType', 'Only image files are allowed', (value) => {
      if (!value) return true; // Allow no file for updates (existing image)
      return value && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(value.type);
    })
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      if (!value) return true; // Allow no file for updates
      return value && value.size <= 5 * 1024 * 1024; // 5MB
    })
});

const UpdatePet = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [petData, setPetData] = useState(null);

  // Fetch pet data
  useEffect(() => {
    const fetchPetData = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        // Get fresh Firebase token
        let token = localStorage.getItem('firebase_id_token');
        if (!token || !isValidFirebaseToken(token)) {
          token = await getFreshFirebaseToken(user);
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/pets/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setPetData(response.data);
        setImagePreview(response.data.petImage);
      } catch (error) {
        console.error('Error fetching pet data:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to load pet data',
          icon: 'error'
        }).then(() => {
          navigate('/my-pets');
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPetData();
    }
  }, [id, navigate, user]);

  // Upload image to imgbb
  const uploadImage = async (imageFile) => {
    console.log('🖼️ Starting image upload...', {
      fileName: imageFile.name,
      fileSize: imageFile.size,
      fileType: imageFile.type
    });

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      console.log('🔑 Using API key:', import.meta.env.VITE_IMGBB_API_KEY ? 'Available' : 'Missing');
      
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log('✅ Image upload successful:', response.data);
      return response.data.data.url;
    } catch (error) {
      console.error('❌ Image upload error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 400) {
        throw new Error('Invalid image file or API key. Please check the file format.');
      } else if (error.response?.status === 429) {
        throw new Error('Upload limit exceeded. Please try again later.');
      } else {
        throw new Error('Failed to upload image. Please try again.');
      }
    }
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue('petImage', file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (setFieldValue) => {
    setFieldValue('petImage', null);
    setImagePreview(petData?.petImage || null); // Reset to original image
    console.log('🗑️ Image removed, reset to original:', petData?.petImage);
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setIsSubmitting(true);

      // Show loading
      Swal.fire({
        title: 'Updating Your Pet...',
        text: 'Please wait while we save the changes',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Upload new image if provided
      let imageUrl = petData.petImage; // Keep existing image by default
      if (values.petImage && typeof values.petImage !== 'string') {
        console.log('🖼️ New image detected, uploading...');
        try {
          imageUrl = await uploadImage(values.petImage);
          console.log('✅ New image uploaded successfully:', imageUrl);
        } catch (error) {
          console.error('❌ Image upload failed:', error);
          Swal.close();
          setFieldError('petImage', error.message || 'Failed to upload image. Please try again.');
          return;
        }
      } else {
        console.log('📷 Using existing image:', imageUrl);
      }

      // Prepare updated pet data
      const updatedPetData = {
        petName: values.petName,
        petAge: parseInt(values.petAge),
        petCategory: values.petCategory.value,
        petLocation: values.petLocation,
        shortDescription: values.shortDescription,
        longDescription: values.longDescription,
        petImage: imageUrl,
        dateUpdated: new Date().toISOString()
      };

      // Submit to backend
      const token = await getFreshFirebaseToken(user);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/pets/${id}`,
        updatedPetData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      Swal.close();

      // Show success message
      Swal.fire({
        title: 'Pet Updated Successfully! 🎉',
        html: `
          <div class="text-center">
            <div class="text-6xl mb-4">🐾</div>
            <p class="text-lg mb-2"><strong>${values.petName}</strong> has been updated!</p>
            <p class="text-sm text-gray-600">Your changes have been saved successfully.</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'View My Pets',
        showCancelButton: true,
        cancelButtonText: 'Continue Editing',
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#6b7280'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/my-pets');
        }
      });

    } catch (error) {
      Swal.close();
      console.error('Error updating pet:', error);
      
      if (error.response?.status === 401) {
        Swal.fire({
          title: 'Authentication Error',
          text: 'Please log in again to update the pet',
          icon: 'error',
          confirmButtonText: 'Go to Login',
          confirmButtonColor: '#ef4444'
        }).then(() => {
          navigate('/login');
        });
      } else {
        Swal.fire({
          title: 'Error Updating Pet',
          text: error.response?.data?.message || 'Something went wrong. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      }
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeMenuId="my-pets">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-lg text-base-content/60">Loading pet data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!petData) {
    return (
      <DashboardLayout activeMenuId="my-pets">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">😿</div>
            <h2 className="text-2xl font-bold text-base-content mb-2">Pet Not Found</h2>
            <p className="text-base-content/70 mb-4">The pet you're looking for doesn't exist.</p>
            <button onClick={() => navigate('/my-pets')} className="btn btn-primary">
              Back to My Pets
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenuId="my-pets">
      <div className="w-full max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full text-secondary font-medium mb-4">
            <FaEdit className="w-5 h-5" />
            <span>Update Pet</span>
          </div>
          <h1 className="font-secondary font-bold text-3xl md:text-4xl mb-2 bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent">
            Update {petData.petName}
          </h1>
          <p className="text-base text-base-content/70 max-w-2xl mx-auto">
            Make changes to your pet's information to keep it up to date
          </p>
        </div>

        {/* Form */}
        <div className="backdrop-blur-lg bg-white/30 dark:bg-base-200/20 border border-base-content/10 dark:border-base-content/20 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-8">
            <Formik
              initialValues={{
                petName: petData.petName || '',
                petAge: petData.petAge || '',
                petCategory: petCategories.find(cat => cat.value === petData.petCategory) || null,
                petLocation: petData.petLocation || '',
                shortDescription: petData.shortDescription || '',
                longDescription: petData.longDescription || '',
                petImage: null // For new image uploads only
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values, errors, touched }) => (
                <Form className="space-y-8">
                  {/* Pet Image Upload */}
                  <div>
                    <label className="label">
                      <span className="label-text text-lg font-medium flex items-center gap-2">
                        <FaCamera className="text-primary" />
                        Pet Image
                        <span className="text-sm text-base-content/60 font-normal">(Optional - leave unchanged if you don't want to update)</span>
                      </span>
                    </label>
                    
                    <div className="relative">
                      <div className="w-full h-64 bg-base-200 rounded-2xl overflow-hidden border-2 border-dashed border-primary/20">
                        {imagePreview ? (
                          <div className="relative w-full h-full">
                            <img
                              src={imagePreview}
                              alt="Pet preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded-lg text-xs">
                              {values.petImage ? 'New Image' : 'Current Image'}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <FaCamera className="w-12 h-12 text-base-content/30 mx-auto mb-2" />
                              <p className="text-base-content/60">No image available</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="absolute top-2 right-2 flex gap-2">
                        <label className="btn btn-sm btn-primary gap-2">
                          <FaCamera className="w-3 h-3" />
                          {values.petImage ? 'Change' : 'Upload New'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, setFieldValue)}
                            className="hidden"
                          />
                        </label>
                        {values.petImage && (
                          <button
                            type="button"
                            onClick={() => removeImage(setFieldValue)}
                            className="btn btn-sm btn-error"
                            title="Remove new image and keep original"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm text-base-content/60">
                      <p>• Supported formats: JPEG, PNG, GIF, WebP</p>
                      <p>• Maximum file size: 5MB</p>
                      <p>• Leave unchanged if you don't want to update the image</p>
                    </div>
                    
                    <ErrorMessage name="petImage" component="div" className="text-error text-sm mt-1" />
                  </div>

                  {/* Pet Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pet Name */}
                    <div>
                      <label className="label">
                        <span className="label-text font-medium flex items-center gap-2">
                          <FaPaw className="text-secondary" />
                          Pet Name *
                        </span>
                      </label>
                      <Field
                        name="petName"
                        type="text"
                        placeholder="Enter your pet's name"
                        className={`input input-bordered w-full focus:input-primary transition-all duration-300 ${
                          errors.petName && touched.petName ? 'input-error' : ''
                        }`}
                      />
                      <ErrorMessage name="petName" component="div" className="text-error text-sm mt-1" />
                    </div>

                    {/* Pet Age */}
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">Pet Age (years) *</span>
                      </label>
                      <Field
                        name="petAge"
                        type="number"
                        min="0"
                        max="30"
                        placeholder="Enter pet's age"
                        className={`input input-bordered w-full focus:input-primary transition-all duration-300 ${
                          errors.petAge && touched.petAge ? 'input-error' : ''
                        }`}
                      />
                      <ErrorMessage name="petAge" component="div" className="text-error text-sm mt-1" />
                    </div>
                  </div>

                  {/* Pet Category */}
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Pet Category *</span>
                    </label>
                    <Select
                      options={petCategories}
                      value={values.petCategory}
                      onChange={(selectedOption) => setFieldValue('petCategory', selectedOption)}
                      placeholder="Select pet category..."
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          minHeight: '48px',
                          border: errors.petCategory && touched.petCategory ? '1px solid #ef4444' : '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.3)' : 'none',
                          '&:hover': {
                            borderColor: state.isFocused ? '#3b82f6' : '#d1d5db'
                          }
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
                          color: state.isSelected ? 'white' : '#374151'
                        })
                      }}
                    />
                    <ErrorMessage name="petCategory" component="div" className="text-error text-sm mt-1" />
                  </div>

                  {/* Pet Location */}
                  <div>
                    <label className="label">
                      <span className="label-text font-medium flex items-center gap-2">
                        <FaMapMarkerAlt className="text-accent" />
                        Pet Location *
                      </span>
                    </label>
                    <Field
                      name="petLocation"
                      type="text"
                      placeholder="Enter pickup location (e.g., Dhaka, Bangladesh)"
                      className={`input input-bordered w-full focus:input-primary transition-all duration-300 ${
                        errors.petLocation && touched.petLocation ? 'input-error' : ''
                      }`}
                    />
                    <div className="label">
                      <span className="label-text-alt text-base-content/60">
                        Specify where the pet can be picked up by the adopter
                      </span>
                    </div>
                    <ErrorMessage name="petLocation" component="div" className="text-error text-sm mt-1" />
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="label">
                      <span className="label-text font-medium flex items-center gap-2">
                        <FaInfoCircle className="text-info" />
                        Short Description *
                      </span>
                    </label>
                    <Field
                      name="shortDescription"
                      as="textarea"
                      rows="3"
                      placeholder="A brief, engaging description of your pet"
                      className={`textarea textarea-bordered w-full focus:textarea-primary transition-all duration-300 resize-none ${
                        errors.shortDescription && touched.shortDescription ? 'textarea-error' : ''
                      }`}
                    />
                    <div className="label">
                      <span className="label-text-alt text-base-content/60">
                        {values.shortDescription.length}/200 characters
                      </span>
                    </div>
                    <ErrorMessage name="shortDescription" component="div" className="text-error text-sm mt-1" />
                  </div>

                  {/* Long Description */}
                  <div>
                    <label className="label">
                      <span className="label-text font-medium flex items-center gap-2">
                        <FaFileAlt className="text-warning" />
                        Detailed Description *
                      </span>
                    </label>
                    <div className={`${
                      errors.longDescription && touched.longDescription ? 'border border-error rounded-lg' : ''
                    }`}>
                      <TiptapEditor
                        content={values.longDescription}
                        onChange={(content) => setFieldValue('longDescription', content)}
                        placeholder="Provide detailed information about your pet..."
                      />
                    </div>
                    <div className="label">
                      <span className="label-text-alt text-base-content/60">
                        {values.longDescription ? values.longDescription.replace(/<[^>]*>/g, '').length : 0}/2000 characters
                      </span>
                    </div>
                    <ErrorMessage name="longDescription" component="div" className="text-error text-sm mt-1" />
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary btn-lg flex-1 gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Updating Pet...
                        </>
                      ) : (
                        <>
                          <FaEdit className="w-5 h-5" />
                          Update Pet Information
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/my-pets')}
                      className="btn btn-outline btn-lg gap-3 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 backdrop-blur-lg bg-warning/10 border border-warning/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <FaInfoCircle className="text-warning text-xl mt-1" />
            <div>
              <h3 className="font-bold text-warning mb-2">Update Information</h3>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>• You can update any field except the adoption status</li>
                <li>• Image is optional - leave unchanged if you don't want to update it</li>
                <li>• Changes will be visible to potential adopters immediately</li>
                <li>• Make sure all information remains accurate and honest</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UpdatePet;
