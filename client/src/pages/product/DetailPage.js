import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getToken } from '../../apis/auth';
import { getProduct } from '../../apis/product';
import {
    getNumberOfFollowersForProduct,
    checkFollowingProduct,
} from '../../apis/follow';
import { formatPrice } from '../../helper/formatPrice';
import MainLayout from '../../components/layout/MainLayout';
import Loading from '../../components/ui/Loading';
import Error from '../../components/ui/Error';
import Carousel from '../../components/image/Carousel';
import StarRating from '../../components/label/StarRating';
import FollowProductButton from '../../components/button/FollowProductButton';
import AddToCartForm from '../../components/item/form/AddToCartForm';
import Paragraph from '../../components/ui/Paragraph';
import CategorySmallCard from '../../components/card/CategorySmallCard';
import StoreSmallCard from '../../components/card/StoreSmallCard';
import ListBestSellerProducts from '../../components/list/ListBestSellerProduct';
import ListProductsByStore from '../../components/list/ListProductsByStore';
import SigninButton from '../../components/item/SigninItem';
import ListReviews from '../../components/list/ListReviews';
import RecommendationAPI from '../../recommeder/RecommendationAPI';


const DetailPage = () => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [product, setProduct] = useState({});
    const { productId } = useParams();
    const [showStoreInfo, setShowStoreInfo] = useState(false);
    const [productIds, setProductIds] = useState([]);


    const a = [
        '653681c1b6a74a2cda023db6',
        '653532aca0f5c9826c5b8aa2',
        '65353c60a0f5c9826c5b8ee0',
        '65354e6ba0f5c9826c5b93c9',
        '65367544b6a74a2cda0233cb',
        '6539034fc91f1d13803be319',
        '65390947c91f1d13803bec3a'
    ];

    const init = () => {
        setError('');
        setIsLoading(true);
        getProduct(productId)
            .then(async (data) => {
                if (data.error) setError(data.error);
                else if (
                    data.product &&
                    data.product.storeId &&
                    !data.product.storeId.isActive
                )
                    setError('This store is banned by GoodDeal!');
                else {
                    const newProduct = data.product;
                    //get count followers
                    try {
                        const res = await getNumberOfFollowersForProduct(
                            newProduct._id,
                        );
                        newProduct.numberOfFollowers = res.count;
                    } catch {
                        newProduct.numberOfFollowers = 0;
                    }

                    //check follow
                    try {
                        const { _id, accessToken } = getToken();
                        const res = await checkFollowingProduct(
                            _id,
                            accessToken,
                            newProduct._id,
                        );
                        newProduct.isFollowing = res.success ? true : false;
                    } catch {
                        newProduct.isFollowing = false;
                    }

                    setProduct(newProduct);
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
    }, [productId]);


    useEffect(() => {
        const fetchData = async () => {
            setError('');
            setIsLoading(true);
            try {
                const productData = await getProduct(productId);
                if (productData.error) {
                    setError(productData.error);
                } else {
                    const newProduct = productData.product;
                    // Lấy số lượng người theo dõi sản phẩm
                    try {
                        const res = await getNumberOfFollowersForProduct(
                            newProduct._id
                        );
                        newProduct.numberOfFollowers = res.count;
                    } catch (error) {
                        newProduct.numberOfFollowers = 0;
                    }
                    // Kiểm tra sản phẩm đã được theo dõi chưa
                    try {
                        const { _id, accessToken } = getToken();
                        const res = await checkFollowingProduct(
                            _id,
                            accessToken,
                            newProduct._id
                        );
                        newProduct.isFollowing = res.success ? true : false;
                    } catch (error) {
                        newProduct.isFollowing = false;
                    }
                    setProduct(newProduct);
                }
            } catch (error) {
                setError('Server Error');
            }
            setIsLoading(false);
        };

        fetchData();
    }, [productId]);

    return (
        <div className='bg-body'>
            <MainLayout>
                <div className="position-relative">
                    {isloading && <Loading />}
                    {error ? (
                        <Error msg={error} />
                    ) : (
                        <div className="conatiner-fluid">
                            <div className="row">
                                <div className="col-md-8 mb-4">
                                    <Carousel
                                        listImages={product.listImages}
                                        alt={product.name}
                                        style={{
                                            paddingBottom: 'calc(2/3*100%)',
                                        }}
                                    />
                                </div>

                                <div className="col-md-4 mb-4">
                                    <h1 className="fs-4">{product.name}</h1>
                                    <StarRating stars={product.rating} />
                                    <span className='border-start ms-4'></span>
                                    <span className='ms-4'>Đã bán {product.sold}</span>

                                    <div className="d-flex flex-wrap justify-content-right align-items-center mt-3">
                                        <h2 className="text-danger fs-3 m-0 me-2">
                                            {product.promotionalPrice &&
                                                formatPrice(
                                                    product.promotionalPrice
                                                        .$numberDecimal,
                                                )}{' '}
                                            VND
                                        </h2>

                                        <p className="text-decoration-line-through text-muted mt-1">
                                            {product.price &&
                                                formatPrice(
                                                    product.price.$numberDecimal,
                                                )}{' '}
                                            VND
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        {product.storeId &&
                                            !product.storeId.isOpen && (
                                                <Error msg="This store is closed, can' t order in this time!" />
                                            )}
                                        {product.quantity <= 0 && (
                                            <Error msg="The product is sold out!" />
                                        )}

                                        {!getToken() && (
                                            <SigninButton
                                                className="w-100 btn-lg"
                                                title="Đăng Nhập Ngay !"
                                            />
                                        )}

                                        {product.storeId &&
                                            product.storeId.isOpen &&
                                            product.quantity > 0 &&
                                            getToken() &&
                                            getToken().role === 'user' && (
                                                <AddToCartForm product={product} />
                                            )}

                                        {getToken() && (
                                            <FollowProductButton
                                                productId={product._id}
                                                isFollowing={product.isFollowing}
                                                onRun={() =>
                                                    setProduct({
                                                        ...product,
                                                        isFollowing:
                                                            !product.isFollowing,
                                                    })
                                                }
                                                className="mt-2 w-100 btn-lg"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="container-fluid p-0">
                                        <div className="row res-flex-reverse-md">
                                            <div className="col-md-8 p-0">
                                                <ListReviews
                                                    productId={product._id}
                                                />
                                            </div>

                                            <div className="col-md-4 mb-5">
                                                <div className="mb-5">
                                                    <CategorySmallCard
                                                        category={
                                                            product.categoryId
                                                        }
                                                        parent={true}
                                                    />
                                                </div>

                                                <Paragraph
                                                    value={product.description}
                                                    label="Description"
                                                    multiLine={true}
                                                />

                                                <div className="mt-4 px-3 d-flex justify-content-around align-items-center badge bg-dark rounded">
                                                    <span className="p-2">
                                                        <StoreSmallCard
                                                            store={product.storeId}
                                                        />
                                                    </span>
                                                    {product.storeId && (
                                                        <button className="btn bg-white opacity">
                                                            <Link to={`/store/${product.storeId._id}`} className="text-dark text-decoration-none">Xem Store</Link>
                                                        </button>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Gợi ý sản phẩm */}
                                <div className='col-12'>
                                    <RecommendationAPI productId={productId} />
                                </div>


                                <div className="col-12">    
                                    {product.storeId && (
                                        <div className="mt-4 rounded p-4" style={{ backgroundColor: '#e9ecef'}}>
                                            <ListProductsByStore
                                                heading={`${product.storeId &&
                                                    product.storeId.name
                                                    ? `Sản phẩm khác của ${product.storeId.name}`
                                                    : ' Sản phẩm khác của Store'
                                                    }`}
                                                storeId={product.storeId._id}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </MainLayout>
        </div>
    );
};

export default DetailPage;
