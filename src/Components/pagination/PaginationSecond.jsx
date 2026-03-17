import styles from "./pagination.module.css";

const PaginationSecond = ({
    data,
    renderRow,
    className = "",
    onPageChange,
    totalPages,
    currentPage,
    pageSize,
    setPageSize
}) => {
    const pageNumberButtons = Array.from({ length: totalPages }, (_, i) => i + 1);
    const MAX_NUMBER_OF_VISIBLE_BUTTONS = 5;

    let firstPageIndex = currentPage - 2;
    let lastPageIndex = currentPage + 3;

    if (firstPageIndex <= 0) {
        firstPageIndex = 1;
        lastPageIndex = Math.min(totalPages - 1, firstPageIndex + MAX_NUMBER_OF_VISIBLE_BUTTONS);
    }

    if (lastPageIndex >= totalPages) {
        lastPageIndex = totalPages - 1
        firstPageIndex = Math.max(1, totalPages - MAX_NUMBER_OF_VISIBLE_BUTTONS - 1)
    }

    const visiblePageButtons = pageNumberButtons.slice(firstPageIndex, lastPageIndex)

    const navigateButtonClickHandler = (pg) => {
        onPageChange(prv => prv + pg)
    }

    const pageBtnClickHandler = (pg) => {
        onPageChange(pg)
    }

    const changeHandler = (e) => {
        const newSize = Number(e.target.value);
        setPageSize(newSize);
        onPageChange(1)
    }

    return (
        <div className={`${styles["pagination"]} ${styles[className]}`}>
            <div className={`${styles["pagination__content"]}`}>
                {data.map((product, i) => <div key={i}>
                    {renderRow(product)}
                </div>)}
            </div>

            <nav
                aria-label="Pagination Navigation"
                className={`${styles["buttons"]}`}
            >
                <select
                    aria-label="Items per page"
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
                    <span aria-hidden="true" className={styles.ellipsis}>...</span>
                )}

                <div className={`${styles['buttons__dynamic-container']}`}>
                    {visiblePageButtons.map((pg) => {
                        return <button
                            key={pg}
                            aria-current={currentPage === pg ? "page" : undefined}
                            aria-label={currentPage === pg ? `page ${pg}` : `Go to page ${pg}`}
                            className={`${styles["buttons__btn"]} ${currentPage === pg && styles["buttons__btn-active"]}`}
                            disabled={pg === currentPage}
                            onClick={() => pageBtnClickHandler(pg)}
                        >
                            {pg}
                        </button>
                    })}
                </div>

                {lastPageIndex < totalPages - 1 && (
                    <span aria-hidden="true" className={styles.ellipsis}>...</span>
                )}

                <button
                    aria-label="Go to next page"
                    className={`${styles["buttons__btn"]}`}
                    disabled={currentPage === totalPages}
                    onClick={() => navigateButtonClickHandler(1)}
                >
                    next
                </button>
                <button
                    aria-label={`Go to the last page, page ${totalPages}`}
                    className={`${styles["buttons__btn"]} ${currentPage === totalPages && styles["buttons__btn-active"]}`}
                    disabled={currentPage === totalPages}
                    onClick={() => pageBtnClickHandler(totalPages)}
                >
                    {totalPages}
                </button>
            </nav>

            <div aria-live="polite" className={`${styles["sr_only"]}`}>
                page {currentPage} loaded
            </div>
        </div>
    )
}

export default PaginationSecond;