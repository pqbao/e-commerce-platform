import { useState, useEffect } from 'react';
import { getToken } from '../../apis/auth';
import {
    listCommissions,
    deleteCommission,
    restoreCommission,
} from '../../apis/commission';
import Pagination from '../ui/Pagination';
import SearchInput from '../ui/SearchInput';
import SortByButton from './sub/SortByButton';
import StoreCommissionLabel from '../label/StoreCommissionLabel';
import DeletedLabel from '../label/DeletedLabel';
import AdminCreateCommissionItem from '../item/AdminCreateCommissionItem';
import AdminEditCommissionForm from '../item/form/AdminEditCommissionForm';
import Modal from '../ui/Modal';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import Success from '../ui/Success';
import ConfirmDialog from '../ui/ConfirmDialog';
import ActiveLabel from '../label/ActiveLabel';

const AdminCommissionTable = ({ heading = 'Chiết khấu bán hàng' }) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [isConfirming1, setIsConfirming1] = useState(false);
    const [run, setRun] = useState(false);

    const [editedCommission, setEditedCommission] = useState({});
    const [deletedCommission, setDeletedCommission] = useState({});
    const [restoredCommission, setRestoredCommission] = useState({});

    const [commissions, setCommissions] = useState([]);
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
        listCommissions(_id, accessToken, filter)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setCommissions(data.commissions);
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

    const handleEditCommission = (commission) => {
        setEditedCommission(commission);
    };

    const handleDeleteCommission = (commission) => {
        setDeletedCommission(commission);
        setIsConfirming(true);
    };

    const handleRestoreCommission = (commission) => {
        setRestoredCommission(commission);
        setIsConfirming1(true);
    };

    const onSubmitDelete = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        deleteCommission(_id, accessToken, deletedCommission._id)
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
        restoreCommission(_id, accessToken, restoredCommission._id)
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
                    title="Xoá chiết khấu"
                    message={
                        <span>
                            Bạn chắc chắn muốn xoá{' '}
                            <StoreCommissionLabel
                                commission={deletedCommission}
                            />
                        </span>
                    }
                    color="danger"
                    onSubmit={onSubmitDelete}
                    onClose={() => setIsConfirming(false)}
                />
            )}
            {isConfirming1 && (
                <ConfirmDialog
                    title="Khôi phục chiết khấu"
                    message={
                        <span>
                            bạn chắc chắn muốn khôi phục{' '}
                            <StoreCommissionLabel
                                commission={restoredCommission}
                            />
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
                        <AdminCreateCommissionItem onRun={() => setRun(!run)} />
                    </div>
                </div>
                <span className="me-2 text-nowrap res-hide">
                    {pagination.size || 0} kết quả
                </span>
            </div>

            <div className="table-scroll my-2">
                <table className="table table-hover table-sm align-middle text-center">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Tên"
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
                                    title="Mức phí"
                                    sortBy="cost"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Mô tả"
                                    sortBy="description"
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
                        {commissions.map((commission, index) => (
                            <tr key={index}>
                                <th scope="row">
                                    {index +
                                        1 +
                                        (filter.page - 1) * filter.limit}
                                </th>
                                <td>
                                    <small>
                                        <StoreCommissionLabel
                                            commission={commission}
                                        />
                                    </small>
                                </td>
                                <td>
                                    <small>
                                        {commission.cost &&
                                            commission.cost.$numberDecimal}
                                        %
                                    </small>
                                </td>
                                <td>
                                    <div
                                        style={{
                                            width: '300px',
                                            maxHeight: '200px',
                                            overflow: 'auto',
                                        }}
                                    >
                                        <small>{commission.description}</small>
                                    </div>
                                </td>
                                <td>
                                    <small>
                                        {commission.isDeleted && (
                                            <DeletedLabel />
                                        )}
                                    </small>

                                    <small>
                                        {commission.isDeleted == false && (
                                            <ActiveLabel />
                                        )}
                                    </small>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-primary ripple me-2"
                                        data-bs-toggle="modal"
                                        data-bs-target="#edit-commission-form"
                                        onClick={() =>
                                            handleEditCommission(commission)
                                        }
                                    >
                                        <i className="fas fa-pen"></i>
                                    </button>

                                    {!commission.isDeleted ? (
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger ripple"
                                            onClick={() =>
                                                handleDeleteCommission(
                                                    commission,
                                                )
                                            }
                                        >
                                            <i className="fas fa-trash-alt"></i>

                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary ripple"
                                            onClick={() =>
                                                handleRestoreCommission(
                                                    commission,
                                                )
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

            <Modal
                id="edit-commission-form"
                hasCloseBtn={false}
                title="Cập nhật chiết khấu"
            >
                <AdminEditCommissionForm
                    oldCommission={editedCommission}
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

export default AdminCommissionTable;
