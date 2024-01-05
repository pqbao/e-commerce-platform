import Paragraph from '../ui/Paragraph';
import UserRoleLabel from '../label/UserRoleLabel';
import { humanReadableDate } from '../../helper/humanReadable';

const UserJoinedInfo = ({ user = {} }) => (
    <div className="container-fluid">
        <div className="row py-2 border border-primary rounded-3 bg-body">
            <div className="col-12">
                <Paragraph
                    label="Vai trò"
                    value={<UserRoleLabel role={user.role} />}
                />
            </div>

            <div className="col-12">
                <Paragraph
                    label="Tham gia"
                    value={humanReadableDate(user.createdAt)}
                />
            </div>
        </div>
    </div>
);

export default UserJoinedInfo;
