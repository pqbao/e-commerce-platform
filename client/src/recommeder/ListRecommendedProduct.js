import { useState, useEffect } from 'react';
import { listRecommendProducts } from '../apis/product';
import Loading from '../components/ui/Loading';
import Error from '../components/ui/Error';
import ProductCard from '../components/card/ProductCard';

const ListRecommendedProduct = ({
    heading = 'Recommend',
    col = 'col-xl-2 col-md-3 col-sm-4 col-6',
    productIds = [], // Danh sách các ID sản phẩm cần so sánh
    limit = '100',
}) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [products, setProducts] = useState([]);

    const init = () => {
        setError('');
        setIsLoading(true);

        // Gọi API để lấy tất cả sản phẩm
        listRecommendProducts({
            search: '',
            rating: '',
            minPrice: '',
            maxPrice: '',
            sortBy: 'sold',
            order: 'desc',
            limit, // Lấy tất cả sản phẩm
            page: 1
        })
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                    setIsLoading(false);
                } else {
                    // Lọc sản phẩm dựa trên danh sách productIds
                    const filteredProducts = data.products.filter(product => productIds.includes(product._id));
                    setProducts(filteredProducts);
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                setError('Server Error');
                setIsLoading(false);
            });
    };

    useEffect(() => {
        init();
    }, [productIds]); 

    return (
        <div className="">
            {isloading && <Loading />}
            {error && <Error msg={error} />}

            <div className="row mt-3">
                {products &&
                    products.map((product, index) => (
                        <div className={`mb-4`} key={index}>
                            <ProductCard product={product} />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ListRecommendedProduct;
