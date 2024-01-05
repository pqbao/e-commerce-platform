import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../../apis/auth';
import { listStoresByUser } from '../../apis/store';
import StoreSmallCard from '../card/StoreSmallCard';
import ManagerRoleLabel from '../label/ManagerRoleLabel';
import StoreLicenseLabel from '../label/StoreLicenseLabel';
import StoreStatusLabel from '../label/StoreStatusLabel';
import Pagination from '../ui/Pagination';
import SearchInput from '../ui/SearchInput';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import SortByButton from './sub/SortByButton';

const UserStoresTable = ({ heading = 'Cửa hàng của bạn' }) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [stores, setStores] = useState([]);
    const [pagination, setPagination] = useState({
        size: 0,
    });
    const [filter, setFilter] = useState({
        search: '',
        sortBy: 'name',
        sortMoreBy: 'rating',
        order: 'asc',
        limit: 6,
        page: 1,
    });

    const { _id, accessToken } = getToken();

    const init = () => {
        setError('');
        setIsLoading(true);
        listStoresByUser(_id, accessToken, filter)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setStores(data.stores);
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
            {heading && (
                <h4 className="text-center text-uppercase">{heading}</h4>
            )}

            {isloading && <Loading />}
            {error && <Error msg={error} />}

            <div className="d-flex justify-content-between align-items-end">
                <div className="d-flex align-items-center">
                    <SearchInput onChange={handleChangeKeyword} />
                    <div className="ms-2">
                        <Link
                            type="button"
                            className="btn btn-primary ripple text-nowrap"
                            to="/account/storeManager/createNewStore"
                        >
                            <i className="fas fa-plus-circle"></i>
                            <span className="ms-2 res-hide">Tạo cửa hàng</span>
                        </Link>
                    </div>
                </div>
                <span className="me-2 text-nowrap res-hide">
                    {pagination.size || 0} kết quả
                </span>
            </div>

            <div className="table-scroll my-2">
                <table className="table table-sm table-hover align-middle text-center">
                    <thead>
                        <tr>
                            <th scope="col">
                                <SortByButton
                                    currentSortBy={filter.sortBy}
                                    title="#"
                                    sortBy="point"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentSortBy={filter.sortBy}
                                    title="Cửa hàng"
                                    sortBy="name"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentSortBy={filter.sortBy}
                                    title="Vai trò"
                                    sortBy="ownerId"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentSortBy={filter.sortBy}
                                    title="Giấy phép"
                                    sortBy="isActive"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentSortBy={filter.sortBy}
                                    title="Trạng thái"
                                    sortBy="isOpen"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>

                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map((store, index) => (
                            <tr key={index}>
                                <th scope="row">
                                    {index +
                                        1 +
                                        (filter.page - 1) * filter.limit}
                                </th>
                                <td className="text-start ps-4">
                                    <small>
                                        <StoreSmallCard store={store} />
                                    </small>
                                </td>
                                <td className="text-start ps-5">
                                    <small>
                                        <ManagerRoleLabel
                                            role={
                                                _id == store.ownerId._id
                                                    ? 'owner'
                                                    : 'staff'
                                            }
                                        />
                                    </small>
                                </td>
                                <td className="text-start ps-5">
                                    <small>
                                        <StoreLicenseLabel
                                            isActive={store.isActive}
                                        />
                                    </small>
                                </td>
                                <td className="text-start ps-5">
                                    <small>
                                        <StoreStatusLabel
                                            isOpen={store.isOpen}
                                        />
                                    </small>
                                </td>
                                <td>
                                    <Link
                                        type="button"
                                        className="btn btn-primary ripple"
                                        to={`/vendor/${store._id}`}
                                    >
                                        <i className="fas fa-user-tie"></i>
                                        <span className="ms-2 res-hide">
                                            Dashboard
                                        </span>
                                    </Link>
                                </td>
                            </tr>
                        ))}

                        {stores <= 0 && (
                            <tr>
                                <td colSpan={6}>Chưa có cửa hàng nào!</td>
                            </tr>
                        )}
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

export default UserStoresTable;
