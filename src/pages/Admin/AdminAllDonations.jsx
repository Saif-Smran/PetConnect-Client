import React, { useState, useEffect } from 'react';
import { FaHeart, FaEdit, FaTrash, FaPause, FaPlay, FaSync, FaSearch, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../utils/api';
import DynamicTitle from '../../components/DynamicTitle';

const AdminAllDonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDonations, setFilteredDonations] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadDonations();
    }, []);

    useEffect(() => {
        let filtered = donations.filter(function(donation) {
            return donation.petName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                donation.creatorEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                donation.creatorName?.toLowerCase().includes(searchTerm.toLowerCase());
        });

        if (statusFilter !== 'all') {
            filtered = filtered.filter(function(donation) { return donation.status === statusFilter; });
        }

        setFilteredDonations(filtered);
    }, [donations, searchTerm, statusFilter]);

    const loadDonations = async () => {
        try {
            setLoading(true);
            const response = await api.get('/donations');
            setDonations(response.data);
        } catch (error) {
            console.error('Error loading donations:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to load donations',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePauseCampaign = async (donationId) => {
        try {
            const response = await api.put(`/admin/donations/${donationId}/pause`);

            if (response.status === 200) {
                Swal.fire({
                    title: 'Campaign Paused!',
                    text: 'The donation campaign has been paused',
                    icon: 'success',
                    confirmButtonColor: '#10b981'
                });
                loadDonations();
            }
        } catch (error) {
            console.error('Error pausing campaign:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to pause campaign',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    const handleResumeCampaign = async (donationId) => {
        try {
            const response = await api.put(`/admin/donations/${donationId}/resume`);

            if (response.status === 200) {
                Swal.fire({
                    title: 'Campaign Resumed!',
                    text: 'The donation campaign has been resumed',
                    icon: 'success',
                    confirmButtonColor: '#10b981'
                });
                loadDonations();
            }
        } catch (error) {
            console.error('Error resuming campaign:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to resume campaign',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    const handleDeleteCampaign = async (donationId) => {
        const result = await Swal.fire({
            title: 'Delete Campaign',
            text: 'Are you sure you want to delete this donation campaign? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await api.delete(`/admin/donations/${donationId}`);

                if (response.status === 200) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Campaign has been deleted successfully',
                        icon: 'success',
                        confirmButtonColor: '#10b981'
                    });
                    loadDonations();
                } else {
                    throw new Error('Failed to delete campaign');
                }
            } catch (error) {
                console.error('Error deleting campaign:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to delete campaign',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return (
        <div className="h-full bg-gradient-to-br from-base-200 via-base-100 to-base-200">
            <DynamicTitle title="Admin Donations - Manage All Campaigns" />
            <div className="w-full h-full p-4">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary font-medium mb-4">
                        <FaHeart className="w-5 h-5" />
                        <span>Admin Panel</span>
                    </div>
                    <h1 className="font-secondary font-bold text-3xl md:text-4xl mb-4">
                        All Donation Campaigns
                    </h1>
                    <p className="text-base-content/70">
                        Manage all donation campaigns created by users
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                        <input
                            type="text"
                            placeholder="Search campaigns..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input input-bordered w-full pl-10"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="select select-bordered"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button
                        onClick={loadDonations}
                        className="btn btn-primary gap-2"
                    >
                        <FaSync className="w-4 h-4" />
                        Refresh
                    </button>
                </div>

                {/* Donations Table */}
                <div className="bg-base-100 rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr className="bg-base-200">
                                    <th>Campaign</th>
                                    <th>Target/Raised</th>
                                    <th>Creator</th>
                                    <th>Status</th>
                                    <th>Last Update</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDonations.map(function(donation) {
                                    return (
                                    <tr key={donation._id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <img
                                                            src={donation.petImage || '/placeholder.jpg'}
                                                            alt={donation.petName}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{donation.petName}</div>
                                                    <div className="text-sm opacity-50">{donation.shortDescription}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-sm">
                                                <div><strong>Target:</strong> ${donation.maxDonation}</div>
                                                <div><strong>Raised:</strong> ${donation.raisedAmount || 0}</div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                    <div 
                                                        className="bg-primary h-2 rounded-full" 
                                                        style={{width: `${Math.min((donation.raisedAmount || 0) / donation.maxDonation * 100, 100)}%`}}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-sm">
                                                <div>{donation.creatorName}</div>
                                                <div className="opacity-50">{donation.creatorEmail}</div>
                                            </div>
                                        </td>
                                        <td>
                                            {donation.status === 'active' ? (
                                                <span className="badge badge-success">Active</span>
                                            ) : donation.status === 'paused' ? (
                                                <span className="badge badge-warning">Paused</span>
                                            ) : (
                                                <span className="badge badge-info">Completed</span>
                                            )}
                                        </td>
                                        <td>
                                            {new Date(donation.lastUpdate).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <Link to={`/donations/${donation._id}`} className="btn btn-info btn-sm gap-1">
                                                    <FaEye className="w-3 h-3" />
                                                    View
                                                </Link>
                                                <Link to={`/dashboard/edit-donation-campaign/${donation._id}`} className="btn btn-warning btn-sm gap-1">
                                                    <FaEdit className="w-3 h-3" />
                                                    Edit
                                                </Link>
                                                {donation.status === 'active' ? (
                                                    <button
                                                        onClick={() => handlePauseCampaign(donation._id)}
                                                        className="btn btn-warning btn-sm gap-1"
                                                        title="Pause Campaign"
                                                    >
                                                        <FaPause className="w-3 h-3" />
                                                        Pause
                                                    </button>
                                                ) : donation.status === 'paused' ? (
                                                    <button
                                                        onClick={() => handleResumeCampaign(donation._id)}
                                                        className="btn btn-success btn-sm gap-1"
                                                        title="Resume Campaign"
                                                    >
                                                        <FaPlay className="w-3 h-3" />
                                                        Resume
                                                    </button>
                                                ) : null}
                                                <button
                                                    onClick={() => handleDeleteCampaign(donation._id)}
                                                    className="btn btn-error btn-sm gap-1"
                                                    title="Delete Campaign"
                                                >
                                                    <FaTrash className="w-3 h-3" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {filteredDonations.length === 0 && (
                    <div className="text-center py-12">
                        <FaHeart className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
                        <p className="text-base-content/70">No campaigns found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAllDonations;
