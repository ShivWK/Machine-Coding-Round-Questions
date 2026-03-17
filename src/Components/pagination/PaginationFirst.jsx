import { useState } from 'react'
import styles from "./pagination.module.css";

const PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;
const MAX_NUMBER_OF_VISIBLE_BUTTONS = 5;

const PaginationFirst = ({ data, renderRow, rowPerPage = PAGE_SIZE, className = "" }) => {
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
        lastPageIndex = Math.min(totalNumberOfPages - 1, firstPageIndex + MAX_NUMBER_OF_VISIBLE_BUTTONS);
    }

    if (lastPageIndex >= totalNumberOfPages) {
        lastPageIndex = totalNumberOfPages - 1
        firstPageIndex = Math.max(1, totalNumberOfPages - MAX_NUMBER_OF_VISIBLE_BUTTONS - 1)
    }

    const visibleData = data.slice(startIndex, lastIndex)
    const visiblePageButtons = pageNumberButtons.slice(firstPageIndex, lastPageIndex)

    const navigateButtonClickHandler = (pg) => {
        setCurrentPage(prv => prv + pg)
    }

    const pageBtnClickHandler = (pg) => {
        setCurrentPage(pg)
    }

    const changeHandler = (e) => {
        const newSize = Number(e.target.value);
        setPageSize(newSize);
        setCurrentPage(1)
    }

    return (
        <div className={`${styles["pagination"]} ${styles[className]}`}>
            <div className={`${styles["pagination__content"]}`}>
                {visibleData.map((data, i) => <div key={i}>
                    {renderRow(data)}
                </div>)}
            </div>

            <nav
                className={`${styles["buttons"]}`}
                aria-label='Pagination Navigation'
            >
                {/* Screen readers will announce: “Navigation region: Pagination Navigation” */}
                <select
                    aria-label='Items per page'
                    value={pageSize}
                    className={`${styles["buttons__select"]}`} onChange={changeHandler}
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={40}>40</option>
                    <option value={50}>50</option>
                </select>
                <button
                    aria-label="Go to first page"
                    className={`${styles["buttons__btn"]} ${currentPage === 1 && styles["buttons__btn-active"]}`}
                    disabled={currentPage === 1}
                    onClick={() => pageBtnClickHandler(1)}
                >
                    1
                </button>
                <button
                    aria-label="Go to previous page"
                    className={`${styles["buttons__btn"]}`}
                    disabled={currentPage === 1}
                    onClick={() => navigateButtonClickHandler(-1)}
                >
                    prev
                </button>

                {firstPageIndex > 1 && (
                    <span aria-hidden='true' className={styles.ellipsis}>...</span>
                )}

                <div className={`${styles['buttons__dynamic-container']}`}>
                    {visiblePageButtons.map((pg) => {
                        return <button
                            key={pg}
                            aria-label={currentPage === pg ? `page ${pg}` : `Go to page ${pg}`}
                            aria-current={currentPage === pg ? "page" : undefined}
                            className={`${styles["buttons__btn"]} ${currentPage === pg && styles["buttons__btn-active"]}`}
                            disabled={pg === currentPage}
                            onClick={() => pageBtnClickHandler(pg)}
                        >
                            {pg}
                        </button>
                    })}
                </div>

                {lastPageIndex < totalNumberOfPages - 1 && (
                    <span aria-hidden="true" className={styles.ellipsis}>...</span>
                )}

                <button
                    aria-label="Go to next page"
                    className={`${styles["buttons__btn"]}`}
                    disabled={currentPage === totalNumberOfPages}
                    onClick={() => navigateButtonClickHandler(1)}
                >
                    next
                </button>
                <button
                    aria-label={`Go to last page, page ${totalNumberOfPages}`}
                    className={`${styles["buttons__btn"]} ${currentPage === totalNumberOfPages && styles["buttons__btn-active"]}`}
                    disabled={currentPage === totalNumberOfPages}
                    onClick={() => pageBtnClickHandler(totalNumberOfPages)}
                >
                    {totalNumberOfPages}
                </button>
            </nav>

            <div aria-live="polite" className={`${styles["sr_only"]}`}>
                page {currentPage} loaded
            </div>
        </div>
    )
}

export default PaginationFirst;