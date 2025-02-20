import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
const InfiniteScroll = ({ items: allItems, renderItem, itemsPerPage = 10, className = '', loadingComponent = _jsx("div", { className: 'text-center py-4', children: "Loading..." }), endMessage = _jsx("div", { className: 'text-center py-4', children: "No more items to load" }), threshold = 100, containerHeight = '600px', }) => {
    const [displayedItems, setDisplayedItems] = useState(allItems.slice(0, itemsPerPage));
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(allItems.length > itemsPerPage);
    const containerRef = useRef(null);
    const loadMore = () => {
        if (loading || !hasMore)
            return;
        setLoading(true);
        try {
            const nextPage = page + 1;
            const startIndex = nextPage * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, allItems.length);
            const nextItems = allItems.slice(startIndex, endIndex);
            setDisplayedItems(prev => [...prev, ...nextItems]);
            setPage(nextPage);
            setHasMore(endIndex < allItems.length);
        }
        finally {
            setLoading(false);
        }
    };
    const handleScroll = () => {
        if (!containerRef.current || loading || !hasMore)
            return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const scrolledToThreshold = scrollHeight - scrollTop - clientHeight <= threshold;
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
    return (_jsxs("div", { ref: containerRef, className: `overflow-auto relative ${className}`, style: { height: containerHeight }, children: [_jsx("div", { className: 'space-y-4', children: displayedItems.map((item, index) => (_jsx("div", { children: renderItem(item, index) }, index))) }), loading && loadingComponent, !hasMore && !loading && endMessage] }));
};
export default InfiniteScroll;
