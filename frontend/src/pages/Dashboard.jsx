import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FiPhone, FiClock, FiTrendingUp, FiCalendar, FiUsers, FiTarget } from 'react-icons/fi';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const { user, isAdmin, isManager, isSalesperson } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [performance, setPerformance] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            if (isAdmin || isManager) {
                const [analyticsRes, leaderboardRes] = await Promise.all([
                    api.get('/analytics/overall'),
                    api.get('/analytics/leaderboard'),
                ]);
                setAnalytics(analyticsRes.data);
                setLeaderboard(leaderboardRes.data.leaderboard);
            }

            if (isSalesperson) {
                const perfRes = await api.get('/analytics/performance');
                setPerformance(perfRes.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // Stats for Admin/Manager
    const adminStats = analytics ? [
        { name: 'Total Calls', value: analytics.summary.total_calls, icon: FiPhone, color: 'bg-blue-500' },
        { name: 'Total Leads', value: analytics.summary.total_leads, icon: FiUsers, color: 'bg-green-500' },
        { name: 'Avg Duration', value: `${Math.floor(analytics.summary.average_duration / 60)}m ${analytics.summary.average_duration % 60}s`, icon: FiClock, color: 'bg-purple-500' },
        { name: 'Conversion Rate', value: `${analytics.summary.conversion_rate}%`, icon: FiTrendingUp, color: 'bg-orange-500' },
    ] : [];

    // Stats for Salesperson
    const salesStats = performance ? [
        { name: 'My Calls', value: performance.summary.total_calls, icon: FiPhone, color: 'bg-blue-500' },
        { name: 'Assigned Leads', value: performance.summary.assigned_leads, icon: FiUsers, color: 'bg-green-500' },
        { name: 'Conversion Rate', value: `${performance.summary.conversion_rate}%`, icon: FiTrendingUp, color: 'bg-orange-500' },
        { name: 'Pending Follow-ups', value: performance.summary.pending_followups, icon: FiCalendar, color: 'bg-purple-500' },
    ] : [];

    const stats = isSalesperson ? salesStats : adminStats;

    // Chart data
    const callsPerDayData = {
        labels: (analytics?.calls_per_day || performance?.calls_per_day || []).map(d =>
            new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        ),
        datasets: [
            {
                label: 'Calls',
                data: (analytics?.calls_per_day || performance?.calls_per_day || []).map(d => d.count),
                borderColor: 'rgb(14, 165, 233)',
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const outcomeData = analytics?.calls_by_outcome || performance?.calls_by_outcome || [];
    const outcomeChartData = {
        labels: outcomeData.map(o => o.outcome.replace('_', ' ').toUpperCase()),
        datasets: [
            {
                data: outcomeData.map(o => o.count),
                backgroundColor: [
                    '#10b981', '#3b82f6', '#f59e0b', '#ef4444',
                    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
                ],
            },
        ],
    };

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.full_name}! 👋</h1>
                <p className="text-primary-100">Here's what's happening with your sales today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="card hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calls Per Day */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Calls Per Day (Last 7 Days)</h3>
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

                {/* Calls by Outcome */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Calls by Outcome</h3>
                    <div className="flex justify-center">
                        <div className="w-64 h-64">
                            <Doughnut
                                data={outcomeChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: true,
                                    plugins: {
                                        legend: { position: 'bottom' },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Leaderboard (Admin/Manager only) */}
            {(isAdmin || isManager) && leaderboard.length > 0 && (
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Salesperson Leaderboard</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
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
                                            <span className={`text-2xl ${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}`}>
                                                {index < 3 ? '' : `#${index + 1}`}
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
            )}
        </div>
    );
};

export default Dashboard;
