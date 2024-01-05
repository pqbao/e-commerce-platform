import { useState, useEffect } from 'react';
import { getToken } from '../../../apis/auth';
import { updateProduct } from '../../../apis/product';
import { regexTest, numberTest } from '../../../helper/test';
import Input from '../../ui/Input';
import TextArea from '../../ui/TextArea';
import Error from '../../ui/Error';
import Success from '../../ui/Success';
import Loading from '../../ui/Loading';
import ConfirmDialog from '../../ui/ConfirmDialog';
import CategorySelector from '../../seletor/CategorySelector';
import { Link } from 'react-router-dom';
import StyleSelector from '../../seletor/StyleSelector';

const VendorEditProductProfileForm = ({ product = {}, storeId = '' }) => {
    const [isloading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [newProduct, setNewProduct] = useState({});

    const { _id, accessToken } = getToken();

    useEffect(() => {
        setNewProduct({
            name: product.name,
            description: product.description,
            quantity: product.quantity,
            price: product.price && product.price.$numberDecimal,
            promotionalPrice:
                product.promotionalPrice &&
                product.promotionalPrice.$numberDecimal,
            categoryId: product.categoryId && product.categoryId._id,
            defaultCategory: product.categoryId,
            styleValueIds:
                product.styleValueIds &&
                product.styleValueIds.map((v) => v._id),
            defaultStyleValues: product.styleValueIds,
            isValidName: true,
            isValidDescription: true,
            isValidQuantity: true,
            isValidPrice: true,
            isValidPromotionalPrice: true,
        });
    }, [product, storeId]);

    const handleChange = (name, isValidName, value) => {
        setNewProduct({
            ...newProduct,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        setNewProduct({
            ...newProduct,
            [isValidName]: flag,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const {
            name,
            description,
            quantity,
            price,
            promotionalPrice,
            categoryId,
        } = newProduct;
        if (
            !name ||
            !description ||
            !quantity ||
            !price ||
            !promotionalPrice ||
            !categoryId
        ) {
            setNewProduct({
                ...newProduct,
                isValidName: regexTest('anything', name),
                isValidDescription: regexTest('bio', description),
                isValidQuantity: numberTest('positive|zero', quantity),
                isValidPrice: numberTest('positive|zero', price),
                promotionalPrice: numberTest('positive|zero', promotionalPrice),
            });
            return;
        }

        const {
            isValidName,
            isValidDescription,
            isValidQuantity,
            isValidPrice,
            isValidPromotionalPrice,
        } = newProduct;
        if (
            !isValidName ||
            !isValidDescription ||
            !isValidQuantity ||
            !isValidPrice ||
            !isValidPromotionalPrice
        )
            return;

        setIsConfirming(true);
    };

    const onSubmit = () => {
        const formData = new FormData();
        formData.set('name', newProduct.name);
        formData.set('description', newProduct.description);
        formData.set('quantity', newProduct.quantity);
        formData.set('price', newProduct.price);
        formData.set('promotionalPrice', newProduct.promotionalPrice);
        formData.set('categoryId', newProduct.categoryId);
        if (newProduct.styleValueIds && newProduct.styleValueIds.length > 0)
            formData.set('styleValueIds', newProduct.styleValueIds.join('|'));

        setError('');
        setSuccess('');
        setIsLoading(true);
        updateProduct(_id, accessToken, formData, product._id, storeId)
            .then((data) => {
                if (data.error) setError(data.error);
                else setSuccess(data.success);
                setIsLoading(false);
                setTimeout(() => {
                    setSuccess('');
                    setError('');
                }, 3000);
            })
            .catch((error) => {
                setError('Sever error');
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
                    title="Cập nhật thông tin sản phẩm"
                    onSubmit={onSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            <form
                className="border border-primary rounded-3 row mb-2 bg-body"
                onSubmit={handleSubmit}
            >
                <div className="col-12 bg-primary p-3">
                    <h1 className="text-white fs-5 m-0">
                        Cập nhật thông tin sản phẩm
                    </h1>
                </div>

                <div className="col-12 px-4">
                    <Input
                        type="text"
                        label="Tên sản phẩm"
                        value={newProduct.name}
                        isValid={newProduct.isValidName}
                        feedback="Vui lòng cung cấp tên sản phẩm hợp lệ"
                        validator="anything"
                        onChange={(value) =>
                            handleChange('name', 'isValidName', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidName', flag)
                        }
                    />
                </div>

                <div className="col-12 px-4">
                    <TextArea
                        type="text"
                        label="Thông tin mô tả sản phẩm"
                        value={newProduct.description}
                        isValid={newProduct.isValidDescription}
                        feedback="Vui lòng cung cấp mô tả sản phẩm hợp lệ"
                        validator="bio"
                        onChange={(value) =>
                            handleChange(
                                'description',
                                'isValidDescription',
                                value,
                            )
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidDescription', flag)
                        }
                    />
                </div>
                <div className='d-flex px-4'>
                <div className="col-4 pe-4">
                    <Input
                        type="number"
                        label="Số lượng"
                        value={newProduct.quantity}
                        isValid={newProduct.isValidQuantity}
                        feedback="Vui lòng cung cấp số lượng sản phẩm hợp lệ"
                        validator="positive|zero"
                        onChange={(value) =>
                            handleChange('quantity', 'isValidQuantity', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidQuantity', flag)
                        }
                    />
                </div>

                <div className="col-4 px-2">
                    <Input
                        type="number"
                        label="Giá gốc (VND)"
                        value={newProduct.price}
                        isValid={newProduct.isValidPrice}
                        feedback="Vui lòng cung cấp giá sản phẩm hợp lệ"
                        validator="positive|zero"
                        onChange={(value) =>
                            handleChange('price', 'isValidPrice', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidPrice', flag)
                        }
                    />
                </div>

                <div className="col-4 ps-4">
                    <Input
                        type="number"
                        label="Giá khuyến mãi (VND)"
                        value={newProduct.promotionalPrice}
                        isValid={newProduct.isValidPromotionalPrice}
                        feedback="Vui lòng cung cấp giá khuyến mãi sản phẩm hợp lệ"
                        validator="positive|zero"
                        onChange={(value) =>
                            handleChange(
                                'promotionalPrice',
                                'isValidPromotionalPrice',
                                value,
                            )
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidPromotionalPrice', flag)
                        }
                    />
                </div>
                </div>

                <div className="col-12 mt-4 px-4">
                <p className="cus-input-group-label">Chọn danh mục</p>
                    <CategorySelector
                        label="Danh mục"
                        defaultValue={newProduct.defaultCategory}
                        isActive={true}
                        isRequired={true}
                        onSet={(category) =>
                            setNewProduct({
                                ...newProduct,
                                categoryId: category._id,
                            })
                        }
                    />
                </div>

                <div className="col-12 mt-5 px-4">
                    <p className="">
                        Style{' '}
                        <small className="text-muted">
                            *cần chọn danh mục trước
                        </small>
                    </p>
                    <StyleSelector
                        label="Choosed styles"
                        defaultValue={newProduct.defaultStyleValues}
                        categoryId={newProduct.categoryId}
                        onSet={(styleValues) => {
                            setNewProduct({
                                ...newProduct,
                                styleValueIds: styleValues.map(
                                    (value) => value._id,
                                ),
                            });
                        }}
                    />
                </div>

                {error && (
                    <div className="col-12 px-4">
                        <Error msg={error} />
                    </div>
                )}

                {success && (
                    <div className="col-12 px-4">
                        <Success msg={success} />
                    </div>
                )}

                <div className="col-12 px-4 pb-3 d-flex justify-content-between align-items-center mt-4">

                    <div className="">
                        <Link
                            to={`/vendor/products/${storeId}`}
                            className="back"
                        >
                           <i className="fa-solid fa-circle-chevron-left"></i> Back
                        </Link>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary ripple res-w-100-md"
                        onClick={handleSubmit}
                        style={{ width: '40%' }}
                    >
                        Cập nhật
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VendorEditProductProfileForm;
