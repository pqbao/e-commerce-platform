import Modal from '../ui/Modal';
import UserEditPasswordForm from './form/UserEditPasswordForm';

const UserEditPasswordItem = (props) => (
    <div className="position-relative d-inline-block">
        <button
            type="button"
            className="btn btn-primary ripple cus-tooltip"
            data-bs-toggle="modal"
            data-bs-target="#password-edit-form"
        >
            <i className="fas fa-key"></i>
        </button>

        <Modal
            id="password-edit-form"
            hasCloseBtn={false}
            title="Đổi mật khẩu"
        >
            <UserEditPasswordForm />
        </Modal>

    </div>
);

export default UserEditPasswordItem;
