import { useState, useEffect } from 'react';
import { getToken } from '../../../apis/auth';
import { getProductByIdForManager } from '../../../apis/product';
import Error from '../../ui/Error';
import Loading from '../../ui/Loading';
import VendorEditProductProfileForm from './VendorEditProductProfileForm';
import VendorEditProductImagesForm from './VendorEditProductImagesForm';

const VendorEditProductForm = ({ storeId = '', productId = '' }) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [run, setRun] = useState(false);

    const [product, setProduct] = useState({});

    const init = () => {
        const { _id, accessToken } = getToken();
        setError('');
        setIsLoading(true);
        getProductByIdForManager(_id, accessToken, productId, storeId)
            .then((data) => {
                if (data.error) setError(data.error);
                else setProduct(data.product);
                setIsLoading(false);
            })
            .catch((error) => {
                setError('Server Error');
                setIsLoading(false);
            });
    };

    useEffect(() => {
        init();
    }, [productId, storeId, run]);

    return (
        <div className="p-1 position-relative">
            {isloading && <Loading />}
            {error && <Error msg={error} />}

            <div className="mb-4">
                <VendorEditProductImagesForm
                    product={product}
                    storeId={storeId}
                    onRun={() => setRun(!run)}
                />
            </div>

            <div className="mb-4">
                <VendorEditProductProfileForm
                    product={product}
                    storeId={storeId}
                />
            </div>


        </div>
    );
};

export default VendorEditProductForm;
