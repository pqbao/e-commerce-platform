import { useState, useRef, useEffect } from 'react';
import StarRating from '../label/StarRating';
import InputRange from '../ui/InputRange';

const ProductFilterCategory = ({ filter, setFilter }) => {
    const [price, setPrice] = useState({
        min: '0',
        max: '',
    });
    const typingTimeoutRef = useRef(null);

    const handleFilter = (name, value) => {
        setFilter({
            ...filter,
            [name]: value,
        });
    };

    const handleSetPrice = (name1, name2, value) => {
        setPrice({
            ...price,
            [name1]: value,
        });

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            handleFilter(name2, value);
        }, 600);
    };
    
    const formatCurrency = (amount) => {
        // Định dạng số thành tiền VND
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const renderFilterRating = () => {
        const render = [];
        for (let i = 0; i <= 5; i++)
            render.push(
                <div key={i} className="form-check d-flex align-items-center">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="rating"
                        id={`rating${i}`}
                        defaultChecked={
                            i !== 0 ? filter.rating === i : filter.rating === ''
                        }
                        onClick={() => {
                            if (i === 0) handleFilter('rating', '');
                            else handleFilter('rating', i);
                        }}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <label
                        className="form-check-label ms-2"
                        htmlFor={`rating${i}`}
                        style={{
                            cursor: 'pointer',
                        }}
                    >
                        {i === 0 ? (
                            <span style={{ display: 'block', paddingTop: '2px', fontSize: '14px' }}>Tất cả</span>
                        ) : (
                            <small>
                                <StarRating stars={i} /> {i !== 5 && 'trở lên'}
                            </small>
                        )}
                    </label>
                </div>,
            );
        return render;


    };

    return (
        <div>

            <div className="mb-4">
                <h6>Sắp xếp</h6>

                <div className="form-check d-flex align-items-center">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="sortBy"
                        id="sortBy1"
                        defaultChecked={filter.sortBy === 'sold'}
                        onClick={() => handleFilter('sortBy', 'sold')}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <label
                        className="form-check-label ms-2"
                        htmlFor="sortBy1"
                        style={{
                            cursor: 'pointer',
                            fontSize: '14px',
                            marginTop: '3px'
                        }}
                    >
                        Bán chạy
                    </label>
                </div>

                <div className="form-check d-flex align-items-center">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="sortBy"
                        id="sortBy2"
                        defaultChecked={filter.sortBy === 'createdAt'}
                        onClick={() =>
                            handleFilter('sortBy', 'createdAt')
                        }
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <label
                        className="form-check-label ms-2"
                        htmlFor="sortBy2"
                        style={{
                            cursor: 'pointer',
                            fontSize: '14px',
                            marginTop: '3px'
                        }}
                    >
                        Mới nhất
                    </label>
                </div>
            </div>

            <div className="mb-4">
                <h6>Đánh giá</h6>
                {renderFilterRating()}
            </div>

            <div className="mb-4">
                <h6 className='mb-2'>Khoảng giá</h6>
                <form className=" d-flex align-items-center">
                    <div className="">
                        <InputRange
                            type="number"
                            validator="positon|zero"
                            value={price.min}
                            onChange={(value) =>
                                handleSetPrice('min', 'minPrice', value)
                            }
                        />
                    </div>

                    <span className='mx-1'>-</span>

                    <div className="">
                        <InputRange
                            type="number"
                            validator="positon|zero"
                            value={price.max}
                            onChange={(value) =>
                                handleSetPrice('max', 'maxPrice', value)
                            }
                        />
                    </div>
                </form>

                {/* <form className="row">
                <span style={{fontSize: '14px'}}>Giá dưới: {formatCurrency(parseInt(price.max))}</span>

                    <div className="col-12">
                        <input
                            type="range"
                            className="form-range"
                            min="0"
                            max='10000000'
                            step="50000"    
                            value={price.max}
                            onChange={(e) =>
                                handleSetPrice('max', 'maxPrice', e.target.value)
                            }
                        />
                    </div>
                    
                </form> */}
            </div>
        </div>

    );
};

export default ProductFilterCategory;
