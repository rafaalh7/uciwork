// components/withPermission.tsx
import React from 'react';
import { useRoles } from '../context/RoleContext';

export const withPermission = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermission?: string
) => {
  const WithPermission: React.FC<P> = (props) => {
    const { user, hasPermission } = useRoles();
    
    if (!user || (requiredPermission && !hasPermission(requiredPermission))) {
      return <div>No tienes permiso para acceder a este contenido.</div>;
    }
    
    return <WrappedComponent {...props} />;
  };
  
  return WithPermission;
};