import Toast from "./components/toast/Toast";
import Pagination from "./components/pagination/Pagination";

const dataToRender = Array.from({ length: 200 }, (_, i) => i);

const renderRow = (d) => {
  return <>
    <p>data is {d}</p>
  </>
}

// https://dummyjson.com/products

function App() {
  return (
    // <Toast type="success" message={"New notification"} /> 
    <Pagination data={dataToRender} renderRow={renderRow} />
  )
}

export default App
