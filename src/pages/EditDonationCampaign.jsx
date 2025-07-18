import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';

const EditDonationCampaign = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [campaign, setCampaign] = useState({
        petName: '',
        maxDonation: '',
        shortDescription: '',
        longDescription: '',
        lastDateOfDonation: '',
        image: ''
    });

    useEffect(() => {
        if (id) {
            loadCampaign();
        }
    }, [id]);

    const loadCampaign = async () => {
        try {
            setLoading(true);
            // For now, just set some default values
            setCampaign({
                petName: 'Sample Pet',
                maxDonation: '1000',
                shortDescription: 'Help this pet',
                longDescription: 'This pet needs your help for medical treatment.',
                lastDateOfDonation: new Date().toISOString().split('T')[0],
                image: ''
            });
        } catch (error) {
            console.error('Error loading campaign:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to load campaign details',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCampaign(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Add your API call here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            
            Swal.fire({
                title: 'Success!',
                text: 'Campaign updated successfully',
                icon: 'success',
                confirmButtonColor: '#10b981'
            });
            
            navigate('/dashboard/my-donation-campaigns');
        } catch (error) {
            console.error('Error updating campaign:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to update campaign',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <p className="text-base-content/60">Loading campaign...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning/20 rounded-full text-warning font-medium mb-4">
                        <FaEdit className="w-5 h-5" />
                        <span>Edit Campaign</span>
                    </div>
                    <h1 className="font-secondary font-bold text-3xl md:text-4xl mb-4">
                        Edit Donation Campaign
                    </h1>
                    <p className="text-base-content/70">
                        Update your pet's donation campaign details
                    </p>
                </div>

                {/* Form */}
                <div className="bg-base-100 rounded-2xl shadow-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Pet Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="petName"
                                    value={campaign.petName}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="Enter pet name"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Maximum Donation Amount</span>
                                </label>
                                <input
                                    type="number"
                                    name="maxDonation"
                                    value={campaign.maxDonation}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="Enter maximum donation amount"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Short Description</span>
                            </label>
                            <input
                                type="text"
                                name="shortDescription"
                                value={campaign.shortDescription}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                placeholder="Brief description of the campaign"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Long Description</span>
                            </label>
                            <textarea
                                name="longDescription"
                                value={campaign.longDescription}
                                onChange={handleInputChange}
                                className="textarea textarea-bordered w-full h-32"
                                placeholder="Detailed description of why this pet needs help"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Last Date of Donation</span>
                            </label>
                            <input
                                type="date"
                                name="lastDateOfDonation"
                                value={campaign.lastDateOfDonation}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Pet Image URL</span>
                            </label>
                            <input
                                type="url"
                                name="image"
                                value={campaign.image}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                placeholder="Enter image URL"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn btn-primary flex-1 gap-2"
                            >
                                {saving ? (
                                    <FaSpinner className="w-4 h-4 animate-spin" />
                                ) : (
                                    <FaSave className="w-4 h-4" />
                                )}
                                {saving ? 'Updating...' : 'Update Campaign'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard/my-donation-campaigns')}
                                className="btn btn-ghost flex-1 gap-2"
                            >
                                <FaTimes className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditDonationCampaign;
