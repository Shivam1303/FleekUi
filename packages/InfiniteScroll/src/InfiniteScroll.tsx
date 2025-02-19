import React, { useEffect, useRef, useState } from 'react';

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

const InfiniteScroll = <T,>({
  items,
  renderItem,
  loadMore,
  hasMore,
  loading = false,
  className = '',
  loadingComponent = <div className='text-center py-4'>Loading...</div>,
  endMessage = <div className='text-center py-4'>No more items to load</div>,
  threshold = 100,
  containerHeight = '600px',
}: InfiniteScrollProps<T>): React.ReactElement => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = async () => {
    if (!containerRef.current || isLoadingMore || !hasMore || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const scrolledToThreshold =
      scrollHeight - scrollTop - clientHeight <= threshold;

    if (scrolledToThreshold) {
      setIsLoadingMore(true);
      try {
        await loadMore();
      } finally {
        setIsLoadingMore(false);
      }
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
  }, [hasMore, isLoadingMore, loading]);

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

      {(loading || isLoadingMore) && loadingComponent}
      {!hasMore && !loading && endMessage}
    </div>
  );
};

export default InfiniteScroll;
