import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { showSuccessNotification, showErrorNotification } from '../utils/notifications';
import { FaHeart, FaEdit, FaEye, FaPause, FaPlay, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { MdPets } from 'react-icons/md';
import DashboardLayout from '../Layout/DashboardLayout';

const MyDonationCampaigns = () => {
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [donators, setDonators] = useState([]);
    const [showDonatorsModal, setShowDonatorsModal] = useState(false);
    const [loadingDonators, setLoadingDonators] = useState(false);

    const fetchCampaigns = useCallback(async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/donation-campaigns/my-campaigns`, {
                headers: {
                    'Authorization': `Bearer ${await user.getIdToken()}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCampaigns(data);
            } else {
                showErrorNotification('Failed to fetch campaigns');
            }
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            showErrorNotification('Failed to fetch campaigns');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    const toggleCampaignStatus = async (campaignId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/donation-campaigns/${campaignId}/toggle-status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${await user.getIdToken()}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                showSuccessNotification(data.message);
                fetchCampaigns(); // Refresh campaigns
            } else {
                const error = await response.json();
                showErrorNotification(error.error || 'Failed to update campaign status');
            }
        } catch (error) {
            console.error('Error updating campaign status:', error);
            showErrorNotification('Failed to update campaign status');
        }
    };

    const showDonators = async (campaignId) => {
        setLoadingDonators(true);
        setShowDonatorsModal(true);
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/donation-campaigns/${campaignId}/donations`, {
                headers: {
                    'Authorization': `Bearer ${await user.getIdToken()}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setDonators(data);
            } else {
                showErrorNotification('Failed to fetch donators');
            }
        } catch (error) {
            console.error('Error fetching donators:', error);
            showErrorNotification('Failed to fetch donators');
        } finally {
            setLoadingDonators(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            active: 'badge-success',
            paused: 'badge-warning',
            completed: 'badge-info',
            expired: 'badge-error'
        };

        return (
            <span className={`badge ${statusClasses[status] || 'badge-neutral'} font-medium`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const calculateProgress = (raised, max) => {
        return Math.min((raised / max) * 100, 100);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (loading) {
        return (
            <DashboardLayout activeMenuId="my-donation-campaigns">
                <div className="w-full max-w-4xl mx-auto">
                    <div className="text-center py-16">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="mt-4 text-lg text-base-content/70">Loading your campaigns...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activeMenuId="my-donation-campaigns">
            <div className="w-full max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary font-medium mb-4">
                        <FaHeart className="w-5 h-5" />
                        <span>My Campaigns</span>
                    </div>
                    <h1 className="font-secondary font-bold text-3xl md:text-4xl mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                        My Donation Campaigns
                    </h1>
                    <p className="text-base text-base-content/70 max-w-2xl mx-auto">
                        Manage your donation campaigns and track their progress
                    </p>
                </div>

                {/* Create Campaign Button */}
                <div className="flex justify-center mb-8">
                    <Link
                        to="/dashboard/create-donation-campaign"
                        className="btn btn-primary btn-lg gap-2 hover:scale-105 transition-transform"
                    >
                        <FaHeart className="w-5 h-5" />
                        Create New Campaign
                    </Link>
                </div>

                {/* Campaigns Table */}
                {campaigns.length === 0 ? (
                    <div className="text-center py-16">
                        <MdPets className="w-24 h-24 text-base-content/30 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-base-content/70 mb-2">No Campaigns Yet</h3>
                        <p className="text-base-content/60 mb-6">You haven't created any donation campaigns yet.</p>
                        <Link
                            to="/dashboard/create-donation-campaign"
                            className="btn btn-primary btn-lg gap-2"
                        >
                            <FaHeart className="w-5 h-5" />
                            Create Your First Campaign
                        </Link>
                    </div>
                ) : (
                    <div className="bg-base-100 rounded-3xl shadow-2xl overflow-hidden border border-base-300">
                        <div className="overflow-x-auto">
                            <table className="table table-lg">
                                <thead className="bg-base-200">
                                    <tr>
                                        <th className="text-base font-semibold">Pet Details</th>
                                        <th className="text-base font-semibold">Progress</th>
                                        <th className="text-base font-semibold">Status</th>
                                        <th className="text-base font-semibold">End Date</th>
                                        <th className="text-base font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {campaigns.map((campaign) => (
                                        <tr key={campaign._id} className="hover:bg-base-50">
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-16 h-16">
                                                            <img
                                                                src={campaign.petImage || '/placeholder.jpg'}
                                                                alt={campaign.petName}
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-lg">{campaign.petName}</div>
                                                        <div className="text-sm text-base-content/70">
                                                            {campaign.shortDescription.substring(0, 50)}...
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium">
                                                            {formatCurrency(campaign.raisedAmount || 0)}
                                                        </span>
                                                        <span className="text-sm text-base-content/70">
                                                            {formatCurrency(campaign.maxDonationAmount)}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-base-300 rounded-full h-2">
                                                        <div
                                                            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                                                            style={{
                                                                width: `${calculateProgress(campaign.raisedAmount || 0, campaign.maxDonationAmount)}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <div className="text-xs text-base-content/60">
                                                        {Math.round(calculateProgress(campaign.raisedAmount || 0, campaign.maxDonationAmount))}% raised
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {getStatusBadge(campaign.status)}
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <FaCalendarAlt className="w-4 h-4 text-base-content/60" />
                                                    <span>{formatDate(campaign.lastDate)}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => toggleCampaignStatus(campaign._id, campaign.status)}
                                                        className={`btn btn-sm ${campaign.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                                                        title={campaign.status === 'active' ? 'Pause Campaign' : 'Resume Campaign'}
                                                    >
                                                        {campaign.status === 'active' ? (
                                                            <FaPause className="w-4 h-4" />
                                                        ) : (
                                                            <FaPlay className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <Link
                                                        to={`/dashboard/edit-donation-campaign/${campaign._id}`}
                                                        className="btn btn-sm btn-primary"
                                                        title="Edit Campaign"
                                                    >
                                                        <FaEdit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => showDonators(campaign._id)}
                                                        className="btn btn-sm btn-info"
                                                        title="View Donators"
                                                    >
                                                        <FaEye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Donators Modal */}
                {showDonatorsModal && (
                    <div className="modal modal-open">
                        <div className="modal-box max-w-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold">Campaign Donators</h3>
                                <button
                                    className="btn btn-sm btn-circle btn-ghost"
                                    onClick={() => setShowDonatorsModal(false)}
                                >
                                    ✕
                                </button>
                            </div>

                            {loadingDonators ? (
                                <div className="text-center py-8">
                                    <span className="loading loading-spinner loading-lg text-primary"></span>
                                    <p className="mt-4">Loading donators...</p>
                                </div>
                            ) : donators.length === 0 ? (
                                <div className="text-center py-8">
                                    <FaHeart className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                                    <p className="text-lg text-base-content/70">No donations yet</p>
                                    <p className="text-base-content/60">Share your campaign to get more donations!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-sm text-base-content/70 mb-4">
                                        Total Donations: {donators.length}
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {donators.map((donation, index) => (
                                            <div key={index} className="flex justify-between items-center p-4 bg-base-100 rounded-lg border border-base-300">
                                                <div>
                                                    <div className="font-semibold">{donation.donorName}</div>
                                                    <div className="text-sm text-base-content/70">{donation.donorEmail}</div>
                                                    <div className="text-xs text-base-content/60">
                                                        {formatDate(donation.date)}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-lg text-primary">
                                                        {formatCurrency(donation.amount)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyDonationCampaigns;
