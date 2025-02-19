import React, { useEffect, useRef, useState } from 'react';

interface InfiniteScrollProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemsPerPage?: number;
  className?: string;
  loadingComponent?: React.ReactNode;
  endMessage?: React.ReactNode;
  threshold?: number;
  containerHeight?: string | number;
}

const InfiniteScroll = <T,>({
  items: allItems,
  renderItem,
  itemsPerPage = 10,
  className = '',
  loadingComponent = <div className='text-center py-4'>Loading...</div>,
  endMessage = <div className='text-center py-4'>No more items to load</div>,
  threshold = 100,
  containerHeight = '600px',
}: InfiniteScrollProps<T>): React.ReactElement => {
  const [displayedItems, setDisplayedItems] = useState<T[]>(
    allItems.slice(0, itemsPerPage),
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(allItems.length > itemsPerPage);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadMore = () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextItems = allItems.slice(0, (page + 1) * itemsPerPage);

      if (nextItems.length >= allItems.length) {
        setHasMore(false);
      }

      setDisplayedItems(nextItems);
      setPage((prev) => prev + 1);
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
        {displayedItems.map((item, index) => (
          <div key={index}>{renderItem(item, index)}</div>
        ))}
      </div>

      {loading && loadingComponent}
      {!hasMore && !loading && endMessage}
    </div>
  );
};

export default InfiniteScroll;
