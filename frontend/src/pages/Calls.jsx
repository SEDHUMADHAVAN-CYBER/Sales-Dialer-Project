import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FiClock, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';

const Calls = () => {
    const { isSalesperson } = useAuth();
    const [calls, setCalls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCalls();
    }, []);

    const fetchCalls = async () => {
        try {
            const endpoint = isSalesperson ? '/calls/my-calls' : '/calls';
            const response = await api.get(endpoint);
            setCalls(response.data.calls);
        } catch (error) {
            console.error('Error fetching calls:', error);
        } finally {
            setLoading(false);
        }
    };

    const getOutcomeBadge = (outcome) => {
        const badges = {
            no_answer: 'badge-gray',
            busy: 'badge-warning',
            voicemail: 'badge-info',
            connected: 'badge-success',
            interested: 'badge-success',
            not_interested: 'badge-danger',
            callback: 'badge-warning',
            converted: 'badge-success',
        };
        return badges[outcome] || 'badge-gray';
    };

    const formatDuration = (seconds) => {
        if (!seconds) return 'N/A';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
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
                <h2 className="text-2xl font-bold text-gray-900">
                    {isSalesperson ? 'My Call History' : 'All Calls'}
                </h2>
                <p className="text-gray-600 mt-1">{calls.length} calls total</p>
            </div>

            {/* Calls Table */}
            <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                {!isSalesperson && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salesperson</th>
                                )}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Outcome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {calls.map((call) => (
                                <tr key={call.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-gray-900">
                                            <FiCalendar className="w-4 h-4 text-gray-400" />
                                            {format(new Date(call.start_time), 'MMM dd, yyyy HH:mm')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{call.company_name}</td>
                                    <td className="px-6 py-4 text-gray-600">{call.contact_person}</td>
                                    {!isSalesperson && (
                                        <td className="px-6 py-4 text-gray-600">{call.salesperson_name}</td>
                                    )}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FiClock className="w-4 h-4 text-gray-400" />
                                            {formatDuration(call.duration)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`badge ${getOutcomeBadge(call.outcome)}`}>
                                            {call.outcome?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <p className="text-sm text-gray-600 truncate">
                                            {call.notes || '-'}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {calls.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No calls found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Calls;
