import { useEffect, useState, useCallback } from "react";
import styles from "./infinite.module.css";

const InfiniteScrollFirst = ({ fetchData, renderItem, pageSize = 10, className = '' }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticking, setTicking] = useState(false);

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
    const handleScroll = () => {
      if (ticking) return;
      setTicking(true);

      requestAnimationFrame(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        const scrollTop = window.scrollY;

        const remaining = scrollHeight - (scrollTop + clientHeight);
        console.log("remaining", remaining)

        if (remaining < 200 && !loading) {
          loadData()
        }

        setTicking(false);
      })
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [loading, ticking, loadData])

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

    {loading && <p>Loading...</p>}
    {!hasMore && <p>No More Products</p>}
  </>
  )
}

export default InfiniteScrollFirst;

// Learn concurrent render