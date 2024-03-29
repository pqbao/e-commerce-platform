import { useState } from 'react';
import { getToken } from '../../../apis/auth';
import { createDelivery } from '../../../apis/delivery';
import { regexTest, numberTest } from '../../../helper/test';
import TextArea from '../../ui/TextArea';
import Input from '../../ui/Input';
import Loading from '../../ui/Loading';
import Error from '../../ui/Error';
import Success from '../../ui/Success';
import ConfirmDialog from '../../ui/ConfirmDialog';

const AdminCreateDeliveryForm = ({ onRun = () => {} }) => {
    const [isloading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [delivery, setDelivery] = useState({
        name: '',
        description: '',
        price: 1000,
        isValidName: true,
        isValidDescription: true,
        isValidPrice: true,
    });

    const { _id, accessToken } = getToken();

    const handleChange = (name, isValidName, value) => {
        setDelivery({
            ...delivery,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        setDelivery({
            ...delivery,
            [isValidName]: flag,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, description, price } = delivery;
        if (!name || !description || !price) {
            setDelivery({
                ...delivery,
                isValidName: regexTest('name', name),
                isValidDescription: regexTest('bio', description),
                isValidPrice: numberTest('positive', price),
            });
            return;
        }

        const { isValidName, isValidDescription, isValidPrice } = delivery;
        if (!isValidName || !isValidDescription || !isValidPrice) return;

        setIsConfirming(true);
    };

    const onSubmit = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        createDelivery(_id, accessToken, delivery)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setSuccess(data.success);
                    setDelivery({
                        name: '',
                        description: '',
                        price: 1000,
                        isValidName: true,
                        isValidDescription: true,
                        isValidPrice: true,
                    });
                    if (onRun) onRun();
                }
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                    setSuccess('');
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
                    title="Tạo đơn vị vận chuyển"
                    onSubmit={onSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            <form className="row mb-2" onSubmit={handleSubmit}>
                <div className="col-12">
                    <Input
                        type="text"
                        label="Tên đơn vị vận chuyển"
                        value={delivery.name}
                        isValid={delivery.isValidName}
                        feedback="Vui lòng cung cấp tên đơn vị vận chuyển hợp lệ"
                        validator="level"
                        onChange={(value) =>
                            handleChange('name', 'isValidName', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidName', flag)
                        }
                    />
                </div>

                <div className="col-12">
                    <TextArea
                        type="text"
                        label="Mô tả"
                        value={delivery.description}
                        isValid={delivery.isValidDescription}
                        feedback="Vui lòng cung cấp mô tả hợp lệ"
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

                <div className="col-12">
                    <Input
                        type="number"
                        label="Giá (VND)"
                        value={delivery.price}
                        isValid={delivery.isValidPrice}
                        feedback="Vui lòng cung cấp giá hợp lệ(>0)."
                        validator="positive"
                        onChange={(value) =>
                            handleChange('price', 'isValidPrice', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidPrice', flag)
                        }
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
                        className="btn btn-primary ripple"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminCreateDeliveryForm;
