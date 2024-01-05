import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listActiveCategories } from '../../../apis/category';
import Logo from './Logo';

//cre: Scanfcode.com footer template
const Footer = (props) => {
    const [categories, setCategories] = useState([]);

    const loadCategories = () => {
        listActiveCategories({
            search: '',
            categoryId: null,
            sortBy: 'date',
            order: 'asc',
            limit: 6,
            page: 1,
        })
            .then((data) => {
                if (data.error) return;
                else setCategories(data.categories);
            })
            .catch((error) => {
                return;
            });
    };

    useEffect(() => loadCategories(), []);

    return (
        <footer className="site-footer">
            <div className="container-lg">
                <div className="row">
                    <div className="col-sm-12 col-md-6">
                        <div className="mb-4">
                            <div className="mb-2 d-block">
                                <Logo />
                            </div>
                            <p style={{ textAlign: 'justify' }}>
                                MultiMart - Nơi Đa Dạng Mua Sắm trực tuyến. 
                                Khám phá thế giới sản phẩm và dịch vụ đa dạng tại MultiMart, 
                                nơi bạn có thể tìm thấy mọi thứ một cách dễ dàng và thuận tiện.
                            </p>
                        </div>

                        <div className="mb-4">
                            <ul className="social-icons" style={{ textAlign: 'justify' }}>
                                <li>
                                    <Link
                                        className="facebook"
                                        to=""
                                    >
                                        <i className="fab fa-facebook"></i>
                                    </Link>
                                </li>
                                <li>
                                    <Link className="google" to="#">
                                        <i className="fab fa-google"></i>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="github"
                                        to=""
                                    >
                                        <i className="fab fa-github"></i>
                                    </Link>
                                </li>
                                <li>
                                    <Link className="linkedin" to="#">
                                        <i className="fab fa-linkedin"></i>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                    </div>

                    <div className="col-xs-6 col-md-3">
                        <h6>DANH MỤC</h6>
                        <ul className="footer-links">
                            {categories &&
                                categories.map((category, index) => (
                                    <li key={index}>
                                        <Link
                                            className="link-hover text-reset"
                                            to={`/category/${category._id}`}
                                            title={category.name}
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </div>

                    <div className="col-xs-6 col-md-3">
                        <h6>liên kết</h6>
                        <ul className="footer-links">
                            <li>
                                <Link className="link-hover text-reset" to="#">
                                    Về chúng tôi
                                </Link>
                            </li>
                            <li>
                                <Link className="link-hover text-reset" to="#">
                                    Liên hệ chúng tôi
                                </Link>
                            </li>
                            <li>
                                <Link className="link-hover text-reset" to="#">
                                    Chính sách
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <hr />
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">
                        <p className="copyright-text" style={{ textAlign: 'center' }}>
                            Copyright &copy; 2023 All Rights Reserved by{' '}
                            <Link className="link-hover text-reset" to="#">
                                PQB
                            </Link>
                            .
                        </p>
                    </div>


                </div>
            </div>
        </footer>
    );
};

export default Footer;
