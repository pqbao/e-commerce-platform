import { useState, useEffect } from 'react';
import { getToken } from '../../../apis/auth';
import { addToCart } from '../../../apis/cart';
import Loading from '../../ui/Loading';
import Error from '../../ui/Error';
import Success from '../../ui/Success';
import ConfirmDialog from '../../ui/ConfirmDialog';
import StyleValueSelector from '../../seletor/StyleValueSelector';
import useUpdateDispatch from '../../../hooks/useUpdateDispatch';

const AddToCartForm = ({ product = {} }) => {
    const [isloading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [updateDispatch] = useUpdateDispatch();

    const [cartItem, setCartItem] = useState({});

    useEffect(() => {
        let defaultList = [];

        product.styleValueIds &&
            product.styleValueIds.forEach((value) => {
                let flag = true;
                defaultList.forEach((list) => {
                    if (value.styleId._id === list[0].styleId._id) {
                        list.push(value);
                        flag = false;
                    }

                    list.sort((a, b) => {
                        const nameA = a.name.toUpperCase();
                        const nameB = b.name.toUpperCase();
                        if (nameA < nameB) return -1;
                        if (nameA > nameB) return 1;
                        return 0;
                    });
                });

                if (flag) defaultList.push([value]);
            });

        const defaultStyleValues = defaultList.map((list) => list[0]);
        const defaultStyleValueIds = defaultStyleValues
            .map((value) => value._id)
            .join('|');

        setCartItem({
            storeId: product.storeId && product.storeId._id,
            productId: product._id,
            styleValueIds: defaultStyleValueIds,
            defaultStyleValues: defaultStyleValues,
            count: 1,
        });
    }, [product]);

    const handleSet = (values) => {
        setCartItem({
            ...cartItem,
            styleValueIds: values.map((value) => value._id).join('|'),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsConfirming(true);
    };

    const onSubmit = () => {
        const { _id, accessToken } = getToken();

        setError('');
        setSuccess('');
        setIsLoading(true);
        addToCart(_id, accessToken, cartItem)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setSuccess(data.success);
                    updateDispatch('account', data.user);
                }
                setTimeout(() => {
                    setError('');
                    setSuccess('');
                }, 3000);
                setIsLoading(false);
            })
            .catch((error) => {
                setError('Server Error');
                setTimeout(() => {
                    setError('');
                }, 3000);
                setIsLoading(false);
            });
    };

    return (
        <div className="position-relative">
            {isloading && <Loading />}

            {isConfirming && (
                <ConfirmDialog
                    title="Thêm vào giỏ hàng"
                    onSubmit={onSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            <form className="add-to-cart-form row">
                <div className="col-12">
                    <StyleValueSelector
                        listValues={product.styleValueIds}
                        isEditable={true}
                        defaultValue={cartItem.defaultStyleValues}
                        onSet={(values) => handleSet(values)}
                    />
                </div>

                {error && (
                    <div className="col-12">
                        <Error msg={error} />
                    </div>
                )}

                {success && (
                    <div className="col-12">
                        <Success msg={success} />
                    </div>
                )}

                <div className="col-12 d-grid mt-4">
                    <button
                        type="submit"
                        className="btn btn-primary ripple btn-lg"
                        onClick={handleSubmit}
                    >
                        <i className="fa-solid fa-bag-shopping"></i>
                        <span className='ms-2' style={{ fontSize: '1.1rem' }}>Thêm Vào Giỏ Hàng</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddToCartForm;
