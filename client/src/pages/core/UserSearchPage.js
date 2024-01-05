import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getToken } from '../../apis/auth';
import { getlistUsers } from '../../apis/user';
import useUpdateEffect from '../../hooks/useUpdateEffect';
import MainLayout from '../../components/layout/MainLayout';
import UserCard from '../../components/card/UserCard';
import Pagination from '../../components/ui/Pagination.js';
import Loading from '../../components/ui/Loading';
import Error from '../../components/ui/Error';

const UserSearchPage = (props) => {
    const [error, setError] = useState('');
    const [isloading, setIsLoading] = useState(false);

    const keyword =
        new URLSearchParams(useLocation().search).get('keyword') || '';
    const [listUsers, setListUsers] = useState([]);
    const [pagination, setPagination] = useState({
        size: 0,
    });
    const [filter, setFilter] = useState({
        search: keyword,
        sortBy: 'point',
        role: 'customer',
        order: 'desc',
        limit: 12,
        page: 1,
    });

    const init = () => {
        setError('');
        setIsLoading(true);

        getlistUsers(filter)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setPagination({
                        size: data.size,
                        pageCurrent: data.filter.pageCurrent,
                        pageCount: data.filter.pageCount,
                    });
                    setListUsers(data.users);
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setError('Server Error');
                setIsLoading(false);
            });
    };

    useEffect(() => {
        init();
    }, [filter]);

    useUpdateEffect(() => {
        setFilter({
            ...filter,
            search: keyword,
            page: 1,
        });
    }, [keyword]);

    const handleChangePage = (newPage) => {
        setFilter({
            ...filter,
            page: newPage,
        });
    };

    return (
        <MainLayout>
            <div className="position-relative">
                {isloading && <Loading />}
                {error && <Error msg={error} />}

                <div className="d-flex justify-content-end">
                    <span className="me-3">{pagination.size || 0} kết quả</span>
                </div>

                <div className="row mt-3">
                    {listUsers &&
                        listUsers.map((user, index) => (
                            <div
                                className="col-xl-2 col-md-3 col-sm-4 col-6 mb-4"
                                key={index}
                            >
                                <UserCard
                                    user={user}
                                    hasFollowBtn={getToken()}
                                />
                            </div>
                        ))}
                </div>

                {pagination.size != 0 && (
                    <Pagination
                        pagination={pagination}
                        onChangePage={handleChangePage}
                    />
                )}

                {pagination.size <= 0 && (
                    <div className='d-flex align-items-center justify-content-center flex-column'>
                        <img
                            src="http://localhost:8000/static/uploads/search-not-found.png"
                            style={{ width: '150px' }}
                        />
                        <div className='text-secondary mt-4'>Không tìm thấy người dùng nào phù hợp với từ khoá <span className='text-primary'>'{filter.search}'</span></div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default UserSearchPage;
