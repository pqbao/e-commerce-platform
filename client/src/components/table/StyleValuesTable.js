import { useState, useEffect, Fragment } from 'react';
import { getToken } from '../../apis/auth';
import {
    listStyleValues,
    listActiveStyleValues,
    deleteStyleValue,
    restoreStyleValue,
} from '../../apis/style';
import DeletedLabel from '../label/DeletedLabel';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import Success from '../ui/Success';
import ConfirmDialog from '../ui/ConfirmDialog';
import Modal from '../ui/Modal';
import AddValueStyleItem from '../item/AddValueStyleItem';
import AdminEditStyleValueForm from '../item/form/AdminEditStyleValueForm';
import ActiveLabel from '../label/ActiveLabel';

const StyleValuesTable = ({
    heading = true,
    styleId = '',
    isActive = false,
}) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [isConfirming1, setIsConfirming1] = useState(false);
    const [run, setRun] = useState(false);

    const [deletedStyleValue, setDeletedStyleValue] = useState({});
    const [restoredStyleValue, setRestoredStyleValue] = useState({});
    const [editedStyleValue, setEditedStyleValue] = useState({});

    const [styleValues, setStyleValues] = useState([]);
    const [style, setStyle] = useState({});

    const { _id, accessToken } = getToken();

    const init = () => {
        setError('');
        setIsLoading(true);
        if (!isActive) {
            listStyleValues(_id, accessToken, styleId)
                .then((data) => {
                    if (data.error) setError(data.error);
                    else {
                        setStyleValues(data.styleValues);
                        setStyle(data.style);
                    }
                    setIsLoading(false);
                })
                .catch((error) => {
                    setError('Server Error');
                    setIsLoading(false);
                });
        } else {
            listActiveStyleValues(styleId)
                .then((data) => {
                    if (data.error) setError(data.error);
                    else {
                        setStyleValues(data.styleValues);
                        setStyle(data.style);
                    }
                    setIsLoading(false);
                })
                .catch((error) => {
                    setError('Server Error');
                    setIsLoading(false);
                });
        }
    };

    useEffect(() => {
        init();
    }, [styleId, run]);

    const handleDelete = (styleValue) => {
        setDeletedStyleValue(styleValue);
        setIsConfirming(true);
    };

    const handleRestore = (styleValue) => {
        setRestoredStyleValue(styleValue);
        setIsConfirming1(true);
    };

    const onSubmitDelete = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        deleteStyleValue(_id, accessToken, deletedStyleValue._id)
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
                setTimeout(() => {
                    setError('');
                }, 3000);
                setIsLoading(false);
            });
    };

    const onSubmitRestore = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        restoreStyleValue(_id, accessToken, restoredStyleValue._id)
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
                    title="Xoá giá trị Style"
                    color="danger"
                    onSubmit={onSubmitDelete}
                    onClose={() => setIsConfirming(false)}
                />
            )}
            {isConfirming1 && (
                <ConfirmDialog
                    title="Khôi phục giá trị Style"
                    onSubmit={onSubmitRestore}
                    onClose={() => setIsConfirming1(false)}
                />
            )}

            {heading && (
                <h4 className="text-center text-uppercase">
                    Giá trị của <span className="text-primary">{style.name}</span>
                </h4>
            )}

            {isloading && <Loading />}
            {error && <Error msg={error} />}
            {success && <Success msg={success} />}

            <div className="d-flex justify-content-between align-items-end">
                <AddValueStyleItem
                    styleId={styleId}
                    styleName={style.name}
                    onRun={() => setRun(!run)}
                />
                <span className="me-2 text-nowrap res-hide">
                    {styleValues.length || 0} kết quả
                </span>
            </div>

            <div className="table-scroll my-2">
                <table className="table align-middle table-hover table-sm text-center">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tên</th>
                            {!isActive && (
                                <Fragment>
                                    <th scope="col">Trạng thái</th>
                                    <th scope="col"></th>
                                </Fragment>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {styleValues.map((value, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{value.name}</td>
                                {!isActive && (
                                    <Fragment>
                                        <td>
                                            {value.isDeleted && (
                                                <small>
                                                    <DeletedLabel />
                                                </small>
                                            )}

                                            {value.isDeleted == false && (
                                                <small>
                                                    <ActiveLabel />
                                                </small>
                                            )}
                                        </td>
                                        <td className="text-nowrap">
                                            <button
                                                type="button"
                                                className="btn btn-primary ripple me-2"
                                                data-bs-toggle="modal"
                                                data-bs-target="#edit-style-value-form"
                                                onClick={() =>
                                                    setEditedStyleValue(value)
                                                }
                                            >
                                                <i className="fas fa-pen"></i>

                                            </button>

                                            {!value.isDeleted ? (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger ripple"
                                                    onClick={() =>
                                                        handleDelete(value)
                                                    }
                                                >
                                                    <i className="fas fa-trash-alt"></i>

                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary ripple"
                                                    onClick={() =>
                                                        handleRestore(value)
                                                    }
                                                >
                                                    <i class="fa-solid fa-rotate-left"></i>
                                                </button>
                                            )}
                                        </td>
                                    </Fragment>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {!isActive && (
                <Modal
                    id="edit-style-value-form"
                    hasCloseBtn={false}
                    title="Chỉnh sửa giá trị Style"
                >
                    <AdminEditStyleValueForm
                        oldStyleValue={editedStyleValue}
                        onRun={() => setRun(!run)}
                    />
                </Modal>
            )}
        </div>
    );
};

export default StyleValuesTable;
