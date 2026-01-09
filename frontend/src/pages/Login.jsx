import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiPhone } from 'react-icons/fi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo and Header */}
                <div className="text-center mb-8 animate-slide-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
                        <FiPhone className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">Sales Dialer</h1>
                    <p className="text-primary-100">Call Tracking & Performance System</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-in">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome Back</h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label">Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input pl-10"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input pl-10"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full btn-lg"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Demo Credentials:</p>
                        <div className="text-xs text-gray-600 space-y-1">
                            <p><strong>Admin:</strong> admin@salesdialer.com</p>
                            <p><strong>Manager:</strong> manager@salesdialer.com</p>
                            <p><strong>Sales:</strong> sales1@salesdialer.com</p>
                            <p className="text-gray-500 mt-2">Password: password123</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-primary-100 text-sm mt-6">
                    © 2026 Sales Dialer. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
