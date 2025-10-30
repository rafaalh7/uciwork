// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  lastLogin?: Date;
  age: number;
}

export type SortableUserField = keyof User;

export interface ColumnConfig {
  key: SortableUserField;
  label: string;
  sortable?: boolean;
  type: 'string' | 'number' | 'date';
}