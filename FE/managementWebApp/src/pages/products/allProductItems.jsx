import { useEffect, useState } from "react";
import { useProduct } from "../../contexts";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import ProductItem from "../../components/cards/productItem";

function AllProductItems() {
  const { products, fetchProducts } = useProduct();
  const { categoryId } = useParams();
  const { setQueryParamsObj } = useProduct();
  const [isOpenProductDetail, setIsOpenProductDetail] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchProducts();
    };
    fetchData();
  }, []);

  const handleCloseProductDetail = () => {
    setIsOpenProductDetail(!isOpenProductDetail);
  };

  const handleOpenProductDetail = () => {
    setIsOpenProductDetail(true);
  };

  useEffect(() => {
    setQueryParamsObj((pre) => {
      return {
        ...pre,
        categories: categoryId,
      };
    });
  }, [categoryId, setQueryParamsObj]);

  if (products.length === 0)
    return (
      <div className="w-full">
        <p className="text-center text-gray-700">Không có sản phẩm</p>
      </div>
    );
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[26px] gap-y-[32px]">
        {products &&
          products.map((item) => (
            <ProductItem
              key={item._id}
              product={item}
              openModal={handleOpenProductDetail}
            />
          ))}
      </div>
      <Outlet />
    </>
  );
}

export default AllProductItems;
