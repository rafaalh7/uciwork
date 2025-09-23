// store/tableStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Función para generar datos de ejemplo adicionales
const generateMoreData = () => {
  const departments = ['Ventas', 'Marketing', 'TI', 'Recursos Humanos', 'Finanzas'];
  const names = ['Ana García', 'Carlos López', 'María Rodríguez', 'José Martínez', 'Laura Pérez', 
                'Miguel Sánchez', 'Elena Gómez', 'David Fernández', 'Sofía Díaz', 'Javier Ruiz'];
  
  const data = [];
  const baseId = 11; // Continuar desde donde terminan los datos de ejemplo
  
  for (let i = 0; i < 40; i++) {
    data.push({
      id: baseId + i,
      name: names[Math.floor(Math.random() * names.length)],
      email: `usuario${baseId + i}@empresa.com`,
      department: departments[Math.floor(Math.random() * departments.length)],
      salary: Math.floor(Math.random() * 50000) + 30000,
      hireDate: new Date(2020 + Math.floor(Math.random() * 4), 
                         Math.floor(Math.random() * 12), 
                         Math.floor(Math.random() * 28) + 1)
                .toISOString().split('T')[0],
      selected: false
    });
  }
  
  return data;
};

export const useTable = create(
  persist(
    (set, get) => ({
      // Estado inicial
      data: [],
      filteredData: [],
      currentPage: 1,
      itemsPerPage: 10,
      sortField: 'id',
      sortDirection: 'asc',
      searchTerm: '',
      selectedRows: new Set(),
      exportFormat: 'csv',
      exportScope: 'filtered',
      exportHistory: [],
      alert: null,
      
      // Acciones
      initializeData: (initialData) => {
        const moreData = generateMoreData();
        const allData = [...initialData, ...moreData];
        set({ 
          data: allData,
          filteredData: allData
        });
      },
      
      setSearchTerm: (term) => {
        set({ searchTerm: term, currentPage: 1 });
        get().filterData();
      },
      
      filterData: () => {
        const { data, searchTerm } = get();
        
        if (!searchTerm) {
          set({ filteredData: data });
          return;
        }
        
        const term = searchTerm.toLowerCase();
        const filtered = data.filter(item => 
          item.name.toLowerCase().includes(term) ||
          item.email.toLowerCase().includes(term) ||
          item.department.toLowerCase().includes(term) ||
          item.id.toString().includes(term)
        );
        
        set({ filteredData: filtered });
      },
      
      setSort: (field) => {
        const { sortField, sortDirection } = get();
        const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        
        set({ 
          sortField: field, 
          sortDirection: newDirection,
          currentPage: 1
        });
        
        get().sortData();
      },
      
      sortData: () => {
        const { filteredData, sortField, sortDirection } = get();
        
        const sorted = [...filteredData].sort((a, b) => {
          let aValue = a[sortField];
          let bValue = b[sortField];
          
          if (sortField === 'hireDate') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
          }
          
          if (sortDirection === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
        });
        
        set({ filteredData: sorted });
      },
      
      setCurrentPage: (page) => {
        set({ currentPage: page });
      },
      
      toggleRowSelection: (id) => {
        const { selectedRows } = get();
        const newSelectedRows = new Set(selectedRows);
        
        if (newSelectedRows.has(id)) {
          newSelectedRows.delete(id);
        } else {
          newSelectedRows.add(id);
        }
        
        set({ selectedRows: newSelectedRows });
      },
      
      toggleSelectAll: () => {
        const { filteredData, selectedRows, currentPage, itemsPerPage } = get();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentPageData = filteredData.slice(startIndex, endIndex);
        
        const allSelectedOnPage = currentPageData.every(item => selectedRows.has(item.id));
        const newSelectedRows = new Set(selectedRows);
        
        if (allSelectedOnPage) {
          currentPageData.forEach(item => newSelectedRows.delete(item.id));
        } else {
          currentPageData.forEach(item => newSelectedRows.add(item.id));
        }
        
        set({ selectedRows: newSelectedRows });
      },
      
      setExportFormat: (format) => {
        set({ exportFormat: format });
      },
      
      setExportScope: (scope) => {
        set({ exportScope: scope });
      },
      
      addToExportHistory: (record) => {
        const { exportHistory } = get();
        const updatedHistory = [record, ...exportHistory.slice(0, 9)]; // Mantener solo las últimas 10
        
        set({ exportHistory: updatedHistory });
      },
      
      setAlert: (type, message) => {
        set({ alert: { type, message } });
        
        // Limpiar la alerta después de 5 segundos
        setTimeout(() => {
          set({ alert: null });
        }, 5000);
      },
      
      clearAlert: () => {
        set({ alert: null });
      }
    }),
    {
      name: 'table-storage',
      partialize: (state) => ({ 
        exportFormat: state.exportFormat,
        exportScope: state.exportScope,
        exportHistory: state.exportHistory
      })
    }
  )
);

// Provider para inicializar datos
export const TableProvider = ({ children }) => {
  const initializeData = useTable(state => state.initializeData);
  
  React.useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      initializeData([]); // Los datos se cargan en el App.jsx
    }, 100);
  }, [initializeData]);
  
  return <>{children}</>;
};