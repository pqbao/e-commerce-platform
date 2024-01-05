import { useState, useEffect } from 'react';
import { getToken } from '../../apis/auth';
import { Link } from 'react-router-dom';
import {
    getOrderByUser,
    getOrderByStore,
    getOrderForAdmin,
} from '../../apis/order';
import { humanReadableDate } from '../../helper/humanReadable';
import { formatPrice } from '../../helper/formatPrice';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import OrderStatusLabel from '../label/OrderStatusLabel';
import Paragraph from '../ui/Paragraph';
import UserSmallCard from '../card/UserSmallCard';
import StoreSmallCard from '../card/StoreSmallCard';
import ListOrderItems from '../list/ListOrderItems';
import VendorUpdateOrderStatus from '../button/VendorUpdateOrderStatus';
import AdminUpdateOrderStatus from '../button/AdminUpdateOrderStatus';
import UserCancelOrderButton from '../button/UserCancelOrderButton';

const OrderDetailInfo = ({
    orderId = '',
    storeId = '',
    by = 'user',
    isEditable = false,
}) => {
    const [isloading, setIsLoading] = useState(false);
    const [run, setRun] = useState(false);
    const [error, setError] = useState('');

    const [order, setOrder] = useState({});

    const { _id, accessToken } = getToken();

    const init = () => {
        setError('');
        setIsLoading(true);
        if (by === 'store')
            getOrderByStore(_id, accessToken, orderId, storeId)
                .then((data) => {
                    if (data.error) setError(data.error);
                    else setOrder(data.order);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setError('Server Error');
                    setIsLoading(false);
                });
        else if (by === 'admin')
            getOrderForAdmin(_id, accessToken, orderId)
                .then((data) => {
                    if (data.error) setError(data.error);
                    else setOrder(data.order);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setError('Server Error');
                    setIsLoading(false);
                });
        else
            getOrderByUser(_id, accessToken, orderId)
                .then((data) => {
                    if (data.error) setError(data.error);
                    else setOrder(data.order);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setError('Server Error');
                    setIsLoading(false);
                });
    };

    useEffect(() => {
        init();
    }, [orderId, storeId, by, run]);

    return (
        <div className="position-relative">
            {isloading && <Loading />}

            <div className="d-flex flex-wrap justify-content-start align-items-center">
                <h4 className="mx-3"><span className='badge bg-primary'>Mã đơn hàng</span> #{order._id}</h4>

                {(!isEditable ||
                    (isEditable &&
                        by === 'store' &&
                        order.status !== 'Not processed' &&
                        order.status !== 'Processing') ||
                    (isEditable &&
                        by === 'admin' &&
                        order.status !== 'Shipped')) && (
                        <span className="fs-6 mx-4 mb-2">
                            <OrderStatusLabel status={order.status} />
                        </span>
                    )}

                {by === 'user' && order.status === 'Not processed' && (
                    <div className="mx-4 mb-2">
                        <UserCancelOrderButton
                            orderId={order._id}
                            status={order.status}
                            detail={true}
                            createdAt={order.createdAt}
                            onRun={() => setRun(!run)}
                        />
                    </div>
                )}

                {isEditable &&
                    by === 'store' &&
                    (order.status === 'Not processed' ||
                        order.status === 'Processing') && (
                        <div className="mx-4 mb-2">
                            <VendorUpdateOrderStatus
                                storeId={storeId}
                                orderId={orderId}
                                status={order.status}
                                onRun={() => setRun(!run)}
                            />
                        </div>
                    )}

                {isEditable && by === 'admin' && order.status === 'Shipped' && (
                    <div className="mx-4 mb-2">
                        <AdminUpdateOrderStatus
                            storeId={storeId}
                            orderId={orderId}
                            status={order.status}
                            onRun={() => setRun(!run)}
                        />
                    </div>
                )}
            </div>

            {error && <Error msg={error} />}

            <div className="container-fluid mb-2">
                <div className="row py-2 border border-primary rounded-3 bg-body">
                    <div className="col-sm-6">
                        <Paragraph
                            label="Ngày tạo"
                            value={humanReadableDate(order.createdAt)}
                        />
                    </div>

                    <div className="col-sm-6">
                        <Paragraph
                            label="Cửa hàng bán"
                            value={<StoreSmallCard store={order.storeId} />}
                        />
                    </div>
                </div>
            </div>

            <div className="container-fluid mb-2">
                <div className="row py-2 border border-primary rounded-3 bg-body">
                    <div className="col-sm-6">
                        <Paragraph
                            label="Người nhận"
                            value={<UserSmallCard user={order.userId} />}
                        />
                    </div>

                    <div className="col-sm-6">
                        <Paragraph label="Số điện thoại" value={order.phone} />
                    </div>

                    <div className="col-12">
                        <Paragraph label="Đến địa chỉ" value={order.address} />
                    </div>
                </div>
            </div>

            <div className="container-fluid mb-2">
                <div className="row py-2 border border-primary rounded-3 bg-body">
                    {order.deliveryId && (
                        <div className="col-12">
                            <Paragraph
                                label="Đơn vị vận chuyển"
                                value={
                                    <span>
                                        {order.deliveryId.name} -{' '}
                                        {order.deliveryId.price.$numberDecimal}{' '}
                                        VND
                                    </span>
                                }
                            />
                        </div>
                    )}

                    <div className="col-12">
                        <Paragraph
                            label="Hình thức thanh toán"
                            value={
                                order.isPaidBefore
                                    ? 'Thanh toán trực tuyến - Paypal'
                                    : 'Thanh toán khi nhận hàng'
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="container-fluid mb-2">
                <div className="row py-2 border border-primary rounded-3 bg-body position-relative">
                    <ListOrderItems
                        orderId={orderId}
                        storeId={storeId}
                        by={by}
                        status={order.status}
                    />

                    <div className="col-12 mt-2 d-flex justify-content-end ">
                        <div className="me-4">
                            {/* <Paragraph
                                label="Final total (include discounts)"
                                value={
                                    <span className="text-primary fw-bold fs-5">
                                        {formatPrice(
                                            order.amountFromUser &&
                                                order.amountFromUser
                                                    .$numberDecimal,
                                        )}{' '}
                                        VND
                                    </span>
                                }
                            /> */}

                            <h4>Tổng thanh toán
                            <span className='d-block fs-6 fw-normal'>Đã bao gồm giảm giá & vận chuyển</span>
                            </h4>

                            {/* <div className='d-flex'> */}
                            <div className="mx-4 position-absolute start-0">
                                <Link
                                    to={`/vendor/orders/${storeId}`}
                                    className="back"
                                >
                                    <i class="fa-solid fa-circle-chevron-left"></i> Back
                                </Link>
                            </div>
                            
                            <span className="text-danger fw-bold fs-4">
                                {formatPrice(
                                    order.amountFromUser &&
                                    order.amountFromUser
                                        .$numberDecimal,
                                )}{' '}
                                VND
                            </span>
                            {/* </div> */}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailInfo;
