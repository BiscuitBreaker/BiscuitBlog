import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('AdminRoute - user:', user, 'loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bakery-bg flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    console.log('AdminRoute: No user, redirecting to landing');
    return <Navigate to="/landing" replace />;
  }

  console.log('AdminRoute: User email:', user.email, 'Expected: bbreakergaming@gmail.com');

  // Check if user is the admin
  if (user.email !== 'bbreakergaming@gmail.com') {
    console.log('AdminRoute: Not admin user, access denied');
    return (
      <div className="min-h-screen bakery-bg flex items-center justify-center">
        <div className="text-center glass-effect p-8 rounded-xl border border-white/10">
          <h1 className="text-2xl font-bold text-white mb-4">🚫 Admin Access Required</h1>
          <p className="text-gray-300 mb-6">
            This area is restricted to administrators only.
          </p>
          <p className="text-accent-teal text-sm mb-6">
            Signed in as: {user.email}
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  console.log('AdminRoute: Admin access granted!');
  return <>{children}</>;
};

export default AdminRoute;