import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { imageUpload } from '../utils/imageUpload';
import { FaUpload, FaDollarSign, FaCalendarAlt, FaAlignLeft, FaFileAlt, FaHeart, FaEdit, FaCamera, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { MdPets } from 'react-icons/md';
import DashboardLayout from '../Layout/DashboardLayout';
import TiptapEditor from '../components/TiptapEditor';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

// Validation schema
const validationSchema = Yup.object({
  petName: Yup.string()
    .min(2, 'Campaign title must be at least 2 characters')
    .max(50, 'Campaign title must be less than 50 characters')
    .required('Campaign title is required'),
  maxDonationAmount: Yup.number()
    .min(1, 'Maximum donation amount must be at least $1')
    .max(100000, 'Maximum donation amount must be less than $100,000')
    .required('Maximum donation amount is required'),
  lastDate: Yup.date()
    .min(new Date(), 'Last date must be in the future')
    .required('Last date is required'),
  shortDescription: Yup.string()
    .min(10, 'Short description must be at least 10 characters')
    .max(200, 'Short description must be less than 200 characters')
    .required('Short description is required'),
  longDescription: Yup.string()
    .test('minLength', 'Long description must be at least 50 characters', (value) => {
      if (!value) return false;
      // Strip HTML tags to count actual content
      const textContent = value.replace(/<[^>]*>/g, '').trim();
      return textContent.length >= 50;
    })
    .test('maxLength', 'Long description must be less than 2000 characters', (value) => {
      if (!value) return false;
      // Strip HTML tags to count actual content
      const textContent = value.replace(/<[^>]*>/g, '').trim();
      return textContent.length <= 2000;
    })
    .required('Long description is required')
});

const EditDonationCampaign = ({ showEndpointInfo = false }) => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fetchingCampaign, setFetchingCampaign] = useState(true);
    const [initialValues, setInitialValues] = useState({
        petName: '',
        maxDonationAmount: '',
        lastDate: '',
        shortDescription: '',
        longDescription: '',
        petImage: null
    });

    const fetchCampaign = useCallback(async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/donation-campaigns/${id}`, {
                headers: {
                    'Authorization': `Bearer ${await user.getIdToken()}`
                }
            });

            if (response.ok) {
                const campaign = await response.json();
                
                // Check if user owns this campaign
                if (campaign.createdByEmail !== user.email) {
                    Swal.fire({
                        title: 'Access Denied',
                        text: 'You are not authorized to edit this campaign',
                        icon: 'error',
                        confirmButtonColor: '#ef4444'
                    }).then(() => {
                        navigate('/dashboard/my-donation-campaigns');
                    });
                    return;
                }

                const formattedDate = campaign.lastDate 
                    ? new Date(campaign.lastDate).toISOString().split('T')[0] 
                    : '';

                setInitialValues({
                    petName: campaign.petName || '',
                    maxDonationAmount: campaign.maxDonationAmount || '',
                    lastDate: formattedDate,
                    shortDescription: campaign.shortDescription || '',
                    longDescription: campaign.longDescription || '',
                    petImage: null // Don't set existing image as initial value for file input
                });
                
                setImagePreview(campaign.petImage);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to fetch campaign details',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                }).then(() => {
                    navigate('/dashboard/my-donation-campaigns');
                });
            }
        } catch (error) {
            console.error('Error fetching campaign:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to fetch campaign details',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            }).then(() => {
                navigate('/dashboard/my-donation-campaigns');
            });
        } finally {
            setFetchingCampaign(false);
        }
    }, [id, user, navigate]);

    useEffect(() => {
        fetchCampaign();
    }, [fetchCampaign]);

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
        // Don't clear imagePreview completely, keep the original if available
        // setImagePreview(null);
    };

    const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
        try {
            setIsSubmitting(true);

            // Show loading
            Swal.fire({
                title: 'Updating Campaign...',
                text: 'Please wait while we update your donation campaign',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            let updateData = {
                petName: values.petName,
                maxDonationAmount: parseFloat(values.maxDonationAmount),
                lastDate: values.lastDate,
                shortDescription: values.shortDescription,
                longDescription: values.longDescription
            };

            // Upload new image if selected
            if (values.petImage) {
                try {
                    const imageUrl = await imageUpload(values.petImage);
                    updateData.petImage = imageUrl;
                } catch (error) {
                    console.error('Image upload failed:', error);
                    Swal.close();
                    setFieldError('petImage', 'Failed to upload image. Please try again.');
                    return;
                }
            }

            // Submit to backend
            const token = await user.getIdToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/donation-campaigns/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update campaign');
            }

            Swal.close();

            // Show success message
            Swal.fire({
                title: 'Campaign Updated Successfully! 🎉',
                html: `
                    <div class="text-center">
                        <div class="text-6xl mb-4">✨</div>
                        <p class="text-lg mb-2">Your donation campaign for <strong>${values.petName}</strong> has been updated!</p>
                        <p class="text-sm text-gray-600">The changes are now live.</p>
                    </div>
                `,
                icon: 'success',
                confirmButtonText: 'View My Campaigns',
                showCancelButton: true,
                cancelButtonText: 'Edit More',
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#6b7280'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/dashboard/my-donation-campaigns');
                }
                // If cancelled, stay on the edit page
            });

        } catch (error) {
            Swal.close();
            console.error('Error updating campaign:', error);
            
            if (error.response?.status === 401) {
                Swal.fire({
                    title: 'Authentication Error',
                    text: 'Please log in again to update the campaign',
                    icon: 'error',
                    confirmButtonText: 'Go to Login',
                    confirmButtonColor: '#ef4444'
                }).then(() => {
                    navigate('/login');
                });
            } else {
                Swal.fire({
                    title: 'Error Updating Campaign',
                    text: error.message || 'Something went wrong. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            }
        } finally {
            setIsSubmitting(false);
            setSubmitting(false);
        }
    };

    if (fetchingCampaign) {
        return (
            <DashboardLayout activeMenuId="my-donation-campaigns">
                <div className="w-full max-w-4xl mx-auto">
                    <div className="text-center py-16">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="mt-4 text-lg text-base-content/70">Loading campaign details...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activeMenuId="my-donation-campaigns">
            <div className="w-full max-w-4xl mx-auto">
                {showEndpointInfo && (
                    <div className="mb-6 p-4 rounded-xl bg-info/10 border border-info/30 text-info text-sm flex items-center gap-2">
                        <FaInfoCircle className="mr-2" />
                        <span>Server Endpoint: <code className="bg-base-200 px-2 py-1 rounded">PUT /donation-campaigns/{id}</code></span>
                    </div>
                )}
                
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary font-medium mb-4">
                        <FaEdit className="w-5 h-5" />
                        <span>Edit Campaign</span>
                    </div>
                    <h1 className="font-secondary font-bold text-3xl md:text-4xl mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                        Edit Donation Campaign
                    </h1>
                    <p className="text-base text-base-content/70 max-w-2xl mx-auto">
                        Update your campaign details to better reach potential donors and help your pet
                    </p>
                </div>

                {/* Form */}
                <div className="backdrop-blur-lg bg-white/30 dark:bg-base-200/20 border border-base-content/10 dark:border-base-content/20 rounded-3xl overflow-hidden shadow-xl">
                    <div className="p-8">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {({ setFieldValue, values, errors, touched }) => (
                                <Form className="space-y-8">
                                    {/* Pet Image Upload */}
                                    <div>
                                        <label className="label">
                                            <span className="label-text text-lg font-medium flex items-center gap-2">
                                                <FaCamera className="text-primary" />
                                                Pet Image
                                            </span>
                                        </label>
                                        
                                        <div className="relative">
                                            <div className="w-full h-64 bg-base-200 rounded-2xl overflow-hidden">
                                                <img
                                                    src={imagePreview || '/placeholder.jpg'}
                                                    alt="Pet preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            
                                            <label className="absolute bottom-4 right-4 btn btn-primary btn-sm gap-2 cursor-pointer">
                                                <FaCamera className="w-4 h-4" />
                                                Change Image
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
                                                    className="absolute top-2 right-2 w-8 h-8 bg-error text-white rounded-full flex items-center justify-center hover:bg-error/80 transition-colors"
                                                >
                                                    <FaTimes className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="label">
                                            <span className="label-text-alt text-base-content/60">
                                                Leave unchanged to keep current image, or select a new one
                                            </span>
                                        </div>
                                        
                                        <ErrorMessage name="petImage" component="div" className="text-error text-sm mt-1" />
                                    </div>

                                    {/* Pet Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Campaign Title */}
                                        <div>
                                            <label className="label">
                                                <span className="label-text font-medium flex items-center gap-2">
                                                    <MdPets className="text-secondary" />
                                                    Campaign Title *
                                                </span>
                                            </label>
                                            <Field
                                                name="petName"
                                                type="text"
                                                placeholder="Enter campaign title"
                                                className={`input input-bordered w-full focus:input-primary transition-all duration-300 ${
                                                    errors.petName && touched.petName ? 'input-error' : ''
                                                }`}
                                            />
                                            <ErrorMessage name="petName" component="div" className="text-error text-sm mt-1" />
                                        </div>

                                        {/* Maximum Donation Amount */}
                                        <div>
                                            <label className="label">
                                                <span className="label-text font-medium flex items-center gap-2">
                                                    <FaDollarSign className="text-success" />
                                                    Maximum Donation Amount *
                                                </span>
                                            </label>
                                            <Field
                                                name="maxDonationAmount"
                                                type="number"
                                                min="1"
                                                step="0.01"
                                                placeholder="Enter maximum amount needed"
                                                className={`input input-bordered w-full focus:input-primary transition-all duration-300 ${
                                                    errors.maxDonationAmount && touched.maxDonationAmount ? 'input-error' : ''
                                                }`}
                                            />
                                            <ErrorMessage name="maxDonationAmount" component="div" className="text-error text-sm mt-1" />
                                        </div>
                                    </div>

                                    {/* Last Date */}
                                    <div>
                                        <label className="label">
                                            <span className="label-text font-medium flex items-center gap-2">
                                                <FaCalendarAlt className="text-warning" />
                                                Last Date of Donation *
                                            </span>
                                        </label>
                                        <Field
                                            name="lastDate"
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            className={`input input-bordered w-full focus:input-primary transition-all duration-300 ${
                                                errors.lastDate && touched.lastDate ? 'input-error' : ''
                                            }`}
                                        />
                                        <div className="label">
                                            <span className="label-text-alt text-base-content/60">
                                                Select the last date when donations will be accepted
                                            </span>
                                        </div>
                                        <ErrorMessage name="lastDate" component="div" className="text-error text-sm mt-1" />
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
                                            placeholder="A brief description of why this pet needs help (e.g., 'Injured kitten needs urgent medical care')"
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
                                                <FaFileAlt className="text-accent" />
                                                Detailed Description *
                                            </span>
                                        </label>
                                        <div className={`${
                                            errors.longDescription && touched.longDescription ? 'border border-error rounded-lg' : ''
                                        }`}>
                                            <TiptapEditor
                                                content={values.longDescription}
                                                onChange={(content) => setFieldValue('longDescription', content)}
                                                placeholder="Provide detailed information about the pet's condition, medical needs, treatment required, how the donations will be used, and any other relevant details..."
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
                                                    Updating Campaign...
                                                </>
                                            ) : (
                                                <>
                                                    <FaEdit className="w-5 h-5" />
                                                    Update Campaign
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/dashboard/my-donation-campaigns')}
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
                <div className="mt-8 backdrop-blur-lg bg-info/10 border border-info/20 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <FaInfoCircle className="text-info text-xl mt-1" />
                        <div>
                            <h3 className="font-bold text-info mb-2">Update Guidelines</h3>
                            <ul className="text-sm text-base-content/70 space-y-1">
                                <li>• Only update fields that need changes</li>
                                <li>• Image upload is optional - leave unchanged to keep current image</li>
                                <li>• Be transparent about any changes in the pet's condition</li>
                                <li>• Updated information will be visible to all donors immediately</li>
                                <li>• Major changes might require notifying existing donors</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EditDonationCampaign;
