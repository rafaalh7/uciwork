// pages/AdminDashboard.tsx
import React from 'react';
import { withPermission } from '../components/withPermission';
import { RoleManagement } from '../components/RoleManagement';

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-dashboard">
      <h1>Panel de Administración</h1>
      <section>
        <h2>Gestor de Roles</h2>
        <RoleManagement />
      </section>
      {/* Otras secciones del dashboard */}
    </div>
  );
};

// Protege el dashboard con el permiso requerido
export default withPermission(AdminDashboard, 'admin.dashboard');