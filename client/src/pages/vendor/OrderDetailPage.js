import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import OrderDetailInfo from '../../components/info/OrderDetailInfo';
import VendorLayout from '../../components/layout/VendorLayout';

const OrderDetailPage = (props) => {
    const user = useSelector((state) => state.account.user);
    const store = useSelector((state) => state.vendor.store);
    const { orderId, storeId } = useParams();
    return (
        <VendorLayout user={user} store={store}>
            <div className="res-mx--12-md">
                <OrderDetailInfo
                    orderId={orderId}
                    storeId={storeId}
                    by="store"
                    isEditable={true}
                />

                {/* <div className="mx-4">
                    <Link
                        to={`/vendor/orders/${storeId}`}
                        className="back"
                    >
                         <i class="fa-solid fa-circle-chevron-left"></i> Back
                    </Link>
                </div> */}
            </div>
        </VendorLayout>
    );
};

export default OrderDetailPage;
