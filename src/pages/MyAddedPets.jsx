import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaPaw, FaEdit, FaTrash, FaHeart, FaPlus } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { getFreshFirebaseToken, isValidFirebaseToken } from '../utils/tokenUtils';
import DynamicTitle from '../components/DynamicTitle';

const MyAddedPets = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch pets added by user
  const fetchPets = useCallback(async () => {
    if (!user) {
      console.error('No user authenticated');
      navigate('/login');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Check existing token first
      let token = localStorage.getItem('firebase_id_token');
      
      // If no token or invalid token, get a fresh one
      if (!token || !isValidFirebaseToken(token)) {
        console.log('🔄 Getting fresh Firebase token...');
        token = await getFreshFirebaseToken(user);
      }
      
      console.log('🔍 Using token for request:', token.substring(0, 20) + '...');
      console.log('🔍 Making request to:', `${import.meta.env.VITE_API_URL}/pets/my-pets`);
      
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/pets/my-pets`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      console.log('✅ Response received:', res.data);
      console.log('✅ Response length:', res.data.length);
      
      // Ensure data is always an array
      const petsData = Array.isArray(res.data) ? res.data : [];
      setData(petsData);
      console.log('✅ Data set successfully');
    } catch (error) {
      console.error('❌ Error fetching pets:', error);
      
      // If token error, try to get a fresh token and retry once
      if (error.response?.status === 401 || error.response?.status === 403) {
        try {
          console.log('🔄 Token error, getting fresh token and retrying...');
          const freshToken = await getFreshFirebaseToken(user);
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/pets/my-pets`, {
            headers: { 
              Authorization: `Bearer ${freshToken}`,
              'Content-Type': 'application/json'
            },
          });
          console.log('✅ Retry successful:', res.data);
          const petsData = Array.isArray(res.data) ? res.data : [];
          setData(petsData);
          return;
        } catch (retryError) {
          console.error('Retry with fresh token also failed:', retryError);
        }
        
        Swal.fire({
          title: 'Authentication Error',
          text: 'Please log in again to view your pets',
          icon: 'error',
          confirmButtonText: 'Go to Login',
          confirmButtonColor: '#ef4444'
        }).then(() => {
          navigate('/login');
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to load your pets. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate, user]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  // Delete pet handler
  const deletePet = useCallback((id) => {
    Swal.fire({
      title: 'Delete Pet? 🗑️',
      text: 'Are you sure you want to delete this pet? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280'
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!user) {
          Swal.fire({
            title: 'Authentication Error',
            text: 'Please log in again to delete pets',
            icon: 'error',
            confirmButtonColor: '#ef4444'
          });
          return;
        }
        
        try {
          const token = await getFreshFirebaseToken(user);
          await axios.delete(
            `${import.meta.env.VITE_API_URL}/pets/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchPets();
          Swal.fire({
            title: 'Deleted!',
            text: 'Your pet has been deleted successfully.',
            icon: 'success',
            confirmButtonColor: '#10b981'
          });
        } catch (error) {
          console.error('Error deleting pet:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to delete pet. Please try again.',
            icon: 'error',
            confirmButtonColor: '#ef4444'
          });
        }
      }
    });
  }, [user, fetchPets]);

  // Mark pet as adopted handler
  const adoptPet = useCallback(async (id) => {
    if (!user) {
      Swal.fire({
        title: 'Authentication Error',
        text: 'Please log in again to update pets',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
      return;
    }
    
    try {
      const token = await getFreshFirebaseToken(user);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/pets/${id}`,
        { adopted: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPets();
      Swal.fire({
        title: 'Congratulations! 🎉',
        text: 'Pet marked as adopted successfully!',
        icon: 'success',
        confirmButtonColor: '#10b981'
      });
    } catch (error) {
      console.error('Error updating pet:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update pet. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    }
  }, [user, fetchPets]);

  // Log for debugging if needed
  console.log('Data length:', data.length);

  return (
    <div>
      <DynamicTitle title="My Added Pets - Manage Your Pet Listings" />
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-lg text-base-content/60">Loading your pets...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-12">
          <div className="container mx-auto px-4">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/20 rounded-full text-primary font-medium mb-6">
                <FaPaw className="w-6 h-6" />
                <span className="text-lg">My Added Pets</span>
              </div>
              <h1 className="font-secondary font-bold text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Manage Your Pets
              </h1>
              <p className="text-xl text-base-content/70 max-w-3xl mx-auto mb-8">
                View, edit, and manage all the pets you've added for adoption
              </p>
              
              {/* Add New Pet Button */}
              <button
                onClick={() => navigate('/dashboard/add-pet')}
                className="btn btn-primary btn-lg gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <FaPlus className="w-5 h-5" />
                Add New Pet
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="backdrop-blur-lg bg-base-100/80 border border-base-content/10 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">🐾</div>
                <h3 className="text-2xl font-bold text-primary">{Array.isArray(data) ? data.length : 0}</h3>
                <p className="text-base-content/70">Total Pets</p>
              </div>
              <div className="backdrop-blur-lg bg-base-100/80 border border-base-content/10 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">❤️</div>
                <h3 className="text-2xl font-bold text-success">{Array.isArray(data) ? data.filter(pet => pet.adopted).length : 0}</h3>
                <p className="text-base-content/70">Adopted</p>
              </div>
              <div className="backdrop-blur-lg bg-base-100/80 border border-base-content/10 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">🏠</div>
                <h3 className="text-2xl font-bold text-warning">{Array.isArray(data) ? data.filter(pet => !pet.adopted).length : 0}</h3>
                <p className="text-base-content/70">Available</p>
              </div>
            </div>

            {/* Table Section */}
            <div className="backdrop-blur-lg bg-base-100/90 border border-base-content/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-base-content/10">
                <h2 className="text-2xl font-bold text-base-content flex items-center gap-3">
                  <FaPaw className="text-primary" />
                  Your Pet Listings
                </h2>
              </div>
              
              {!Array.isArray(data) || data.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🐕</div>
                  <h3 className="text-2xl font-bold text-base-content mb-2">No Pets Added Yet</h3>
                  <p className="text-base-content/70 mb-6">Start by adding your first pet for adoption</p>
                  <button
                    onClick={() => navigate('/dashboard/add-pet')}
                    className="btn btn-primary btn-lg gap-3"
                  >
                    <FaPlus className="w-5 h-5" />
                    Add Your First Pet
                  </button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead className="bg-base-200/50">
                        <tr>
                          <th className="p-4 text-base font-semibold">Photo</th>
                          <th className="p-4 text-base font-semibold">Pet Name</th>
                          <th className="p-4 text-base font-semibold">Category</th>
                          <th className="p-4 text-base font-semibold">Age</th>
                          <th className="p-4 text-base font-semibold">Location</th>
                          <th className="p-4 text-base font-semibold">Status</th>
                          <th className="p-4 text-base font-semibold">Date Added</th>
                          <th className="p-4 text-base font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((pet, index) => (
                          <tr key={pet._id} className={`hover:bg-base-200/30 transition-colors ${index % 2 === 0 ? 'bg-base-50/30' : ''}`}>
                            <td className="p-4">
                              <div className="avatar">
                                <div className="mask mask-squircle h-16 w-16">
                                  <img
                                    src={pet.petImage}
                                    alt={pet.petName}
                                    className="object-cover"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-medium text-base-content">
                                {pet.petName}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="badge badge-outline capitalize">
                                {pet.petCategory}
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-base-content/70">
                                {pet.petAge} years
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="text-base-content/70">
                                {pet.petLocation}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className={`badge ${pet.adopted ? 'badge-success' : 'badge-warning'}`}>
                                {pet.adopted ? 'Adopted' : 'Available'}
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-base-content/70">
                                {new Date(pet.dateAdded).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => navigate(`/update-pet/${pet._id}`)}
                                  className="btn btn-sm btn-primary gap-1 hover:scale-105 transition-transform"
                                  title="Edit Pet"
                                >
                                  <FaEdit className="w-3 h-3" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => deletePet(pet._id)}
                                  className="btn btn-sm btn-error gap-1 hover:scale-105 transition-transform"
                                  title="Delete Pet"
                                >
                                  <FaTrash className="w-3 h-3" />
                                  Delete
                                </button>
                                {!pet.adopted && (
                                  <button
                                    onClick={() => adoptPet(pet._id)}
                                    className="btn btn-sm btn-success gap-1 hover:scale-105 transition-transform"
                                    title="Mark as Adopted"
                                  >
                                    <FaHeart className="w-3 h-3" />
                                    Adopted
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination - Only show if more than 10 pets */}
                  {data.length > 10 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t border-base-content/10 bg-base-50/30">
                      <div className="text-sm text-base-content/70">
                        Showing {data.length} pets
                      </div>
                      <div className="text-sm text-base-content/70">
                        Pagination can be added if needed
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAddedPets;
