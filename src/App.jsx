// import Toast from "./components/toast/Toast";
import Pagination from "./components/pagination/Pagination";
import products from "./utilis/products.json";
import Product from "./components/pagination/Product";

// const dataToRender = Array.from({ length: 500 }, (_, i) => i);

const renderRow = (d) => {
  return <Product data={d} />
}

// https://dummyjson.com/products

function App() {

  return (
    // <Toast type="success" message={"New notification"} /> 
    <Pagination data={products} renderRow={renderRow} />
  )
}

export default App
