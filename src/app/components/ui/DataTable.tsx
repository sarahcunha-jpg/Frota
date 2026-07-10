import React, { useState } from 'react';
import { cn } from './utils';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T extends { id: string }> {
  title: string;
  data: T[];
  columns: Column<T>[];
  actions?: (row: T) => React.ReactNode;
  onSearch?: (query: string) => void;
  pagination?: boolean;
  pageSize?: number;
  loading?: boolean;
}

export const DataTable = React.forwardRef<HTMLDivElement, DataTableProps<any>>(
  (
    {
      title,
      data,
      columns,
      actions,
      onSearch,
      pagination = true,
      pageSize = 10,
      loading = false,
    },
    ref
  ) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const paginatedData = pagination
      ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      : data;

    const totalPages = Math.ceil(data.length / pageSize);

    const handleSearch = (query: string) => {
      setSearchQuery(query);
      onSearch?.(query);
      setCurrentPage(1);
    };

    const handleSort = (column: string) => {
      if (sortColumn === column) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortColumn(column);
        setSortDirection('asc');
      }
    };

    return (
      <div
        ref={ref}
        className="bg-white border border-neutral-200 rounded-lg overflow-hidden"
      >
        {/* Toolbar */}
        <div className="flex justify-between items-center p-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
          {onSearch && (
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-900 text-white">
              <tr>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className={cn(
                      'px-4 py-3 text-left text-sm font-semibold',
                      col.sortable && 'cursor-pointer hover:bg-primary-800'
                    )}
                    onClick={() => col.sortable && handleSort(String(col.key))}
                    style={{ width: col.width }}
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      {col.sortable && sortColumn === String(col.key) && (
                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                ))}
                {actions && (
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-4 py-8 text-center text-neutral-500"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-4 py-8 text-center text-neutral-500"
                  >
                    Nenhum registro encontrado
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-neutral-50 border-b border-neutral-200 transition-colors"
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className="px-4 py-3 text-sm text-neutral-700"
                      >
                        {col.render
                          ? col.render(row[col.key], row)
                          : String(row[col.key])}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-4 py-3 text-center flex justify-center gap-2">
                        {actions(row)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-neutral-200">
            <p className="text-sm text-neutral-600">
              Mostrando {(currentPage - 1) * pageSize + 1} de {data.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-50 text-sm font-semibold hover:bg-neutral-50"
              >
                ←
              </button>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      'px-3 py-1 border rounded text-sm font-semibold',
                      currentPage === pageNum
                        ? 'bg-primary-900 text-white border-primary-900'
                        : 'border-neutral-300 hover:bg-neutral-50'
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-50 text-sm font-semibold hover:bg-neutral-50"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

DataTable.displayName = 'DataTable';