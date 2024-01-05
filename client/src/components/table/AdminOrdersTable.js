import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../../apis/auth';
import { listOrdersForAdmin } from '../../apis/order';
import { humanReadableDate } from '../../helper/humanReadable';
import { formatPrice } from '../../helper/formatPrice';
import Pagination from '../ui/Pagination';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import SortByButton from './sub/SortByButton';
import OrderStatusLabel from '../label/OrderStatusLabel';
import OrderPaymentLabel from '../label/OrderPaymentLabel';
import StoreSmallCard from '../card/StoreSmallCard';
import UserSmallCard from '../card/UserSmallCard';
import SearchInput from '../ui/SearchInput';

const AdminOrdersTable = ({ heading = true, status = '' }) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({
        size: 0,
    });
    const [filter, setFilter] = useState({
        search: '',
        sortBy: 'createdAt',
        order: 'desc',
        status,
        limit: 6,
        page: 1,
    });

    const { _id, accessToken } = getToken();

    const init = () => {
        setError('');
        setIsLoading(true);
        listOrdersForAdmin(_id, accessToken, filter)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setOrders(data.orders);
                    setPagination({
                        size: data.size,
                        pageCurrent: data.filter.pageCurrent,
                        pageCount: data.filter.pageCount,
                    });
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setError('Server Error');
                setIsLoading(false);
            });
    };

    useEffect(() => {
        setFilter({
            ...filter,
            status,
        });
    }, [status]);

    useEffect(() => {
        init();
    }, [filter]);

    const handleChangeKeyword = (keyword) => {
        setFilter({
            ...filter,
            search: keyword,
            page: 1,
        });
    };

    const handleChangePage = (newPage) => {
        setFilter({
            ...filter,
            page: newPage,
        });
    };

    const handleSetSortBy = (order, sortBy) => {
        setFilter({
            ...filter,
            sortBy,
            order,
        });
    };

    return (
        <div className="position-relative">
            {heading &&
                (status === '' ? (
                    <h4 className="text-center text-uppercase">
                        Đơn hàng trên hệ thống
                    </h4>
                ) : (
                    <h4 className="text-center text-uppercase">
                        Đơn hàng đang chờ vận chuyển
                    </h4>
                ))}

            {isloading && <Loading />}
            {error && <Error msg={error} />}

            <div className="d-flex justify-content-between align-items-end">
                <div className="d-flex align-items-center">
                    <SearchInput onChange={handleChangeKeyword} />
                </div>

                <span className="me-2 text-nowrap res-hide">
                    {pagination.size || 0} kết quả
                </span>
            </div>

            <div className="table-scroll my-2">
                <table className="table align-middle table-hover table-sm text-center">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Mã đơn hàng"
                                    sortBy="_id"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Ngày tạo"
                                    sortBy="createdAt"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Tổng tiền"
                                    sortBy="amountFromUser"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Người mua"
                                    sortBy="userId"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Người bán"
                                    sortBy="storeId"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Chiết khấu"
                                    sortBy="amountToGD"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Vận chuyển"
                                    sortBy="deliveryId"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Thanh toán"
                                    sortBy="isPaidBefore"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Trạng thái"
                                    sortBy="status"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>

                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={index}>
                                <th scope="row">
                                    {index +
                                        1 +
                                        (filter.page - 1) * filter.limit}
                                </th>
                                <td>
                                    <small>{order._id}</small>
                                </td>
                                <td style={{ whiteSpace: 'normal' }}>
                                    <small>
                                        {humanReadableDate(order.createdAt)}
                                    </small>
                                </td>
                                <td>
                                    <small className="text-nowrap">
                                        {order.amountFromUser &&
                                            formatPrice(
                                                order.amountFromUser
                                                    .$numberDecimal,
                                            )}{' '}
                                        VND
                                    </small>
                                </td>
                                <td
                                    className="text-start ps-2"
                                    style={{ maxWidth: '300px' }}
                                >
                                    <UserSmallCard user={order.userId} />
                                </td>
                                <td
                                    className="text-start ps-2"
                                    style={{ maxWidth: '300px' }}
                                >
                                    <StoreSmallCard store={order.storeId} />
                                </td>
                                <td>
                                    <small className="text-nowrap">
                                        Cửa hàng:{' '}
                                        {order.amountToStore &&
                                            formatPrice(
                                                order.amountToStore
                                                    .$numberDecimal,
                                            )}{' '}
                                        VND
                                    </small>
                                    <br />

                                    <small className="text-nowrap">
                                        MultiMart:{' '}
                                        {order.amountToGD &&
                                            formatPrice(
                                                order.amountToGD.$numberDecimal,
                                            )}{' '}
                                        VND
                                    </small>
                                </td>
                                <td>
                                    {order.deliveryId && (
                                        <small>
                                            {order.deliveryId.name}
                                            <br />
                                            {formatPrice(
                                                order.deliveryId.price
                                                    .$numberDecimal,
                                            )}{' '}
                                            VND
                                        </small>
                                    )}
                                </td>
                                <td>
                                    <small>
                                        <OrderPaymentLabel
                                            isPaidBefore={order.isPaidBefore}
                                        />
                                    </small>
                                </td>
                                <td>
                                    <small>
                                        <OrderStatusLabel
                                            status={order.status}
                                        />
                                    </small>
                                </td>
                                <td>
                                    <div className="position-relative d-inline-block">
                                        <div className="position-relative d-inline-block">
                                            <Link
                                                type="button"
                                                className="btn btn-primary ripple cus-tooltip"
                                                to={`/admin/order/detail/${order._id}`}
                                            >
                                                <i className="fas fa-info-circle me-2"></i>
                                                Detail
                                            </Link>
                                            
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination.size != 0 && (
                <Pagination
                    pagination={pagination}
                    onChangePage={handleChangePage}
                />
            )}
        </div>
    );
};

export default AdminOrdersTable;
