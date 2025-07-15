import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../Layout/DashboardLayout';
import { FaCheck, FaTimes, FaSpinner, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { MdPets } from 'react-icons/md';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

const AdoptionRequests = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const fetchAdoptionRequests = useCallback(async () => {
        try {
            setLoading(true);
            const token = await user.getIdToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/adoption-requests`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            } else {
                throw new Error('Failed to fetch adoption requests');
            }
        } catch (error) {
            console.error('Error fetching adoption requests:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to load adoption requests. Please try again.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchAdoptionRequests();
        }
    }, [user, fetchAdoptionRequests]);

    const handleRequestAction = async (requestId, action, petName, requesterName) => {
        const actionText = action === 'accept' ? 'Accept' : 'Reject';
        const actionColor = action === 'accept' ? '#10b981' : '#ef4444';
        
        const result = await Swal.fire({
            title: `${actionText} Adoption Request?`,
            html: `
                <div class="text-center">
                    <div class="text-4xl mb-4">${action === 'accept' ? '🐾' : '❌'}</div>
                    <p class="text-lg mb-2">Are you sure you want to ${action} this adoption request?</p>
                    <div class="bg-base-200 rounded-lg p-4 mt-4">
                        <p><strong>Pet:</strong> ${petName}</p>
                        <p><strong>Requester:</strong> ${requesterName}</p>
                    </div>
                    ${action === 'accept' ? '<p class="text-sm text-gray-600 mt-4">This will mark the pet as adopted and reject all other pending requests.</p>' : ''}
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Yes, ${actionText}`,
            cancelButtonText: 'Cancel',
            confirmButtonColor: actionColor,
            cancelButtonColor: '#6b7280'
        });

        if (result.isConfirmed) {
            try {
                setProcessingId(requestId);
                const token = await user.getIdToken();
                const response = await fetch(`${import.meta.env.VITE_API_URL}/adoption-requests/${requestId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ action })
                });

                if (response.ok) {
                    const successMessage = action === 'accept' 
                        ? 'Adoption request accepted! The pet has been marked as adopted.'
                        : 'Adoption request rejected.';
                    
                    Swal.fire({
                        title: 'Success!',
                        text: successMessage,
                        icon: 'success',
                        confirmButtonColor: '#10b981'
                    });
                    fetchAdoptionRequests(); // Refresh the list
                } else {
                    const error = await response.json();
                    throw new Error(error.error || `Failed to ${action} request`);
                }
            } catch (error) {
                console.error(`Error ${action}ing request:`, error);
                Swal.fire({
                    title: 'Error',
                    text: error.message || `Failed to ${action} request. Please try again.`,
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
            } finally {
                setProcessingId(null);
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <div className="badge badge-warning">Pending</div>;
            case 'accepted':
                return <div className="badge badge-success">Accepted</div>;
            case 'rejected':
                return <div className="badge badge-error">Rejected</div>;
            default:
                return <div className="badge badge-neutral">Unknown</div>;
        }
    };

    if (loading) {
        return (
            <DashboardLayout activeMenuId="adoption-requests">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <FaSpinner className="animate-spin text-4xl text-primary mb-4 mx-auto" />
                        <p className="text-lg">Loading adoption requests...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activeMenuId="adoption-requests">
            <div className="w-full max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary font-medium mb-4">
                        <MdPets className="w-5 h-5" />
                        <span>Adoption Requests</span>
                    </div>
                    <h1 className="font-secondary font-bold text-3xl md:text-4xl mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                        Pet Adoption Requests
                    </h1>
                    <p className="text-base text-base-content/70 max-w-2xl mx-auto">
                        Manage adoption requests for your pets
                    </p>
                </div>

                {/* Requests Table */}
                <div className="backdrop-blur-lg bg-white/30 dark:bg-base-200/20 border border-base-content/10 dark:border-base-content/20 rounded-3xl overflow-hidden shadow-xl">
                    {requests.length === 0 ? (
                        <div className="text-center py-16">
                            <MdPets className="text-6xl text-base-content/30 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-base-content/70 mb-2">No Adoption Requests</h3>
                            <p className="text-base-content/60 mb-6">You haven't received any adoption requests yet.</p>
                            <a href="/add-pet" className="btn btn-primary">
                                Add a Pet for Adoption
                            </a>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr className="border-b border-base-content/10">
                                        <th className="text-left">Pet Details</th>
                                        <th className="text-left">Requester Info</th>
                                        <th className="text-left">Contact Details</th>
                                        <th className="text-left">Request Date</th>
                                        <th className="text-left">Status</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((request) => (
                                        <tr key={request._id} className="hover:bg-base-content/5 transition-colors">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-12 h-12">
                                                            <img
                                                                src={request.petImage || '/placeholder.jpg'}
                                                                alt={request.petName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-base-content">
                                                            {request.petName}
                                                        </div>
                                                        <div className="text-sm text-base-content/60">
                                                            Pet ID: {request.petId.slice(-8)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FaUser className="text-primary text-sm" />
                                                    <span className="font-medium">{request.requesterName}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-base-content/60">
                                                    <FaMapMarkerAlt className="text-accent" />
                                                    <span>{request.requesterLocation}</span>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FaEnvelope className="text-info text-sm" />
                                                    <span className="text-sm">{request.requesterEmail}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FaPhone className="text-success text-sm" />
                                                    <span className="text-sm">{request.requesterPhone}</span>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="text-base-content">
                                                    {format(new Date(request.requestDate), 'MMM dd, yyyy')}
                                                </div>
                                                <div className="text-sm text-base-content/60">
                                                    {format(new Date(request.requestDate), 'hh:mm a')}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                {getStatusBadge(request.status)}
                                            </td>
                                            <td className="py-4 text-center">
                                                {request.status === 'pending' ? (
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleRequestAction(request._id, 'accept', request.petName, request.requesterName)}
                                                            disabled={processingId === request._id}
                                                            className="btn btn-sm btn-success"
                                                            title="Accept adoption request"
                                                        >
                                                            {processingId === request._id ? (
                                                                <FaSpinner className="animate-spin" />
                                                            ) : (
                                                                <FaCheck />
                                                            )}
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleRequestAction(request._id, 'reject', request.petName, request.requesterName)}
                                                            disabled={processingId === request._id}
                                                            className="btn btn-sm btn-error"
                                                            title="Reject adoption request"
                                                        >
                                                            {processingId === request._id ? (
                                                                <FaSpinner className="animate-spin" />
                                                            ) : (
                                                                <FaTimes />
                                                            )}
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-base-content/60">
                                                        {request.status === 'accepted' ? 'Adopted' : 'Rejected'}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Stats Card */}
                {requests.length > 0 && (
                    <div className="mt-8 backdrop-blur-lg bg-primary/10 border border-primary/20 rounded-2xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary mb-2">
                                    {requests.length}
                                </div>
                                <div className="text-sm text-base-content/70">Total Requests</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-warning mb-2">
                                    {requests.filter(r => r.status === 'pending').length}
                                </div>
                                <div className="text-sm text-base-content/70">Pending</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-success mb-2">
                                    {requests.filter(r => r.status === 'accepted').length}
                                </div>
                                <div className="text-sm text-base-content/70">Accepted</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-error mb-2">
                                    {requests.filter(r => r.status === 'rejected').length}
                                </div>
                                <div className="text-sm text-base-content/70">Rejected</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdoptionRequests;
