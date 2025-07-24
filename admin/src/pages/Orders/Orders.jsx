import React from "react";
import "./Orders.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// import { assets } from "../../assets/assets"; // bỏ vì thay icon mới
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { PackageCheck, PackageSearch, Truck, CheckCheck } from "lucide-react"; // icon thay thế đẹp hơn

const Orders = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

  const layDanhSachDonHang = async () => {
    const response = await axios.get(url + "/api/order/list", {
      headers: { token },
    });
    if (response.data.success) {
      setOrders(response.data.data);
    }
  };

  const capNhatTrangThai = async (event, orderId) => {
    const response = await axios.post(
      url + "/api/order/status",
      {
        orderId,
        status: event.target.value,
      },
      { headers: { token } }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      await layDanhSachDonHang();
    } else {
      toast.error(response.data.message);
    }
  };

  const statusOptions = [
    { value: "Food Processing", label: "Đang xử lý" },
    { value: "Out for delivery", label: "Đang giao hàng" },
    { value: "Delivered", label: "Đã giao" },
  ];

  const renderIconByStatus = (status) => {
    switch (status) {
      case "Food Processing":
        return <PackageSearch color="#3498db" size={40} />;
      case "Out for delivery":
        return <Truck color="#f39c12" size={40} />;
      case "Delivered":
        return <CheckCheck color="#2ecc71" size={40} />;
      default:
        return <PackageCheck color="#95a5a6" size={40} />;
    }
  };

  useEffect(() => {
    if (!admin && !token) {
      toast.error("Vui lòng đăng nhập trước");
      navigate("/");
    }
    layDanhSachDonHang();
  }, []);

  return (
    <div className="order">
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <div className="order-item-icon">
              {renderIconByStatus(order.status)}
            </div>
            <div>
              <p className="order-item-food">
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p className="order-item-name">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.street + ","}</p>
                <p>
                  {order.address.city +
                    ", " +
                    order.address.state +
                    ", " +
                    order.address.country +
                    ", " +
                    order.address.zipcode}
                </p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Số món: {order.items.length}</p>
            <p>Tổng tiền: {order.amount.toLocaleString()} đ</p>
            <select
              onChange={(event) => capNhatTrangThai(event, order._id)}
              value={order.status}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
