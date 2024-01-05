import { formatPrice } from '../../helper/formatPrice';

const EWalletInfo = ({ eWallet = 0 }) => (
    <div className="d-inline-flex justify-content-start align-items-center link-golden fs-2">
        {/* <i className="fa-solid fa-money-bill-transfer me-2"></i> */}
        <span>Số dư: {formatPrice(eWallet)} VND</span>
    </div>
);

export default EWalletInfo;
