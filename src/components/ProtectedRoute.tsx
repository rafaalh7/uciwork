// components/ProtectedRoute.tsx
import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useRoles } from '../context/RoleContext';

interface ProtectedRouteProps extends RouteProps {
  requiredPermission?: string;
  fallback?: React.ReactNode | string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredPermission,
  fallback = <Redirect to="/login" />,
  ...props
}) => {
  const { user, hasPermission } = useRoles();
  
  if (!user) {
    return <>{fallback}</>;
  }
  
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>;
  }
  
  return <Route {...props} />;
};