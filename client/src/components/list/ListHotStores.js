import { useState, useEffect } from 'react';
import { getlistStores } from '../../apis/store';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import StoreCard from '../card/StoreCard';

const ListHotStores = ({
    heading = 'Hot Stores',
    col = 'col-xl-2-5 col-md-3 col-sm-4 col-6',
}) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [stores, setStores] = useState([]);

    const init = () => {
        setError('');
        setIsLoading(true);
        getlistStores({
            search: '',
            sortBy: 'rating',
            sortMoreBy: 'point',
            isActive: 'true',
            order: 'desc',
            limit: 5,
            page: 1,
        })
            .then((data) => {
                if (data.error) setError(data.error);
                else setStores(data.stores);
                setIsLoading(false);
            })
            .catch((error) => {
                setError('Server Error');
                setIsLoading(false);
            });
    };

    useEffect(() => {
        init();
    }, []);

    return (
        <div className="position-relative">
            {heading && <h5>{heading}</h5>}

            {isloading && <Loading />}
            {error && <Error msg={error} />}

            <div className="row mt-3">
                {stores &&
                    stores.map((store, index) => (
                        <div className={`${col} mb-4`} key={index}>
                            <StoreCard store={store} />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ListHotStores;
