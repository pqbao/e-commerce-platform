import { Link, useLocation } from 'react-router-dom';
import Avatar from '../../image/Avatar';

const AdminSideBar = ({ user = {} }) => {
    const path = useLocation().pathname.split('/')[2];
    return (
        <div className="sticky-sidebar d-flex flex-column flex-shrink-0 p-3 shadow bg-body rounded res-account-sidebar">
            <ul className="nav nav-pills flex-column mb-auto">
                <div className="position-relative mx-auto mb-4 res-hide-xl d-none">
                    <Avatar
                        avatar={user.avatar}
                        name={user.firstname + ' ' + user.lastname}
                        alt={user.firstname + ' ' + user.lastname}
                    />
                </div>

                <hr className="res-hide-xl d-none" />

                <li className="nav-item">
                    <Link
                        to={`/admin/dashboard`}
                        className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
                            path === 'dashboard' ? 'active' : ''
                        }`}
                        style={{ height: '48px' }}
                    >
                        <i className="fas fa-chart-pie icon-set"></i>
                        <span className="ms-3 res-hide-xl">Dashboard</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to={`/admin/user`}
                        className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
                            path === 'user' ? 'active' : ''
                        }`}
                    >
                        <i className="fas fa-user-friends icon-set"></i>
                        <span className="ms-3 res-hide-xl">Users</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to={`/admin/store`}
                        className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
                            path === 'store' ? 'active' : ''
                        }`}
                    >
                        <i className="fas fa-store icon-set"></i>
                        <span className="ms-3 res-hide-xl">Stores</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to="/admin/order"
                        className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
                            path === 'order' ? 'active' : ''
                        }`}
                    >
                        <i className="fa-solid fa-file-lines icon-set"></i>
                        <span className="ms-3 res-hide-xl">Order</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to="/admin/transaction"
                        className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
                            path === 'transaction' ? 'active' : ''
                        }`}
                        style={{ height: '48px', whiteSpace: 'nowrap' }}
                    >
                        <i className="fa-solid fa-money-bill-transfer icon-set"></i>
                        <span className="ms-3 res-hide-xl">Transaction</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to={`/admin/category`}
                        className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
                            path === 'category' ? 'active' : ''
                        }`}
                    >
                        <i className="fa-solid fa-box icon-set"></i>
                        <span className="ms-3 res-hide-xl">Category</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to={`/admin/style`}
                        className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
                            path === 'style' ? 'active' : ''
                        }`}
                    >
                        <i className="fa-solid fa-boxes-stacked icon-set"></i>
                        <span className="ms-3 res-hide-xl">Style</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to={`/admin/product`}
                        className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
                            path === 'product' ? 'active' : ''
                        }`}
                    >
                        <i className="fa-solid fa-box-open icon-set"></i>
                        <span className="ms-3 res-hide-xl">Products</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to={`/admin/level`}
                        className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
                            path === 'level' ? 'active' : ''
                        }`}
                    >
                        <i className="fas fa-shield-alt icon-set"></i>
                        <span className="ms-3 res-hide-xl">Level</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to={`/admin/commission`}
                        className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
                            path === 'commission' ? 'active' : ''
                        }`}
                        style={{ height: '48px', whiteSpace: 'nowrap' }}
                    >
                        <i className="fa-solid fa-percent icon-set"></i>
                        <span className="ms-3 res-hide-xl">Commission</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to={`/admin/delivery`}
                        className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
                            path === 'delivery' ? 'active' : ''
                        }`}
                    >
                        <i className="fas fa-truck icon-set"></i>
                        <span className="ms-3 res-hide-xl">Delivery</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default AdminSideBar;
