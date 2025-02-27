import React, { useState, useEffect, useCallback } from 'react';

// Types for our data table
export interface Column<T = any> {
  field: string;
  header: string;
  sortable?: boolean;
  hidden?: boolean;
  body?: (rowData: T) => React.ReactNode;
  style?: React.CSSProperties;
  width?: string;
}

export type SortOrder = 'asc' | 'desc' | null;

export interface SortMeta {
  field: string;
  order: SortOrder;
}

export interface DataTableProps<T = any> {
  data?: T[];
  columns: Column<T>[];
  loading?: boolean;
  paginator?: boolean;
  rows?: number;
  totalRecords?: number;
  selectionMode?: 'single' | 'multiple' | 'checkbox' | null;
  selection?: T | T[];
  onSelectionChange?: (selection: T | T[]) => void;
  onSort?: (sortMeta: SortMeta) => void;
  onPage?: (event: { first: number; rows: number }) => void;
  onSearch?: (searchTerm: string) => void;
  lazy?: boolean;
  emptyMessage?: string;
  className?: string;
  style?: React.CSSProperties;
  columnToggle?: boolean;
}

const DataTable = <T extends Record<string, any>>(props: DataTableProps<T>) => {
  const {
    data = [],
    columns,
    loading = false,
    paginator = false,
    rows = 10,
    totalRecords = 0,
    selectionMode = null,
    selection,
    onSelectionChange,
    onSort,
    onPage,
    onSearch,
    lazy = false,
    emptyMessage = 'No records found',
    className,
    style,
    columnToggle = false,
  } = props;

  const [visibleColumns, setVisibleColumns] = useState<Column<T>[]>(columns);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<T | T[] | null>(
    selection || (selectionMode === 'multiple' || selectionMode === 'checkbox' ? [] : null)
  );

  // Update visible columns when columns prop changes
  useEffect(() => {
    setVisibleColumns(columns.filter(col => !col.hidden));
  }, [columns]);

  // Handle sorting
  const handleSort = useCallback((field: string) => {
    const newSortOrder = sortField === field 
      ? sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? null : 'asc'
      : 'asc';
    
    setSortField(field);
    setSortOrder(newSortOrder);
    
    if (onSort) {
      onSort({ field, order: newSortOrder });
    }
  }, [sortField, sortOrder, onSort]);

  // Handle selection
  const handleSelection = useCallback((item: T, isSelected: boolean) => {
    let newSelection: T | T[] | null;
    
    if (selectionMode === 'single') {
      newSelection = isSelected ? item : [];
    } else if (selectionMode === 'multiple' || selectionMode === 'checkbox') {
      const currentSelection = Array.isArray(selectedItems) ? selectedItems : [];
      newSelection = isSelected 
        ? [...currentSelection, item]
        : currentSelection.filter(i => i !== item);
    } else {
      newSelection = [];
    }
    
    setSelectedItems(newSelection);
    
    if (onSelectionChange) {
      onSelectionChange(newSelection);
    }
  }, [selectionMode, selectedItems, onSelectionChange]);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    
    if (onPage) {
      onPage({ first: page * rows, rows });
    }
  }, [rows, onPage]);

  // Handle search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    
    if (onSearch) {
      onSearch(term);
    }
  }, [onSearch]);

  // Handle column toggle
  const toggleColumn = useCallback((column: Column<T>) => {
    const updatedColumns = visibleColumns.includes(column)
      ? visibleColumns.filter(col => col !== column)
      : [...visibleColumns, column];
    
    setVisibleColumns(updatedColumns);
  }, [visibleColumns]);

  // Check if an item is selected
  const isSelected = useCallback((item: T) => {
    if (!selectedItems) return false;
    
    if (Array.isArray(selectedItems)) {
      return selectedItems.some(i => JSON.stringify(i) === JSON.stringify(item));
    }
    
    return JSON.stringify(selectedItems) === JSON.stringify(item);
  }, [selectedItems]);

  // Render table header
  const renderHeader = () => (
    <thead className="bg-gray-50">
      <tr>
        {selectionMode === 'checkbox' && (
          <th className="w-12 px-3 py-3.5">
            <input 
              type="checkbox" 
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              onChange={e => {
                const isChecked = e.target.checked;
                const newSelection = isChecked ? [...data] : [];
                setSelectedItems(newSelection);
                if (onSelectionChange) onSelectionChange(newSelection);
              }}
              checked={Array.isArray(selectedItems) && data.length > 0 && selectedItems.length === data.length}
            />
          </th>
        )}
        {visibleColumns.map(col => (
          <th 
            key={col.field} 
            style={col.style}
            className={`px-3 py-3.5 text-left text-sm font-semibold text-gray-900 ${col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
            onClick={() => col.sortable && handleSort(col.field)}
          >
            <div className="flex items-center">
              {col.header}
              {col.sortable && sortField === col.field && (
                <span className="ml-1">
                  {sortOrder === 'asc' ? 
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg> : 
                    sortOrder === 'desc' ? 
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg> : ''}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );

  // Render table body
  const renderBody = () => {
    if (loading) {
      return (
        <tbody className="divide-y divide-gray-200 bg-white">
          <tr>
            <td colSpan={visibleColumns.length + (selectionMode === 'checkbox' ? 1 : 0)} className="px-3 py-4 text-center text-sm text-gray-500">
              <div className="flex justify-center">
                <svg className="h-5 w-5 animate-spin text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-2">Loading...</span>
              </div>
            </td>
          </tr>
        </tbody>
      );
    }

    if (data.length === 0) {
      return (
        <tbody className="divide-y divide-gray-200 bg-white">
          <tr>
            <td colSpan={visibleColumns.length + (selectionMode === 'checkbox' ? 1 : 0)} className="px-3 py-4 text-center text-sm text-gray-500">
              {emptyMessage}
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className="divide-y divide-gray-200 bg-white">
        {data.map((rowData, rowIndex) => (
          <tr 
            key={rowIndex}
            className={`${isSelected(rowData) ? 'bg-indigo-50' : ''} ${selectionMode === 'single' ? 'cursor-pointer hover:bg-gray-50' : ''}`}
            onClick={() => selectionMode === 'single' && handleSelection(rowData, !isSelected(rowData))}
          >
            {selectionMode === 'checkbox' && (
              <td className="whitespace-nowrap px-3 py-4">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  checked={isSelected(rowData)}
                  onChange={e => handleSelection(rowData, e.target.checked)}
                />
              </td>
            )}
            {visibleColumns.map(col => (
              <td key={col.field} style={col.style} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {col.body ? col.body(rowData) : rowData[col.field]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  };

  // Render column toggle panel
  const renderColumnToggle = () => {
    if (!columnToggle) return null;

    const [dropdownVisible, setDropdownVisible] = useState(false);

    return (
      <div className="relative ml-2">
        <button 
          className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={() => setDropdownVisible(!dropdownVisible)}
          aria-haspopup="true"
          aria-expanded={dropdownVisible}
        >
          <svg className="mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          Columns
        </button>
        {dropdownVisible && (
          <div className="absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {columns.map(col => (
                <div key={col.field} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <input
                    type="checkbox"
                    id={`col-toggle-${col.field}`}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 mr-2"
                    checked={visibleColumns.includes(col)}
                    onChange={() => toggleColumn(col)}
                  />
                  <label htmlFor={`col-toggle-${col.field}`} className="ml-2 cursor-pointer">{col.header}</label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render pagination
  const renderPagination = () => {
    if (!paginator) return null;

    const pageCount = Math.max(1, Math.ceil(totalRecords / rows));
    
    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{currentPage * rows + 1}</span> to{' '}
              <span className="font-medium">{Math.min((currentPage + 1) * rows, totalRecords)}</span> of{' '}
              <span className="font-medium">{totalRecords}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="Previous page"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              
              {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                // Show pages around current page
                let pageNum;
                if (pageCount <= 5) {
                  pageNum = i;
                } else {
                  const startPage = Math.max(0, Math.min(currentPage - 2, pageCount - 5));
                  pageNum = startPage + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      currentPage === pageNum
                        ? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                    aria-current={currentPage === pageNum ? 'page' : undefined}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
              
              <button
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === pageCount - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentPage === pageCount - 1}
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="Next page"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  // Render search input
  const renderSearch = () => (
    <div className="border-b border-gray-200 bg-white p-4 sm:flex sm:items-center sm:justify-between">
      <div className="relative mt-2 rounded-md shadow-sm max-w-xs">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>
      {renderColumnToggle()}
    </div>
  );

  return (
    <div className={`overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5 ${className || ''}`} style={style}>
      {(onSearch || columnToggle) && renderSearch()}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          {renderHeader()}
          {renderBody()}
        </table>
      </div>
      {renderPagination()}
    </div>
  );
};

export default DataTable;
