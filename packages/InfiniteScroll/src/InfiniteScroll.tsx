import React, { useEffect, useRef, useState } from 'react';

interface InfiniteScrollProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  fetchItems: (page: number) => Promise<T[]>;
  itemsPerPage?: number;
  className?: string;
  loadingComponent?: React.ReactNode;
  endMessage?: React.ReactNode;
  threshold?: number;
  containerHeight?: string | number;
}

const InfiniteScroll = <T,>({
  items: initialItems,
  renderItem,
  fetchItems,
  itemsPerPage = 10,
  className = '',
  loadingComponent = <div className='text-center py-4'>Loading...</div>,
  endMessage = <div className='text-center py-4'>No more items to load</div>,
  threshold = 100,
  containerHeight = '600px',
}: InfiniteScrollProps<T>): React.ReactElement => {
  const [items, setItems] = useState<T[]>(initialItems);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newItems = await fetchItems(page);

      if (newItems.length < itemsPerPage) {
        setHasMore(false);
      }

      setItems((prevItems) => [...prevItems, ...newItems]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error loading items:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = async () => {
    if (!containerRef.current || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const scrolledToThreshold =
      scrollHeight - scrollTop - clientHeight <= threshold;

    if (scrolledToThreshold) {
      await loadMore();
    }
  };

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [hasMore, loading]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto relative ${className}`}
      style={{ height: containerHeight }}
    >
      <div className='space-y-4'>
        {items.map((item, index) => (
          <div key={index}>{renderItem(item, index)}</div>
        ))}
      </div>

      {loading && loadingComponent}
      {!hasMore && !loading && endMessage}
    </div>
  );
};

export default InfiniteScroll;
