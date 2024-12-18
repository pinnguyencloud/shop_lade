import {
  getOverView,
  getSales,
  getTopProducts,
  getStockStatus,
} from "../../services/dashboard/dashboardService";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
} from "recharts";
import {
  Users,
  Truck,
  Package,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";

const OverviewCard = ({ title, value, icon: Icon, bgColor }) => (
  <div className={`${bgColor} p-4 rounded-lg`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <Icon className="text-gray-600" size={24} />
    </div>
  </div>
);

function Dashboards() {
  const [data, setData] = useState({
    overview: null,
    sales: [],
    topProducts: [],
    stockStatus: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overview, sales, topProducts, stockStatus] = await Promise.all([
          getOverView(),
          getSales(),
          getTopProducts(),
          getStockStatus(),
        ]);

        setData({
          overview: overview?.success ? overview.data : null,
          sales: sales?.success ? sales.data : [],
          topProducts: topProducts?.success ? topProducts.data : [],
          stockStatus: stockStatus?.success ? stockStatus.data : [],
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const inventoryData = [
    {
      name: "Nhập kho",
      value: data.overview?.imports.value || 0,
      quantity: data.overview?.imports.quantity || 0,
    },
    {
      name: "Xuất kho",
      value: data.overview?.exports.value || 0,
      quantity: data.overview?.exports.quantity || 0,
    },
  ];

  if (loading) return <div className="p-4">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-4 text-red-500">Lỗi: {error}</div>;

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Overview */}
      <div className="col-span-2 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Tổng quan</h2>
        {data.overview && (
          <div className="grid grid-cols-3 gap-4">
            <OverviewCard
              title="Khách hàng"
              value={data.overview.customers}
              icon={Users}
              bgColor="bg-blue-100"
            />
            <OverviewCard
              title="Nhà cung cấp"
              value={data.overview.suppliers}
              icon={Truck}
              bgColor="bg-green-100"
            />
            <OverviewCard
              title="Sản phẩm"
              value={data.overview.products}
              icon={Package}
              bgColor="bg-purple-100"
            />
            <OverviewCard
              title="Sắp hết hàng"
              value={data.overview.lowStock}
              icon={AlertTriangle}
              bgColor="bg-red-100"
            />
            <OverviewCard
              title="Nhập kho"
              value={`${formatCurrency(data.overview.imports.value)} (${
                data.overview.imports.quantity
              })`}
              icon={ArrowDownToLine}
              bgColor="bg-yellow-100"
            />
            <OverviewCard
              title="Xuất kho"
              value={`${formatCurrency(data.overview.exports.value)} (${
                data.overview.exports.quantity
              })`}
              icon={ArrowUpFromLine}
              bgColor="bg-orange-100"
            />
          </div>
        )}
      </div>

      {/* Inventory Chart */}
      <div className="col-span-2 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Nhập/Xuất kho</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={inventoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              yAxisId="left"
              tickFormatter={(value) => `${value / 1000000}M`}
            />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              formatter={(value, name) => {
                if (name === "value") return formatCurrency(value);
                return value;
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="value"
              name="Giá trị"
              fill="#8884d8"
              barSize={60}
            />
            <Bar
              yAxisId="right"
              dataKey="quantity"
              name="Số lượng"
              fill="#82ca9d"
              barSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sales */}
      <div className="col-span-1 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Doanh thu</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.sales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              yAxisId="left"
              tickFormatter={(value) => `${value / 1000000}M`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, "dataMax + 5"]}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "revenue") return formatCurrency(value);
                return value;
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              name="Doanh thu"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="order_count"
              name="Số đơn"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products */}
      <div className="col-span-1 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Top sản phẩm</h2>
        <div className="grid grid-cols-1 gap-4">
          {data.topProducts.map((product, index) => (
            <div
              key={product.product_id}
              className="p-4 rounded-lg bg-gray-50 flex justify-between items-center"
            >
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium">{product.productName}</p>
                  <p className="text-sm text-gray-500">
                    Mã: {product.productCode}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">
                  {formatCurrency(product.total_revenue)}
                </p>
                <p className="text-sm text-gray-500">
                  Đã bán: {product.total_sold}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Status */}
      <div className="col-span-2 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Tình trạng kho</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data.stockStatus}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="productName" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="totalStock"
              name="Tồn kho"
              fill="#8884d8"
            />
            <Bar
              yAxisId="left"
              dataKey="safeLevel"
              name="Mức an toàn"
              fill="#82ca9d"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="soldQuantity"
              name="Đã bán"
              stroke="#ff7300"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboards;
