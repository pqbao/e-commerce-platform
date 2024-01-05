const ProductLicenseLabel = ({ isActive = false, detail = true }) => (
    <span className="position-relative d-inline-block">
        {isActive ? (
            <span className="badge bg-info cus-tooltip">
                <i className="fas fa-check-circle"></i>
                {detail && <span className="ms-2">licensed</span>}
            </span>
        ) : (
            <span className="badge bg-danger cus-tooltip">
                <i className="fas fa-times-circle"></i>
                {detail && <span className="ms-2">unlicensed</span>}
            </span>
        )}
        {isActive ? (
            <small className="cus-tooltip-msg">
                Sản phẩm được cấp phép
            </small>
        ) : (
            <small className="cus-tooltip-msg">
                Sản phẩm này đã bị cấm
            </small>
        )}
    </span>
);

export default ProductLicenseLabel;
