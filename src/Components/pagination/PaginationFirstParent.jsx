import { useEffect, useState } from "react";
import PaginationFirst from "./PaginationFirst";
import Product from './Product';
// import products from "../../utils/products.json"

const renderRow = (d) => {
  return <Product data={d} />
}

function PaginationFirstParent() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const call = async () => {
      setLoading(true)
      const response = await fetch("https://dummyjson.com/products?limit=0");

      if (!response.ok) {
        console.log("Something went wrong")
      }

      const result = await response.json();
      setLoading(false)
      setProducts(result.products)

      console.log(result)
    }

    call()
  }, [])

  return (
    loading ?
      <p>Loading...</p>
      : <PaginationFirst data={products} renderRow={renderRow} />
  )
}

export default PaginationFirstParent;