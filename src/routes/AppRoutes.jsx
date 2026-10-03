import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleRoute from '../components/RoleRoute';
import Navbar from '../components/Navbar';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

import Profile from '../pages/shared/Profile';

import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminCreateUser from '../pages/admin/CreateUser';
import AdminStores from '../pages/admin/Stores';
import AdminCreateStore from '../pages/admin/CreateStore';
import UserStores from '../pages/user/Stores';
import OwnerDashboard from '../pages/owner/Dashboard';

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={
              user?.role?.toUpperCase() === 'ADMIN' ? <Navigate to="/admin/dashboard" replace /> :
              user?.role?.toUpperCase() === 'OWNER' ? <Navigate to="/owner/dashboard" replace /> : 
              user?.role?.toUpperCase() === 'USER' ? <Navigate to="/user/stores" replace /> : 
              <div className="p-8 text-center text-red-600 font-bold">Invalid or missing user role. Please contact support.</div>
            } />
            
            {/* Generic Shared Routes */}
            <Route path="/profile" element={<Profile />} />

            {/* Admin Routes */}
            <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/users/create" element={<AdminCreateUser />} />
              <Route path="/admin/stores" element={<AdminStores />} />
              <Route path="/admin/stores/create" element={<AdminCreateStore />} />
            </Route>

            {/* Owner Routes */}
            <Route element={<RoleRoute allowedRoles={['OWNER']} />}>
              <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            </Route>

            {/* User Routes */}
            <Route element={<RoleRoute allowedRoles={['USER']} />}>
              <Route path="/user/stores" element={<UserStores />} />
            </Route>
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
