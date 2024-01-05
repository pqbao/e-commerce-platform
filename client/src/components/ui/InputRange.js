import { useState } from 'react';

const InputRange = ({
    onChange = () => {},
    onValidate = () => {},
    type = 'text',
    value = '',
    isValid = true,
    isDisabled = false,
    min = 0,
}) => {
    const onHandleChange = (e) => {

        if (type === 'number') {
            const numericValue = e.target.value.replace(/[^0-9]/g, '');
            onChange(numericValue);
        } else {
            onChange(e.target.value);
        }
    };

    const onHandleBlur = (e) => {
        if (type === 'number') {
            const isValidNumber = validateNumber(e.target.value);
            onValidate(isValidNumber);
        }
    };

    const validateNumber = (number) => {
        return parseFloat(number) >= min;
    };

    
    const formatCurrency = (value) => {
        const formatted = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
        
        // Loại bỏ ký tự đ phía sau
        return formatted.replace(/[^0-9.,]/g, '');
    };

    return (
        <div className="">
            <input
                type={type === 'number' ? 'text' : type}
                inputMode={type === 'number' ? 'numeric' : 'text'}
                pattern={type === 'number' ? '[0-9]*' : undefined}
                required
                disabled={isDisabled}
                className={`input-range form-control`}
                onChange={onHandleChange}
                onBlur={onHandleBlur}
                value={formatCurrency(value)}
            />
        </div>
    );
};

export default InputRange;
