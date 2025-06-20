// components/DynamicMenu.tsx
import React from 'react';
import { useRoles } from '../context/RoleContext';

interface MenuItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  permission?: string;
  subItems?: MenuItem[];
}

interface DynamicMenuProps {
  items: MenuItem[];
}

export const DynamicMenu: React.FC<DynamicMenuProps> = ({ items }) => {
  const { hasPermission } = useRoles();
  
  const renderItem = (item: MenuItem) => {
    if (item.permission && !hasPermission(item.permission)) return null;
    
    return (
      <li key={item.path}>
        <a href={item.path}>
          {item.icon && <span className="menu-icon">{item.icon}</span>}
          <span className="menu-label">{item.label}</span>
        </a>
        {item.subItems && (
          <ul className="submenu">
            {item.subItems.map(renderItem)}
          </ul>
        )}
      </li>
    );
  };
  
  return (
    <nav className="dynamic-menu">
      <ul>{items.filter(item => !item.permission || hasPermission(item.permission)).map(renderItem)}</ul>
    </nav>
  );
};