// context/RoleContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Role, User, Permission } from '../types/roles';

interface RoleContextType {
  user: User | null;
  roles: Record<string, Role>;
  login: (user: User) => void;
  logout: () => void;
  addRole: (role: Role) => void;
  updateRole: (id: string, updates: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  hasPermission: (permission: Permission) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Record<string, Role>>({});
  
  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const loadData = async () => {
      const savedUser = localStorage.getItem('user');
      const savedRoles = localStorage.getItem('roles');
      
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedRoles) setRoles(JSON.parse(savedRoles));
      
      // Opcional: cargar desde API
      // const apiRoles = await fetchRoles();
      // setRoles(apiRoles);
    };
    
    loadData();
    
    // Sincronizar entre pestañas
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'user') setUser(e.newValue ? JSON.parse(e.newValue) : null);
      if (e.key === 'roles') setRoles(e.newValue ? JSON.parse(e.newValue) : {});
    };
    
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
  
  // Persistir cambios
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);
  
  useEffect(() => {
    localStorage.setItem('roles', JSON.stringify(roles));
  }, [roles]);
  
  const login = (newUser: User) => setUser(newUser);
  const logout = () => setUser(null);
  
  const addRole = (role: Role) => {
    setRoles(prev => ({ ...prev, [role.id]: role }));
    logChange(`Added role ${role.name}`);
  };
  
  const updateRole = (id: string, updates: Partial<Role>) => {
    setRoles(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates }
    }));
    logChange(`Updated role ${id}`);
  };
  
  const deleteRole = (id: string) => {
    setRoles(prev => {
      const newRoles = { ...prev };
      delete newRoles[id];
      return newRoles;
    });
    logChange(`Deleted role ${id}`);
  };
  
  const logChange = (message: string) => {
    console.log(`[Role System] ${message}`);
    // Podría enviarse a un servicio de logging
  };
  
  // Verificar permisos con herencia
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    
    const checkRole = (roleId: string, visited = new Set<string>()): boolean => {
      if (visited.has(roleId)) return false;
      visited.add(roleId);
      
      const role = roles[roleId];
      if (!role) return false;
      
      // Verificar permisos directos
      if (role.permissions.includes(permission)) return true;
      
      // Verificar roles heredados
      if (role.inherits) {
        return role.inherits.some(parentId => checkRole(parentId, visited));
      }
      
      return false;
    };
    
    return user.roles.some(roleId => checkRole(roleId));
  };
  
  return (
    <RoleContext.Provider value={{ user, roles, login, logout, addRole, updateRole, deleteRole, hasPermission }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRoles = () => {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRoles must be used within a RoleProvider');
  return context;
};