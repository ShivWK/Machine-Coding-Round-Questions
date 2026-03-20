import { useEffect, useState, useCallback, useRef } from "react";
import styles from "./infinite.module.css";

const InfiniteScrollSecond = ({ fetchData, renderItem, pageSize = 10, className = '' }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const lastItemRef = useRef(null)

    const loadData = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true)

        const { data: newItems, error, hasMore: more } = await fetchData({ currentPage, pageSize })

        if (error) {
            setLoading(false)
            console.log("Error in fetching data");
            return;
        }

        setItems((prv) => [...prv, ...newItems]);
        setLoading(false)
        setHasMore(more);
        setCurrentPage(prv => prv + 1)
    }, [fetchData, loading, hasMore, currentPage, pageSize])

    useEffect(() => {
        const call = async () => {
            loadData()
        }

        call()
    }, [])

    useEffect(() => {
        if (loading || !lastItemRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];

            if (entry.isIntersecting && hasMore) {
                loadData()
            }
        }, {
            root: null,
            threshold: 0.5,
            rootMargin: "200px"
        })

        const item = lastItemRef.current;
        observer.observe(item);

        return () => {
            observer.unobserve(item);
            observer.disconnect()
        }
    }, [items.length, hasMore, loadData, loading])

    return (<>
        <div role="list" className={`${styles["infinite__container"]} ${className}`}>
            {
                items.map((data, i) => {
                    return <div
                        role="listItem"
                        ref={i === (items.length - 1) ? lastItemRef : null}
                        key={i}
                    >{
                            renderItem(data)
                        }
                    </div>
                })
            }
        </div>

        {loading && <p
            role="status"
            className={`${styles["infinite__loading"]}`}>Loading...</p>}

        {!hasMore && <p
            role="status"
            className={`${styles["infinite__hasMore"]}`}>No More Products</p>}

        <div aria-live="polite" aria-atomic="true" className={`${styles["sr-only"]}`}>
            {loading && "Loading more items"}
            {!hasMore && "No more items to load"}
        </div>
    </>
    )
}

export default InfiniteScrollSecond;