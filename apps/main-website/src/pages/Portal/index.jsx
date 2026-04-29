import React from 'react';
import { useAuth } from '../../context/AuthContext';
import HostDashboard from './HostDashboard';
import AdminDashboard from './AdminDashboard';

const Portal = () => {
  const { user } = useAuth();

  // Route depending on the user's role logic
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  // Default fallback is the standard Host Family view
  return <HostDashboard />;
};

export default Portal;
