import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyInput from "../../../components/form/myInput";
import ProductSearchItem from "../../../components/cards/productSearchItem";
import { useProduct } from "../../../contexts";
import useDebounce from "../../../hooks/useDebounce"; // Import custom hook

function SearchProduct() {
  const navigate = useNavigate();
  const [searchCode, setSearchCode] = useState("");
  const [foundProducts, setFoundProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { products, setQueryParamsObj } = useProduct();

  // Debounce giá trị searchCode với 500ms
  const debouncedSearchCode = useDebounce(searchCode, 500);

  const handleSearchChange = (e) => {
    setSearchCode(e.target.value);
  };

  useEffect(() => {
    if (!debouncedSearchCode) {
      setErrorMessage("");
      setFoundProducts([]);
      return;
    }

    // Update query params sau khi debounce
    setQueryParamsObj((prev) => ({
      ...prev,
      productCode: debouncedSearchCode,
      limit: 0,
    }));

    if (products.length > 0) {
      setFoundProducts(products);
      setErrorMessage("");
    } else {
      setFoundProducts([]);
      setErrorMessage(
        "Không tìm thấy mã sản phẩm. Vui lòng thêm sản phẩm mới."
      );
    }
  }, [debouncedSearchCode, setQueryParamsObj, products]);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-2/5">
        <MyInput
          type="text"
          value={searchCode}
          onChange={handleSearchChange}
          label={"Nhập mã sản phẩm"}
        />
        {/* Thông báo lỗi */}
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

        {/* Hiển thị các sản phẩm tìm thấy */}
        {foundProducts.length > 0 && (
          <div className="mt-2 max-h-[450px] flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
            {foundProducts.map((product) => (
              <ProductSearchItem key={product.id} obj={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchProduct;
