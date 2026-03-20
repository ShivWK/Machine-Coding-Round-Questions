import Product from "../pagination/Product";
import InfiniteScrollFirst from "./InfiniteScrollFirst";
import InfiniteScrollSecond from "./InfiniteScrollSecond";

const fetchData = async ({ currentPage, pageSize }) => {
    try {
        const response = await fetch(`https://dummyjson.com/products?limit=${pageSize}&skip=${(currentPage - 1) * 10}`)

        const result = await response.json();

        if (!response.ok) {
            throw new Error("Something went wrong")
        }

        return {
            data: result.products,
            hasMore: (currentPage * pageSize) < result.total,
        }
    } catch (err) {
        return {
            error: true,
            message: err.message || "Something went wrong",
        }
    }
}

const renderItem = (data) => {
    return <Product data={data} />
}

const InfiniteScrollParent = () => {
    return (
        // <InfiniteScrollFirst
        //     fetchData={fetchData}
        //     renderItem={renderItem}
        //     pageSize={10}
        // />

        <InfiniteScrollSecond
            fetchData={fetchData}
            renderItem={renderItem}
            pageSize={20}
        />
    )
}

export default InfiniteScrollParent