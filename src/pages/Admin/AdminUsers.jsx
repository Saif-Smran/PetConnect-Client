import React, { useState, useEffect } from 'react';
import { FaUser, FaUserShield, FaCrown, FaBan, FaCheck, FaSync, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../../utils/api';
import DynamicTitle from '../../components/DynamicTitle';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(function(user) {
            return user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setFilteredUsers(filtered);
    }, [users, searchTerm]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/auth/users');
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            console.error('Error loading users:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to load users',
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleMakeAdmin = async (userId) => {
        try {
            const result = await Swal.fire({
                title: 'Make Admin',
                text: 'Are you sure you want to make this user an admin?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, make admin'
            });

            if (result.isConfirmed) {
                await api.patch(`/auth/users/${userId}/promote`);
                
                Swal.fire({
                    title: 'Success!',
                    text: 'User has been made an admin',
                    icon: 'success'
                });
                
                loadUsers();
            }
        } catch (error) {
            console.error('Error making user admin:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to make user admin',
                icon: 'error'
            });
        }
    };

    const handleBanUser = async (userId) => {
        try {
            const result = await Swal.fire({
                title: 'Ban User',
                text: 'Are you sure you want to ban this user?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, ban user'
            });

            if (result.isConfirmed) {
                await api.patch(`/auth/users/${userId}/ban`);
                
                Swal.fire({
                    title: 'Success!',
                    text: 'User has been banned',
                    icon: 'success'
                });
                
                loadUsers();
            }
        } catch (error) {
            console.error('Error banning user:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to ban user',
                icon: 'error'
            });
        }
    };

    const handleUnbanUser = async (userId) => {
        try {
            const result = await Swal.fire({
                title: 'Unban User',
                text: 'Are you sure you want to unban this user?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, unban user'
            });

            if (result.isConfirmed) {
                await api.patch(`/auth/users/${userId}/unban`);
                
                Swal.fire({
                    title: 'Success!',
                    text: 'User has been unbanned',
                    icon: 'success'
                });
                
                loadUsers();
            }
        } catch (error) {
            console.error('Error unbanning user:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to unban user',
                icon: 'error'
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
            <DynamicTitle title="Admin Users - Manage User Accounts" />
            <div className="max-w-full mx-auto p-3">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-base-content mb-2">
                        User Management
                    </h1>
                    <p className="text-base-content/60">
                        Manage all registered users and their permissions
                    </p>
                </div>

                {/* Search and Controls */}
                <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="input input-bordered pl-10 w-full md:w-80"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={loadUsers}
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        <FaSync className="mr-2" />
                        Refresh
                    </button>
                </div>

                {/* Users Table */}
                <div className="bg-base-100 rounded-lg shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr className="bg-base-200">
                                    <th className="text-left">User</th>
                                    <th className="text-left">Email</th>
                                    <th className="text-left">Role</th>
                                    <th className="text-left">Status</th>
                                    <th className="text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-8">
                                            <div className="text-base-content/60">
                                                No users found
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map(function(user) {
                                        return (
                                            <tr key={user._id} className="hover:bg-base-200/50 transition-colors">
                                                <td className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="avatar">
                                                            <div className="mask mask-squircle w-12 h-12">
                                                                <img
                                                                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=3B82F6&color=ffffff&size=48&rounded=true`}
                                                                    alt={user.displayName || user.email}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-bold">{user.displayName || 'No Name'}</div>
                                                            <div className="text-sm opacity-50">
                                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        {user.role === 'admin' ? (
                                                            <>
                                                                <FaCrown className="text-warning" />
                                                                <span className="badge badge-warning">Admin</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FaUser className="text-primary" />
                                                                <span className="badge badge-primary">User</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    {user.banned ? (
                                                        <span className="badge badge-error">Banned</span>
                                                    ) : (
                                                        <span className="badge badge-success">Active</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="flex gap-2">
                                                        {user.role !== 'admin' && (
                                                            <button
                                                                className="btn btn-sm btn-warning"
                                                                onClick={() => handleMakeAdmin(user.uid)}
                                                            >
                                                                <FaUserShield className="mr-1" />
                                                                Make Admin
                                                            </button>
                                                        )}
                                                        {user.banned ? (
                                                            <button
                                                                className="btn btn-sm btn-success"
                                                                onClick={() => handleUnbanUser(user.uid)}
                                                            >
                                                                <FaCheck className="mr-1" />
                                                                Unban
                                                            </button>
                                                        ) : (
                                                            user.role !== 'admin' && (
                                                                <button
                                                                    className="btn btn-sm btn-error"
                                                                    onClick={() => handleBanUser(user.uid)}
                                                                >
                                                                    <FaBan className="mr-1" />
                                                                    Ban
                                                                </button>
                                                            )
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Statistics */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-base-100 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-primary">{users.length}</div>
                        <div className="text-sm text-base-content/70">Total Users</div>
                    </div>
                    <div className="bg-base-100 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-warning">{users.filter(function(u) { return u.role === 'admin'; }).length}</div>
                        <div className="text-sm text-base-content/70">Admins</div>
                    </div>
                    <div className="bg-base-100 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-success">{users.filter(function(u) { return !u.banned; }).length}</div>
                        <div className="text-sm text-base-content/70">Active Users</div>
                    </div>
                    <div className="bg-base-100 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-error">{users.filter(function(u) { return u.banned; }).length}</div>
                        <div className="text-sm text-base-content/70">Banned Users</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
