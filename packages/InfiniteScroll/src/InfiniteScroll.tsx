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
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(allItems.length > itemsPerPage);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadMore = () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const startIndex = nextPage * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, allItems.length);
      const nextItems = allItems.slice(startIndex, endIndex);
      setDisplayedItems(prev => [...prev, ...nextItems]);
      setPage(nextPage);
      setHasMore(endIndex < allItems.length);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (!containerRef.current || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const scrolledToThreshold =
      scrollHeight - scrollTop - clientHeight <= threshold;

    if (scrolledToThreshold) {
      loadMore();
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
  }, [page]);

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
