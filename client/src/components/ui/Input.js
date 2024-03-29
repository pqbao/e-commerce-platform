import { useState } from 'react';
import useToggle from '../../hooks/useToggle';
import { regexTest, numberTest } from '../../helper/test';

const Input = ({
    onChange = () => {},
    onValidate = () => {},
    type = 'text',
    value = '',
    label = 'Enter something',
    validator = 'anything',
    isValid = true,
    isDisabled = false,
    accept = '*/*',
    feedback = 'Please provide a valid value',
    min = 0,
}) => {
    const [tempValue, setTempValue] = useState('');
    const [showPasswordFlag, togglePasswordFlag] = useToggle(true);

    const onHandleChange = (e) => {
        if (type == 'file') {
            onChange(e.target.files[0]);
            setTempValue(e.target.value);
        } else {
            onChange(e.target.value);
        }
    };

    const onHandleBlur = (e) => {
        if (type == 'file') {
            return;
        } else if (type == 'number') {
            const validatorArray = validator.split('|');
            const test = validatorArray
                .map((v) => numberTest(v, e.target.value))
                .reduce((prev, curr) => prev || curr);
            onValidate(test);
        } else {
            const validatorArray = validator.split('|');
            const test = validatorArray
                .map((v) => regexTest(v, e.target.value))
                .reduce((prev, curr) => prev || curr);
            onValidate(test);
        }
    };

    return (
        <div className="cus-input-group">
            <label
                className={`cus-input-group-label ${
                    type == 'file' ? 'cus-input-group-label--file' : ''
                }`}
            >
                {label}
            </label>
            <input
                type={
                    type == 'password'
                        ? showPasswordFlag
                            ? 'password'
                            : 'text'
                        : type
                }
                min={type === 'number' ? min : undefined}
                required
                disabled={isDisabled}
                accept={accept}
                className={`input-style form-control ${
                    isValid ? '' : 'is-invalid'
                }
                    ${
                        type == 'password'
                            ? 'cus-input-group-input--password'
                            : ''
                    } 
                    ${type == 'file' ? 'cus-input-group-input--file' : ''}`}
                onChange={onHandleChange}
                onBlur={onHandleBlur}
                value={type == 'file' ? tempValue : value}
            />
            
            <span className="cus-input-group-bar"></span>
            <small className="invalid-tooltip">{feedback}</small>
            {type == 'password' && (
                <i
                    className={`show-hide-password-icon fas ${
                        showPasswordFlag ? 'fa-eye' : ' fa-eye-slash'
                    }`}
                    onClick={togglePasswordFlag}
                ></i>
            )}
        </div>
    );
};

export default Input;


// import { useState } from 'react';
// import useToggle from '../../hooks/useToggle';
// import { regexTest, numberTest } from '../../helper/test';

// const Input = ({
//     onChange = () => {},
//     onValidate = () => {},
//     type = 'text',
//     value = '',
//     label = 'Enter something',
//     validator = 'anything',
//     isValid = true,
//     isDisabled = false,
//     accept = '*/*',
//     feedback = 'Please provide a valid value',
//     min = 0,
// }) => {
//     const [tempValue, setTempValue] = useState('');
//     const [showPasswordFlag, togglePasswordFlag] = useToggle(true);

//     const onHandleChange = (e) => {
//         if (type == 'file') {
//             onChange(e.target.files[0]);
//             setTempValue(e.target.value);
//         } else {
//             onChange(e.target.value);
//         }
//     };

//     const onHandleBlur = (e) => {
//         if (type == 'file') {
//             return;
//         } else if (type == 'number') {
//             const validatorArray = validator.split('|');
//             const test = validatorArray
//                 .map((v) => numberTest(v, e.target.value))
//                 .reduce((prev, curr) => prev || curr);
//             onValidate(test);
//         } else {
//             const validatorArray = validator.split('|');
//             const test = validatorArray
//                 .map((v) => regexTest(v, e.target.value))
//                 .reduce((prev, curr) => prev || curr);
//             onValidate(test);
//         }
//     };

//     return (
//         <div className="cus-input-group">
//             <input
//                 type={
//                     type == 'password'
//                         ? showPasswordFlag
//                             ? 'password'
//                             : 'text'
//                         : type
//                 }
//                 min={type === 'number' ? min : undefined}
//                 required
//                 disabled={isDisabled}
//                 accept={accept}
//                 className={`cus-input-group-input form-control ${
//                     isValid ? '' : 'is-invalid'
//                 }
//                     ${
//                         type == 'password'
//                             ? 'cus-input-group-input--password'
//                             : ''
//                     } 
//                     ${type == 'file' ? 'cus-input-group-input--file' : ''}`}
//                 onChange={onHandleChange}
//                 onBlur={onHandleBlur}
//                 value={type == 'file' ? tempValue : value}
//             />
//             <label
//                 className={`cus-input-group-label ${
//                     type == 'file' ? 'cus-input-group-label--file' : ''
//                 }`}
//             >
//                 {label}
//             </label>
//             <span className="cus-input-group-bar"></span>
//             <small className="invalid-feedback">{feedback}</small>
//             {type == 'password' && (
//                 <i
//                     className={`show-hide-password-icon fas ${
//                         showPasswordFlag ? 'fa-eye' : ' fa-eye-slash'
//                     }`}
//                     onClick={togglePasswordFlag}
//                 ></i>
//             )}
//         </div>
//     );
// };

// export default Input;
