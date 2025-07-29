import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { showSuccess, showError, showConfirmation } from '../../utils/notifications';
import { FaUsers, FaUserShield, FaUser, FaEllipsisV } from 'react-icons/fa';
import api from '../../utils/api';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const { user } = useContext(AuthContext);

    // Fetch all users
    const fetchUsers = async () => {
        try {
            const response = await api.get('/auth/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            showError('Error', error.response?.data?.error || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Promote user to admin
    const handlePromoteUser = async (userId, userName) => {
        const result = await showConfirmation(
            'Promote to Admin',
            `Are you sure you want to promote ${userName} to admin?`,
            'Yes, Promote!'
        );

        if (result.isConfirmed) {
            setActionLoading(userId);
            try {
                await api.patch(`/auth/users/${userId}/promote`);
                showSuccess('Success', `${userName} has been promoted to admin`);
                fetchUsers(); // Refresh the list
            } catch (error) {
                console.error('Error promoting user:', error);
                showError('Error', error.response?.data?.error || 'Failed to promote user');
            } finally {
                setActionLoading(null);
            }
        }
    };

    // Demote admin to user
    const handleDemoteUser = async (userId, userName) => {
        const result = await showConfirmation(
            'Demote to User',
            `Are you sure you want to demote ${userName} to regular user?`,
            'Yes, Demote!'
        );

        if (result.isConfirmed) {
            setActionLoading(userId);
            try {
                await api.patch(`/auth/users/${userId}/demote`);
                showSuccess('Success', `${userName} has been demoted to regular user`);
                fetchUsers(); // Refresh the list
            } catch (error) {
                console.error('Error demoting user:', error);
                showError('Error', error.response?.data?.error || 'Failed to demote user');
            } finally {
                setActionLoading(null);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    const adminUsers = users.filter(u => u.role === 'admin');
    const regularUsers = users.filter(u => u.role === 'user');

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="font-secondary font-bold text-3xl mb-2">
                    Admin Dashboard
                </h1>
                <p className="font-primary opacity-70">
                    Manage users and their roles
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FaUsers className="text-blue-600 text-xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold">{users.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <FaUserShield className="text-green-600 text-xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Admins</p>
                            <p className="text-2xl font-bold">{adminUsers.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <FaUser className="text-purple-600 text-xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Regular Users</p>
                            <p className="text-2xl font-bold">{regularUsers.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">All Users</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((userItem) => (
                                <tr key={userItem.uid} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                {userItem.photoURL ? (
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover"
                                                        src={userItem.photoURL}
                                                        alt={userItem.displayName}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div
                                                    className={`h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center ${userItem.photoURL ? 'hidden' : 'flex'
                                                        }`}
                                                >
                                                    <FaUser className="text-gray-500" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {userItem.displayName || 'No Name'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{userItem.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${userItem.role === 'admin'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {userItem.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {userItem.uid !== user?.uid && (
                                            <div className="flex space-x-2">
                                                {userItem.role === 'user' ? (
                                                    <button
                                                        onClick={() => handlePromoteUser(userItem.uid, userItem.displayName || userItem.email)}
                                                        disabled={actionLoading === userItem.uid}
                                                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                                    >
                                                        {actionLoading === userItem.uid ? 'Processing...' : 'Promote to Admin'}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleDemoteUser(userItem.uid, userItem.displayName || userItem.email)}
                                                        disabled={actionLoading === userItem.uid}
                                                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                    >
                                                        {actionLoading === userItem.uid ? 'Processing...' : 'Demote to User'}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        {userItem.uid === user?.uid && (
                                            <span className="text-gray-500 text-sm">You</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
};

export default AdminDashboard;
