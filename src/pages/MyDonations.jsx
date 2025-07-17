import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../Layout/DashboardLayout';
import { FaHeart, FaTrash, FaEye, FaSpinner } from 'react-icons/fa';
import { MdPets } from 'react-icons/md';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

const MyDonations = () => {
    const { user } = useAuth();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refundingId, setRefundingId] = useState(null);

    const fetchMyDonations = useCallback(async () => {
        try {
            setLoading(true);
            const token = await user.getIdToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/my-donations`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setDonations(data);
            } else {
                throw new Error('Failed to fetch donations');
            }
        } catch (error) {
            console.error('Error fetching donations:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to load your donations. Please try again.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchMyDonations();
        }
    }, [user, fetchMyDonations]);

    const handleRefund = async (donationId, campaignTitle, amount) => {
        const result = await Swal.fire({
            title: 'Request Refund?',
            html: `
                <div class="text-center">
                    <div class="text-4xl mb-4">💰</div>
                    <p class="text-lg mb-2">Are you sure you want to request a refund for your donation?</p>
                    <div class="bg-base-200 rounded-lg p-4 mt-4">
                        <p><strong>Campaign:</strong> ${campaignTitle}</p>
                        <p><strong>Amount:</strong> $${amount}</p>
                    </div>
                    <p class="text-sm text-gray-600 mt-4">This action cannot be undone.</p>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Request Refund',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280'
        });

        if (result.isConfirmed) {
            try {
                setRefundingId(donationId);
                const token = await user.getIdToken();
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/my-donations/${donationId}/refund`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    Swal.fire({
                        title: 'Refund Requested!',
                        text: 'Your refund request has been processed successfully.',
                        icon: 'success',
                        confirmButtonColor: '#10b981'
                    });
                    fetchMyDonations(); // Refresh the list
                } else {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to process refund');
                }
            } catch (error) {
                console.error('Error processing refund:', error);
                Swal.fire({
                    title: 'Refund Failed',
                    text: error.message || 'Failed to process refund. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            } finally {
                setRefundingId(null);
            }
        }
    };

    if (loading) {
        return (
            <DashboardLayout activeMenuId="my-donations">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <FaSpinner className="animate-spin text-4xl text-primary mb-4 mx-auto" />
                        <p className="text-lg">Loading your donations...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activeMenuId="my-donations">
            <div className="w-full max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary font-medium mb-4">
                        <FaHeart className="w-5 h-5" />
                        <span>My Donations</span>
                    </div>
                    <h1 className="font-secondary font-bold text-3xl md:text-4xl mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                        My Donation History
                    </h1>
                    <p className="text-base text-base-content/70 max-w-2xl mx-auto">
                        Track all your donations and manage refund requests
                    </p>
                </div>

                {/* Donations Table */}
                <div className="backdrop-blur-lg bg-white/30 dark:bg-base-200/20 border border-base-content/10 dark:border-base-content/20 rounded-3xl overflow-hidden shadow-xl">
                    {donations.length === 0 ? (
                        <div className="text-center py-16">
                            <FaHeart className="text-6xl text-base-content/30 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-base-content/70 mb-2">No Donations Yet</h3>
                            <p className="text-base-content/60 mb-6">You haven't made any donations yet. Help a pet in need!</p>
                            <a href="/donations" className="btn btn-primary">
                                Browse Donation Campaigns
                            </a>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr className="border-b border-base-content/10">
                                        <th className="text-left">Campain Details</th>
                                        <th className="text-left">Donation Amount</th>
                                        <th className="text-left">Date</th>
                                        <th className="text-left">Campaign Status</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donations.map((donation) => (
                                        <tr key={donation._id} className="hover:bg-base-content/5 transition-colors">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-12 h-12">
                                                            <img
                                                                src={donation.campaign?.image || donation.campaign?.petImage || '/placeholder.jpg'}
                                                                alt={donation.campaign?.title || donation.campaign?.petName || 'Pet'}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-base-content">
                                                            {donation.campaign?.title || donation.campaign?.petName || 'Unknown Pet'}
                                                        </div>
                                                        <div className="text-sm text-base-content/60">
                                                            by {donation.campaign?.organizer || donation.campaign?.createdByName || 'Unknown'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="text-lg font-bold text-success">
                                                    ${donation.amount}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="text-base-content">
                                                    {format(new Date(donation.date), 'MMM dd, yyyy')}
                                                </div>
                                                <div className="text-sm text-base-content/60">
                                                    {format(new Date(donation.date), 'hh:mm a')}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className={`badge ${
                                                    donation.campaign?.status === 'active' ? 'badge-success' :
                                                    donation.campaign?.status === 'completed' ? 'badge-info' :
                                                    donation.campaign?.status === 'paused' ? 'badge-warning' :
                                                    'badge-error'
                                                }`}>
                                                    {donation.campaign?.status || 'Unknown'}
                                                </div>
                                            </td>
                                            <td className="py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleRefund(donation._id, donation.campaign?.title || donation.campaign?.petName || 'Unknown Campaign', donation.amount)}
                                                        disabled={refundingId === donation._id || donation.campaign?.status !== 'active'}
                                                        className={`btn btn-sm ${
                                                            donation.campaign?.status === 'active' 
                                                                ? 'btn-error' 
                                                                : 'btn-disabled'
                                                        }`}
                                                        title={
                                                            donation.campaign?.status !== 'active' 
                                                                ? 'Refunds only available for active campaigns' 
                                                                : 'Request refund'
                                                        }
                                                    >
                                                        {refundingId === donation._id ? (
                                                            <FaSpinner className="animate-spin" />
                                                        ) : (
                                                            <FaTrash />
                                                        )}
                                                        {refundingId === donation._id ? 'Processing...' : 'Refund'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Stats Card */}
                {donations.length > 0 && (
                    <div className="mt-8 backdrop-blur-lg bg-primary/10 border border-primary/20 rounded-2xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary mb-2">
                                    {donations.length}
                                </div>
                                <div className="text-sm text-base-content/70">Total Donations</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-success mb-2">
                                    ${donations.reduce((sum, donation) => sum + donation.amount, 0).toFixed(2)}
                                </div>
                                <div className="text-sm text-base-content/70">Total Amount Donated</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-info mb-2">
                                    {donations.filter(d => d.campaign?.status === 'active').length}
                                </div>
                                <div className="text-sm text-base-content/70">Active Campaigns</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyDonations;
