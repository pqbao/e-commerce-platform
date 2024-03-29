const pages = (pageCurrent, pageCount) => {
    let topPages = [];
    let midPages = [];
    let botPages = [];

    for (let i = 1; i <= 3; i++) {
        if (i < pageCurrent - 3) {
            topPages.push(i);
        }
    }

    if (pageCount <= 0) midPages = [1];
    for (let i = pageCurrent - 3; i <= pageCurrent + 3; i++) {
        if (i > 0 && i <= pageCount) {
            midPages.push(i);
        }
    }

    for (let i = pageCount; i >= pageCount - 3; i--) {
        if (i > pageCurrent + 3) {
            botPages.unshift(i);
        }
    }

    return {
        topPages,
        midPages,
        botPages,
    };
};

const Pagination = ({
    pagination = {},
    onChangePage = () => {},
    isSmall = false,
}) => {
    const { pageCurrent, pageCount } = pagination;
    const { topPages, midPages, botPages } = pages(pageCurrent, pageCount);

    const handleChangePage = (newPage) => {
        if (onChangePage) {
            onChangePage(newPage);
        }
    };

    return (
        <nav className="my-4">
            <ul className="pagination justify-content-center mb-0">
                <div
                    className="btn-group"
                    role="group"
                    aria-label="Basic outlined example"
                >
                    <button
                        type="button"
                        disabled={pageCurrent <= 1}
                        className="btn btn-outline-primary ripple"
                        style={{ minWidth: '60px' }}
                        onClick={() => handleChangePage(pageCurrent - 1)}
                    >
                        Trước
                    </button>

                    {!isSmall && (
                        <>
                            {topPages.map((p) => (
                                <button
                                    type="button"
                                    key={p}
                                    className="btn btn-outline-primary ripple res-hide-md"
                                    style={{ minWidth: '60px' }}
                                    onClick={() => handleChangePage(p)}
                                >
                                    {p}
                                </button>
                            ))}

                            {midPages[0] - 1 != topPages[topPages.length - 1] &&
                                midPages[0] > 1 && (
                                    <button
                                        disabled
                                        type="button"
                                        className="btn btn-outline-primary ripple res-hide-md"
                                        style={{ minWidth: '60px' }}
                                    >
                                        ...
                                    </button>
                                )}

                            {midPages.map((p) => (
                                <button
                                    type="button"
                                    key={p}
                                    className={`btn ${
                                        p == pageCurrent
                                            ? 'btn-primary'
                                            : 'btn-outline-primary'
                                    } ripple res-hide-md`}
                                    style={{ minWidth: '60px' }}
                                    onClick={
                                        p == pageCurrent
                                            ? () => {}
                                            : () => handleChangePage(p)
                                    }
                                >
                                    {p}
                                </button>
                            ))}

                            {midPages[midPages.length - 1] != botPages[0] - 1 &&
                                midPages[midPages.length - 1] < pageCount && (
                                    <button
                                        disabled
                                        type="button"
                                        className="btn btn-outline-primary ripple res-hide-md"
                                        style={{ minWidth: '60px' }}
                                    >
                                        ...
                                    </button>
                                )}

                            {botPages.map((p) => (
                                <button
                                    type="button"
                                    key={p}
                                    className="btn btn-outline-primary ripple res-hide-md"
                                    style={{ minWidth: '60px' }}
                                    onClick={() => handleChangePage(p)}
                                >
                                    {p}
                                </button>
                            ))}
                        </>
                    )}

                    <button
                        type="button"
                        disabled={pageCurrent >= pageCount}
                        className="btn btn-outline-primary ripple"
                        style={{ minWidth: '60px' }}
                        onClick={() => handleChangePage(pageCurrent + 1)}
                    >
                        Sau
                    </button>
                </div>
            </ul>
        </nav>
    );
};

export default Pagination;
