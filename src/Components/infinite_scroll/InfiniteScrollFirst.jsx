import { useEffect, useState } from "react";
import styles from "./infinite.module.css";

const InfiniteScrollFirst = ({ fetchData, renderItem, pageSize = 10, className = '' }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = async () => {
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
  }

  console.log(items)

  useEffect(() => {
    const call = async () => {
      loadData()
    }

    call()
  }, [])

  return (
    <div className={`${styles["infinite__container"]} ${className}`}>
      {
        items.map((data) => {
          return <div key={data.id}>{
            renderItem(data)
          }
          </div>
        })
      }
    </div>
  )
}

export default InfiniteScrollFirst;