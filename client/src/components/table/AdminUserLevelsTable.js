import { useState, useEffect } from 'react';
import { getToken } from '../../apis/auth';
import {
    listUserLevels,
    deleteUserLevel,
    restoreUserLevel,
} from '../../apis/level';
import Pagination from '../ui/Pagination';
import SearchInput from '../ui/SearchInput';
import SortByButton from './sub/SortByButton';
import UserLevelLabel from '../label/UserLevelLabel';
import DeletedLabel from '../label/DeletedLabel';
import AdminCreateUserLevelItem from '../item/AdminCreateUserLevelItem';
import AdminEditUserLevelForm from '../item/form/AdminEditUserLevelForm';
import Modal from '../ui/Modal';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import Success from '../ui/Success';
import ConfirmDialog from '../ui/ConfirmDialog';
import ActiveLabel from '../label/ActiveLabel';

const AdminUserLevelsTable = ({ heading = 'Level người dùng' }) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [isConfirming1, setIsConfirming1] = useState(false);
    const [run, setRun] = useState(false);

    const [editedLevel, setEditedLevel] = useState({});
    const [deletedLevel, setDeletedLevel] = useState({});
    const [restoredLevel, setRestoredLevel] = useState({});

    const [levels, setLevels] = useState([]);
    const [pagination, setPagination] = useState({
        size: 0,
    });
    const [filter, setFilter] = useState({
        search: '',
        sortBy: 'name',
        order: 'asc',
        limit: 6,
        page: 1,
    });

    const { _id, accessToken } = getToken();

    const init = () => {
        setError('');
        setIsLoading(true);
        listUserLevels(_id, accessToken, filter)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setLevels(data.levels);
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

    const handleEditLevel = (level) => {
        setEditedLevel(level);
    };

    const handleDeleteLevel = (level) => {
        setDeletedLevel(level);
        setIsConfirming(true);
    };

    const handleRestoreLevel = (level) => {
        setRestoredLevel(level);
        setIsConfirming1(true);
    };

    const onSubmitDelete = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        deleteUserLevel(_id, accessToken, deletedLevel._id)
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

    const onSubmitRestore = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        restoreUserLevel(_id, accessToken, restoredLevel._id)
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

    return (
        <div className="position-relative">
            {isloading && <Loading />}
            {isConfirming && (
                <ConfirmDialog
                    title="Xoá Level"
                    message={
                        <span>
                            Bạn chắc chắn muốn xoá{' '}
                            <UserLevelLabel level={deletedLevel} />
                        </span>
                    }
                    color="danger"
                    onSubmit={onSubmitDelete}
                    onClose={() => setIsConfirming(false)}
                />
            )}
            {isConfirming1 && (
                <ConfirmDialog
                    title="Khôi phục Level"
                    message={
                        <span>
                        Bạn chắc chắn muốn khôi phục{' '}
                            <UserLevelLabel level={restoredLevel} />
                        </span>
                    }
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
                    {/* <SearchInput onChange={handleChangeKeyword} /> */}
                    <div>
                        <AdminCreateUserLevelItem onRun={() => setRun(!run)} />
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
                                    title="Tên Level"
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
                                    title="Điểm sàn"
                                    sortBy="minPoint"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Giảm giá (%)"
                                    sortBy="discount"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Màu"
                                    sortBy="color"
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
                        {levels.map((level, index) => (
                            <tr key={index}>
                                <th scope="row">
                                    {index +
                                        1 +
                                        (filter.page - 1) * filter.limit}
                                </th>
                                <td>
                                    <small>
                                        <UserLevelLabel level={level} />
                                    </small>
                                </td>
                                <td>
                                    <small>{level.minPoint}</small>
                                </td>
                                <td>
                                    <small>
                                        {level.discount &&
                                            level.discount.$numberDecimal}
                                        %
                                    </small>
                                </td>
                                <td>
                                    <small>{level.color}</small>
                                </td>
                                <td>
                                    <small>
                                        {level.isDeleted && <DeletedLabel />}
                                    </small>

                                    <small>
                                        {level.isDeleted == false && <ActiveLabel />}
                                    </small>
                                </td>
                                <td className="text-center">
                                    <button
                                        type="button"
                                        className="btn btn-primary ripple me-2"
                                        data-bs-toggle="modal"
                                        data-bs-target="#edit-level-form"
                                        onClick={() => handleEditLevel(level)}
                                    >
                                        <i className="fas fa-pen"></i>

                                    </button>

                                    {!level.isDeleted ? (
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger ripple cus-tooltip"
                                            onClick={() =>
                                                handleDeleteLevel(level)
                                            }
                                        >
                                            <i className="fas fa-trash-alt"></i>

                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary ripple cus-tooltip"
                                            onClick={() =>
                                                handleRestoreLevel(level)
                                            }
                                        >
                                            <i className="fa-solid fa-rotate-left"></i>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal id="edit-level-form" hasCloseBtn={false} title="Chỉnh sửa Level">
                <AdminEditUserLevelForm
                    oldLevel={editedLevel}
                    onRun={() => setRun(!run)}
                />
            </Modal>

            {pagination.size != 0 && (
                <Pagination
                    pagination={pagination}
                    onChangePage={handleChangePage}
                />
            )}
        </div>
    );
};

export default AdminUserLevelsTable;
