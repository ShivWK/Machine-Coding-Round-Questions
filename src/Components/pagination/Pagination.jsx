import { useState } from 'react'
import styles from "./pagination.module.css";

const PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;
const MAX_NUMBER_OF_VISIBLE_BUTTONS = 5;

const Pagination = ({ data, renderRow, rowPerPage = PAGE_SIZE, className = "" }) => {
    const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
    const [pageSize, setPageSize] = useState(rowPerPage)

    const startIndex = (currentPage * pageSize) - pageSize;
    const lastIndex = currentPage * pageSize;
    const totalNumberOfPages = Math.ceil(data.length / pageSize);
    const pageNumberButtons = Array.from({ length: totalNumberOfPages }, (_, i) => i + 1);

    let firstPageIndex = currentPage - 2;
    let lastPageIndex = currentPage + 3;

    if (firstPageIndex <= 0) {
        firstPageIndex = 1;
    }

    if (lastPageIndex >= totalNumberOfPages) {
        lastPageIndex = totalNumberOfPages - 2
    }

    const visibleData = data.slice(startIndex, lastIndex)
    const visiblePageButtons = pageNumberButtons.slice(firstPageIndex, lastPageIndex)

    const navigateButtonClickHandler = (pg) => {
        setCurrentPage(prv => prv + pg)
    }

    const pageBtnClickHandler = (pg) => {
        setCurrentPage(pg)
    }

    return (
        <div className={`pagination ${className}`}>
            <div className="pagination__content">
                {visibleData.map((data, i) => <div key={i}>
                    {renderRow(data)}
                </div>)}
            </div>

            <div className={`${styles["buttons"]}`}>
                <select onChange={(e) => setPageSize(Number(e.target.value))}>
                    <option value={"10"}>10</option>
                    <option value={"20"}>20</option>
                    <option value={"30"}>30</option>
                    <option value={"40"}>40</option>
                    <option value={"50"}>50</option>
                </select>
                <button
                    className={`${styles["buttons__btn"]}`}
                    disabled={currentPage === 1}
                    onClick={() => pageBtnClickHandler(1)}
                >
                    1
                </button>
                <button
                    className={`${styles["buttons__btn"]}`}
                    disabled={currentPage === 1}
                    onClick={() => navigateButtonClickHandler(-1)}
                >
                    prev
                </button>

                <div>
                    {visiblePageButtons.map((pg, i) => {
                        return <button
                            className={`${styles["buttons__btn"]}`}
                            key={i}
                            disabled={pg === currentPage}
                            onClick={() => pageBtnClickHandler(pg)}
                        >
                            {pg}
                        </button>
                    })}
                </div>

                <button
                    className={`${styles["buttons__btn"]}`}
                    disabled={currentPage === totalNumberOfPages}
                    onClick={() => navigateButtonClickHandler(1)}
                >
                    next
                </button>
                <button
                    className={`${styles["buttons__btn"]}`}
                    disabled={currentPage === totalNumberOfPages}
                    onClick={() => pageBtnClickHandler(totalNumberOfPages)}
                >
                    {totalNumberOfPages}
                </button>
            </div>
        </div>
    )
}

export default Pagination;