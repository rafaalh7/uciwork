import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: {
        id: 'user-001',
        name: 'Administrador',
        email: 'admin@empresa.com',
        role: 'admin',
        permissions: {
          view: true,
          edit: true,
          delete: true,
          export: true,
          approve: true
        }
      },
      
      setUser: (userData) => {
        set({ 
          user: { 
            ...userData,
            permissions: userData.permissions || getDefaultPermissions(userData.role)
          } 
        });
      },
      
      updateUserRole: (role) => {
        set((state) => ({
          user: {
            ...state.user,
            role,
            permissions: getDefaultPermissions(role)
          }
        }));
      },
      
      hasPermission: (permission) => {
        const { user } = get();
        return user?.permissions?.[permission] || false;
      },
      
      getUserRole: () => {
        return get().user.role;
      },
      
      logout: () => {
        set({
          user: {
            id: 'guest',
            name: 'Invitado',
            role: 'guest',
            permissions: getDefaultPermissions('guest')
          }
        });
      }
    }),
    {
      name: 'user-storage',
    }
  )
);

const getDefaultPermissions = (role) => {
  const permissions = {
    admin: { view: true, edit: true, delete: true, export: true, approve: true },
    editor: { view: true, edit: true, delete: false, export: true, approve: false },
    viewer: { view: true, edit: false, delete: false, export: false, approve: false },
    guest: { view: false, edit: false, delete: false, export: false, approve: false }
  };
  
  return permissions[role] || permissions.guest;
};