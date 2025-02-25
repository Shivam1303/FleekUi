import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
const DataTable = (props) => {
    const { data = [], columns, loading = false, paginator = false, rows = 10, totalRecords = 0, selectionMode = null, selection, onSelectionChange, onSort, onPage, onSearch, lazy = false, emptyMessage = 'No records found', className, style, columnToggle = false, } = props;
    const [visibleColumns, setVisibleColumns] = useState(columns);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState(selection || (selectionMode === 'multiple' || selectionMode === 'checkbox' ? [] : null));
    // Update visible columns when columns prop changes
    useEffect(() => {
        setVisibleColumns(columns.filter(col => !col.hidden));
    }, [columns]);
    // Handle sorting
    const handleSort = useCallback((field) => {
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
    const handleSelection = useCallback((item, isSelected) => {
        let newSelection;
        if (selectionMode === 'single') {
            newSelection = isSelected ? item : [];
        }
        else if (selectionMode === 'multiple' || selectionMode === 'checkbox') {
            const currentSelection = Array.isArray(selectedItems) ? selectedItems : [];
            newSelection = isSelected
                ? [...currentSelection, item]
                : currentSelection.filter(i => i !== item);
        }
        else {
            newSelection = [];
        }
        setSelectedItems(newSelection);
        if (onSelectionChange) {
            onSelectionChange(newSelection);
        }
    }, [selectionMode, selectedItems, onSelectionChange]);
    // Handle pagination
    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
        if (onPage) {
            onPage({ first: page * rows, rows });
        }
    }, [rows, onPage]);
    // Handle search
    const handleSearch = useCallback((term) => {
        setSearchTerm(term);
        if (onSearch) {
            onSearch(term);
        }
    }, [onSearch]);
    // Handle column toggle
    const toggleColumn = useCallback((column) => {
        const updatedColumns = visibleColumns.includes(column)
            ? visibleColumns.filter(col => col !== column)
            : [...visibleColumns, column];
        setVisibleColumns(updatedColumns);
    }, [visibleColumns]);
    // Check if an item is selected
    const isSelected = useCallback((item) => {
        if (!selectedItems)
            return false;
        if (Array.isArray(selectedItems)) {
            return selectedItems.some(i => JSON.stringify(i) === JSON.stringify(item));
        }
        return JSON.stringify(selectedItems) === JSON.stringify(item);
    }, [selectedItems]);
    // Render table header
    const renderHeader = () => (_jsx("thead", { children: _jsxs("tr", { children: [selectionMode === 'checkbox' && (_jsx("th", { className: "p-selection-column", children: _jsx("input", { type: "checkbox", onChange: e => {
                            const isChecked = e.target.checked;
                            const newSelection = isChecked ? [...data] : [];
                            setSelectedItems(newSelection);
                            if (onSelectionChange)
                                onSelectionChange(newSelection);
                        }, checked: Array.isArray(selectedItems) && data.length > 0 && selectedItems.length === data.length }) })), visibleColumns.map(col => (_jsxs("th", { style: col.style, className: col.sortable ? 'p-sortable-column' : '', onClick: () => col.sortable && handleSort(col.field), children: [col.header, col.sortable && sortField === col.field && (_jsx("span", { className: "p-sortable-column-icon", children: sortOrder === 'asc' ? ' ↑' : sortOrder === 'desc' ? ' ↓' : '' }))] }, col.field)))] }) }));
    // Render table body
    const renderBody = () => {
        if (loading) {
            return (_jsx("tbody", { children: _jsx("tr", { children: _jsx("td", { colSpan: visibleColumns.length + (selectionMode === 'checkbox' ? 1 : 0), className: "p-datatable-loading", children: "Loading..." }) }) }));
        }
        if (data.length === 0) {
            return (_jsx("tbody", { children: _jsx("tr", { children: _jsx("td", { colSpan: visibleColumns.length + (selectionMode === 'checkbox' ? 1 : 0), className: "p-datatable-emptymessage", children: emptyMessage }) }) }));
        }
        return (_jsx("tbody", { children: data.map((rowData, rowIndex) => (_jsxs("tr", { className: isSelected(rowData) ? 'p-highlight' : '', onClick: () => selectionMode === 'single' && handleSelection(rowData, !isSelected(rowData)), children: [selectionMode === 'checkbox' && (_jsx("td", { className: "p-selection-column", children: _jsx("input", { type: "checkbox", checked: isSelected(rowData), onChange: e => handleSelection(rowData, e.target.checked) }) })), visibleColumns.map(col => (_jsx("td", { style: col.style, children: col.body ? col.body(rowData) : rowData[col.field] }, col.field)))] }, rowIndex))) }));
    };
    // Render column toggle panel
    const renderColumnToggle = () => {
        if (!columnToggle)
            return null;
        const [dropdownVisible, setDropdownVisible] = useState(false);
        return (_jsxs("div", { className: "p-column-toggle-container", children: [_jsx("button", { className: "p-column-toggle-button", onClick: () => setDropdownVisible(!dropdownVisible), "aria-haspopup": "true", "aria-expanded": dropdownVisible, children: "Toggle Columns" }), dropdownVisible && (_jsx("div", { className: "p-column-toggle-dropdown", children: columns.map(col => (_jsxs("div", { className: "p-column-toggle-item", children: [_jsx("input", { type: "checkbox", id: `col-toggle-${col.field}`, checked: visibleColumns.includes(col), onChange: () => toggleColumn(col) }), _jsx("label", { htmlFor: `col-toggle-${col.field}`, children: col.header })] }, col.field))) }))] }));
    };
    // Render pagination
    const renderPagination = () => {
        if (!paginator)
            return null;
        const pageCount = Math.max(1, Math.ceil(totalRecords / rows));
        return (_jsxs("div", { className: "p-paginator", children: [_jsx("button", { className: "p-paginator-prev", disabled: currentPage === 0, onClick: () => handlePageChange(currentPage - 1), "aria-label": "Previous page", children: "Previous" }), _jsx("span", { className: "p-paginator-pages", children: Array.from({ length: pageCount }, (_, i) => (_jsx("button", { className: `p-paginator-page ${currentPage === i ? 'p-highlight' : ''}`, onClick: () => handlePageChange(i), "aria-label": `Page ${i + 1}`, "aria-current": currentPage === i ? 'page' : undefined, children: i + 1 }, i))) }), _jsx("button", { className: "p-paginator-next", disabled: currentPage === pageCount - 1, onClick: () => handlePageChange(currentPage + 1), "aria-label": "Next page", children: "Next" })] }));
    };
    // Render search input
    const renderSearch = () => (_jsxs("div", { className: "p-datatable-header", children: [_jsx("div", { className: "p-datatable-search", children: _jsx("input", { type: "text", placeholder: "Search...", value: searchTerm, onChange: e => handleSearch(e.target.value) }) }), renderColumnToggle()] }));
    return (_jsxs("div", { className: `p-datatable ${className || ''}`, style: style, children: [renderSearch(), _jsx("div", { className: "p-datatable-wrapper", children: _jsxs("table", { children: [renderHeader(), renderBody()] }) }), renderPagination()] }));
};
export default DataTable;
