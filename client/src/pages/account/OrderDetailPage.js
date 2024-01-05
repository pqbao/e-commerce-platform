import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import AccountLayout from '../../components/layout/AccountLayout';
import OrderDetailInfo from '../../components/info/OrderDetailInfo';

const OrderDetailPage = (props) => {
    const user = useSelector((state) => state.account.user);
    const { orderId } = useParams();
    return (
        <AccountLayout user={user}>
            <div className="res-mx--12-md">
                <OrderDetailInfo orderId={orderId} />
            </div>
        </AccountLayout>
    );
};

export default OrderDetailPage;
