import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Home from '../pages/Home';

const DefaultRoute: React.FC = () => {
  const { user, loading } = useAuth();

  console.log('DefaultRoute - user:', user, 'loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bakery-bg flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Debug: Show user status
  if (!user) {
    console.log('No user found, redirecting to landing');
    return <Navigate to="/landing" replace />;
  }

  console.log('User found:', user.email);

  // If admin user, redirect to admin panel
  if (user.email === 'bbreakergaming@gmail.com') {
    console.log('Admin user detected, redirecting to admin');
    return <Navigate to="/admin" replace />;
  }

  // For other authenticated users, show home page
  console.log('Regular user, showing home');
  return <Home />;
};

export default DefaultRoute;