import { useState, useEffect } from 'react';
import { listActiveStyleValues } from '../../apis/style';
import Error from '../ui/Error';
import Loading from '../ui/Loading';
import AddValueStyleItem from '../item/AddValueStyleItem';

const MultiStyleValueSelector = ({
    defaultValue = '',
    categoryId = '',
    styleId = '',
    styleName = '',
    onSet,
}) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [run, setRun] = useState('');

    const [values, setValues] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);

    const init = () => {
        setError('');
        setIsLoading(true);
        listActiveStyleValues(styleId)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setValues(data.styleValues);
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setError('Server error');
                setIsLoading(false);
            });
    };

    useEffect(() => {
        init();

        const oldArray = selectedValues;
        const newArray = [];

        setSelectedValues(newArray);
        if (onSet) onSet(oldArray, newArray);
    }, [styleId, categoryId]);

    useEffect(() => {
        init();
    }, [run]);

    useEffect(() => {
        if (defaultValue) {
            const oldArray = selectedValues;
            const newArray = defaultValue.filter(
                (v) => v.styleId._id === styleId,
            );

            setSelectedValues(newArray);
            if (onSet) onSet(oldArray, newArray);
        }
    }, [defaultValue]);

    const handleChoose = (value) => {
        const oldArray = selectedValues;
        const temp = oldArray.map((e) => e._id);

        if (temp.indexOf(value._id) === -1) {
            const newArray = [...oldArray, value];
            setSelectedValues(newArray);
            if (onSet) onSet(oldArray, newArray);
        }
    };

    const handleRemove = (index) => {
        const oldArray = selectedValues;
        const newArray = [
            ...oldArray.slice(0, index),
            ...oldArray.slice(index + 1),
        ];

        setSelectedValues(newArray);
        if (onSet) onSet(oldArray, newArray);
    };

    return (
        <div className="position-relative">
            {isloading && <Loading />}
            {error && <Error msg={error} />}

            <div className="position-relative mt-4">
                <label
                    className="position-absolute text-primary labels"
                    style={{
                        // fontSize: '0.8rem',
                        // left: '12px',
                        top: '-16px',
                    }}
                >
                    {styleName}
                </label>

                <div className="">
                    {selectedValues && selectedValues.length > 0 ? (
                        selectedValues.map((value, index) => (
                            <span
                                key={index}
                                className=" d-inline-flex align-items-center mt-3 me-4"
                            >
                                <span className="border border-2 ps-1 rounded" style={{fontSize: '13px'}}>
                                    {value.name}

                                    <button
                                    type="button"
                                    className="btn btn-danger btn-sm ripple ms-1"
                                    onClick={() => handleRemove(index)}
                                    style={{ height: '30px', width: '30px'}}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                                </span>
                                
                            </span>
                        ))
                    ) : (
                        <span className="text-danger" style={{fontSize: '13px'}}>Chưa chọn {styleName}</span>
                    )}

                    <div
                        className="mt-2"
                        style={{
                            maxHeight: '200px',
                            overflow: 'auto',
                        }}
                    >
                        <div className="list-group">
                            {values.map((value, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`list-group-item ripple list-group-item-action ${
                                        selectedValues &&
                                        selectedValues
                                            .map((v) => v._id)
                                            .indexOf(value._id) !== -1 &&
                                        'active'
                                    }`}
                                    onClick={() => handleChoose(value)}
                                >
                                    {value.name}
                                </button>
                            ))}

                            <span className="list-group-item">
                                <AddValueStyleItem
                                    styleId={styleId}
                                    styleName={styleName}
                                    onRun={() => setRun(!run)}
                                    isFullWidth={true}
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MultiStyleValueSelector;
