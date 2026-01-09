import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FiCalendar, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { format } from 'date-fns';

const Followups = () => {
    const { isSalesperson } = useAuth();
    const [followups, setFollowups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');

    useEffect(() => {
        fetchFollowups();
    }, [filter]);

    const fetchFollowups = async () => {
        try {
            const endpoint = isSalesperson ? '/followups/my-followups' : '/followups';
            const params = { status: filter };
            const response = await api.get(endpoint, { params });
            setFollowups(response.data.followups);
        } catch (error) {
            console.error('Error fetching followups:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (id) => {
        try {
            await api.patch(`/followups/${id}/complete`, {
                notes: 'Completed via dashboard',
            });
            fetchFollowups();
        } catch (error) {
            console.error('Error completing followup:', error);
            alert('Failed to complete follow-up');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'badge-warning',
            completed: 'badge-success',
            missed: 'badge-danger',
        };
        return badges[status] || 'badge-gray';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: FiClock,
            completed: FiCheckCircle,
            missed: FiAlertCircle,
        };
        return icons[status] || FiClock;
    };

    const isPastDue = (scheduledDate) => {
        return new Date(scheduledDate) < new Date();
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
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Follow-ups</h2>
                <p className="text-gray-600 mt-1">{followups.length} follow-ups</p>
            </div>

            {/* Filters */}
            <div className="card">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    {['pending', 'completed', 'missed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${filter === status
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {status.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Followups List */}
            <div className="space-y-4">
                {followups.map((followup) => {
                    const StatusIcon = getStatusIcon(followup.status);
                    const pastDue = followup.status === 'pending' && isPastDue(followup.scheduled_date);

                    return (
                        <div
                            key={followup.id}
                            className={`card hover:shadow-md transition-shadow ${pastDue ? 'border-l-4 border-red-500' : ''
                                }`}
                        >
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 ${followup.status === 'completed' ? 'text-green-500' :
                                                followup.status === 'missed' ? 'text-red-500' :
                                                    pastDue ? 'text-red-500' : 'text-yellow-500'
                                            }`}>
                                            <StatusIcon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {followup.company_name}
                                            </h3>
                                            <p className="text-gray-600">{followup.contact_person}</p>

                                            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <FiCalendar className="w-4 h-4" />
                                                    {format(new Date(followup.scheduled_date), 'MMM dd, yyyy HH:mm')}
                                                </div>
                                                {!isSalesperson && (
                                                    <div className="text-gray-600">
                                                        Assigned to: <span className="font-medium">{followup.salesperson_name}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {followup.notes && (
                                                <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                                    {followup.notes}
                                                </p>
                                            )}

                                            {pastDue && (
                                                <div className="mt-2 flex items-center gap-1 text-red-600 text-sm font-medium">
                                                    <FiAlertCircle className="w-4 h-4" />
                                                    Overdue
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className={`badge ${getStatusBadge(followup.status)}`}>
                                        {followup.status}
                                    </span>
                                    {followup.status === 'pending' && isSalesperson && (
                                        <button
                                            onClick={() => handleComplete(followup.id)}
                                            className="btn btn-success btn-sm"
                                        >
                                            <FiCheckCircle className="w-4 h-4 mr-1" />
                                            Complete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {followups.length === 0 && (
                <div className="card text-center py-12">
                    <p className="text-gray-500">No follow-ups found</p>
                </div>
            )}
        </div>
    );
};

export default Followups;
