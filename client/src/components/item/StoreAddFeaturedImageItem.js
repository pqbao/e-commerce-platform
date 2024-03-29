import Modal from '../ui/Modal';
import StoreAddFeaturedImageForm from './form/StoreAddFeaturedImageForm';

const StoreAddFeaturedImageItem = ({ count = 6, storeId = '' }) => (
    <div className="position-relative d-inline-block">
        <div className="cus-tooltip">
            <button
                type="button"
                disabled={count >= 6 ? true : false}
                className="btn btn-primary ripple text-nowrap btn-sm"
                data-bs-toggle="modal"
                data-bs-target="#add-featured-image-form"
            >
                <i className="fas fa-plus-circle"></i>
                <span className="ms-2 res-hide">Thêm ảnh nổi bật</span>
            </button>

            {count < 6 && (
                <Modal
                    id="add-featured-image-form"
                    hasCloseBtn={false}
                    title="Add new featured image"
                >
                    <StoreAddFeaturedImageForm storeId={storeId} />
                </Modal>
            )}
        </div>
        {count >= 6 && (
            <small className="cus-tooltip-msg">
                Đã đạt giới hạn ảnh tối đa là 6
            </small>
        )}
    </div>
);

export default StoreAddFeaturedImageItem;
