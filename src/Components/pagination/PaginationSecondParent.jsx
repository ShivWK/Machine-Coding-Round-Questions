import { useEffect, useRef, useState } from "react";
import PaginationSecond from "./PaginationSecond";
import Product from './Product';

const renderRow = (d) => {
    return <Product data={d} />
}

function PaginationSecondParent() {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10)
    const abortController = useRef(null);
    const pageCache = useRef(new Map());
    const CACHE_LIMIT = 5;

    const updateCache = (pg, data) => {
        if (pageCache.current.size >= CACHE_LIMIT) {
            const firstKEy = pageCache.current.keys().next().value;
            pageCache.current.delete(firstKEy);
        }

        pageCache.current.set(pg, data)
    }


    useEffect(() => {
        console.log(pageCache.current)

        const call = async () => {
            if (pageCache.current.has(currentPage)) {
                setProducts(pageCache.current.get(currentPage));
                return
            }

            if (abortController.current) {
                abortController.current.abort()
            }

            const controller = new AbortController();
            abortController.current = controller;

            setLoading(true)
            const response = await fetch(`https://dummyjson.com/products?limit=${pageSize}&skip=${(currentPage - 1) * 10}`, {
                signal: controller.signal
            });

            if (!response.ok) {
                console.log("Something went wrong")
            }

            const result = await response.json();
            const totalNumberOfPages = Math.ceil(result.total / 10)
            setTotalPages(totalNumberOfPages);
            setLoading(false)
            setProducts(result.products)

            updateCache(currentPage, result.products)
            //console.log(result)
        }

        call()
    }, [currentPage, pageSize])

    return (
        loading ?
            <p>Loading...</p>
            : <PaginationSecond
                data={products}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                totalPages={totalPages}
                renderRow={renderRow}
                pageSize={pageSize}
                setPageSize={setPageSize}
            />
    )
}

export default PaginationSecondParent;