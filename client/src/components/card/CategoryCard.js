// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { listActiveCategories } from '../../apis/category';

// const IMG = process.env.REACT_APP_STATIC_URL;

// const CategoryCard = ({ category = {} }) => {
//     const [categoryValue, setCategoryValue] = useState({});
//     const [children, setChildren] = useState([]);

//     const init = () => {
//         setCategoryValue(category);

//         listActiveCategories({
//             search: '',
//             categoryId: category._id,
//             sortBy: 'name',
//             order: 'asc',
//             limit: 3,
//             page: 1,
//         })
//             .then((data) => {
//                 if (data.error) return;
//                 else setChildren(data.categories);
//             })
//             .catch((error) => {
//                 return;
//             });
//     };

//     useEffect(() => {
//         init();
//     }, [category]);

//     return (
//         <div className="card shadow border">
//             <Link
//                 className="text-reset text-decoration-none p-2"
//                 to={`/category/${categoryValue._id}`}
//                 title={categoryValue.name}
//             >
//                 <div className="card-img-top cus-card-img-top">
//                     <img
//                         src={IMG + categoryValue.image}
//                         className="cus-card-img"
//                         alt={categoryValue.name}
//                     />
//                 </div>
//             </Link>

//             <div className="card-body">
//                 <Link
//                     className=" link-hover d-block"
//                     to={`/category/${categoryValue._id}`}
//                     title={categoryValue.name}
//                 >
//                     <h6
//                         className="card-title badge text-light text-decoration-none w-100"
//                         style={{
//                             overflow: 'hidden',
//                             textOverflow: 'ellipsis',
//                             whiteSpace: 'nowrap',
//                             textAlign: 'center',
//                             fontSize: '13px',
//                             backgroundColor: '#6499E9'
//                         }}
//                     >
                        
//                         {categoryValue.name}
//                     </h6>
//                 </Link>

//                 {children && children.length > 0 && (
//                     <div
//                         className="card-subtitle ms-2"
//                         style={{ minHeight: '80px' }}
//                     >
//                         {children &&
//                             children.map((child, index) => (
//                                 <Link
//                                     key={index}
//                                     className="text-reset link-hover d-block mt-1"
//                                     to={`/category/${child._id}`}
//                                     style={{
//                                         overflow: 'hidden',
//                                         textOverflow: 'ellipsis',
//                                         whiteSpace: 'nowrap',
//                                     }}
//                                 >
//                                     <small>{child.name}</small>
//                                 </Link>
//                             ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default CategoryCard;


// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const IMG = process.env.REACT_APP_STATIC_URL;

// const CategoryCard = ({ category = {} }) => {
//     const [showChildren, setShowChildren] = useState(false);
//     const { name, _id, image } = category;

//     return (
//         <div className="card border card-category">
//             <Link
//                 className="text-reset text-decoration-none p-1"
//                 to={`/category/${_id}`}
//                 title={name}
//             >
//                 <div className="card-img-top cus-card-img-top">
//                     <img
//                         src={IMG + image}
//                         className="cus-card-img"
//                         alt={name}
//                         style={{borderRadius: '4px'}}
//                     />
//                 </div>
//             </Link>

//             <div className="p-1">
//                 <Link
//                     className="link-hover d-block"
//                     to={`/category/${_id}`}
//                     title={name}
//                 >
//                     <h6
//                         className="card-title badge text-light text-decoration-none w-100 px-1 py-2 text-truncate"
//                         style={{
//                             // overflow: 'hidden',
//                             // textOverflow: 'ellipsis',
//                             // whiteSpace: 'nowrap',
//                             textAlign: 'center',
//                             fontSize: '13px',
//                             backgroundColor: '#0b5ed7',
//                         }}
//                     >
//                         {name}
//                     </h6>
//                 </Link>

//                 {showChildren && category.children && category.children.length > 0 && (
//                     <div className="card-subtitle ms-2" style={{ minHeight: '80px' }}>
//                         {category.children.map((child, index) => (
//                             <Link
//                                 key={index}
//                                 className="text-reset link-hover d-block mt-1"
//                                 to={`/category/${child._id}`}
//                                 style={{
//                                     overflow: 'hidden',
//                                     textOverflow: 'ellipsis',
//                                     whiteSpace: 'nowrap',
//                                 }}
//                             >
//                                 <small>{child.name}</small>
//                             </Link>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default CategoryCard;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const IMG = process.env.REACT_APP_STATIC_URL;

const CategoryCard = ({ category = {} }) => {
    const { name, _id, image } = category;

    return (
        <div className="border rounded p-1 category-card">
            <Link
                className="d-flex align-items-center text-decoration-none"
                to={`/category/${_id}`}
                title={name}
            >
                    {image && (
                        <img
                        src={IMG + image}
                        className="category-image"
                        alt={name}
                        style={{borderRadius: '4px'}}
                    />
                    )}
                    <span
                        className="px-1"
                        style={{
                            textAlign: 'start',
                            fontSize: '14px',
                            color: '#27272A'
                        }}
                    >
                        {name}
                    </span>
            </Link>
        </div>
    );
};

export default CategoryCard;
