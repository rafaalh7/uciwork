// components/TableComponent.jsx
import React from 'react';
import { useTable } from '../store/tableStore';

const TableComponent = ({ data }) => {
  const {
    filteredData,
    currentPage,
    itemsPerPage,
    sortField,
    sortDirection,
    searchTerm,
    selectedRows,
    initializeData,
    setSort,
    setCurrentPage,
    toggleRowSelection,
    toggleSelectAll
  } = useTable();

  // Inicializar datos cuando el componente se monta
  React.useEffect(() => {
    initializeData(data);
  }, [data, initializeData]);

  // Calcular datos para la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Verificar si todos los elementos en la página actual están seleccionados
  const allSelectedOnPage = currentData.length > 0 && 
    currentData.every(item => selectedRows.has(item.id));

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Generar paginación
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Botón anterior
    pages.push(
      <button
        key="prev"
        className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹
      </button>
    );

    // Primera página y elipsis si es necesario
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className="pagination-btn"
          onClick={() => setCurrentPage(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1">...</span>);
      }
    }

    // Páginas visibles
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    // Última página y elipsis si es necesario
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          className="pagination-btn"
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    // Botón siguiente
    pages.push(
      <button
        key="next"
        className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        ›
      </button>
    );

    return pages;
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="table-info">
          Mostrando {filteredData.length} registros
          {searchTerm && ` (filtrados por "${searchTerm}")`}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th className="checkbox-column">
                <input
                  type="checkbox"
                  checked={allSelectedOnPage}
                  onChange={toggleSelectAll}
                  indeterminate={!allSelectedOnPage && currentData.some(item => selectedRows.has(item.id))}
                />
              </th>
              <th 
                className={`sortable ${sortField === 'id' ? 'sorted' : ''}`}
                onClick={() => setSort('id')}
              >
                ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className={`sortable ${sortField === 'name' ? 'sorted' : ''}`}
                onClick={() => setSort('name')}
              >
                Nombre {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className={`sortable ${sortField === 'email' ? 'sorted' : ''}`}
                onClick={() => setSort('email')}
              >
                Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className={`sortable ${sortField === 'department' ? 'sorted' : ''}`}
                onClick={() => setSort('department')}
              >
                Departamento {sortField === 'department' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className={`sortable ${sortField === 'salary' ? 'sorted' : ''}`}
                onClick={() => setSort('salary')}
              >
                Salario {sortField === 'salary' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className={`sortable ${sortField === 'hireDate' ? 'sorted' : ''}`}
                onClick={() => setSort('hireDate')}
              >
                Fecha Contratación {sortField === 'hireDate' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map(item => (
                <tr key={item.id} className={selectedRows.has(item.id) ? 'selected' : ''}>
                  <td className="checkbox-column">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(item.id)}
                      onChange={() => toggleRowSelection(item.id)}
                    />
                  </td>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.department}</td>
                  <td>{formatCurrency(item.salary)}</td>
                  <td>{formatDate(item.hireDate)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No se encontraron registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default TableComponent;