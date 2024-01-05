import { useState, useEffect } from 'react';
import { getToken } from '../../apis/auth';
import {
    listProductsForAdmin,
    activeProduct as activeOrInactive,
} from '../../apis/product';
import { humanReadableDate } from '../../helper/humanReadable';
import Pagination from '../ui/Pagination';
import SearchInput from '../ui/SearchInput';
import SortByButton from './sub/SortByButton';
import ProductSmallCard from '../card/ProductSmallCard';
import StoreSmallCard from '../card/StoreSmallCard';
import ProductStatusLabel from '../label/ProductStatusLabel';
import StarRating from '../label/StarRating';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import ConfirmDialog from '../ui/ConfirmDialog';

const AdminProductsTable = ({ heading = true, isActive = true }) => {
    const [isloading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');
    const [run, setRun] = useState('');

    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({
        size: 0,
    });
    const [filter, setFilter] = useState({
        search: '',
        sortBy: 'name',
        isActive,
        order: 'asc',
        limit: 6,
        page: 1,
    });

    const [activeProduct, setActiveProduct] = useState({});

    const { _id, accessToken } = getToken();

    const init = () => {
        setError('');
        setIsLoading(true);
        listProductsForAdmin(_id, accessToken, filter)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setProducts(data.products);
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
        init();
    }, [filter, run]);

    useEffect(() => {
        setFilter({
            ...filter,
            isActive,
        });
    }, [isActive]);

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

    const handleActiveProduct = (product) => {
        setActiveProduct(product);
        setIsConfirming(true);
    };

    const onSubmit = () => {
        setError('');
        setIsLoading(true);
        const value = { isActive: !activeProduct.isActive };
        activeOrInactive(_id, accessToken, value, activeProduct._id)
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                    setTimeout(() => {
                        setError('');
                    }, 3000);
                } else setRun(!run);
                setIsLoading(false);
            })
            .catch((error) => {
                setError('Server Error');
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                }, 3000);
            });
    };

    return (
        <div className="position-relative">
            {heading && (
                <h4 className="text-center text-uppercase">
                    {isActive ? 'Sản phẩm được cấp phép' : 'Sản phẩm không được cấp phép'}
                </h4>
            )}

            {isloading && <Loading />}
            {error && <Error msg={error} />}
            {isConfirming && (
                <ConfirmDialog
                    title={
                        !activeProduct.isActive
                            ? 'Cấp phép bán'
                            : 'Không cấp phép bán'
                    }
                    color={!activeProduct.isActive ? 'primary' : 'danger'}
                    onSubmit={onSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            <div className="d-flex justify-content-between align-items-end">
                <div className="option-wrap d-flex align-items-center">
                    <SearchInput onChange={handleChangeKeyword} />
                </div>
                <span className="me-2 text-nowrap res-hide">
                    {pagination.size || 0} kết quả
                </span>
            </div>

            <div className="table-scroll my-2">
                <table className="table align-middle table-hover table-bordered table-sm text-center">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Sản phẩm"
                                    sortBy="name"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Cửa hàng"
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
                                    title="Xếp hạng"
                                    sortBy="rating"
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
                                    sortBy="isSelling"
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

                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <th scope="row">
                                    {index +
                                        1 +
                                        (filter.page - 1) * filter.limit}
                                </th>
                                <td
                                    className="text-start"
                                    style={{ whiteSpace: 'normal' }}
                                >
                                    <ProductSmallCard product={product} />
                                </td>
                                <td className="text-start">
                                    <StoreSmallCard store={product.storeId} />
                                </td>
                                <td>
                                    <small>
                                        <StarRating stars={product.rating} />
                                    </small>
                                </td>
                                <td>
                                    <small>
                                        <ProductStatusLabel
                                            isSelling={product.isSelling}
                                        />
                                    </small>
                                </td>
                                <td>
                                    <small>
                                        {humanReadableDate(product.createdAt)}
                                    </small>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className={`btn ${
                                            !product.isActive
                                                ? 'btn-outline-primary'
                                                : 'btn-outline-danger'
                                        } ripple cus-tooltip`}
                                        onClick={() =>
                                            handleActiveProduct(product)
                                        }
                                    >
                                        {!product.isActive ? (
                                            <>
                                                <i className="far fa-check-circle"></i>
                                                <span className="ms-2 res-hide">
                                                    License
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-ban"></i>
                                                <span className="ms-2 res-hide">
                                                    Ban
                                                </span>
                                            </>
                                        )}
                                    </button>
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

export default AdminProductsTable;
