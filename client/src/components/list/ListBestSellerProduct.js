import { useState, useEffect } from 'react';
import { listActiveProducts } from '../../apis/product';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import ProductCard from '../card/ProductCard';

const ListBestSellerProducts = ({
    heading = 'Best Seller',
    col = 'col-xl-2-5 col-md-3 col-sm-4 col-6',
    categoryId = '',
    limit = '10',
}) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [products, setProducts] = useState([]);

    const init = () => {
        setError('');
        setIsLoading(true);
        listActiveProducts({
            search: '',
            rating: '',
            categoryId,
            minPrice: '',
            maxPrice: '',
            sortBy: 'sold',
            order: 'desc',
            limit,
            page: 1,
        })
            .then((data) => {
                if (data.error) setError(data.error);
                else setProducts(data.products);
                setIsLoading(false);
            })
            .catch((error) => {
                setError('Server Error');
                setIsLoading(false);
            });
    };

    useEffect(() => {
        init();
    }, [categoryId]);

    return (
        <div className="position-relative">
            { heading == 'Sản phẩm bán chạy' ? <h5 className='text-danger position-relative'>{heading} <span className='badge bg-danger'>Hot</span></h5> : <h5>{heading}</h5>}

            {isloading && <Loading />}
            {error && <Error msg={error} />}

            <div className="row mt-3">
                {products &&
                    products.map((product, index) => (
                        <div className={`${col} mb-4`} key={index}>
                            <ProductCard product={product}/>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ListBestSellerProducts;


