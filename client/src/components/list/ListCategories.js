// import { useState, useEffect } from 'react';
// import { listActiveCategories } from '../../apis/category';
// import Loading from '../ui/Loading';
// import Error from '../ui/Error';
// import CategoryCard from '../card/CategoryCard';

// const ListCategories = ({
//     heading = 'Danh mục sản phẩm',
//     categoryId = null,
//     col = 'col-md-2 col-sm-4 col-6',
//     limit = '6',
// }) => {
//     const [isloading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');

//     const [categories, setCategories] = useState([]);

//     const init = () => {
//         setError('');
//         setIsLoading(true);
//         listActiveCategories({
//             search: '',
//             categoryId,
//             sortBy: 'name',
//             order: 'asc',
//             limit,
//             page: 1,
//         })
//             .then((data) => {
//                 if (data.error) setError(data.error);
//                 else setCategories(data.categories);
//                 setIsLoading(false);
//             })
//             .catch((error) => {
//                 setError('Server Error');
//                 setIsLoading(false);
//             });
//     };

//     useEffect(() => {
//         init();
//     }, [categoryId]);

//     return (
//         <div className="position-relative">
//             {heading && <h5>{heading}</h5>}

//             {isloading && <Loading />}
//             {error && <Error msg={error} />}

//             <div className="row mt-3">
//                 {categories &&
//                     categories.map((category, index) => (
//                         <div className={`${col} mb-4`} key={index}>
//                             <CategoryCard category={category} />
//                         </div>
//                     ))}
//             </div>
//         </div>
//     );
// };

// export default ListCategories;

import { useState, useEffect } from 'react';
import { listActiveCategories } from '../../apis/category';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import CategoryCard from '../card/CategoryCard';

const ListCategories = ({
    heading = 'Danh mục sản phẩm',
    categoryId = null,
    // col = 'col-md-2 col-sm-4 col-6',
    col = '',

    itemsPerPage = 6,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);

    const loadCategories = (newPage) => {
        setError('');
        setIsLoading(true);

        listActiveCategories({
            search: '',
            categoryId,
            sortBy: 'date',
            order: 'asc',
            limit: itemsPerPage,
            page: newPage,
        })
            .then((data) => {
                if (data.error) setError(data.error);
                else setCategories(data.categories);
                setIsLoading(false);
            })
            .catch(() => {
                setError('Server Error');
                setIsLoading(false);
            });
    };

    useEffect(() => {
        loadCategories(page);
    }, [categoryId, page]);

    const nextPage = () => {
        setPage(page + 1);
    };

    const prevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    return (
        <div className="position-relative">
            {heading && <h6>{heading}</h6>}

            {isLoading && <Loading />}
            {error && <Error msg={error} />}

            <div className="row mt-3">
                {categories &&
                    categories.map((category, index) => (
                        <div className={`${col} mb-2`} key={index}>
                            <CategoryCard category={category} />
                        </div>
                    ))}
            </div>
            

            {/* <div className={`row mt-3 category-list${isLoading ? '' : ' loaded'}`}>
                {categories &&
                    categories.map((category, index) => (
                        <div className={`${col} mb-4 category-item${isLoading ? '' : ' loaded'}`} key={index}>
                            <CategoryCard category={category} />
                        </div>
                    ))}
            </div> */}

{/* 
            <div className="pagination">
                {page > 1 && (
                    <button className="btn btn-prev" onClick={prevPage}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                )}
                {categories.length === itemsPerPage && (
                    <button className="btn btn-next" onClick={nextPage}>
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                )}
            </div> */}
        </div>
    );
};

export default ListCategories;
