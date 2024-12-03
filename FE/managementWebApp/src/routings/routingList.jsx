import { createBrowserRouter } from "react-router-dom";
import LayoutRouter from "./routingLayout";
import Dashboards from "../pages/dashboards";
import Customers from "../pages/customers";
import Products from "../pages/products";
import AddProduct from "../pages/products/addProduct";
import ProductDetail from "../pages/products/productDetail";
import AllProductItems from "../pages/products/allProductItems";
import Warehouses from "../pages/warehouses";
import Navigation from "../pages/warehouses/navigation";
import ImportWarehouse from "../pages/warehouses/importWarehouse";
import NavigationImport from "../pages/warehouses/importWarehouse/navigation";
import SearchProduct from "../pages/warehouses/importWarehouse/searchProduct";

const router = createBrowserRouter([
  {
    path: "",
    element: <LayoutRouter />,
    children: [
      {
        path: "",
        element: <Dashboards />,
      },
      {
        path: "/customers",
        element: <Customers />,
      },
      {
        path: "/products",
        element: <Products />,
        children: [
          {
            path: "",
            element: <AllProductItems />,
          },
          {
            path: ":categoryId",
            element: <AllProductItems />,
            children: [
              {
                path: ":productId",
                element: <ProductDetail />,
              },
            ],
          },
        ],
      },
      {
        path: "/products/addProduct",
        element: <AddProduct />,
      },
      {
        path: "/warehouse",
        element: <Warehouses />,
        children: [
          { path: "", element: <Navigation /> },
          {
            path: "import-warehouse",
            element: <ImportWarehouse />,
            children: [
              { path: "", element: <NavigationImport /> },
              { path: "search-product", element: <SearchProduct /> },
            ],
          },
        ],
      },
    ],
  },
]);
export default router;
