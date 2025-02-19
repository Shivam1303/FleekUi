# Fleek InfiniteScroll Component

A simplified infinite scroll component for React applications that handles pagination internally.

## Installation

```bash
npm install @sliderzz/fleek-infinitescroll
```

## Usage

```tsx
import React from 'react';
import { InfiniteScroll } from '@sliderzz/fleek-infinitescroll';
interface Post {
id: number;
title: string;
content: string;
}
const PostList: React.FC = () => {
// Function to fetch items from your API
const fetchPosts = async (page: number) => {
const response = await fetch(/api/posts?page=${page}&limit=10);
return response.json();
};
return (
<InfiniteScroll<Post>
items={[]} // Initial items (empty array)
fetchItems={fetchPosts} // Just pass your fetch function
itemsPerPage={10} // Optional: defaults to 10
renderItem={(post) => (
<div className="p-4 border rounded-lg shadow-sm mb-4">
<h2 className="text-xl font-bold">{post.title}</h2>
<p className="text-gray-600">{post.content}</p>
</div>
)}
containerHeight="800px"
className="bg-white rounded-lg p-4"
/>
);
};
export default PostList;
```

## Props

| Prop               | Type                                          | Required | Default         | Description                              |
| ------------------ | --------------------------------------------- | -------- | --------------- | ---------------------------------------- |
| `items`            | `T[]`                                         | Yes      | -               | Initial items array (can be empty)       |
| `renderItem`       | `(item: T, index: number) => React.ReactNode` | Yes      | -               | Function to render each item             |
| `fetchItems`       | `(page: number) => Promise<T[]>`              | Yes      | -               | Function to fetch items for a given page |
| `itemsPerPage`     | `number`                                      | No       | `10`            | Number of items per page                 |
| `className`        | `string`                                      | No       | `""`            | Additional CSS classes                   |
| `loadingComponent` | `React.ReactNode`                             | No       | Default spinner | Loading indicator                        |
| `endMessage`       | `React.ReactNode`                             | No       | Default message | End of list message                      |
| `threshold`        | `number`                                      | No       | `100`           | Scroll threshold in pixels               |
| `containerHeight`  | `string \| number`                            | No       | `"600px"`       | Container height                         |
