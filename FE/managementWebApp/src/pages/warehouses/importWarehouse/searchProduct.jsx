import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyInput from "../../../components/form/myInput";
import ProductSearchItem from "../../../components/cards/productSearchItem";
import demo from "../../../assets/images/demo.jpg";

// Giả sử có một danh sách sản phẩm
const productList = [
  { id: "123", productName: "Sản phẩm A", productCode: "SPA", img: demo },
  { id: "123123", productName: "Sản phẩm D", productCode: "SPD", img: demo },
  { id: "456", productName: "Sản phẩm B", productCode: "SPB", img: demo },
  { id: "789", productName: "Sản phẩm C", productCode: "SPC", img: demo },
];

function SearchProduct() {
  const navigate = useNavigate();
  const [searchCode, setSearchCode] = useState("");
  const [foundProducts, setFoundProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearchChange = (e) => {
    setSearchCode(e.target.value);
  };

  useEffect(() => {
    if (!searchCode) {
      setErrorMessage("");
      setFoundProducts([]);
      return;
    }

    // Thực hiện debounce với setTimeout
    const debounceTime = setTimeout(() => {
      const filteredProducts = productList.filter(
        (item) =>
          item.productCode.toLowerCase().includes(searchCode.toLowerCase()) ||
          item.productName.toLowerCase().includes(searchCode.toLowerCase())
      );

      if (filteredProducts.length > 0) {
        setFoundProducts(filteredProducts);
        setErrorMessage("");
      } else {
        setFoundProducts([]);
        setErrorMessage(
          "Không tìm thấy mã sản phẩm. Vui lòng thêm sản phẩm mới."
        );
      }
    }, 500);

    return () => {
      clearTimeout(debounceTime);
    };
  }, [searchCode]);

  const handleProductClick = (product) => {
    navigate("/create-receipt", { state: { product } });
  };

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
          <div className="mt-2">
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
