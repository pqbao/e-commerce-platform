import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../../apis/auth';
import { listOrdersForAdmin, listOrdersByStore } from '../../apis/order';
import {
    listProductsForAdmin,
    listProductsForManager,
} from '../../apis/product';
import { listUserForAdmin } from '../../apis/user';
import { listStoresForAdmin } from '../../apis/store';
import { groupByDate, groupByJoined, groupBySold } from '../../helper/groupBy';
import { humanReadableDate } from '../../helper/humanReadable';
import LineChart from './LineChart';
import BarChart from './BarChart';
import DoughnutChart from './DoughnutChart';
import DropDownMenu from '../ui/DropDownMenu';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import UserSmallCard from '../card/UserSmallCard';
import StoreSmallCard from '../card/StoreSmallCard';
import ProductSmallCard from '../card/ProductSmallCard';

const groupByFunc = {
    order: groupByDate,
    product: groupBySold,
    user: groupByJoined,
    store: groupByJoined,
};

const titles = {
    order: 'Sales statistics by orders',
    product: 'Sales statistics by products',
    user: 'Statistics of new users',
    store: 'Statistics of new stores',
};

const ListStatisticsItems = ({ by = 'admin', storeId = '' }) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [items, setItems] = useState({
        order: [],
        product: [],
        user: [],
        store: [],
    });
    const [sizes, setSizes] = useState({
        order: 0,
        product: 0,
        user: 0,
        store: 0,
    });
    const [options, setOptions] = useState({
        flag: 'order',
        by: 'hours',
        sliceEnd: 6,
        type: 'line',
    });

    const { _id, accessToken } = getToken();

    const adminInit = async () => {
        setError('');
        setIsLoading(true);
        try {
            const orderData = await listOrdersForAdmin(_id, accessToken, {
                search: '',
                limit: 1000,
                sortBy: 'createdAt',
                order: 'desc',
                page: 1,
                status: 'Delivered',
            });

            const productData = await listProductsForAdmin(_id, accessToken, {
                search: '',
                sortBy: 'sold',
                isActive: 'true',
                order: 'desc',
                limit: 1000,
                page: 1,
            });

            const userData = await listUserForAdmin(_id, accessToken, {
                search: '',
                sortBy: 'point',
                order: 'desc',
                limit: 1000,
                page: 1,
                role: 'user',
            });

            const storeData = await listStoresForAdmin(_id, accessToken, {
                search: '',
                sortBy: 'point',
                sortMoreBy: 'rating',
                isActive: 'true',
                order: 'desc',
                limit: 1000,
                page: 1,
            });

            setItems({
                ...items,
                order: orderData.orders.reverse(),
                product: productData.products,
                user: userData.users,
                store: storeData.stores,
            });

            setSizes({
                ...sizes,
                order: orderData.size,
                product: productData.size,
                user: userData.size,
                store: storeData.size,
            });
        } catch (e) {
            setError('Server Error');
        }

        setIsLoading(false);
    };

    const vendorInit = async () => {
        setError('');
        setIsLoading(true);

        try {
            const orderData = await listOrdersByStore(
                _id,
                accessToken,
                {
                    search: '',
                    limit: 1000,
                    sortBy: 'createdAt',
                    order: 'desc',
                    page: 1,
                    status: 'Delivered',
                },
                storeId,
            );

            const productData = await listProductsForManager(
                _id,
                accessToken,
                {
                    search: '',
                    sortBy: 'sold',
                    isActive: 'true',
                    order: 'desc',
                    limit: 1000,
                    page: 1,
                },
                storeId,
            );

            setItems({
                ...items,
                order: orderData.orders.reverse(),
                product: productData.products,
            });

            setSizes({
                ...sizes,
                order: orderData.size,
                product: productData.size,
            });
        } catch (e) {
            setError('Server Error');
        }

        setIsLoading(false);
    };

    useEffect(() => {
        if (by === 'admin') adminInit();
        else vendorInit();
    }, [by, storeId]);

    return (
        <div className="position-relative">
            {isloading && <Loading />}
            {error && <Error msg={error} />}
            <div className="container-fluid px-2 mb-2">
                <div className="row">
                    {by === 'admin' && (
                        <>
                            <div className="col-md-3 col-6">
                                <button
                                    type="button"
                                    className={`btn ${options.flag === 'user'
                                            ? 'btn-outline-primary border-2'
                                            : 'bg-white border-2'
                                        } btn-lg ripple w-100 p-3 mb-2 bg-white`}
                                    onClick={() =>
                                        setOptions({
                                            ...options,
                                            flag: 'user',
                                        })
                                    }
                                >
                                    <div className='d-flex align-items-center'>
                                        <div className='badge bg-primary position-relative d-flex justify-content-center align-items-center' style={{ width: '50px', height: '50px' }}>
                                            <i className="fas fa-user-friends fs-4"></i>
                                        </div>

                                        <div className='ms-4'>
                                            <p className="fs-6 text-dark">Người dùng</p>
                                            <p className="text-start fs-4 text-primary fw-bold">{sizes.user}</p>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            <div className="col-md-3 col-6">
                                <button
                                    type="button"
                                    className={`btn ${options.flag === 'store'
                                            ? 'btn-outline-success border-2'
                                            : 'bg-white border-2'
                                        } btn-lg ripple w-100 p-3 mb-2 bg-white`}
                                    onClick={() =>
                                        setOptions({
                                            ...options,
                                            flag: 'store',
                                        })
                                    }
                                >
                                    <div className='d-flex align-items-center'>
                                        <div className='badge bg-success position-relative d-flex justify-content-center align-items-center' style={{ width: '50px', height: '50px' }}>
                                            <i className="fas fa-store fs-4"></i>
                                        </div>

                                        <div className='ms-4'>
                                            <p className="fs-6 text-dark">Cửa hàng</p>
                                            <p className="text-start fs-4 text-success fw-bold">{sizes.store}</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </>
                    )}

                    <div className="col-md-3 col-6">
                        <button
                            type="button"
                            className={`btn ${
                                options.flag === 'product'
                                    ? 'btn-outline-warning border-2'
                                    : 'bg-white border-2'
                            } btn-lg ripple w-100 p-3 mb-2 bg-white`}
                            onClick={() =>
                                setOptions({
                                    ...options,
                                    flag: 'product',
                                })
                            }
                        >
                           <div className='d-flex align-items-center'>
                                <div className='badge bg-warning position-relative d-flex justify-content-center align-items-center' style={{width: '50px', height:'50px'}}>
                                    <i className="fa-solid fa-box-open fs-4"></i>
                                </div>

                                <div className='ms-4'>
                                    <p className="fs-6 text-dark">Sản phẩm</p>
                                    <p className="text-start fs-4 text-warning fw-bold">{sizes.product}</p>
                                </div>
                            </div>
                        </button>
                    </div>

                    <div className="col-md-3 col-6">
                        <button
                            type="button"
                            className={`btn ${
                                options.flag === 'order'
                                ? 'btn-outline-danger border-2'
                                : 'bg-white border-2'
                        } btn-lg ripple w-100 p-3 mb-2 bg-white`}
                            onClick={() =>
                                setOptions({
                                    ...options,
                                    flag: 'order',
                                })
                            }
                        >

                            <div className='d-flex align-items-center'>
                                <div className='badge bg-pink position-relative d-flex justify-content-center align-items-center' style={{width: '50px', height:'50px'}}>
                                    <i className="fa-solid fa-file-lines fs-4"></i>
                                </div>

                                <div className='ms-4'>
                                    <p className="fs-6 text-dark">Đơn hàng</p>
                                    <p className="text-start fs-4 text-danger fw-bold">{sizes.order}</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="container-fluid px-3">
                <div className="row">
                    <div className="col-xl-6 col-lg-6 bg-body rounded">
                        <form className="d-flex">
                            {options.flag !== 'product' ? (
                                <div className="m-2">
                                    <DropDownMenu
                                        listItem={[
                                            {
                                                label: 'Giờ',
                                                value: 'hours',
                                                icon: (
                                                    <i className="fa-solid fa-clock"></i>
                                                ),
                                            },
                                            {
                                                label: 'Ngày',
                                                value: 'date',
                                                icon: (
                                                    <i className="fas fa-calendar-day"></i>
                                                ),
                                            },
                                            {
                                                label: 'Tháng',
                                                value: 'month',
                                                icon: (
                                                    <i className="fas fa-calendar-alt"></i>
                                                ),
                                            },
                                            {
                                                label: 'Năm',
                                                value: 'year',
                                                icon: (
                                                    <i className="fas fa-calendar-minus"></i>
                                                ),
                                            },
                                        ]}
                                        value={options.by}
                                        setValue={(value) =>
                                            setOptions({
                                                ...options,
                                                by: value,
                                            })
                                        }
                                        label="Thống kê theo"
                                        borderBtn={true}
                                    />
                                </div>
                            ) : (
                                <div className="m-2">
                                    <DropDownMenu
                                        listItem={[
                                            {
                                                label: '6 sản phẩm',
                                                value: 6,
                                            },
                                            {
                                                label: '10 sản phẩm',
                                                value: 10,
                                            },
                                            {
                                                label: '50 sản phẩm',
                                                value: 50,
                                            },
                                            {
                                                label: '100 sản phẩm',
                                                value: 100,
                                            },
                                        ]}
                                        value={options.sliceEnd}
                                        setValue={(value) =>
                                            setOptions({
                                                ...options,
                                                sliceEnd: value,
                                            })
                                        }
                                        label="Thống kê theo"
                                        borderBtn={true}
                                    />
                                </div>
                            )}
                            <div className='m-2'>
                                <DropDownMenu
                                    listItem={[
                                        {
                                            label: 'Line',
                                            value: 'line',
                                            icon: (
                                                <i className="fas fa-chart-line"></i>
                                            ),
                                        },
                                        {
                                            label: 'Bar',
                                            value: 'bar',
                                            icon: (
                                                <i className="fa-solid fa-chart-column"></i>
                                            ),
                                        },
                                        {
                                            label: 'Doughnut',
                                            value: 'doughnut',
                                            icon: (
                                                <i className="fas fa-chart-pie"></i>
                                            ),
                                        },
                                    ]}
                                    value={options.type}
                                    setValue={(value) =>
                                        setOptions({
                                            ...options,
                                            type: value,
                                        })
                                    }
                                    label="Loại biểu đồ"
                                    borderBtn={true}
                                />
                            </div>
                        </form>

                        <div className="m-2">
                            {options.type === 'line' && (
                                <LineChart
                                    by={options.by}
                                    items={items[options.flag]}
                                    groupBy={groupByFunc[options.flag]}
                                    title={titles[options.flag]}
                                    sliceEnd={options.sliceEnd}
                                />
                            )}
                            {options.type === 'bar' && (
                                <BarChart
                                    by={options.by}
                                    items={items[options.flag]}
                                    groupBy={groupByFunc[options.flag]}
                                    title={titles[options.flag]}
                                    sliceEnd={options.sliceEnd}
                                />
                            )}
                            {options.type === 'doughnut' && (
                                <DoughnutChart
                                    by={options.by}
                                    items={items[options.flag]}
                                    groupBy={groupByFunc[options.flag]}
                                    title={titles[options.flag]}
                                    sliceEnd={options.sliceEnd}
                                />
                            )}
                        </div>
                    </div>

                    <div className="col-xl-6 col-lg-6">
                        <h4 className="text-center">
                            {options.flag === 'user' && 'Top 6 người dùng'}
                            {options.flag === 'store' && 'Top 6 cửa hàng'}
                            {options.flag === 'product' && 'Top 6 sản phẩm'}
                            {options.flag === 'order' && 'Top 6 đơn hàng'}
                        </h4>
                        <div className="table-scroll my-2">
                            <table className="table align-middle table-hover table-sm text-center">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">
                                            {options.flag[0].toUpperCase() +
                                                options.flag.substring(1)}
                                        </th>
                                        <th scope="col">
                                            {options.flag === 'user' && 'Điểm'}
                                            {options.flag === 'store' &&
                                                'Điểm'}
                                            {options.flag === 'product' &&
                                                'Đã bán'}
                                            {options.flag === 'order' && 'Ngày tạo'}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {((options.flag === 'order') ?
                                        items[options.flag].slice(-6).reverse() :
                                        items[options.flag].slice(0,6))
                                        .map((item, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td
                                                    className="text-start"
                                                    style={{
                                                        whiteSpace: 'normal',
                                                    }}
                                                >
                                                    {options.flag ===
                                                        'user' && (
                                                        <UserSmallCard
                                                            user={item}
                                                        />
                                                    )}
                                                    {options.flag ===
                                                        'store' && (
                                                        <StoreSmallCard
                                                            store={item}
                                                        />
                                                    )}
                                                    {options.flag ===
                                                        'product' && (
                                                        <ProductSmallCard
                                                            // Css text ...
                                                            style={{
                                                                height: '28px',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: '1',
                                                                WebkitBoxOrient: 'vertical',
                                                            }}
                                                            product={item}
                                                        />
                                                    )}
                                                    {options.flag ===
                                                        'order' && (
                                                        <small>
                                                            {item._id}
                                                        </small>
                                                    )}
                                                </td>
                                                <td>
                                                    {options.flag === 'user' &&
                                                        item.point}
                                                    {options.flag === 'store' &&
                                                        item.point}
                                                    {options.flag ===
                                                        'product' && item.sold}
                                                    {options.flag ===
                                                        'order' && (
                                                        <small>
                                                            {humanReadableDate(
                                                                item.createdAt,
                                                            )}
                                                        </small>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                        {/* <div className="d-flex justify-content-end my-2">
                            <Link
                                to={`/${by}/${
                                    by === 'admin'
                                        ? options.flag
                                        : options.flag + 's/' + storeId
                                }`}
                                className="link-hover"
                            >
                                <span className="me-2 res-hide">
                                    Đến trang {options.flag}
                                </span>
                                <i className="fas fa-external-link-alt"></i>
                            </Link>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListStatisticsItems;
