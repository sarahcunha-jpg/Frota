import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: any[];
  onAdd?: () => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  searchable?: boolean;
  sortable?: boolean;
  paginated?: boolean;
  itemsPerPage?: number;
}

export const DataTable: React.FC<DataTableProps> = ({
  title,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  onView,
  searchable = true,
  sortable = true,
  paginated = true,
  itemsPerPage = 10,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data
  let filteredData = data;
  if (searchable && searchTerm) {
    filteredData = data.filter((row) =>
      Object.values(row).some(
        (value) =>
          value &&
          value
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );
  }

  // Sort data
  if (sortConfig) {
    filteredData = [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Paginate
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = paginated
    ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredData;

  const handleSort = (key: string) => {
    if (!sortable) return;
    setSortConfig(
      sortConfig?.key === key && sortConfig.direction === 'asc'
        ? { key, direction: 'desc' }
        : { key, direction: 'asc' }
    );
  };

  return (
    <div className="bg-white border border-neutral-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 lg:p-6 border-b border-neutral-300 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {searchable && (
            <Input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              containerClassName="flex-1"
            />
          )}
          {onAdd && (
            <Button variant="secondary" size="medium" onClick={onAdd}>
              ➕ Novo
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary-900 text-white">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left font-semibold ${col.width || ''} ${
                    col.sortable && sortable ? 'cursor-pointer hover:bg-primary-800' : ''
                  }`}
                  onClick={() => col.sortable && sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable && sortable && (
                      <span className="text-xs">
                        {sortConfig?.key === col.key
                          ? sortConfig.direction === 'asc'
                            ? '↑'
                            : '↓'
                          : '↕'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete || onView) && <th className="px-4 py-3 text-center">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete || onView ? 1 : 0)}
                  className="px-4 py-8 text-center text-neutral-600"
                >
                  Nenhum registro encontrado
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={index}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-neutral-900">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            className="text-primary-600 hover:text-primary-800 transition-colors"
                            title="Visualizar"
                          >
                            👁️
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="text-primary-600 hover:text-primary-800 transition-colors"
                            title="Editar"
                          >
                            ✏️
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="text-danger hover:text-red-700 transition-colors"
                            title="Excluir"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginated && totalPages > 1 && (
        <div className="p-4 border-t border-neutral-300 flex items-center justify-between">
          <p className="text-sm text-neutral-600">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} de {filteredData.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-neutral-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 transition-colors"
            >
              ←
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const page = Math.max(1, currentPage - 2) + i;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`
                    px-3 py-2 rounded-lg transition-colors
                    ${currentPage === page ? 'bg-primary-900 text-white' : 'border border-neutral-300 hover:bg-neutral-100'}
                  `}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-neutral-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 transition-colors"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;