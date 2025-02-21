# InfiniteScroll Component

A React component that implements infinite scrolling functionality for large lists of data with client-side pagination handling.

## Features

- Client-side pagination
- Customizable item rendering
- Loading and end-of-list indicators
- Configurable scroll threshold
- Customizable styling

## Installation

```bash
npm install @sliderzz/fleek-infinitescroll
```

## Usage

```tsx
// Example usage
import { InfiniteScroll } from '@/packages/InfiniteScroll';

interface User {
  id: number;
  name: string;
  email: string;
}

const UserList = () => {
  // Sample data
  const users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    // ... more users
  ];

  const renderUser = (user: User, index: number) => {
    return (
      <div className='p-4 bg-white shadow rounded-lg'>
        <h3 className='font-bold'>{user.name}</h3>
        <p className='text-gray-600'>{user.email}</p>
      </div>
    );
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>User List</h1>
      <InfiniteScroll
        items={users}
        renderItem={renderUser}
        itemsPerPage={20}
        containerHeight='600px'
        className='bg-gray-100 p-4 rounded-lg'
        loadingComponent={
          <div className='flex justify-center py-4'>
            <span className='loading loading-spinner' />
          </div>
        }
        endMessage={
          <div className='text-center text-gray-500 py-4'>
            That's all the users!
          </div>
        }
        threshold={200}
      />
    </div>
  );
};
```

## Props

| Prop               | Type                                          | Default                            | Description                                                |
| ------------------ | --------------------------------------------- | ---------------------------------- | ---------------------------------------------------------- |
| `items`            | `T[]`                                         | Required                           | Array of items to be displayed                             |
| `renderItem`       | `(item: T, index: number) => React.ReactNode` | Required                           | Function to render each item                               |
| `itemsPerPage`     | `number`                                      | `10`                               | Number of items to load per page                           |
| `className`        | `string`                                      | `''`                               | Additional CSS classes for the container                   |
| `loadingComponent` | `React.ReactNode`                             | `<div>Loading...</div>`            | Component to show while loading more items                 |
| `endMessage`       | `React.ReactNode`                             | `<div>No more items to load</div>` | Message to show when all items are loaded                  |
| `threshold`        | `number`                                      | `100`                              | Distance from bottom (in pixels) to trigger next page load |
| `containerHeight`  | `string \| number`                            | `'600px'`                          | Height of the scrollable container                         |

## Notes

- The component handles pagination client-side, meaning all data should be passed in advance
- Uses a scroll threshold to determine when to load more items
- Automatically manages the display of loading and end-message components
- Cleans up event listeners on unmount

## Performance Considerations

- Consider the size of your data array as all items are stored in memory
- Use appropriate `itemsPerPage` values to balance smooth scrolling and performance
- Implement virtualization for extremely large lists (10,000+ items).

## Browser Support

Works in all modern browsers that support:

- IntersectionObserver API
- CSS Flexbox
- Modern JavaScript features
