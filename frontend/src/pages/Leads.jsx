import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FiPhone, FiEdit, FiTrash2, FiPlus, FiUpload, FiFilter } from 'react-icons/fi';
import CallModal from '../components/CallModal';

const Leads = () => {
    const { isSalesperson, isManager, isAdmin } = useAuth();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showCallModal, setShowCallModal] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchLeads();
    }, [filter]);

    const fetchLeads = async () => {
        try {
            const endpoint = isSalesperson ? '/leads/my-leads' : '/leads';
            const params = filter !== 'all' ? { status: filter } : {};
            const response = await api.get(endpoint, { params });
            setLeads(response.data.leads);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartCall = (lead) => {
        setSelectedLead(lead);
        setShowCallModal(true);
    };

    const handleCallComplete = () => {
        setShowCallModal(false);
        setSelectedLead(null);
        fetchLeads();
    };

    const getStatusBadge = (status) => {
        const badges = {
            new: 'badge-info',
            contacted: 'badge-warning',
            qualified: 'badge-success',
            converted: 'badge-success',
            lost: 'badge-danger',
            follow_up: 'badge-warning',
        };
        return badges[status] || 'badge-gray';
    };

    const getPriorityBadge = (priority) => {
        const badges = {
            high: 'badge-danger',
            medium: 'badge-warning',
            low: 'badge-gray',
        };
        return badges[priority] || 'badge-gray';
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
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isSalesperson ? 'My Leads' : 'All Leads'}
                    </h2>
                    <p className="text-gray-600 mt-1">{leads.length} leads total</p>
                </div>

                {(isManager || isAdmin) && (
                    <div className="flex gap-2">
                        <button className="btn btn-secondary btn-sm">
                            <FiUpload className="w-4 h-4 mr-2" />
                            Upload CSV
                        </button>
                        <button className="btn btn-primary btn-sm">
                            <FiPlus className="w-4 h-4 mr-2" />
                            Add Lead
                        </button>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="card">
                <div className="flex items-center gap-2 flex-wrap">
                    <FiFilter className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filter:</span>
                    {['all', 'new', 'contacted', 'qualified', 'follow_up', 'converted', 'lost'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${filter === status
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {status.replace('_', ' ').toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Leads Table */}
            <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                {!isSalesperson && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                                )}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {leads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{lead.company_name}</div>
                                        {lead.email && (
                                            <div className="text-sm text-gray-500">{lead.email}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">{lead.contact_person}</td>
                                    <td className="px-6 py-4 text-gray-600">{lead.phone}</td>
                                    <td className="px-6 py-4">
                                        <span className={`badge ${getStatusBadge(lead.status)}`}>
                                            {lead.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`badge ${getPriorityBadge(lead.priority)}`}>
                                            {lead.priority}
                                        </span>
                                    </td>
                                    {!isSalesperson && (
                                        <td className="px-6 py-4 text-gray-600">
                                            {lead.assigned_to_name || 'Unassigned'}
                                        </td>
                                    )}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {isSalesperson && (
                                                <button
                                                    onClick={() => handleStartCall(lead)}
                                                    className="btn btn-success btn-sm"
                                                >
                                                    <FiPhone className="w-4 h-4 mr-1" />
                                                    Call
                                                </button>
                                            )}
                                            {(isManager || isAdmin) && (
                                                <>
                                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                        <FiEdit className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {leads.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No leads found</p>
                    </div>
                )}
            </div>

            {/* Call Modal */}
            {showCallModal && selectedLead && (
                <CallModal
                    lead={selectedLead}
                    onClose={() => setShowCallModal(false)}
                    onComplete={handleCallComplete}
                />
            )}
        </div>
    );
};

export default Leads;
