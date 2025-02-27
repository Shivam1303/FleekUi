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
    const renderHeader = () => (_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [selectionMode === 'checkbox' && (_jsx("th", { className: "w-12 px-3 py-3.5", children: _jsx("input", { type: "checkbox", className: "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600", onChange: e => {
                            const isChecked = e.target.checked;
                            const newSelection = isChecked ? [...data] : [];
                            setSelectedItems(newSelection);
                            if (onSelectionChange)
                                onSelectionChange(newSelection);
                        }, checked: Array.isArray(selectedItems) && data.length > 0 && selectedItems.length === data.length }) })), visibleColumns.map(col => (_jsx("th", { style: col.style, className: `px-3 py-3.5 text-left text-sm font-semibold text-gray-900 ${col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`, onClick: () => col.sortable && handleSort(col.field), children: _jsxs("div", { className: "flex items-center", children: [col.header, col.sortable && sortField === col.field && (_jsx("span", { className: "ml-1", children: sortOrder === 'asc' ?
                                    _jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 15l7-7 7 7" }) }) :
                                    sortOrder === 'desc' ?
                                        _jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) }) : '' }))] }) }, col.field)))] }) }));
    // Render table body
    const renderBody = () => {
        if (loading) {
            return (_jsx("tbody", { className: "divide-y divide-gray-200 bg-white", children: _jsx("tr", { children: _jsx("td", { colSpan: visibleColumns.length + (selectionMode === 'checkbox' ? 1 : 0), className: "px-3 py-4 text-center text-sm text-gray-500", children: _jsxs("div", { className: "flex justify-center", children: [_jsxs("svg", { className: "h-5 w-5 animate-spin text-indigo-600", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), _jsx("span", { className: "ml-2", children: "Loading..." })] }) }) }) }));
        }
        if (data.length === 0) {
            return (_jsx("tbody", { className: "divide-y divide-gray-200 bg-white", children: _jsx("tr", { children: _jsx("td", { colSpan: visibleColumns.length + (selectionMode === 'checkbox' ? 1 : 0), className: "px-3 py-4 text-center text-sm text-gray-500", children: emptyMessage }) }) }));
        }
        return (_jsx("tbody", { className: "divide-y divide-gray-200 bg-white", children: data.map((rowData, rowIndex) => (_jsxs("tr", { className: `${isSelected(rowData) ? 'bg-indigo-50' : ''} ${selectionMode === 'single' ? 'cursor-pointer hover:bg-gray-50' : ''}`, onClick: () => selectionMode === 'single' && handleSelection(rowData, !isSelected(rowData)), children: [selectionMode === 'checkbox' && (_jsx("td", { className: "whitespace-nowrap px-3 py-4", children: _jsx("input", { type: "checkbox", className: "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600", checked: isSelected(rowData), onChange: e => handleSelection(rowData, e.target.checked) }) })), visibleColumns.map(col => (_jsx("td", { style: col.style, className: "whitespace-nowrap px-3 py-4 text-sm text-gray-500", children: col.body ? col.body(rowData) : rowData[col.field] }, col.field)))] }, rowIndex))) }));
    };
    // Render column toggle panel
    const renderColumnToggle = () => {
        if (!columnToggle)
            return null;
        const [dropdownVisible, setDropdownVisible] = useState(false);
        return (_jsxs("div", { className: "relative ml-2", children: [_jsxs("button", { className: "inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50", onClick: () => setDropdownVisible(!dropdownVisible), "aria-haspopup": "true", "aria-expanded": dropdownVisible, children: [_jsx("svg", { className: "mr-1.5 h-5 w-5 text-gray-400", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z", clipRule: "evenodd" }) }), "Columns"] }), dropdownVisible && (_jsx("div", { className: "absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none", children: _jsx("div", { className: "py-1", children: columns.map(col => (_jsxs("div", { className: "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", children: [_jsx("input", { type: "checkbox", id: `col-toggle-${col.field}`, className: "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 mr-2", checked: visibleColumns.includes(col), onChange: () => toggleColumn(col) }), _jsx("label", { htmlFor: `col-toggle-${col.field}`, className: "ml-2 cursor-pointer", children: col.header })] }, col.field))) }) }))] }));
    };
    // Render pagination
    const renderPagination = () => {
        if (!paginator)
            return null;
        const pageCount = Math.max(1, Math.ceil(totalRecords / rows));
        return (_jsx("div", { className: "flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6", children: _jsxs("div", { className: "hidden sm:flex sm:flex-1 sm:items-center sm:justify-between", children: [_jsx("div", { children: _jsxs("p", { className: "text-sm text-gray-700", children: ["Showing ", _jsx("span", { className: "font-medium", children: currentPage * rows + 1 }), " to", ' ', _jsx("span", { className: "font-medium", children: Math.min((currentPage + 1) * rows, totalRecords) }), " of", ' ', _jsx("span", { className: "font-medium", children: totalRecords }), " results"] }) }), _jsx("div", { children: _jsxs("nav", { className: "isolate inline-flex -space-x-px rounded-md shadow-sm", "aria-label": "Pagination", children: [_jsx("button", { className: `relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`, disabled: currentPage === 0, onClick: () => handlePageChange(currentPage - 1), "aria-label": "Previous page", children: _jsx("svg", { className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", "aria-hidden": "true", children: _jsx("path", { fillRule: "evenodd", d: "M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z", clipRule: "evenodd" }) }) }), Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                                    // Show pages around current page
                                    let pageNum;
                                    if (pageCount <= 5) {
                                        pageNum = i;
                                    }
                                    else {
                                        const startPage = Math.max(0, Math.min(currentPage - 2, pageCount - 5));
                                        pageNum = startPage + i;
                                    }
                                    return (_jsx("button", { onClick: () => handlePageChange(pageNum), className: `relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === pageNum
                                            ? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'}`, "aria-current": currentPage === pageNum ? 'page' : undefined, children: pageNum + 1 }, pageNum));
                                }), _jsx("button", { className: `relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === pageCount - 1 ? 'opacity-50 cursor-not-allowed' : ''}`, disabled: currentPage === pageCount - 1, onClick: () => handlePageChange(currentPage + 1), "aria-label": "Next page", children: _jsx("svg", { className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", "aria-hidden": "true", children: _jsx("path", { fillRule: "evenodd", d: "M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z", clipRule: "evenodd" }) }) })] }) })] }) }));
    };
    // Render search input
    const renderSearch = () => (_jsxs("div", { className: "border-b border-gray-200 bg-white p-4 sm:flex sm:items-center sm:justify-between", children: [_jsxs("div", { className: "relative mt-2 rounded-md shadow-sm max-w-xs", children: [_jsx("div", { className: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3", children: _jsx("svg", { className: "h-5 w-5 text-gray-400", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z", clipRule: "evenodd" }) }) }), _jsx("input", { type: "text", className: "block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6", placeholder: "Search...", value: searchTerm, onChange: e => handleSearch(e.target.value) })] }), renderColumnToggle()] }));
    return (_jsxs("div", { className: `overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5 ${className || ''}`, style: style, children: [(onSearch || columnToggle) && renderSearch(), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-300", children: [renderHeader(), renderBody()] }) }), renderPagination()] }));
};
export default DataTable;
