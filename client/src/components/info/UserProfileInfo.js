import Paragraph from '../ui/Paragraph';
import PhoneActiveButton from '../button/PhoneActiveButton';
import EmailActiveButton from '../button/EmailActiveButton';
import UserEditProfileItem from '../item/UserEditProfileItem';
import UserEditPasswordItem from '../item/UserEditPasswordItem';

const UserProfileInfo = ({ user = {}, isEditable = false }) => (
    <div className="container-fluid">
        <div className="row py-2 border border-primary rounded-3 bg-body">
            <div className="col-sm-6">
                <Paragraph label="Họ" value={user.firstname} />
            </div>

            <div className="col-sm-6">
                <Paragraph label="Tên" value={user.lastname} />
            </div>

            {!isEditable ? (
                <div className="col-sm-6">
                    <Paragraph label="Email" value={user.email || '-'} />
                </div>
            ) : (
                <>
                    <div className="col-sm-6">
                        <Paragraph label="Email" value={user.email || '-'} />
                    </div>


                    <div className="col-sm-6 mt-4 ps-4">
                        <EmailActiveButton
                            // email={user.email}
                            // isEmailActive={user.isEmailActive}
                            googleId={user.googleId}
                            facebookId={user.facebookId}
                        />
                    </div>
                </>
            )}

            {!isEditable ? (
                <div className="col-sm-6">
                    <Paragraph label="Phone" value={user.phone || '-'} />
                </div>
            ) : (
                <>
                    <div className="col-sm-6">
                        <Paragraph label="Số điện thoại" value={user.phone || '-'} />
                    </div>

                    {/* <div className="col-sm-6 mt-2 ps-4">
                        <PhoneActiveButton
                            phone={user.phone}
                            isPhoneActive={user.isPhoneActive}
                        />
                    </div> */}
                </>
            )}

            <div className="col-sm-6">
                <Paragraph label="CMND/CCCD" value={user.id_card || '-'} />
            </div>

            {isEditable && (
                <div className="col-12 d-flex justify-content-end">
                    <UserEditProfileItem user={user} />

                    {!user.googleId && !user.facebookId && (
                        <div className="ms-1">
                            <UserEditPasswordItem />
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
);

export default UserProfileInfo;
