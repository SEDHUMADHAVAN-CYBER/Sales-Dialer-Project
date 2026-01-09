import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FiDownload, FiTrendingUp, FiUsers, FiPhone, FiTarget } from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('7days');

    useEffect(() => {
        fetchAnalytics();
    }, [dateRange]);

    const fetchAnalytics = async () => {
        try {
            const [analyticsRes, leaderboardRes] = await Promise.all([
                api.get('/analytics/overall'),
                api.get('/analytics/leaderboard'),
            ]);
            setAnalytics(analyticsRes.data);
            setLeaderboard(leaderboardRes.data.leaderboard);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (type) => {
        try {
            const response = await api.get(`/analytics/export?type=${type}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}_report.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting report:', error);
            alert('Failed to export report');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const callsPerDayData = {
        labels: (analytics?.calls_per_day || []).map(d =>
            new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        ),
        datasets: [
            {
                label: 'Calls',
                data: (analytics?.calls_per_day || []).map(d => d.count),
                borderColor: 'rgb(14, 165, 233)',
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const outcomeData = analytics?.calls_by_outcome || [];
    const outcomeBarData = {
        labels: outcomeData.map(o => o.outcome.replace('_', ' ').toUpperCase()),
        datasets: [
            {
                label: 'Count',
                data: outcomeData.map(o => o.count),
                backgroundColor: [
                    '#10b981', '#3b82f6', '#f59e0b', '#ef4444',
                    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
                ],
            },
        ],
    };

    const leaderboardData = {
        labels: leaderboard.map(p => p.full_name),
        datasets: [
            {
                label: 'Conversions',
                data: leaderboard.map(p => p.conversions),
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
            },
            {
                label: 'Total Calls',
                data: leaderboard.map(p => p.total_calls),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
            },
        ],
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
                    <p className="text-gray-600 mt-1">Comprehensive sales performance insights</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => handleExport('calls')}
                        className="btn btn-secondary btn-sm"
                    >
                        <FiDownload className="w-4 h-4 mr-2" />
                        Export Calls
                    </button>
                    <button
                        onClick={() => handleExport('leads')}
                        className="btn btn-secondary btn-sm"
                    >
                        <FiDownload className="w-4 h-4 mr-2" />
                        Export Leads
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Calls</p>
                            <p className="text-3xl font-bold text-gray-900">{analytics?.summary.total_calls}</p>
                        </div>
                        <div className="bg-blue-500 w-12 h-12 rounded-xl flex items-center justify-center">
                            <FiPhone className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="card hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Leads</p>
                            <p className="text-3xl font-bold text-gray-900">{analytics?.summary.total_leads}</p>
                        </div>
                        <div className="bg-green-500 w-12 h-12 rounded-xl flex items-center justify-center">
                            <FiUsers className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="card hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
                            <p className="text-3xl font-bold text-gray-900">{analytics?.summary.conversion_rate}%</p>
                        </div>
                        <div className="bg-orange-500 w-12 h-12 rounded-xl flex items-center justify-center">
                            <FiTrendingUp className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="card hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Follow-up Rate</p>
                            <p className="text-3xl font-bold text-gray-900">{analytics?.summary.followup_completion_rate}%</p>
                        </div>
                        <div className="bg-purple-500 w-12 h-12 rounded-xl flex items-center justify-center">
                            <FiTarget className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calls Trend */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Calls Trend (Last 7 Days)</h3>
                    <Line
                        data={callsPerDayData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { display: false },
                            },
                            scales: {
                                y: { beginAtZero: true },
                            },
                        }}
                    />
                </div>

                {/* Outcome Distribution */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Outcomes Distribution</h3>
                    <Bar
                        data={outcomeBarData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { display: false },
                            },
                            scales: {
                                y: { beginAtZero: true },
                            },
                        }}
                    />
                </div>
            </div>

            {/* Salesperson Performance */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance Comparison</h3>
                <Bar
                    data={leaderboardData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                        },
                        scales: {
                            y: { beginAtZero: true },
                        },
                    }}
                />
            </div>

            {/* Detailed Leaderboard */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Performance Metrics</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salesperson</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Calls</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversions</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversion Rate</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Duration</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {leaderboard.map((person, index) => (
                                <tr key={person.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-lg font-semibold">
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{person.full_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{person.total_calls}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">{person.conversions}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="badge badge-success">{person.conversion_rate || 0}%</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                        {Math.floor((person.avg_duration || 0) / 60)}m {Math.floor((person.avg_duration || 0) % 60)}s
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

export default Analytics;
