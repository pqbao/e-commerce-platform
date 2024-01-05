import { useSelector } from 'react-redux';
import useToggle from '../../hooks/useToggle';
import AdminLayout from '../../components/layout/AdminLayout';
import AdminCategoriesTable from '../../components/table/AdminCategoriesTable';
import CategorySelector from '../../components/seletor/CategorySelector';

const CategoryPage = (props) => {
    const user = useSelector((state) => state.account.user);
    const [flag, toggleFlag] = useToggle(false);
    return (
        <AdminLayout user={user}>
            {/* <div className="d-flex align-items-center mb-2">
                <div className="position-relative d-inline-block me-2">
                    <span>Cây danh mục</span>
                    <button
                        type="button"
                        className={`btn ${
                            flag ? 'btn-primary' : 'btn-outline-primary'
                        } btn-lg ripple cus-tooltip`}
                        onClick={() => toggleFlag()}
                    >
                        <i className="fa-solid fa-chevron-down"></i>
                        <i class="fa-solid fa-chevron-up"></i>
                    </button>
                </div>
            </div> */}

            <div class="accordion" id="accordionExample">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne">
                        <button
                            class="accordion-button fw-bold"
                            type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapseOne"
                            aria-expanded="true"
                            aria-controls="collapseOne"
                            onClick={() => toggleFlag()}
                        >
                            Cây danh mục
                        </button>
                    </h2>
                    <div class="">
                        {flag && (
                            <div className="mb-4">
                                <CategorySelector isActive={true} isSelected={false} />
                            </div>
                        )}

                        <div className='mt-4'>
                            <AdminCategoriesTable />
                        </div>
                    </div>
                    <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample"></div>
                </div>
            </div>

            {/* {flag && (
                <div className="mb-4">
                    <CategorySelector isActive={true} isSelected={false} />
                </div>
            )}

            <AdminCategoriesTable /> */}
        </AdminLayout>
    );
};

export default CategoryPage;
