// components/RoleManagement.tsx
import React, { useState } from 'react';
import { useRoles } from '../context/RoleContext';
import { Role, Permission } from '../types/roles';

const availablePermissions: Permission[] = [
  'user.read',
  'user.create',
  'user.update',
  'user.delete',
  'content.read',
  'content.create',
  'content.update',
  'content.delete',
  'admin.dashboard',
  'admin.roles',
];

export const RoleManagement: React.FC = () => {
  const { roles, addRole, updateRole, deleteRole } = useRoles();
  const [currentRole, setCurrentRole] = useState<Partial<Role> | null>(null);
  const [newPermission, setNewPermission] = useState<Permission>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRole || !currentRole.name) return;
    
    const role: Role = {
      id: currentRole.id || Date.now().toString(),
      name: currentRole.name,
      permissions: currentRole.permissions || [],
      inherits: currentRole.inherits || [],
    };
    
    if (currentRole.id) {
      updateRole(currentRole.id, role);
    } else {
      addRole(role);
    }
    
    setCurrentRole(null);
  };
  
  const addPermission = () => {
    if (!newPermission || !currentRole) return;
    setCurrentRole({
      ...currentRole,
      permissions: [...(currentRole.permissions || []), newPermission],
    });
    setNewPermission('');
  };
  
  const removePermission = (permission: Permission) => {
    if (!currentRole) return;
    setCurrentRole({
      ...currentRole,
      permissions: (currentRole.permissions || []).filter(p => p !== permission),
    });
  };
  
  return (
    <div className="role-management">
      <div className="role-list">
        <h3>Roles existentes</h3>
        <ul>
          {Object.values(roles).map(role => (
            <li key={role.id}>
              <strong>{role.name}</strong>
              <button onClick={() => setCurrentRole({ ...role })}>Editar</button>
              <button onClick={() => deleteRole(role.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
        <button onClick={() => setCurrentRole({ id: '', name: '', permissions: [] })}>
          Crear nuevo rol
        </button>
      </div>
      
      {currentRole && (
        <form onSubmit={handleSubmit} className="role-form">
          <h3>{currentRole.id ? 'Editar Rol' : 'Crear Rol'}</h3>
          
          <label>
            Nombre del Rol:
            <input
              type="text"
              value={currentRole.name || ''}
              onChange={e => setCurrentRole({ ...currentRole, name: e.target.value })}
              required
            />
          </label>
          
          <div className="permissions-section">
            <h4>Permisos</h4>
            <div className="current-permissions">
              {currentRole.permissions?.map(permission => (
                <span key={permission} className="permission-tag">
                  {permission}
                  <button type="button" onClick={() => removePermission(permission)}>×</button>
                </span>
              ))}
            </div>
            
            <div className="add-permission">
              <select
                value={newPermission}
                onChange={e => setNewPermission(e.target.value as Permission)}
              >
                <option value="">Seleccionar permiso</option>
                {availablePermissions.map(perm => (
                  <option key={perm} value={perm}>{perm}</option>
                ))}
              </select>
              <button type="button" onClick={addPermission}>Añadir Permiso</button>
            </div>
          </div>
          
          <div className="inheritance-section">
            <h4>Hereda de (opcional)</h4>
            {Object.values(roles)
              .filter(role => role.id !== currentRole.id)
              .map(role => (
                <label key={role.id}>
                  <input
                    type="checkbox"
                    checked={currentRole.inherits?.includes(role.id) || false}
                    onChange={e => {
                      const inherits = currentRole.inherits || [];
                      if (e.target.checked) {
                        setCurrentRole({
                          ...currentRole,
                          inherits: [...inherits, role.id],
                        });
                      } else {
                        setCurrentRole({
                          ...currentRole,
                          inherits: inherits.filter(id => id !== role.id),
                        });
                      }
                    }}
                  />
                  {role.name}
                </label>
              ))}
          </div>
          
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => setCurrentRole(null)}>Cancelar</button>
        </form>
      )}
    </div>
  );
};