import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FaPaw, FaCamera, FaMapMarkerAlt, FaInfoCircle, FaFileAlt, FaTimes, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';
import TiptapEditor from '../components/TiptapEditor';
import { getFreshFirebaseToken } from '../utils/tokenUtils';

// Pet categories for dropdown
const petCategories = [
  { value: 'dog', label: '🐕 Dog' },
  { value: 'cat', label: '🐱 Cat' },
  { value: 'rabbit', label: '🐰 Rabbit' },
  { value: 'fish', label: '🐠 Fish' },
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
    .test('minLength', 'Long description must be at least 50 characters', function(value) {
      if (!value) return false;
      const textContent = value.replace(/<[^>]*>/g, '').trim();
      return textContent.length >= 50;
    })
    .test('maxLength', 'Long description must be less than 2000 characters', function(value) {
      if (!value) return false;
      const textContent = value.replace(/<[^>]*>/g, '').trim();
      return textContent.length <= 2000;
    })
    .required('Long description is required'),
  petImage: Yup.mixed()
    .required('Pet image is required')
    .test('fileType', 'Only image files are allowed', function(value) {
      if (!value) return false;
      return value && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(value.type);
    })
    .test('fileSize', 'File size must be less than 5MB', function(value) {
      if (!value) return false;
      return value && value.size <= 5 * 1024 * 1024;
    })
});

const AddPet = ({ showEndpointInfo = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData
      );
      return response.data.data.url;
    } catch (error) {
      console.error('Image upload error:', error);
      
      if (error.response?.data?.error?.code === 100) {
        throw new Error('Invalid ImgBB API key. Please get a valid API key from https://api.imgbb.com/ and update your .env.local file.');
      }
      
      throw new Error('Failed to upload image');
    }
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue('petImage', file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (setFieldValue) => {
    setFieldValue('petImage', null);
    setImagePreview(null);
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setIsSubmitting(true);

      Swal.fire({
        title: 'Adding Your Pet...',
        text: 'Please wait while we upload the image and save the pet information',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      let imageUrl = '';
      try {
        imageUrl = await uploadImage(values.petImage);
      } catch (error) {
        console.error('Image upload failed:', error);
        Swal.close();
        setFieldError('petImage', 'Failed to upload image. Please try again.');
        return;
      }

      const petData = {
        petName: values.petName,
        petAge: parseInt(values.petAge),
        petCategory: values.petCategory.value,
        petLocation: values.petLocation,
        shortDescription: values.shortDescription,
        longDescription: values.longDescription,
        petImage: imageUrl
      };

      console.log('🔄 Getting fresh Firebase ID token for API request...');
      const freshToken = await getFreshFirebaseToken(user);
      console.log('✅ Fresh token obtained for API request');
      
      await axios.post(
        `${import.meta.env.VITE_API_URL}/pets`,
        petData,
        {
          headers: {
            'Authorization': `Bearer ${freshToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      Swal.close();

      Swal.fire({
        title: 'Pet Added Successfully! 🎉',
        html: `
          <div class="text-center">
            <div class="text-6xl mb-4">🐾</div>
            <p class="text-lg mb-2"><strong>${values.petName}</strong> has been added to your pets!</p>
            <p class="text-sm text-gray-600">You can view and manage it in your dashboard.</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'View My Pets',
        showCancelButton: true,
        cancelButtonText: 'Add Another Pet',
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#6b7280'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/my-pets');
        } else {
          window.location.reload();
        }
      });

    } catch (error) {
      Swal.close();
      console.error('Error adding pet:', error);
      
      if (error.response?.status === 401) {
        Swal.fire({
          title: 'Authentication Error',
          text: 'Please log in again to add a pet',
          icon: 'error',
          confirmButtonText: 'Go to Login',
          confirmButtonColor: '#ef4444'
        }).then(() => {
          navigate('/login');
        });
      } else {
        Swal.fire({
          title: 'Error Adding Pet',
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      {showEndpointInfo && (
        <div className="mb-6 p-4 rounded-xl bg-info/10 border border-info/30 text-info text-sm flex items-center gap-2">
          <FaInfoCircle className="mr-2" />
          <span>Server Endpoint: <code className="bg-base-200 px-2 py-1 rounded">POST /pets</code></span>
        </div>
      )}

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary font-medium mb-4">
          <FaPaw className="w-5 h-5" />
          <span>Add Pet</span>
        </div>
        <h1 className="font-secondary font-bold text-3xl md:text-4xl mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Add Your Pet for Adoption
        </h1>
        <p className="text-base text-base-content/70 max-w-2xl mx-auto">
          Help your beloved pet find a new loving home by sharing their information with potential adopters
        </p>
      </div>

      <div className="backdrop-blur-lg bg-white/30 dark:bg-base-200/20 border border-base-content/10 dark:border-base-content/20 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-8">
          <Formik
            initialValues={{
              petName: '',
              petAge: '',
              petCategory: null,
              petLocation: '',
              shortDescription: '',
              longDescription: '',
              petImage: null
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values, errors, touched }) => (
              <Form className="space-y-8">
                <div>
                  <label className="label">
                    <span className="label-text text-lg font-medium flex items-center gap-2">
                      <FaCamera className="text-primary" />
                      Pet Image *
                    </span>
                  </label>
                  
                  {!imagePreview ? (
                    <div className="relative">
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-primary/20 border-dashed rounded-2xl cursor-pointer bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 transition-all duration-300">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FaCamera className="w-12 h-12 mb-4 text-primary/60" />
                          <p className="mb-2 text-lg font-medium text-base-content">
                            Click to upload pet image
                          </p>
                          <p className="text-sm text-base-content/60">
                            PNG, JPG, GIF or WEBP (Max 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, setFieldValue)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="w-full h-64 bg-base-200 rounded-2xl overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Pet preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(setFieldValue)}
                        className="absolute top-2 right-2 w-8 h-8 bg-error text-white rounded-full flex items-center justify-center hover:bg-error/80 transition-colors"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  <ErrorMessage name="petImage" component="div" className="text-error text-sm mt-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Pet Category *</span>
                  </label>
                  <Select
                    options={petCategories}
                    value={values.petCategory}
                    onChange={(selectedOption) => setFieldValue('petCategory', selectedOption)}
                    placeholder="Select pet category..."
                    className="react-select-container text-black"
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
                      placeholder="Provide detailed information about your pet"
                    />
                  </div>
                  <div className="label">
                    <span className="label-text-alt text-base-content/60">
                      {values.longDescription ? values.longDescription.replace(/<[^>]*>/g, '').length : 0}/2000 characters
                    </span>
                  </div>
                  <ErrorMessage name="longDescription" component="div" className="text-error text-sm mt-1" />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary btn-lg flex-1 gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Adding Pet...
                      </>
                    ) : (
                      <>
                        <FaPlus className="w-5 h-5" />
                        Add Pet for Adoption
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/pets')}
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

      <div className="mt-8 backdrop-blur-lg bg-info/10 border border-info/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <FaInfoCircle className="text-info text-xl mt-1" />
          <div>
            <h3 className="font-bold text-info mb-2">Important Information</h3>
            <ul className="text-sm text-base-content/70 space-y-1">
              <li>• All fields marked with * are required</li>
              <li>• Your pet will be visible to all users once added</li>
              <li>• Please provide accurate and honest information</li>
              <li>• You can edit or remove your pet listing from your dashboard</li>
              <li>• Make sure your contact information is current for potential adopters</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPet;
