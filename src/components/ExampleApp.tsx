// App.tsx
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DynamicMenu } from './components/DynamicMenu';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';

// Datos iniciales de roles (podrían cargarse desde una API)
const initialRoles: Record<string, Role> = {
  '1': {
    id: '1',
    name: 'admin',
    permissions: ['admin.dashboard', 'admin.roles', 'user.read', 'user.create', 'user.update', 'user.delete'],
  },
  '2': {
    id: '2',
    name: 'editor',
    permissions: ['content.read', 'content.create', 'content.update'],
    inherits: ['3'], // Hereda de 'user'
  },
  '3': {
    id: '3',
    name: 'user',
    permissions: ['content.read'],
  },
};

const menuItems: MenuItem[] = [
  { label: 'Inicio', path: '/', icon: '🏠' },
  { label: 'Perfil', path: '/profile', icon: '👤', permission: 'user.read' },
  {
    label: 'Administración',
    path: '/admin',
    icon: '⚙️',
    permission: 'admin.dashboard',
    subItems: [
      { label: 'Dashboard', path: '/admin/dashboard' },
      { label: 'Roles', path: '/admin/roles', permission: 'admin.roles' },
    ],
  },
];

const App: React.FC = () => {
  return (
    <RoleProvider initialRoles={initialRoles}>
      <Router>
        <div className="app-container">
          <header>
            <DynamicMenu items={menuItems} />
          </header>
          
          <main>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/login" component={LoginPage} />
              
              <ProtectedRoute 
                path="/profile" 
                component={UserProfile} 
                requiredPermission="user.read"
              />
              
              <ProtectedRoute
                path="/admin"
                component={AdminDashboard}
                requiredPermission="admin.dashboard"
              />
              
              <Route render={() => <h1>404 - Página no encontrada</h1>} />
            </Switch>
          </main>
        </div>
      </Router>
    </RoleProvider>
  );
};

export default App;