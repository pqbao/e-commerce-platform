const PhoneActiveItem = ({ phone = '', isPhoneActive = false }) => {
    return (
        <>
            {phone && isPhoneActive && (
                <div className="position-relative d-inline-block">
                    <span className="badge bg-primary cus-tooltip">
                        <i className="fas fa-check-circle me-2"></i>
                        verified
                    </span>
                    <small className="cus-tooltip-msg">
                        Phone number Verified
                    </small>
                </div>
            )}

            {phone && !isPhoneActive && (
                <div className="position-relative d-inline-block">
                    <div className="temp cus-tooltip">
                        <button
                            disabled
                            className="btn btn-warning btn-sm text-white cus-tooltip ripple"
                            onClick={() => {}}
                        >
                            <i className="fas fa-sms me-2"></i>
                            Xác thực
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default PhoneActiveItem;
