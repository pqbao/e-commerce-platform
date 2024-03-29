import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { authsocial, setToken } from '../../../apis/auth';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import Loading from '../../ui/Loading';
import Error from '../../ui/Error';
import { gapi } from "gapi-script";

const SocialForm = (props) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const history = useHistory();

    const onSuccess = (res) => {
        if (!res.profileObj && !res.accessToken) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const data = res.profileObj || res;
        const user = {
            firstname: data.givenName || data.name.split(' ')[0],
            lastname:
                (data.familyName ? data.familyName : data.givenName) ||
                data.name.split(' ')[1],
            email: data.email,
        };

        if (data.googleId) user.googleId = data.googleId;
        if (data.userID) user.facebookId = data.userID;

        authsocial(user)
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                    setIsLoading(false);
                } else {
                    const { accessToken, refreshToken, _id, role } = data;
                    setToken({ accessToken, refreshToken, _id, role }, () => {
                        history.go(0);
                    });
                }
            })
            .catch((error) => {
                setError('Server error!');
                setIsLoading(false);
            });
    };

    const onFailure = (res) => {
        setError(res.details);
        setIsLoading(false);
    };

    const onRequest = () => {
        setIsLoading(true);
    };

    useEffect(() => {
        function start() {
          gapi.client.init({
            clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            scope: 'email',
          });
        }
    
        gapi.load('client:auth2', start);
      }, []);

    return (
        <>
            {isloading && <Loading />}
            {error && (
                <div className="col-12">
                    <Error msg={error} />
                </div>
            )}

            <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                onSuccess={onSuccess}
                onFailure={onFailure}
                onRequest={onRequest}
                cookiePolicy={'single_host_origin'}
                render={(renderProps) => (
                    <button
                        type="button"
                        className="btn btn--with-img btn-outline-primary ripple fw-bold"
                        onClick={renderProps.onClick}
                    >
                        <img
                            className="social-img me-2 rounded-circle"
                            src="https://img.icons8.com/color/48/000000/google-logo.png"
                        />
                        Tiếp tục với Google
                    </button>
                )}
            />

            <FacebookLogin
                appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                autoLoad
                fields="name,email,picture"
                onClick={onRequest}
                callback={onSuccess}
                render={(renderProps) => (
                    <button
                        type="button"
                        className="btn btn--with-img btn-outline-primary ripple fw-bold"
                        onClick={renderProps.onClick}
                    >
                        <img
                            className="social-img me-2 rounded-circle"
                            src="https://img.icons8.com/color/48/000000/facebook-new.png"
                        />
                        Tiếp tục với Facebook
                    </button>
                )}
            />
        </>
    );
};

export default SocialForm;
