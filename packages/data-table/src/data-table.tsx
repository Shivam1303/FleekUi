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
    <thead>
      <tr>
        {selectionMode === 'checkbox' && (
          <th className="p-selection-column">
            <input 
              type="checkbox" 
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
            className={col.sortable ? 'p-sortable-column' : ''}
            onClick={() => col.sortable && handleSort(col.field)}
          >
            {col.header}
            {col.sortable && sortField === col.field && (
              <span className="p-sortable-column-icon">
                {sortOrder === 'asc' ? ' ↑' : sortOrder === 'desc' ? ' ↓' : ''}
              </span>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );

  // Render table body
  const renderBody = () => {
    if (loading) {
      return (
        <tbody>
          <tr>
            <td colSpan={visibleColumns.length + (selectionMode === 'checkbox' ? 1 : 0)} className="p-datatable-loading">
              Loading...
            </td>
          </tr>
        </tbody>
      );
    }

    if (data.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={visibleColumns.length + (selectionMode === 'checkbox' ? 1 : 0)} className="p-datatable-emptymessage">
              {emptyMessage}
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {data.map((rowData, rowIndex) => (
          <tr 
            key={rowIndex}
            className={isSelected(rowData) ? 'p-highlight' : ''}
            onClick={() => selectionMode === 'single' && handleSelection(rowData, !isSelected(rowData))}
          >
            {selectionMode === 'checkbox' && (
              <td className="p-selection-column">
                <input 
                  type="checkbox" 
                  checked={isSelected(rowData)}
                  onChange={e => handleSelection(rowData, e.target.checked)}
                />
              </td>
            )}
            {visibleColumns.map(col => (
              <td key={col.field} style={col.style}>
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
      <div className="p-column-toggle-container">
        <button 
          className="p-column-toggle-button"
          onClick={() => setDropdownVisible(!dropdownVisible)}
          aria-haspopup="true"
          aria-expanded={dropdownVisible}
        >
          Toggle Columns
        </button>
        {dropdownVisible && (
          <div className="p-column-toggle-dropdown">
            {columns.map(col => (
              <div key={col.field} className="p-column-toggle-item">
                <input
                  type="checkbox"
                  id={`col-toggle-${col.field}`}
                  checked={visibleColumns.includes(col)}
                  onChange={() => toggleColumn(col)}
                />
                <label htmlFor={`col-toggle-${col.field}`}>{col.header}</label>
              </div>
            ))}
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
      <div className="p-paginator">
        <button 
          className="p-paginator-prev" 
          disabled={currentPage === 0}
          onClick={() => handlePageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          Previous
        </button>
        <span className="p-paginator-pages">
          {Array.from({ length: pageCount }, (_, i) => (
            <button 
              key={i}
              className={`p-paginator-page ${currentPage === i ? 'p-highlight' : ''}`}
              onClick={() => handlePageChange(i)}
              aria-label={`Page ${i + 1}`}
              aria-current={currentPage === i ? 'page' : undefined}
            >
              {i + 1}
            </button>
          ))}
        </span>
        <button 
          className="p-paginator-next" 
          disabled={currentPage === pageCount - 1}
          onClick={() => handlePageChange(currentPage + 1)}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    );
  };

  // Render search input
  const renderSearch = () => (
    <div className="p-datatable-header">
      <div className="p-datatable-search">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>
      {renderColumnToggle()}
    </div>
  );

  return (
    <div className={`p-datatable ${className || ''}`} style={style}>
      {renderSearch()}
      <div className="p-datatable-wrapper">
        <table>
          {renderHeader()}
          {renderBody()}
        </table>
      </div>
      {renderPagination()}
    </div>
  );
};

export default DataTable;
