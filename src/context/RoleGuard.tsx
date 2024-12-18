import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (userRole && allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }
  
  return <Navigate to="/unauthorized" replace />;
};

export { RoleGuard };
