const OrderPaymentLabel = ({ isPaidBefore = false, detail = true }) => (
    <span className="position-relative d-inline-block">
        {isPaidBefore ? (
            <span className="badge bg-warning cus-tooltip">
                <i className="fab fa-paypal"></i>
                {detail && <span className="ms-2">Paypal</span>}
            </span>
        ) : (
            <span className="badge bg-primary cus-tooltip">
                <i className="fa-solid fa-hand-holding-dollar"></i>
                {detail && <span className="ms-2">Trả sau</span>}
            </span>
        )}
        {isPaidBefore ? (
            <small className="cus-tooltip-msg">Thanh toán bằng Paypal</small>
        ) : (
            <small className="cus-tooltip-msg">Thanh toán khi giao hàng</small>
        )}
    </span>
);

export default OrderPaymentLabel;
