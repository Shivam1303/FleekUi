import React from 'react';
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
    onPage?: (event: {
        first: number;
        rows: number;
    }) => void;
    onSearch?: (searchTerm: string) => void;
    lazy?: boolean;
    emptyMessage?: string;
    className?: string;
    style?: React.CSSProperties;
    columnToggle?: boolean;
}
declare const DataTable: <T extends Record<string, any>>(props: DataTableProps<T>) => import("react/jsx-runtime").JSX.Element;
export default DataTable;
