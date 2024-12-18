import React, { useState, useEffect } from "react";
import { useCustomer } from "../../contexts/accounts/customerContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  Collapse,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";

const CustomerManagement = () => {
  const {
    customers,
    loading,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    removeCustomer,
  } = useCustomer();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    ward: "",
    district: "",
    province: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showNotification = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Bạn có chắc muốn xóa khách hàng này?")) {
        await removeCustomer(id);
        showNotification("Xóa khách hàng thành công");
        fetchCustomers();
      }
    } catch (error) {
      showNotification(
        "Không thể xóa khách hàng. Vui lòng thử lại sau.",
        "error"
      );
      console.error("Lỗi khi xóa khách hàng:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer.id, formData);
        showNotification("Cập nhật khách hàng thành công");
      } else {
        await createCustomer(formData);
        showNotification("Thêm khách hàng mới thành công");
      }
      setIsDialogOpen(false);
      resetForm();
      fetchCustomers();
    } catch (error) {
      showNotification(
        "Không thể lưu thông tin khách hàng. Vui lòng thử lại sau.",
        "error"
      );
      console.error("Lỗi khi lưu khách hàng:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      ward: "",
      district: "",
      province: "",
    });
    setSelectedCustomer(null);
  };

  const toggleRowExpansion = (customerId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [customerId]: !prev[customerId],
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      completed: "success",
      pending: "warning",
      cancelled: "error",
      processing: "info",
    };
    return statusColors[status] || "default";
  };

  const getStatusText = (status) => {
    const statusTexts = {
      completed: "Hoàn thành",
      pending: "Chờ xử lý",
      cancelled: "Đã hủy",
      processing: "Đang xử lý",
    };
    return statusTexts[status] || status;
  };

  const filteredCustomers =
    customers?.filter(
      (customer) =>
        customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer?.phone?.includes(searchTerm)
    ) || [];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Card
        elevation={0}
        sx={{
          mb: 4,
          borderRadius: 2,
          backgroundColor: "primary.main",
          color: "white",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Quản lý khách hàng
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsDialogOpen(true)}
              sx={{
                backgroundColor: "white",
                color: "primary.main",
                "&:hover": { backgroundColor: "grey.100" },
              }}
            >
              Thêm khách hàng
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm theo tên hoặc số điện thoại"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ backgroundColor: "white" }}
          />
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.50" }}>
                <TableCell sx={{ width: "50px" }}></TableCell>
                <TableCell
                  sx={{ fontWeight: "bold" }}
                  className="w-32 font-medium"
                >
                  Tên
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold" }}
                  className="w-32 font-medium"
                >
                  Số điện thoại
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell
                  sx={{ fontWeight: "bold" }}
                  className="max-w-[150px]"
                >
                  Địa chỉ
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Tổng sản phẩm</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Tổng chi tiêu</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <React.Fragment key={customer.id}>
                  <TableRow hover>
                    <TableCell>
                      {customer.orders?.length > 0 && (
                        <IconButton
                          size="small"
                          onClick={() => toggleRowExpansion(customer.id)}
                        >
                          {expandedRows[customer.id] ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell className="max-w-[190px]">
                      {`${customer.address}, ${customer.ward}, ${customer.district}, ${customer.province}`}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <ShoppingCartIcon fontSize="small" color="action" />
                        {customer.total_quantity || 0} 
                      </Box>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(customer.total_price || 0)} 
                    </TableCell>

                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setFormData(customer);
                          setIsDialogOpen(true);
                        }}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(customer.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {customer.orders?.length > 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        sx={{ p: 0, borderBottom: "none" }}
                      >
                        <Collapse in={expandedRows[customer.id]} timeout="auto">
                          <Box sx={{ p: 3, backgroundColor: "grey.50" }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                              Lịch sử đơn hàng
                            </Typography>
                            <TableContainer>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Mã đơn</TableCell>
                                    <TableCell>Ngày đặt</TableCell>
                                    <TableCell>Người nhận</TableCell>
                                    <TableCell>SĐT</TableCell>
                                    <TableCell>Địa chỉ</TableCell>
                                    <TableCell>Số lượng</TableCell>
                                    <TableCell>Tổng tiền</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {customer.orders.map((order) => (
                                    <TableRow key={order.id}>
                                      <TableCell>#{order.id}</TableCell>
                                      <TableCell>
                                        {formatDate(order.created_at)}
                                      </TableCell>
                                      <TableCell>
                                        {order.receiver_name}
                                      </TableCell>
                                      <TableCell>
                                        {order.phone_number}
                                      </TableCell>
                                      <TableCell>{order.address}</TableCell>
                                      <TableCell>
                                        {order.total_quantity}
                                      </TableCell>
                                      <TableCell>
                                        {formatCurrency(order.total_price)}
                                      </TableCell>
                                      <TableCell>
                                        <Chip
                                          label={getStatusText(order.status)}
                                          color={getStatusColor(order.status)}
                                          size="small"
                                        />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          resetForm();
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle
            sx={{ backgroundColor: "primary.main", color: "white", py: 3 }}
          >
            {selectedCustomer ? "Cập nhật khách hàng" : "Thêm khách hàng mới"}
          </DialogTitle>
          <DialogContent sx={{ p: 4, mt: 10 }}>
            <Box sx={{ display: "grid", gap: 3 }}>
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}
              >
                <TextField
                  label="Tên khách hàng"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  fullWidth
                  variant="outlined"
                  sx={{
                    mt: 2,
                    "& .MuiInputLabel-root": {
                      backgroundColor: "white",
                      padding: "0 8px",
                    },
                  }}
                />
                <TextField
                  label="Số điện thoại"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                />
              </Box>
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Địa chỉ"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                fullWidth
                variant="outlined"
              />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 3,
                }}
              >
                <TextField
                  label="Phường/Xã"
                  value={formData.ward}
                  onChange={(e) =>
                    setFormData({ ...formData, ward: e.target.value })
                  }
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Quận/Huyện"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Tỉnh/Thành phố"
                  value={formData.province}
                  onChange={(e) =>
                    setFormData({ ...formData, province: e.target.value })
                  }
                  fullWidth
                  variant="outlined"
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, backgroundColor: "grey.50" }}>
            <Button
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
              variant="outlined"
            >
              Hủy
            </Button>
            <Button type="submit" variant="contained" sx={{ minWidth: 100 }}>
              {selectedCustomer ? "Cập nhật" : "Thêm mới"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerManagement;
