import Modal from '../ui/Modal';
import UserEditProfileForm from './form/UserEditProfileForm';

const UserEditProfileItem = ({ user = {} }) => (
    <div className="position-relative d-inline-block">
        <button
            type="button"
            className="btn btn-primary ripple cus-tooltip"
            data-bs-toggle="modal"
            data-bs-target="#profile-edit-form"
        >
            <i className="fas fa-pen"></i>
        </button>

        <Modal id="profile-edit-form" hasCloseBtn={false} title="Chỉnh sửa hồ sơ">
            <UserEditProfileForm
                firstname={user.firstname}
                lastname={user.lastname}
                email={user.email}
                phone={user.phone}
                id_card={user.id_card}
                googleId={user.googleId}
                facebookId={user.facebookId}
            />
        </Modal>

    </div>
);

export default UserEditProfileItem;
