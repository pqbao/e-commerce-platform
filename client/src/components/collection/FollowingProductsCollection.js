import { useState, useEffect } from 'react';
import { getToken } from '../../apis/auth';
import { listFollowingProducts } from '../../apis/follow';
import ProductCard from '../card/ProductCard';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import Pagination from '../ui/Pagination';

const FollowingProductsCollection = (props) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [run, setRun] = useState(false);

    const [listProducts, setListProducts] = useState([]);
    const [pagination, setPagination] = useState({
        size: 0,
    });
    const [filter, setFilter] = useState({
        search: '',
        sortBy: 'name',
        order: 'desc',
        limit: 8,
        page: 1,
    });

    const { _id, accessToken } = getToken();

    const init = () => {
        setError('');
        setIsLoading(true);
        listFollowingProducts(_id, accessToken, filter)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setListProducts(data.products);
                    setPagination({
                        size: data.size,
                        pageCurrent: data.filter.pageCurrent,
                        pageCount: data.filter.pageCount,
                    });
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setError('Server Error');
                setIsLoading(false);
            });
    };

    useEffect(() => {
        init();
    }, [filter, run]);

    const handleChangePage = (newPage) => {
        setFilter({
            ...filter,
            page: newPage,
        });
    };

    return (
        <div className="position-relative">
            {isloading && <Loading />}
            {error && <Error msg={error} />}

            <div className="d-flex justify-content-between align-items-end">
                <h4>Sản phẩm đã thích</h4>
                <span className="me-2 text-nowrap res-hide">
                    {pagination.size || 0} kết quả
                </span>
            </div>

            <div className="container-fluid p-0 mt-3">
                <div className="row">
                    {listProducts &&
                        listProducts.map((product, index) => (
                            <div
                                className="col-lg-3 col-sm-4 col-6 mb-4"
                                key={index}
                            >
                                <ProductCard
                                    product={product}
                                    onRun={() => setRun(!run)}
                                />
                            </div>
                        ))}


                    {listProducts.length <= 0 &&
                        <div className='d-flex align-items-center justify-content-center flex-column'>
                            <img
                                src="http://localhost:8000/static/uploads/follow-empty.png"
                                style={{ width: '200px' }}
                            />
                            <div className='text-secondary'>Bạn chưa yêu thích sản phẩm nào!</div>
                        </div>
                    }
                </div>
            </div>

            {pagination.size != 0 && (
                <Pagination
                    pagination={pagination}
                    onChangePage={handleChangePage}
                />
            )}

        </div>
    );
};

export default FollowingProductsCollection;
