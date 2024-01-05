import { useState } from 'react';
import { getToken } from '../../../apis/auth';
import { createUserLevel } from '../../../apis/level';
import { regexTest, numberTest } from '../../../helper/test';
import Input from '../../ui/Input';
import Loading from '../../ui/Loading';
import Error from '../../ui/Error';
import Success from '../../ui/Success';
import ConfirmDialog from '../../ui/ConfirmDialog';

const AdminCreateUserLevelForm = ({ onRun = () => {} }) => {
    const [isloading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [level, setLevel] = useState({
        name: '',
        minPoint: 0,
        discount: 0,
        color: '',
        isValidName: true,
        isValidMinPoint: true,
        isValidDiscount: true,
        isValidColor: true,
    });

    const { _id, accessToken } = getToken();

    const handleChange = (name, isValidName, value) => {
        setLevel({
            ...level,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        setLevel({
            ...level,
            [isValidName]: flag,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, minPoint, discount, color } = level;
        if (!name || minPoint === '' || discount === '' || !color) {
            setLevel({
                ...level,
                isValidName: regexTest('name', name),
                isValidMinPoint:
                    numberTest('positive', minPoint) ||
                    numberTest('zero', minPoint),
                isValidDiscount: numberTest('zeroTo100', discount),
                isValidColor: regexTest('anything', color),
            });
            return;
        }

        const { isValidName, isValidMinPoint, isValidDiscount, isValidColor } =
            level;
        if (
            !isValidName ||
            !isValidMinPoint ||
            !isValidDiscount ||
            !isValidColor
        )
            return;

        setIsConfirming(true);
    };

    const onSubmit = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        createUserLevel(_id, accessToken, level)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setSuccess(data.success);
                    setLevel({
                        name: '',
                        minPoint: 0,
                        discount: 0,
                        isValidName: true,
                        isValidMinPoint: true,
                        isValidDiscount: true,
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
                    title="Tạo mới Level"
                    onSubmit={onSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            <form className="row mb-2" onSubmit={handleSubmit}>
                <div className="col-12">
                    <Input
                        type="text"
                        label="Tên Level"
                        value={level.name}
                        isValid={level.isValidName}
                        feedback="Vui lòng cung cấp tên Level hợp lệ"
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
                    <Input
                        type="number"
                        label="Điểm sàn"
                        value={level.minPoint}
                        isValid={level.isValidMinPoint}
                        feedback="Vui lòng cung cấp điểm sàn hợp lệ (>=0)"
                        validator="positive|zero"
                        onChange={(value) =>
                            handleChange('minPoint', 'isValidMinPoint', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidMinPoint', flag)
                        }
                    />
                </div>

                <div className="col-12">
                    <Input
                        type="number"
                        label="Giảm giá (%)"
                        value={level.discount}
                        isValid={level.isValidDiscount}
                        feedback="Vui lòng cung cấp tỷ lệ giảm giá hợp lệ (0% - 100%)"
                        validator="zeroTo100"
                        onChange={(value) =>
                            handleChange('discount', 'isValidDiscount', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidDiscount', flag)
                        }
                    />
                </div>

                <div className="col-12">
                    <Input
                        type="text"
                        label="Màu"
                        value={level.color}
                        isValid={level.isValidColor}
                        feedback="Vui lòng cung cấp màu hợp lệ"
                        validator="anything"
                        onChange={(value) =>
                            handleChange('color', 'isValidColor', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidColor', flag)
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

export default AdminCreateUserLevelForm;
