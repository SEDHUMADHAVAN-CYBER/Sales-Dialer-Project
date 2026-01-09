import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Calls from './pages/Calls';
import Followups from './pages/Followups';
import Analytics from './pages/Analytics';
import Users from './pages/Users';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="leads" element={<Leads />} />
                        <Route path="calls" element={<Calls />} />
                        <Route path="followups" element={<Followups />} />
                        <Route
                            path="analytics"
                            element={
                                <ProtectedRoute roles={['admin', 'manager']}>
                                    <Analytics />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="users"
                            element={
                                <ProtectedRoute roles={['admin']}>
                                    <Users />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
