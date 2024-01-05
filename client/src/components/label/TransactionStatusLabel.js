const TransactionStatusLabel = ({ isUp = true, detail = true }) => (
    <span className="d-inline-block position-relative">
        <span className={`badge ${isUp ? 'bg-info' : 'bg-danger'} cus-tooltip`}>
            {isUp ? (
                <span>
                    <i className="fas fa-arrow-circle-down"></i>
                    {detail && <span className="ms-2">in</span>}
                </span>
            ) : (
                <span>
                    <i className="fas fa-arrow-circle-up"></i>
                    {detail && <span className="ms-2">out</span>}
                </span>
            )}
        </span>
    </span>
);

export default TransactionStatusLabel;
