import { useState, useEffect } from 'react';
import { getToken } from '../../../apis/auth';
import { updateCommission } from '../../../apis/commission';
import { regexTest, numberTest } from '../../../helper/test';
import Input from '../../ui/Input';
import TextArea from '../../ui/TextArea';
import Loading from '../../ui/Loading';
import Error from '../../ui/Error';
import Success from '../../ui/Success';
import ConfirmDialog from '../../ui/ConfirmDialog';

const AdminEditCommissionForm = ({ oldCommission = '', onRun = () => {} }) => {
    const [isloading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [commission, setCommission] = useState({
        name: oldCommission.name,
        description: oldCommission.description,
        cost: oldCommission.cost && oldCommission.cost.$numberDecimal,
        isValidName: true,
        isValidDescription: true,
        isValidCost: true,
    });

    const { _id, accessToken } = getToken();

    useEffect(() => {
        setCommission({
            name: oldCommission.name,
            description: oldCommission.description,
            cost: oldCommission.cost && oldCommission.cost.$numberDecimal,
            isValidName: true,
            isValidDescription: true,
            isValidCost: true,
        });
    }, [oldCommission]);

    const handleChange = (name, isValidName, value) => {
        setCommission({
            ...commission,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        setCommission({
            ...commission,
            [isValidName]: flag,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, description, cost } = commission;
        if (!name || !description || cost === '') {
            setCommission({
                ...commission,
                isValidName: regexTest('name', name),
                isValidDescription: regexTest('bio', description),
                isValidCost: numberTest('zeroTo100', cost),
            });
            return;
        }

        const { isValidName, isValidDescription, isValidCost } = commission;
        if (!isValidName || !isValidDescription || !isValidCost) return;

        setIsConfirming(true);
    };

    const onSubmit = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        updateCommission(_id, accessToken, oldCommission._id, commission)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setSuccess(data.success);
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
                    title="Cập nhật chiết khấu"
                    onSubmit={onSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            <form className="row mb-2" onSubmit={handleSubmit}>
                <div className="col-12">
                    <Input
                        type="text"
                        label="Quy mô cửa hàng"
                        value={commission.name}
                        isValid={commission.isValidName}
                        feedback="Vui lòng cung cấp quy mô cửa hàng hợp lệ"
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
                        value={commission.description}
                        isValid={commission.isValidDescription}
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
                        label="Mức phí (%)"
                        value={commission.cost}
                        isValid={commission.isValidCost}
                        feedback="Vui lòng cung cấp mức phí hợp lệ (0%-100%)."
                        validator="zeroTo100"
                        onChange={(value) =>
                            handleChange('cost', 'isValidCost', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidCost', flag)
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
                        Cập nhật
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminEditCommissionForm;
