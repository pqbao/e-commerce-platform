import { useState, useEffect } from 'react';
import { getToken } from '../../apis/auth';
import { listCarts } from '../../apis/cart';
import MainLayout from '../../components/layout/MainLayout';
import Loading from '../../components/ui/Loading';
import Error from '../../components/ui/Error';
import Success from '../../components/ui/Success';
import StoreSmallCard from '../../components/card/StoreSmallCard';
import ListCartItemsForm from '../../components/list/ListCartItemsForm';

const CartPage = (props) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [run, setRun] = useState(false);

    const [carts, setCarts] = useState([]);

    const { _id, accessToken } = getToken();

    const init = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        listCarts(_id, accessToken, { limit: '1000', page: '1' })
            .then((data) => {
                if (data.error) setError(data.error);
                // else if (data.carts.length <= 0) 
                //     setSuccess('Giỏ hàng rỗng!');
                else setCarts(data.carts);
                setIsLoading(false);
            })
            .catch((error) => {
                setError('Server error');
                setIsLoading(false);
            });
    };

    useEffect(() => {
        init();
    }, [run]);

    return (
        <MainLayout>
            <div className="position-relative">
                {isloading && <Loading />}
                {error ? (
                    <Error msg={error} />
                ) : success ? (
                    <Success msg={success} />
                ) : (
                    <div className="accordion" id="accordionPanelsStayOpen">
                        {carts.map((cart, index) => (
                            <div className="accordion-item mb-2" key={index}>
                                <h2
                                    className="accordion-header"
                                    id={`panelsStayOpen-heading-${index}`}
                                >
                                    <button
                                        className="accordion-button btn"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#panelsStayOpen-collapse-${index}`}
                                        aria-expanded="true"
                                        aria-controls={`panelsStayOpen-collapse-${index}`}
                                    >
                                        <StoreSmallCard store={cart.storeId} />
                                    </button>
                                </h2>
                                <div
                                    id={`panelsStayOpen-collapse-${index}`}
                                    className="accordion-collapse collapse show"
                                    aria-labelledby={`panelsStayOpen-collapse-${index}`}
                                >
                                    <div className="accordion-body px-2">
                                        {cart.storeId &&
                                            !cart.storeId.isActive && (
                                                <Error msg="Cửa hàng này bị cấm bởi MultiMart" />
                                            )}

                                        {cart.storeId &&
                                            cart.storeId.isActive &&
                                            !cart.storeId.isOpen && (
                                                <Error msg="Cửa hàng này đã đóng cửa, không thể đặt hàng trong thời gian này!" />
                                            )}

                                        {cart.storeId &&
                                            cart.storeId.isActive &&
                                            cart.storeId.isOpen && (
                                                <ListCartItemsForm
                                                    cartId={cart._id}
                                                    storeId={cart.storeId._id}
                                                    userId={cart.userId._id}
                                                    onRun={() => setRun(!run)}
                                                />
                                            )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {carts.length <= 0 && 
                <div className='d-flex align-items-center justify-content-center flex-column'>
                     <img
                        src="http://localhost:8000/static/uploads/empty-cart.webp"
                        style={{ width: '200px'}}
                    />

                    <span className='fs-5 mt-4' style={{ fontWeight: '500' }}>Giỏ hàng rỗng :(</span>
                    <div className='text-secondary'>Có vẻ như bạn chưa thêm bất kỳ thứ gì vào giỏ hàng của mình!</div>
                </div>
            }
        </MainLayout>
    );
};

export default CartPage;
