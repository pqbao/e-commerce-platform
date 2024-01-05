import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AccountLayout from '../../components/layout/AccountLayout';
import UserLevelInfo from '../../components/info/UserLevelInfo';
import UserProfileInfo from '../../components/info/UserProfileInfo';
import UserJoinedInfo from '../../components/info/UserJoinedInfo';
import Cover from '../../components/image/Cover';
import Avatar from '../../components/image/Avatar';

const ProfilePage = (props) => {
    const user = useSelector((state) => state.account.user);
    return (
        <AccountLayout user={user}>
            <div className="res-mx--12-md">
                <div className="position-relative px-2">
                    <Cover
                        cover={user.cover}
                        alt={user.firstname + ' ' + user.lastname}
                        isEditable="user"
                    />
                    <div className="avatar-absolute avatar-absolute--store">
                        <Avatar
                            avatar={user.avatar}
                            name={user.firstname + ' ' + user.lastname}
                            alt={user.firstname + ' ' + user.lastname}
                            bodername={true}
                            isEditable="user"
                        />
                    </div>
                    <div className="level-group-absolute level-group-absolute--small res-hide">
                        <UserLevelInfo user={user} />
                    </div>
                </div>

                <div className="d-flex justify-content-end m-2 mb-3">
                    <Link
                        className="btn btn-outline-primary ripple btn-sm"
                        to={`/user/${user._id}`}
                        target="_blank"
                    >
                        <i className="me-2 fa-solid fa-chalkboard-user"></i>
                        <span className="res-hide">Xem trang của tôi</span>
                    </Link>
                </div>

                <div className="mt-1 d-none res-dis">
                    <UserLevelInfo user={user} border={false} />
                </div>

                <div className="mt-1">
                    <UserProfileInfo user={user} isEditable={true} />
                </div>

                <div className="mt-1">
                    <UserJoinedInfo user={user} />
                </div>
            </div>
        </AccountLayout>
    );
};

export default ProfilePage;
