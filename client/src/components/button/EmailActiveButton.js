import { useState } from 'react';
import { getToken } from '../../apis/auth';
import { sendConfirmationEmail } from '../../apis/auth';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import Success from '../ui/Success';

const EmailActiveButton = ({
    email = '',
    isEmailActive = false,
    googleId = '',
    facebookId = '',
}) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSendEmail = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);

        const { _id, accessToken } = getToken();

        sendConfirmationEmail(_id, accessToken)
            .then((data) => {
                if (data.error) setError(data.error);
                else setSuccess(data.success);
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                    setSuccess('');
                }, 3000);
            })
            .catch((error) => {
                setError('Error server');
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                }, 3000);
            });
    };

    return (
        <div className="d-inline-flex flex-column">
            {email && isEmailActive && (
                <div className="position-relative d-inline-block">
                    <span className="badge bg-primary cus-tooltip">
                        <i className="fas fa-check-circle me-2"></i>
                        verified
                    </span>
                    <small className="cus-tooltip-msg">Email Verified</small>   
                </div>
            )}

            {(googleId || facebookId) && (
                <div className="position-relative d-inline-block">
                    <span className="badge bg-primary d-inline-flex align-items-end cus-tooltip cus-tooltip">
                        {googleId && (
                            <div className='d-flex align-items-center'> 
                                <img
                                className="social-img rounded-circle me-1 social-img--small"
                                src="https://img.icons8.com/color/48/000000/google-logo.png"
                            />
                            <span>Google</span>
                            </div>
                        )}
                        {facebookId && (
                           <div className='d-flex align-items-center'>
                             <img
                                className="social-img rounded-circle me-1 social-img--small"
                                src="https://img.icons8.com/color/48/000000/facebook-new.png"
                            />
                            <span>Facebook</span>
                           </div>
                        )}
                        
                    </span>
                    <small className="cus-tooltip-msg">
                        Email được liên kết không thể chỉnh sửa
                    </small>
                </div>
            )}

            {email && !isEmailActive && (
                <div className="position-relative d-inline-block">
                    {isloading && <Loading size="small" />}
                    <button
                        className="btn btn-warning btn-sm text-white cus-tooltip ripple"
                        onClick={handleSendEmail}
                    >
                        <i className="fas fa-paper-plane me-2"></i>
                        Xác thực
                    </button>
                    {error && (
                        <span>
                            <Error msg={error} />
                        </span>
                    )}
                    {success && (
                        <span className="text-nowrap">
                            <Success msg={success} />
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default EmailActiveButton;
