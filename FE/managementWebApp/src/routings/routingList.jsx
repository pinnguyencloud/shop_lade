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
import ImportReceipt from "../pages/warehouses/importWarehouse/importReceipt";
import ProductForm from "../pages/warehouses/importWarehouse/productForm";
import CompletedReceipt from "../pages/warehouses/importWarehouse/completedReceipt";
import DraftReceipt from "../pages/warehouses/importWarehouse/draftReceipt";
import ReceiptDetail from "../components/receiptDetail";
import Suppliers from "../pages/suppliers";
import ExportWarehouse from "../pages/warehouses/exportWarehouse";
import NavigationExport from "../pages/warehouses/exportWarehouse/navigation";
import CreateExportReceipt from "../pages/warehouses/exportWarehouse/createExportReceipt";
import CompletedExport from "../pages/warehouses/exportWarehouse/completedExport";
import ExportReceiptDetail from "../components/exportReceiptDetail";

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
              {
                path: "import-warehouse-receipt",
                element: <ImportReceipt />,
                children: [{ path: ":id", element: <ProductForm /> }],
              },
              {
                path: "completed-Receipt",
                element: <CompletedReceipt />,
                children: [{ path: ":id", element: <ReceiptDetail /> }],
              },
              {
                path: "draft-Receipt",
                element: <DraftReceipt />,
                children: [{ path: ":id", element: <ReceiptDetail /> }],
              },
            ],
          },
          {
            path: "export-warehouse",
            element: <ExportWarehouse />,
            children: [
              { path: "", element: <NavigationExport /> },
              { path: "create-receipt", element: <CreateExportReceipt /> },
              {
                path: "export-receipt",
                element: <CompletedExport />,
                children: [{ path: ":id", element: <ExportReceiptDetail /> }],
              },
            ],
          },
        ],
      },
      {
        path: "/suppliers",
        element: <Suppliers />,
      },
    ],
  },
]);
export default router;
