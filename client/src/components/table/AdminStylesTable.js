import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../../apis/auth';
import { listStyles, deleteStyle, restoreStyle } from '../../apis/style';
import Pagination from '../ui/Pagination';
import SearchInput from '../ui/SearchInput';
import SortByButton from './sub/SortByButton';
import DeletedLabel from '../label/DeletedLabel';
import ActiveLabel from '../label/ActiveLabel';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import Success from '../ui/Success';
import ConfirmDialog from '../ui/ConfirmDialog';
import CategorySmallCard from '../card/CategorySmallCard';

const AdminStylesTable = ({ heading = 'Style' }) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [isConfirming1, setIsConfirming1] = useState(false);
    const [run, setRun] = useState(false);

    const [deletedStyle, setDeletedStyle] = useState({});
    const [restoredStyle, setRestoredStyle] = useState({});

    const [styles, setStyles] = useState([]);
    const [pagination, setPagination] = useState({
        size: 0,
    });
    const [filter, setFilter] = useState({
        search: '',
        sortBy: 'date',
        categoryId: '',
        order: 'asc',
        limit: 6,
        page: 1,
    });

    const { _id, accessToken } = getToken();

    const init = () => {
        setError('');
        setIsLoading(true);
        listStyles(_id, accessToken, filter)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setStyles(data.styles);
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

    const handleDelete = (style) => {
        setDeletedStyle(style);
        setIsConfirming(true);
    };

    const handleRestore = (style) => {
        setRestoredStyle(style);
        setIsConfirming1(true);
    };

    const onSubmitDelete = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        deleteStyle(_id, accessToken, deletedStyle._id)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setSuccess(data.success);
                    setRun(!run);
                }
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                    setSuccess('');
                }, 3000);
            })
            .catch((error) => {
                setError('Server Error');
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                }, 3000);
            });
    };

    const onSubmitRestore = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        restoreStyle(_id, accessToken, restoredStyle._id)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setSuccess(data.success);
                    setRun(!run);
                }
                setIsLoading(false);
                setTimeout(() => {
                    setSuccess('');
                    setError('');
                }, 3000);
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
            {isloading && <Loading />}
            {isConfirming && (
                <ConfirmDialog
                    title="Xoá Style"
                    color="danger"
                    onSubmit={onSubmitDelete}
                    onClose={() => setIsConfirming(false)}
                />
            )}
            {isConfirming1 && (
                <ConfirmDialog
                    title="Khôi phụ Style"
                    onSubmit={onSubmitRestore}
                    onClose={() => setIsConfirming1(false)}
                />
            )}

            {heading && (
                <h4 className="text-center text-uppercase">{heading}</h4>
            )}

            {isloading && <Loading />}
            {error && <Error msg={error} />}
            {success && <Success msg={success} />}

            <div className="d-flex justify-content-between align-items-end">
                <div className="option-wrap d-flex align-items-center">
                    <SearchInput onChange={handleChangeKeyword} />
                    <div className="ms-2">
                        <Link
                            type="button"
                            className="btn btn-primary ripple text-nowrap"
                            to="/admin/style/createNewStyle"
                        >
                            <i className="fas fa-plus-circle"></i>
                            <span className="ms-2 res-hide">Thêm Style</span>
                        </Link>
                    </div>
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
                                    title="Style"
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
                                    title="Thuộc danh mục"
                                    sortBy="categoryIds "
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
                                    sortBy="isDeleted"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {styles.map((style, index) => (
                            <tr key={index}>
                                <th scope="row">
                                    {index +
                                        1 +
                                        (filter.page - 1) * filter.limit}
                                </th>
                                <td>{style.name}</td>

                                <td
                                    className="text-start ps-4"
                                    style={{ maxWidth: '1000px' }}
                                >
                                    <div
                                        className=""
                                        style={{
                                            maxHeight: '200px',
                                            overflow: 'auto',
                                        }}
                                    >
                                        {style.categoryIds.map(
                                            (category, index) => (
                                                <div className="" key={index}>
                                                    <CategorySmallCard
                                                        category={category}
                                                    />
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </td>

                                <td>
                                    {style.isDeleted && <DeletedLabel />}
                                    {style.isDeleted == false && <ActiveLabel />}
                                </td>

                                <td className="text-nowrap">
                                    <Link
                                        type="button"
                                        className="btn btn-primary ripple me-2"
                                        to={`/admin/style/values/${style._id}`}
                                    >
                                        <i className="fa-solid fa-circle-plus"></i>

                                    </Link>

                                    <Link
                                        type="button"
                                        className="btn btn-primary ripple me-2"
                                        to={`/admin/style/editStyle/${style._id}`}
                                    >
                                        <i className="fas fa-pen"></i>

                                    </Link>

                                    {!style.isDeleted ? (
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger ripple"
                                            onClick={() => handleDelete(style)}
                                        >
                                            <i className="fas fa-trash-alt"></i>

                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary ripple"
                                            onClick={() => handleRestore(style)}
                                        >
                                            <i class="fa-solid fa-rotate-left"></i>

                                        </button>
                                    )}
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

export default AdminStylesTable;
