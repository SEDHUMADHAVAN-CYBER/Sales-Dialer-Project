import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FiHome, FiPhone, FiUsers, FiCalendar, FiBarChart2,
    FiSettings, FiLogOut, FiMenu, FiX, FiUserPlus
} from 'react-icons/fi';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout, isAdmin, isManager, isSalesperson } = useAuth();
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: FiHome, roles: ['admin', 'manager', 'salesperson'] },
        { name: 'Leads', href: '/leads', icon: FiUsers, roles: ['admin', 'manager', 'salesperson'] },
        { name: 'Calls', href: '/calls', icon: FiPhone, roles: ['admin', 'manager', 'salesperson'] },
        { name: 'Follow-ups', href: '/followups', icon: FiCalendar, roles: ['admin', 'manager', 'salesperson'] },
        { name: 'Analytics', href: '/analytics', icon: FiBarChart2, roles: ['admin', 'manager'] },
        { name: 'Users', href: '/users', icon: FiUserPlus, roles: ['admin'] },
    ];

    const filteredNavigation = navigation.filter(item =>
        item.roles.includes(user?.role)
    );

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <FiPhone className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">Sales Dialer</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-gray-500 hover:text-gray-700"
                        >
                            <FiX className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {filteredNavigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.href)
                                            ? 'bg-primary-50 text-primary-700 font-medium'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-primary-700 font-semibold">
                                    {user?.full_name?.charAt(0)}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.full_name}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <FiLogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : ''}`}>
                {/* Top Bar */}
                <header className="sticky top-0 z-40 bg-white border-b border-gray-200 h-16 flex items-center px-6">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
                    >
                        <FiMenu className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-semibold text-gray-900">
                        {filteredNavigation.find(item => isActive(item.href))?.name || 'Dashboard'}
                    </h1>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default Layout;
