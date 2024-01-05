
import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import ListRecommendedProduct from './ListRecommendedProduct'
import Loading from '../components/ui/Loading';
import Error from '../components/ui/Error';


const Recommeder = ({ productId, col = 'col-xl-2 col-md-3 col-sm-4 col-6', }) => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productId) {
      // Gọi API Python để lấy danh sách sản phẩm được đề xuất dựa trên productId
      setError('');
      setIsLoading(true);

      axios
        .post('http://127.0.0.1:5000/api/recommendations', {
          product_id: productId,
        })
        .then((response) => {
          setRecommendedProducts(response.data.recommended_products);
          setIsLoading(false);
        })
        .catch((error) => {
          setError('Có lỗi khi tải danh sách sản phẩm được đề xuất!!!');
          setIsLoading(false);
        });
    }
  }, [productId]);

  return (
    <div className="rounded p-4" style={{ background: 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)' }}>
      <h5 className='text-white d-inline-block rounded'>Gợi ý sản phẩm</h5>
      {isloading && <p>Đang tải sản phẩm được đề xuất . . .</p>}
      {error && <Error msg={error} />}
      <div className="row">
        {recommendedProducts.map((productId) => (
          <div className={`${col}`} key={productId}>
          {/* <p >{productId}</p> */}
          <ListRecommendedProduct productIds={productId}/>
          </div>
        ))}
        </div>
    </div>
  );
};

export default Recommeder;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';  


// const Recommeder = ({ productId }) => {
//   const [recommendedProducts, setRecommendedProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (productId) {
//       // Gọi API Python để lấy danh sách sản phẩm được đề xuất dựa trên productId
//       setIsLoading(true);
//       setError('');

//       axios
//         .post('http://127.0.0.1:5000/api/recommendations', {
//           product_id: productId,
//         })
//         .then((response) => {
//           setRecommendedProducts(response.data.recommended_products);
//           setIsLoading(false);
//         })
//         .catch((error) => {
//           setError('Có lỗi khi tải danh sách sản phẩm được đề xuất.');
//           setIsLoading(false);
//         });
//     }
//   }, [productId]);

//   return (
//     <div className="mt-4 rounded p-4" style={{ backgroundColor: '#e9ecef' }}>
//       {isLoading && <p>Đang tải sản phẩm được đề xuất...</p>}
//       {error && <p>{error}</p>}
//       <h3>Sản phẩm được đề xuất</h3>
  
//         {recommendedProducts.map((productId) => (
//           <p key={productId}>{productId}</p>

//         ))}

//     </div>
//   );
// };

// export default Recommeder;


