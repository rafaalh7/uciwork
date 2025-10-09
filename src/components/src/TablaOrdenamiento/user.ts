// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
  age: number;
}

export interface ColumnConfig {
  key: keyof User;
  label: string;
  sortable?: boolean;
  type: 'string' | 'number' | 'date';
}