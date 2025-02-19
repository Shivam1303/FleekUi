var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
const InfiniteScroll = ({ items, renderItem, loadMore, hasMore, loading = false, className = '', loadingComponent = _jsx("div", { className: 'text-center py-4', children: "Loading..." }), endMessage = _jsx("div", { className: 'text-center py-4', children: "No more items to load" }), threshold = 100, containerHeight = '600px', }) => {
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const containerRef = useRef(null);
    const handleScroll = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!containerRef.current || isLoadingMore || !hasMore || loading)
            return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const scrolledToThreshold = scrollHeight - scrollTop - clientHeight <= threshold;
        if (scrolledToThreshold) {
            setIsLoadingMore(true);
            try {
                yield loadMore();
            }
            finally {
                setIsLoadingMore(false);
            }
        }
    });
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
    return (_jsxs("div", { ref: containerRef, className: `overflow-auto relative ${className}`, style: { height: containerHeight }, children: [_jsx("div", { className: 'space-y-4', children: items.map((item, index) => (_jsx("div", { children: renderItem(item, index) }, index))) }), (loading || isLoadingMore) && loadingComponent, !hasMore && !loading && endMessage] }));
};
export default InfiniteScroll;
