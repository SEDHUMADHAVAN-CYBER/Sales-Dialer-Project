import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FiPlus, FiEdit, FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        role_id: 3,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, rolesRes] = await Promise.all([
                api.get('/users'),
                api.get('/users/roles'),
            ]);
            setUsers(usersRes.data.users);
            setRoles(rolesRes.data.roles);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users', formData);
            setShowModal(false);
            setFormData({ email: '', password: '', full_name: '', role_id: 3 });
            fetchData();
        } catch (error) {
            console.error('Error creating user:', error);
            alert(error.response?.data?.error || 'Failed to create user');
        }
    };

    const handleToggleActive = async (userId, currentStatus) => {
        try {
            const user = users.find(u => u.id === userId);
            await api.put(`/users/${userId}`, {
                ...user,
                is_active: !currentStatus,
            });
            fetchData();
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        }
    };

    const getRoleBadge = (role) => {
        const badges = {
            admin: 'badge-danger',
            manager: 'badge-warning',
            salesperson: 'badge-info',
        };
        return badges[role] || 'badge-gray';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                    <p className="text-gray-600 mt-1">{users.length} users total</p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary"
                >
                    <FiPlus className="w-4 h-4 mr-2" />
                    Add User
                </button>
            </div>

            {/* Users Table */}
            <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.full_name}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`badge ${getRoleBadge(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`badge ${user.is_active ? 'badge-success' : 'badge-gray'}`}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleToggleActive(user.id, user.is_active)}
                                                className={`p-2 rounded-lg ${user.is_active
                                                        ? 'text-red-600 hover:bg-red-50'
                                                        : 'text-green-600 hover:bg-green-50'
                                                    }`}
                                                title={user.is_active ? 'Deactivate' : 'Activate'}
                                            >
                                                {user.is_active ? <FiUserX className="w-4 h-4" /> : <FiUserCheck className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New User</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="label">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="input"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label className="label">Role</label>
                                <select
                                    value={formData.role_id}
                                    onChange={(e) => setFormData({ ...formData, role_id: parseInt(e.target.value) })}
                                    className="input"
                                    required
                                >
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="btn btn-primary flex-1">
                                    Create User
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
