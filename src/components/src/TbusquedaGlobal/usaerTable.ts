import React from 'react';
import { useUserStore } from '../store/userStore';
import { 
  User, Mail, Building, Shield, MapPin, 
  Calendar, Activity, Phone, CheckCircle, 
  XCircle, Clock, AlertTriangle, Users,
  BarChart3
} from 'lucide-react';

const UserTable: React.FC = () => {
  const { filteredUsers, searchTerm, isLoading, error } = useUserStore();
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'inactive':
        return <Clock className="text-gray-500" size={16} />;
      case 'suspended':
        return <XCircle className="text-red-500" size={16} />;
      case 'pending':
        return <AlertTriangle className="text-yellow-500" size={16} />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      case 'guest': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Buscando usuarios...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header con estadísticas */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Users className="text-gray-700" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900">Usuarios encontrados</h3>
              <p className="text-sm text-gray-600">
                {filteredUsers.length} de {useUserStore.getState().users.length} usuarios
                {searchTerm && ` para "${searchTerm}"`}
              </p>
            </div>
          </div>
          
          {filteredUsers.length > 0 && (
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{filteredUsers.length}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredUsers.filter(u => u.status === 'active').length}
                </div>
                <div className="text-xs text-gray-500">Activos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredUsers.filter(u => u.role === 'admin').length}
                </div>
                <div className="text-xs text-gray-500">Admins</div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mensajes de estado */}
      {error && (
        <div className="px-6 py-4 bg-red-50 border-b border-red-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
            <div>
              <p className="text-red-800 font-medium">{error}</p>
              <p className="text-red-600 text-sm mt-1">
                Prueba con términos diferentes o verifica la ortografía
              </p>
            </div>
          </div>
        </div>
      )}
      
      {filteredUsers.length === 0 && !error && searchTerm && (
        <div className="px-6 py-8 text-center">
          <div className="max-w-md mx-auto">
            <BarChart3 className="text-gray-400 mx-auto mb-4" size={48} />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h4>
            <p className="text-gray-600">
              No hay usuarios que coincidan con "<span className="font-medium">{searchTerm}</span>"
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Intenta con otros términos o busca en un campo diferente
            </p>
          </div>
        </div>
      )}
      
      {/* Tabla de usuarios */}
      {filteredUsers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol & Departamento
                </th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fechas
                </th>
                <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr 
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-5 px-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="text-blue-600" size={20} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin size={12} />
                          {user.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-5 px-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-900">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-5 px-6">
                    <div className="space-y-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        <Shield size={12} className="mr-1" />
                        {user.role.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building size={14} />
                        {user.department}
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-5 px-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-900">Ingreso: {formatDate(user.joinDate)}</div>
                          <div className="text-xs text-gray-500">Últ. actividad: {formatDate(user.lastActive)}</div>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(user.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status.toUpperCase()}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Footer con información */}
      {filteredUsers.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              Mostrando {filteredUsers.length} usuarios
              {searchTerm && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                  Filtrado: "{searchTerm}"
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <Activity size={14} />
              <span>Última búsqueda: {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;