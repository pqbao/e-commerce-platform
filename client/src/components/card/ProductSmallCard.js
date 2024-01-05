import { Link } from 'react-router-dom';

const IMG = process.env.REACT_APP_STATIC_URL;

const ProductSmallCard = ({ product = {}, bodername = false, style = {} }) => {
    // Kiểm tra xem product có tồn tại và có thuộc tính name không
    if (!product || !product.name) {
        return null;
    }

    return (
        <span
            className={`d-inline-flex align-items-center ${bodername && 'bg-body shadow'}`}
        >
            <Link
                className="text-reset text-decoration-none me-2"
                title={product.name}
                to={`/product/${product._id}`}
            >
                <img
                    src={`${IMG + product.listImages[0]}`}
                    className="small-card-img"
                    alt={product.name}
                />
            </Link>

            <Link
                className="text-reset link-hover"
                to={`/product/${product._id}`}
                title={product.name}
                style={style}
            >
                <span className="fs-6 fw-bold">{product.name}</span>
            </Link>
        </span>
    );
};

export default ProductSmallCard;
