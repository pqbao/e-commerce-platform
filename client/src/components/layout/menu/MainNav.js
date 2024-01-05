import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getToken, signout } from '../../../apis/auth';
import LogoSub from './LogoSub';
import SearchBar from './SearchBar';
import SigninItem from '../../item/SigninItem';
import AccountInit from '../../init/AccountInit';
import VendorInit from '../../init/VendorInit';
import UserSmallCard from '../../card/UserSmallCard';
import StoreSmallCard from '../../card/StoreSmallCard';
import ConfirmDialog from '../../ui/ConfirmDialog';

const MainNav = ({ navFor = 'user' }) => {
    const { cartCount } = useSelector((state) => state.account.user);
    const user = useSelector((state) => state.account.user);
    const store = useSelector((state) => state.vendor.store);

    const [isConfirming, setIsConfirming] = useState(false);
    const history = useHistory();
    const { refreshToken } = getToken();

    const handleSignout = () => {
        setIsConfirming(true);
    };

    const onSignoutSubmit = () => {
        signout(refreshToken, () => {
            history.go(0);
        });
    };

    return (
        <header className="main-nav cus-nav navbar fixed-top navbar-expand-md navbar-dark bg-primary">
            {isConfirming && (
                <ConfirmDialog
                    title="Đăng xuất"
                    color="danger"
                    onSubmit={onSignoutSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            <div className="container-lg">
                <Link
                    className="navbar-brand cus-navbar-brand me-4 ripple res-hide-md"
                    to="/"
                >
                    <LogoSub />
                </Link>

                {navFor == 'user' && <SearchBar />}
                {navFor != 'user' && (
                    <h1 className="nav-title text-white m-0">
                        {navFor} <span className="res-hide">Dashboard</span>
                    </h1>
                )}

                {!getToken() ? (
                    <ul
                        className="nav cus-subnav ms-4"
                        style={{ minWidth: 'unset' }}
                    >
                        <li className="nav-item">
                            <SigninItem />
                        </li>
                    </ul>
                ) : (
                    <>
                        <ul className="nav cus-subnav ms-4 d-flex justify-content-end res-hide-md">
                            <li className="nav-item">
                                <AccountInit />
                            </li>

                            {navFor === 'vendor' && (
                                <li className="nav-item">
                                    <VendorInit />
                                </li>
                            )}

                            {navFor === 'user' && (
                                <li className="nav-item position-relative">
                                    <Link
                                        className="btn btn-outline-light cus-outline ripple cus-tooltip"
                                        to="/account/following"
                                    >
                                        <i className="fas fa-heart"></i>
                                        {/* <i className="fas fa-heart" style={{ color: '#ed4956' }}></i> */}
                                    </Link>
                                </li>
                            )}

                            {navFor === 'user' && getToken().role === 'user' && (
                                <li className="nav-item position-relative">
                                    <Link
                                        className="btn btn-outline-light cus-outline ripple cus-tooltip"
                                        to="/account/storeManager"
                                    >
                                        <i className="fas fa-store"></i>
                                    </Link>
                                </li>
                            )}

                            {navFor === 'user' && getToken().role === 'user' && (
                                <li className="nav-item">
                                    <div className="cart-item-wrap position-relative">
                                        <Link
                                            className="btn btn-outline-light cus-outline ripple cus-tooltip"
                                            to="/cart"
                                        >
                                            <i className="fa-solid fa-bag-shopping"></i>
                                        </Link>
                                        {
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cus-tooltip mt-1">
                                                {cartCount < 10
                                                    ? cartCount
                                                    : '9+'}
                                                <span className="visually-hidden">
                                                    products
                                                </span>
                                            </span>
                                        }
                                    </div>
                                </li>
                            )}

                            {navFor === 'user' && getToken().role === 'admin' && (
                                <li className="nav-item position-relative">
                                    <Link
                                        className="btn btn-outline-light cus-outline ripple cus-tooltip"
                                        to="/admin/dashboard"
                                    >
                                        <i className="fa-solid fa-user"></i>
                                    </Link>
                                </li>
                            )}

                            {navFor !== 'user' && (
                                <li className="nav-item position-relative">
                                    <Link
                                        className="btn btn-outline-light cus-outline ripple cus-tooltip"
                                        to="/"
                                    >
                                        <i className="fas fa-home"></i>
                                    </Link>
                                </li>
                            )}
                        </ul>

                        <button
                            className="btn btn-outline-light cus-outline ripple mx-2 d-none res-dis-md"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasNavbarMainNav"
                            aria-controls="offcanvasNavbarMainNav"
                        >
                            <i className="fas fa-bars"></i>
                        </button>

                        <div
                            className="offcanvas offcanvas-end d-none res-dis-md"
                            tabIndex="-1"
                            id="offcanvasNavbarMainNav"
                            aria-labelledby="offcanvasNavbarMainNavLabel"
                            style={{ flexGrow: 'unset', width: 'unset' }}
                        >
                            <div className="offcanvas-header bg-primary">
                                <h5
                                    className="offcanvas-title me-5"
                                    id="offcanvasNavbarMainNavLabel"
                                >
                                    <Link
                                        className="text-decoration-none"
                                        to="/"
                                    >
                                        <LogoSub />
                                    </Link>
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white text-reset"
                                    data-bs-dismiss="offcanvas"
                                    aria-label="Close"
                                ></button>
                            </div>

                            <div className="offcanvas-body">
                                <UserSmallCard
                                    user={user}
                                    link="/account/profile"
                                />

                                {navFor === 'vendor' && (
                                    <div className="mt-2">
                                        <StoreSmallCard
                                            store={store}
                                            link={`/vendor/${store._id}`}
                                        />
                                    </div>
                                )}

                                <ul className="navbar-nav justify-content-end flex-grow-1 mt-3">
                                    <li className="nav-item p-2">
                                        <Link
                                            className="link-hover link-dark d-block"
                                            to="/"
                                        >
                                            <i className="fas fa-home me-2"></i>
                                            Trang chủ
                                        </Link>
                                    </li>

                                    {navFor === 'user' && (
                                        <li className="nav-item p-2">
                                            <Link
                                                className="link-hover link-dark d-block"
                                                to="/account/following"
                                            >
                                                <i className="fas fa-heart me-2"></i>
                                                Yêu thích
                                            </Link>
                                        </li>
                                    )}

                                    {getToken().role === 'user' && (
                                        <li className="nav-item p-2">
                                            <Link
                                                className="link-hover link-dark d-block"
                                                to="/account/storeManager"
                                            >
                                                <i className="fas fa-store me-2"></i>
                                                Quản lý cửa hàng
                                            </Link>
                                        </li>
                                    )}

                                    {navFor === 'user' &&
                                        getToken().role === 'user' && (
                                            <li className="nav-item p-2">
                                                <Link
                                                    className="link-hover link-dark d-block"
                                                    to="/cart"
                                                >
                                                    <i className="fas fa-shopping-basket me-2"></i>
                                                    Giỏ hàng
                                                    
                                                </Link>

                                                
                                            </li>
                                            
                                        )}

                                    {navFor === 'user' &&
                                        getToken().role === 'admin' && (
                                            <li className="nav-item p-2">
                                                <Link
                                                    className="link-hover link-dark d-block"
                                                    to="/admin/dashboard"
                                                >
                                                    <i className="fa-solid fa-user me-2"></i>
                                                    Dashboard
                                                </Link>
                                            </li>
                                        )}

                                    <li
                                        className="nav-item p-2 link-hover link-dark ms-1"
                                        onClick={handleSignout}
                                    >
                                        <i className="fas fa-sign-out-alt me-2"></i>
                                        Đăng xuất
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

export default MainNav;
