import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getToken } from '../../apis/auth';
import {
    listItemsByCart,
    deleteFromCart,
    updateCartItem,
} from '../../apis/cart';
import { totalProducts } from '../../helper/total';
import { formatPrice } from '../../helper/formatPrice';
import useUpdateDispatch from '../../hooks/useUpdateDispatch';
import useToggle from '../../hooks/useToggle';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import Success from '../ui/Success';
import ConfirmDialog from '../ui/ConfirmDialog';
import DropDownMenu from '../ui/DropDownMenu';
import UserLevelLabel from '../label/UserLevelLabel';
import CheckoutForm from '../item/form/CheckoutForm';

const IMG = process.env.REACT_APP_STATIC_URL;

const ListCartItems = ({ cartId = '', storeId = '', userId = '', onRun }) => {
    const [isloading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [run, setRun] = useState(false);

    const [showCheckoutFlag, toogleShowCheckoutFlag] = useToggle(false);

    const { level } = useSelector((state) => state.account.user);
    const [updateDispatch] = useUpdateDispatch();
    const { _id, accessToken } = getToken();

    const [items, setItems] = useState([]);
    const [deleteItem, setDeleteItem] = useState({});
    const [totals, setTotals] = useState({
        totalPrice: 0,
        totalPromotionalPrice: 0,
        amountFromUser1: 0,
    });

    const init = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        listItemsByCart(_id, accessToken, cartId)
            .then(async (data) => {
                if (data.error) setError(data.error);
                else {
                    setItems(data.items);
                    const {
                        totalPrice,
                        totalPromotionalPrice,
                        amountFromUser1,
                    } = totalProducts(data.items, level);
                    setTotals({
                        totalPrice,
                        totalPromotionalPrice,
                        amountFromUser1,
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
        if (cartId) init();
    }, [cartId, storeId, userId, level, run]);

    const handleDelete = (item) => {
        if (!item) return;
        setDeleteItem(item);
        setIsConfirming(true);
    };

    const onSubmit = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        deleteFromCart(_id, accessToken, deleteItem._id)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setSuccess(data.success);
                    updateDispatch('account', data.user);
                    setRun(!run);
                    if (onRun) onRun();
                }
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                    setSuccess('');
                }, 3000);
            })
            .catch((error) => {
                setError('Server Error');
                setTimeout(() => {
                    setError('');
                }, 3000);
            });
    };

    const handleUpdate = (value, item) => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        updateCartItem(_id, accessToken, { count: value }, item._id)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setSuccess(data.success);
                    updateDispatch('account', data.user);
                    setRun(!run);
                    if (onRun) onRun();
                }
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                    setSuccess('');
                }, 3000);
            })
            .catch((error) => {
                setError('Server Error');
                setTimeout(() => {
                    setError('');
                }, 3000);
            });
    };

    return (
        <div className="position-relative">
            {isloading && <Loading />}
            {error && <Error msg={error} />}
            {success && <Success msg={success} />}
            {isConfirming && (
                <ConfirmDialog
                    title="Xoá sản phẩm"
                    color="danger"
                    onSubmit={onSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            {items.map((item, index) => (
                <div
                    key={index}
                    className="d-flex align-items-center mb-2 res-flex-column"
                >
                    <div
                        style={{
                            position: 'relative',
                            width: '300px',
                            maxWidth: '100%',
                            height: '200px',
                            maxHeight: '66.6667%',
                        }}
                    >
                        <img
                            src={
                                item.productId &&
                                IMG + item.productId.listImages[0]
                            }
                            alt={item.productId && item.productId.name}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                top: '0',
                                left: '0',
                                objectFit: 'contain',
                                borderRadius: '4px',
                            }}
                        />
                    </div>

                    <div className="flex-grow-1 d-flex flex-wrap justify-content-between align-items-center ms-4 res-m-0">
                        <div className="">
                            <Link
                                className="text-reset text-decoration-none link-hover d-block mt-1"
                                to={`/product/${
                                    item.productId && item.productId._id
                                }`}
                                title={item.productId && item.productId.name}
                            >
                                <h3 className="fs-5">
                                    {item.productId && item.productId.name}
                                </h3>
                            </Link>

                            <div className="mt-2">
                                {item.styleValueIds &&
                                    item.styleValueIds.map((value, index) => (
                                        <p className="fs-6" key={index}>
                                            {value.styleId &&
                                                value.styleId.name}
                                            : {value.name}
                                        </p>
                                    ))}
                            </div>

                            <div className="mt-2">
                                <p className="text-decoration-line-through text-muted">
                                    {item.productId &&
                                        item.productId.price &&
                                        formatPrice(
                                            item.productId &&
                                                item.productId.price
                                                    .$numberDecimal,
                                        )}{' '}
                                    VND
                                </p>

                                <h4 className="text-primary fs-5">
                                    {item.productId &&
                                        item.productId.promotionalPrice &&
                                        formatPrice(
                                            item.productId &&
                                                item.productId.promotionalPrice
                                                    .$numberDecimal,
                                        )}{' '}
                                    VND x {item.count}
                                </h4>
                            </div>

                            {item.productId && !item.productId.isActive && (
                                <Error msg="TCửa hàng này đã bị cấm bởi MultiMart" />
                            )}

                            {item.productId &&
                                item.productId.isActive &&
                                !item.productId.isSelling && (
                                    <Error msg="Sản phẩm đã ngừng kinh doanh, vui lòng xóa khỏi giỏ hàng của bạn, bạn có thể tiếp tục với những sản phẩm khác!" />
                                )}

                            {item.productId &&
                                item.productId.isActive &&
                                item.productId.isSelling &&
                                item.productId.quantity <= 0 && (
                                    <Error msg="Sản phẩm đã bán hết, vui lòng xóa khỏi giỏ hàng, bạn có thể tiếp tục với những sản phẩm khác!" />
                                )}

                            {item.productId &&
                                item.productId.isActive &&
                                item.productId.isSelling &&
                                item.productId.quantity > 0 &&
                                item.productId.quantity < item.count && (
                                    <Error
                                        msg={`Chỉ còn ${item.productId.quantity} sản phẩm, vui lòng cập nhật số lượng!`}
                                    />
                                )}
                        </div>

                        <div className="d-flex justify-content-between align-items-center my-2">
                            {item.productId &&
                                item.productId.isActive &&
                                item.productId.isSelling &&
                                item.productId.quantity > 0 && (
                                    <div className="me-2">
                                        <DropDownMenu className="mt-0"
                                            listItem={
                                                item.productId &&
                                                item.productId.quantity &&
                                                Array.from(
                                                    {
                                                        length: item.productId
                                                            .quantity,
                                                    },
                                                    (_, i) => {
                                                        return {
                                                            value: i + 1,
                                                            label: i + 1,
                                                        };
                                                    },
                                                )
                                            }
                                            resetDefault={false}
                                            value={item.count}
                                            setValue={(value) =>
                                                handleUpdate(value, item)
                                            }
                                            borderBtn={true}
                                        />
                                    </div>
                                )}

                            <button
                                type="button"
                                className="btn btn-outline-danger ripple"
                                onClick={() => handleDelete(item)}
                            >
                                <i className="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {items.reduce(
                (prev, item) =>
                    prev &&
                    item.productId &&
                    item.productId.isActive &&
                    item.productId.isSelling &&
                    item.productId.quantity > 0 &&
                    item.productId.quantity >= item.count,
                true,
            ) && (
                <div className="d-flex flex-wrap justify-content-end align-items-center mt-4 pt-1 border-top border-primary res-flex-justify-between">
                    {!showCheckoutFlag && (
                        <div className="d-flex justify-content-end align-items-center">
                            <div className="me-4">
                                <p className="text-decoration-line-through text-muted">
                                    {formatPrice(totals.totalPrice)} VND
                                </p>

                                <h4 className="text-decoration-line-through text-primary fs-5">
                                    {formatPrice(totals.totalPromotionalPrice)}{' '}
                                    VND
                                </h4>
                            </div>

                            <div className="me-4">
                                <small>
                                    <UserLevelLabel level={level} />
                                </small>

                                <h4 className="text-primary fs-5">
                                    {formatPrice(totals.amountFromUser1)} VND
                                </h4>
                            </div>
                        </div>
                    )}

                    <button
                        className={`btn ${
                            showCheckoutFlag
                                ? 'btn-primary'
                                : 'btn-outline-primary'
                        } ripple`}
                        type="button"
                        onClick={toogleShowCheckoutFlag}
                    >
                        Tiến hành thanh toán
                    </button>
                </div>
            )}

            {showCheckoutFlag && (
                <div className="mx-2 mt-1">
                    <CheckoutForm
                        cartId={cartId}
                        userId={userId}
                        storeId={storeId}
                        items={items}
                    />
                </div>
            )}
        </div>
    );
};

export default ListCartItems;
