import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Authenticating...</div>;
  }

  if (!user) {
    // If not authenticated, force them back to the login page.
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the children components inside the Portal
  return <Outlet />;
};
