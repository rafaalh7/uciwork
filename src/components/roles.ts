// types/roles.ts
export type Permission = string;

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  inherits?: string[]; // IDs de roles que hereda
}

export interface User {
  id: string;
  name: string;
  roles: string[]; // IDs de roles
}