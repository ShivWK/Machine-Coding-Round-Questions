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

            <div className={`${styles["buttons"]}`}>
                <select className={`${styles["buttons__select"]}`} onChange={changeHandler}>
                    <option value={"10"} selected={pageSize === 10}>10</option>
                    <option value={"20"} selected={pageSize === 20}>20</option>
                    <option value={"30"} selected={pageSize === 30}>30</option>
                    <option value={"40"} selected={pageSize === 40}>40</option>
                    <option value={"50"} selected={pageSize === 50}>50</option>
                </select>
                <button
                    className={`${styles["buttons__btn"]} ${currentPage === 1 && styles["buttons__btn-active"]}`}
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

                {firstPageIndex > 1 && (
                    <span className={styles.ellipsis}>...</span>
                )}

                <div className={`${styles['buttons__dynamic-container']}`}>
                    {visiblePageButtons.map((pg, i) => {
                        return <button
                            className={`${styles["buttons__btn"]} ${currentPage === pg && styles["buttons__btn-active"]}`}
                            key={i}
                            disabled={pg === currentPage}
                            onClick={() => pageBtnClickHandler(pg)}
                        >
                            {pg}
                        </button>
                    })}
                </div>

                {lastPageIndex < totalPages - 1 && (
                    <span className={styles.ellipsis}>...</span>
                )}

                <button
                    className={`${styles["buttons__btn"]}`}
                    disabled={currentPage === totalPages}
                    onClick={() => navigateButtonClickHandler(1)}
                >
                    next
                </button>
                <button
                    className={`${styles["buttons__btn"]} ${currentPage === totalPages && styles["buttons__btn-active"]}`}
                    disabled={currentPage === totalPages}
                    onClick={() => pageBtnClickHandler(totalPages)}
                >
                    {totalPages}
                </button>
            </div>
        </div>
    )
}

export default PaginationSecond;