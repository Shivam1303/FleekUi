import React from 'react';
interface InfiniteScrollProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    loadMore: () => Promise<void>;
    hasMore: boolean;
    loading?: boolean;
    className?: string;
    loadingComponent?: React.ReactNode;
    endMessage?: React.ReactNode;
    threshold?: number;
    containerHeight?: string | number;
}
declare const InfiniteScroll: <T>({ items, renderItem, loadMore, hasMore, loading, className, loadingComponent, endMessage, threshold, containerHeight, }: InfiniteScrollProps<T>) => React.ReactElement;
export default InfiniteScroll;
