import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FaHeart, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import Swal from 'sweetalert2';

const AdoptionRequestForm = ({ pet, onClose }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        requesterName: user?.displayName || '',
        requesterEmail: user?.email || '',
        requesterPhone: '',
        requesterLocation: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.requesterName || !formData.requesterEmail || !formData.requesterPhone || !formData.requesterLocation) {
            Swal.fire({
                title: 'Incomplete Information',
                text: 'Please fill in all required fields.',
                icon: 'warning',
                confirmButtonColor: '#ef4444'
            });
            return;
        }

        try {
            setSubmitting(true);
            const token = await user.getIdToken();

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://pet-connect-server-one.vercel.app'}/adoption-requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    petId: pet._id,
                    requesterName: formData.requesterName,
                    requesterEmail: formData.requesterEmail,
                    requesterPhone: formData.requesterPhone,
                    requesterLocation: formData.requesterLocation
                })
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Request Submitted! 🐾',
                    html: `
                        <div class="text-center">
                            <div class="text-6xl mb-4">💝</div>
                            <p class="text-lg mb-2">Your adoption request for <strong>${pet.petName || pet.name}</strong> has been sent!</p>
                            <p class="text-sm text-gray-600">The pet owner will review your request and contact you soon.</p>
                        </div>
                    `,
                    icon: 'success',
                    confirmButtonColor: '#10b981'
                }).then(() => {
                    onClose();
                });
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to submit request');
            }
        } catch (error) {
            console.error('Error submitting adoption request:', error);
            Swal.fire({
                title: 'Request Failed',
                text: error.message || 'Failed to submit adoption request. Please try again.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-base-100 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-base-content/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FaHeart className="text-primary text-xl" />
                            <h2 className="text-xl font-bold">Adoption Request</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="btn btn-ghost btn-sm btn-circle"
                        >
                            ✕
                        </button>
                    </div>
                    <p className="text-base-content/70 mt-2">
                        Submit your adoption request for <strong>{pet.petName || pet.name}</strong>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Pet Info */}
                    <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                        <div className="flex items-center gap-3">
                            <img
                                src={pet.petImage || pet.image || '/placeholder.jpg'}
                                alt={pet.petName || pet.name}
                                className="w-16 h-16 rounded-xl object-cover"
                            />
                            <div>
                                <h3 className="font-bold text-lg">{pet.petName || pet.name}</h3>
                                <p className="text-sm text-base-content/70">{pet.petLocation || pet.location}</p>
                                <p className="text-sm text-base-content/70">{pet.petAge || pet.age} years old</p>
                            </div>
                        </div>
                    </div>

                    {/* Requester Information */}
                    <div className="space-y-4">
                        <div>
                            <label className="label">
                                <span className="label-text font-medium flex items-center gap-2">
                                    <FaUser className="text-primary" />
                                    Your Name *
                                </span>
                            </label>
                            <input
                                type="text"
                                name="requesterName"
                                value={formData.requesterName}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text font-medium flex items-center gap-2">
                                    <FaEnvelope className="text-secondary" />
                                    Email Address *
                                </span>
                            </label>
                            <input
                                type="email"
                                name="requesterEmail"
                                value={formData.requesterEmail}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text font-medium flex items-center gap-2">
                                    <FaPhone className="text-success" />
                                    Phone Number *
                                </span>
                            </label>
                            <input
                                type="tel"
                                name="requesterPhone"
                                value={formData.requesterPhone}
                                onChange={handleInputChange}
                                placeholder="Enter your phone number"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text font-medium flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-warning" />
                                    Your Location *
                                </span>
                            </label>
                            <input
                                type="text"
                                name="requesterLocation"
                                value={formData.requesterLocation}
                                onChange={handleInputChange}
                                placeholder="Enter your city/area"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-primary flex-1 gap-2"
                        >
                            {submitting ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <FaPaperPlane />
                                    Submit Request
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-outline"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdoptionRequestForm;
