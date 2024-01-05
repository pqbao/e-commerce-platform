import MainLayout from '../../components/layout/MainLayout';
import ListCategories from '../../components/list/ListCategories';
import ListBestSellerProduct from '../../components/list/ListBestSellerProduct';
import ListHotStores from '../../components/list/ListHotStores';

const HomePage = () => {
    return (
        <MainLayout container="container-lg" navFor="user">
            <div className='row'>
                <div className=" col-2 bg-white rounded p-3 sticky-scroll">
                    <ListCategories heading="Danh mục sản phẩm"/>
                </div>
                <div className='col-10'>
                    <div className="mb-4 rounded p-4 bg-white">
                        <ListBestSellerProduct heading="Sản phẩm bán chạy" />
                    </div>

                    <div className="mb-4 bg-white rounded p-4">
                        <ListHotStores heading="Cửa hàng nổi bật" />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default HomePage;
