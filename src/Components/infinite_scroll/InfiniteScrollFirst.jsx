import { useEffect, useState, useCallback, useRef } from "react";
import styles from "./infinite.module.css";

const InfiniteScrollFirst = ({ fetchData, renderItem, pageSize = 10, className = '' }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ticking = useRef(false);

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
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    if (scrollHeight <= clientHeight && !loading && hasMore) {
      const call = async () => {
        loadData()
      }

      call()
    }
  }, [loading, hasMore, loadData])

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        const scrollTop = window.scrollY;

        const remaining = scrollHeight - (scrollTop + clientHeight);

        if (remaining < 200 && !loading) {
          loadData()
        }

        ticking.current = false;
      })
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [loading, loadData])

  return (<>
    <div className={`${styles["infinite__container"]} ${className}`}>
      {
        items.map((data, i) => {
          return <div key={i}>{
            renderItem(data)
          }
          </div>
        })
      }
    </div>

    {loading && <p className={`${styles["infinite__loading"]}`}>Loading...</p>}
    {!hasMore && <p className={`${styles["infinite__hasMore"]}`}>No More Products</p>}
  </>
  )
}

export default InfiniteScrollFirst;

// Learn cascade render