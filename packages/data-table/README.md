# React Data Table

A feature-rich, customizable data table component for React applications.

## Installation

```bash
npm install @sliderzz/fleek-data-table
```


## Features

- ✅ Sorting
- ✅ Pagination
- ✅ Selection (single, multiple, checkbox)
- ✅ Column toggling
- ✅ Search functionality
- ✅ Lazy loading support
- ✅ Custom cell rendering
- ✅ Responsive design

## Usage
```tsx
import React, { useState } from 'react';
import { DataTable } from '@sliderzz/fleek-data-table';

const App = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);

  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    // More data...
  ];

  const columns = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'name', header: 'Name', sortable: true }, 
    { field: 'email', header: 'Email' },
    { field: 'role', header: 'Role', sortable: true },
    {
      field: 'actions',
      header: 'Actions',
      body: (rowData) => (
        <button onClick={() => alert(`Edit user ${rowData.name}`)}>Edit</button>
      )
    }
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      selectionMode="checkbox"
      selection={selectedUsers}
      onSelectionChange={setSelectedUsers}
      paginator
      rows={5}
      totalRecords={data.length}
      columnToggle
    />
  );
};

export default App;
```


## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | Array | [] | Array of data to display in the table |
| columns | Array | required | Column definitions |
| loading | boolean | false | Shows loading state |
| paginator | boolean | false | Enables pagination |
| rows | number | 10 | Number of rows per page |
| totalRecords | number | 0 | Total number of records (for pagination) |
| selectionMode | string | null | 'single', 'multiple', or 'checkbox' |
| selection | any | null | Selected row(s) |
| onSelectionChange | function | null | Callback when selection changes |
| onSort | function | null | Callback when sorting changes |
| onPage | function | null | Callback when page changes |
| onSearch | function | null | Callback when search term changes |
| lazy | boolean | false | Enables lazy loading mode |
| emptyMessage | string | 'No records found' | Message to display when no data |
| className | string | null | Additional CSS class |
| style | object | null | Inline styles |
| columnToggle | boolean | false | Enables column toggling |

## Column Properties

| Property | Type | Description |
|----------|------|-------------|
| field | string | Property of the data object |
| header | string | Column header text |
| sortable | boolean | Enables sorting for this column |
| hidden | boolean | Hides the column initially |
| body | function | Custom template for cell content |
| style | object | Inline styles for the column |
| width | string | Column width |

