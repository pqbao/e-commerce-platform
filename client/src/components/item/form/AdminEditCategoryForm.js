import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../../../apis/auth';
import { updateCategory, getCategoryById } from '../../../apis/category';
import { regexTest } from '../../../helper/test';
import Input from '../../ui/Input';
import InputFile from '../../ui/InputFile';
import Loading from '../../ui/Loading';
import Error from '../../ui/Error';
import Success from '../../ui/Success';
import ConfirmDialog from '../../ui/ConfirmDialog';
import CategorySelector from '../../seletor/CategorySelector';

const AdminEditCategoryForm = ({ categoryId = '' }) => {
    const [isloading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [newCategory, setNewCategory] = useState({
        name: '',
        image: '',
        categoryId: '',
        defaultParentCategory: '',
        defaultSrc: '',
        isValidName: true,
        isValidImage: true,
    });

    const { _id, accessToken } = getToken();

    const init = () => {
        setError('');
        setIsLoading(true);
        getCategoryById(categoryId)
            .then((data) => {
                if (data.error) setError(data.error);
                else
                    setNewCategory({
                        name: data.category.name,
                        image: '',
                        categoryId: data.category.categoryId
                            ? data.category.categoryId._id
                            : '',
                        defaultParentCategory: data.category.categoryId
                            ? data.category.categoryId
                            : '',
                        defaultSrc: data.category.image,
                        isValidName: true,
                        isValidImage: true,
                    });
                setIsLoading(false);
            })
            .catch((error) => {
                setError('Server Error');
                setIsLoading(false);
            });
    };

    useEffect(() => {
        init();
    }, [categoryId]);

    const handleChange = (name, isValidName, value) => {
        setNewCategory({
            ...newCategory,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        setNewCategory({
            ...newCategory,
            [isValidName]: flag,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { name } = newCategory;
        if (!name) {
            setNewCategory({
                ...newCategory,
                isValidName: regexTest('anything', name),
            });
            return;
        }

        const { isValidName, isValidImage } = newCategory;
        if (!isValidName || !isValidImage) return;

        setIsConfirming(true);
    };

    const onSubmit = () => {
        const formData = new FormData();
        formData.set('name', newCategory.name);
        if (newCategory.image) formData.set('image', newCategory.image);
        if (newCategory.categoryId)
            formData.set('categoryId', newCategory.categoryId);

        setError('');
        setSuccess('');
        setIsLoading(true);
        updateCategory(_id, accessToken, categoryId, formData)
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
        <div className="p-1 position-relative">
            {isloading && <Loading />}
            {isConfirming && (
                <ConfirmDialog
                    title="Cập nhật danh mục"
                    onSubmit={onSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            <form
                className="border border-primary rounded-3 row mb-2 bg-body"
                onSubmit={handleSubmit}
            >
                <div className="col-12 bg-primary p-3">
                    <h1 className="text-white fs-5 m-0">Chỉnh sửa danh mục</h1>
                </div>

                <div className="col-12 mt-4 px-4">
                    <CategorySelector
                        label="Danh mục đã chọn"
                        selected="parent"
                        isActive={false}
                        defaultValue={newCategory.defaultParentCategory}
                        onSet={(category) =>
                            setNewCategory({
                                ...newCategory,
                                categoryId: category._id,
                            })
                        }
                    />
                </div>

                <div className="col-12 px-4 mt-2">
                    <Input
                        type="text"
                        label="Tên danh mục"
                        value={newCategory.name}
                        isValid={newCategory.isValidName}
                        feedback="Vui lòng cung cấp tên danh mục hợp lệ"
                        validator="anything"
                        onChange={(value) =>
                            handleChange('name', 'isValidName', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidName', flag)
                        }
                    />
                </div>

                <div className="col-12 px-4 mt-2">
                    <InputFile
                        label="Hình ảnh danh mục"
                        size="avatar"
                        noRadius={true}
                        defaultSrc={newCategory.defaultSrc}
                        value={newCategory.image}
                        isValid={newCategory.isValidImage}
                        feedback="Vui lòng cung cấp hình ảnh danh mục hợp lệ"
                        accept="image/jpg, image/jpeg, image/png, image/gif"
                        onChange={(value) =>
                            handleChange('image', 'isValidImage', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidImage', flag)
                        }
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

                <div className="col-12 px-4 pb-3 d-flex justify-content-between align-items-center mt-4 res-flex-reverse-md">
                    <Link
                        to="/admin/category"
                        className="back"
                        >
                            <i class="fa-solid fa-circle-chevron-left"></i> Backg
                    </Link>
                    <button
                        type="submit"
                        className="btn btn-primary ripple res-w-100-md"
                        onClick={handleSubmit}
                        style={{ width: '324px', maxWidth: '100%' }}
                    >
                        Cập nhật
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminEditCategoryForm;
