import React, { useState, useEffect } from 'react';
import { FaPaw, FaEdit, FaTrash, FaCheck, FaTimes, FaSync, FaSearch, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../utils/api';
import DynamicTitle from '../../components/DynamicTitle';

const AdminAllPets = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPets, setFilteredPets] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadPets();
    }, []);

    useEffect(() => {
        let filtered = pets.filter(function(pet) {
            return pet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pet.addedByEmail?.toLowerCase().includes(searchTerm.toLowerCase());
        });

        if (statusFilter !== 'all') {
            filtered = filtered.filter(function(pet) { return pet.adopted === (statusFilter === 'adopted'); });
        }

        setFilteredPets(filtered);
    }, [pets, searchTerm, statusFilter]);

    const loadPets = async () => {
        try {
            setLoading(true);
            const response = await api.get('/pets');
            setPets(response.data);
        } catch (error) {
            console.error('Error loading pets:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to load pets',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (petId, newStatus) => {
        try {
            const response = await api.put(`/admin/pets/${petId}`, {
                adopted: newStatus
            });

            if (response.status === 200) {
                Swal.fire({
                    title: 'Status Updated!',
                    text: `Pet status changed to ${newStatus ? 'adopted' : 'available'}`,
                    icon: 'success',
                    confirmButtonColor: '#10b981'
                });
                loadPets();
            } else {
                throw new Error('Failed to update pet status');
            }
        } catch (error) {
            console.error('Error updating pet status:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to update pet status',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    const handleDeletePet = async (petId) => {
        const result = await Swal.fire({
            title: 'Delete Pet',
            text: 'Are you sure you want to delete this pet? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await api.delete(`/admin/pets/${petId}`);

                if (response.status === 200) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Pet has been deleted successfully',
                        icon: 'success',
                        confirmButtonColor: '#10b981'
                    });
                    loadPets();
                } else {
                    throw new Error('Failed to delete pet');
                }
            } catch (error) {
                console.error('Error deleting pet:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to delete pet',
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
            <DynamicTitle title="Admin Pets - Manage All Pet Listings" />
            <div className="w-full h-full p-4">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full text-secondary font-medium mb-4">
                        <FaPaw className="w-5 h-5" />
                        <span>Admin Panel</span>
                    </div>
                    <h1 className="font-secondary font-bold text-3xl md:text-4xl mb-4">
                        All Pets Management
                    </h1>
                    <p className="text-base-content/70">
                        Manage all pets added by users
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                        <input
                            type="text"
                            placeholder="Search pets..."
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
                        <option value="available">Available</option>
                        <option value="adopted">Adopted</option>
                    </select>
                    <button
                        onClick={loadPets}
                        className="btn btn-primary gap-2"
                    >
                        <FaSync className="w-4 h-4" />
                        Refresh
                    </button>
                </div>

                {/* Pets Table */}
                <div className="bg-base-100 rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr className="bg-base-200">
                                    <th>Pet</th>
                                    <th>Details</th>
                                    <th>Added By</th>
                                    <th>Status</th>
                                    <th>Added Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPets.map(function(pet) {
                                    return (
                                    <tr key={pet._id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <img
                                                            src={pet.image || '/placeholder.jpg'}
                                                            alt={pet.name}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{pet.name}</div>
                                                    <div className="text-sm opacity-50">{pet.breed}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-sm">
                                                <div><strong>Age:</strong> {pet.age}</div>
                                                <div><strong>Category:</strong> {pet.category}</div>
                                                <div><strong>Location:</strong> {pet.location}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-sm">
                                                <div>{pet.addedByEmail}</div>
                                                <div className="opacity-50">{pet.addedByName}</div>
                                            </div>
                                        </td>
                                        <td>
                                            {pet.adopted ? (
                                                <span className="badge badge-success">Adopted</span>
                                            ) : (
                                                <span className="badge badge-info">Available</span>
                                            )}
                                        </td>
                                        <td>
                                            {new Date(pet.dateAdded).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <Link to={`/pet/${pet._id}`} className="btn btn-info btn-sm gap-1">
                                                    <FaEye className="w-3 h-3" />
                                                    View
                                                </Link>
                                                <Link to={`/update-pet/${pet._id}`} className="btn btn-warning btn-sm gap-1">
                                                    <FaEdit className="w-3 h-3" />
                                                    Edit
                                                </Link>
                                                {pet.adopted ? (
                                                    <button
                                                        onClick={() => handleUpdateStatus(pet._id, false)}
                                                        className="btn btn-success btn-sm gap-1"
                                                        title="Mark as Available"
                                                    >
                                                        <FaTimes className="w-3 h-3" />
                                                        Available
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUpdateStatus(pet._id, true)}
                                                        className="btn btn-success btn-sm gap-1"
                                                        title="Mark as Adopted"
                                                    >
                                                        <FaCheck className="w-3 h-3" />
                                                        Adopted
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeletePet(pet._id)}
                                                    className="btn btn-error btn-sm gap-1"
                                                    title="Delete Pet"
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

                {filteredPets.length === 0 && (
                    <div className="text-center py-12">
                        <FaPaw className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
                        <p className="text-base-content/70">No pets found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAllPets;
