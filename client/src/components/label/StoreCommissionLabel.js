const StoreCommissionLabel = ({ commission = {}, detail = true }) => (
    <span className="position-relative d-inline-block">
        {commission.name === 'Company' && 
            <span className="badge bg-primary cus-tooltip">
                <i className="fa-solid fa-city"></i>
                {detail && <span className="ms-2">{commission.name}</span>}
            </span>
        }

        {commission.name !== 'Company' && 
            <span className="badge bg-primary cus-tooltip">
                <i className="fa-solid fa-store"></i>
                {detail && <span className="ms-2">{commission.name}</span>}
            </span>
        }



        {!detail ? (
            <small className="cus-tooltip-msg">{commission.name}</small>
        ) : (
            <small className="cus-tooltip-msg">
                {commission.name &&
                    commission.name.charAt(0).toUpperCase() +
                        commission.name.slice(1)}{' '}
                - Phí:{' '}
                {commission.cost && commission.cost.$numberDecimal}% / đơn hàng
            </small>
        )}
    </span>
);

export default StoreCommissionLabel;
