import ProductItem from "../../components/cards/productItem";
import Input from "../../components/form/input";
import demo from "../../assets/images/demo.jpg";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Modal from "../../components/modal";
import { useState } from "react";
import { useCategories, useProduct } from "../../contexts";

function Products() {
  const navagate = useNavigate();
  const { categories } = useCategories();
  const [expandedCategories, setExpandedCategories] = useState([]);

  const toggleCategory = (id) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const totalProducts = categories.reduce((a, b) => (a += b.totalProducts), 0);

  return (
    <div className="py-10">
      <h3 className="text-[28px] font-bold">Products</h3>
      <p className="italic text-base">Quản lý sản phẩm</p>
      <div className="w-full flex mt-[28px] gap-6">
        <div className="basis-[25%] flex flex-col gap-5">
          <div className="w-full bg-white rounded px-[30px] py-[32px] shadow">
            <h4 className="text-[22px] font-semibold pb-5 border-b border-b-theirdGray text-center">
              Danh mục sản phẩm
            </h4>
            <div className="text-[#5A5A5A] mt-4 flex flex-col gap-4">
              <div className="flex flex-col">
                <div
                  className="flex justify-between cursor-pointer hover:text-black transition-colors duration-200"
                  onClick={() => navagate("")}
                >
                  <div className="flex gap-[10px]">
                    <span>I</span>
                    <p>Tổng các sản phẩm</p>
                  </div>
                  <span>{totalProducts}</span>
                </div>
              </div>
              {categories &&
                categories.map((item) => (
                  <div key={item.id} className="flex flex-col">
                    <div
                      onClick={() => {
                        toggleCategory(item.id);
                        navagate(`${item.id}`);
                      }}
                      className="flex justify-between cursor-pointer hover:text-black transition-colors duration-200"
                    >
                      <div className="flex gap-[10px]">
                        <span>{item.children?.length > 0 ? "▶" : "I"}</span>
                        <p>{item.name}</p>
                      </div>
                      <span>{item.totalProducts ? item.totalProducts : 0}</span>
                    </div>
                    {/* Hiển thị danh mục con nếu được mở */}
                    {expandedCategories.includes(item.id) && item.children && (
                      <div className="pl-6 mt-2 flex flex-col gap-2">
                        {item.children.map((child) => (
                          <div
                            key={child.id}
                            onClick={() => navagate(`${child.id}`)}
                            className="flex justify-between cursor-pointer hover:text-black transition-colors duration-200"
                          >
                            <p>{child.name}</p>
                            <span>
                              {child.totalProducts ? child.totalProducts : 0}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
          <div className="w-full bg-white h-32 shadow rounded"></div>
        </div>
        <div className="basis-[75%] flex flex-col">
          <Input className={"w-[300px] h-[50px] bg-white rounded shadow"} />
          <div className="my-4">
            <button
              onClick={() => navagate("addProduct")}
              className="text-base px-[30px] py-4 bg-warning font-semibold text-white rounded hover:opacity-80 transition-opacity duration-100"
            >
              Thêm Sản phẩm
            </button>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Products;
