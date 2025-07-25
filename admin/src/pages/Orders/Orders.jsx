import React from "react";
import "./Orders.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { PackageCheck, PackageSearch, Truck, CheckCheck } from "lucide-react";

const Orders = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

  const getOrder = async () => {
    const response = await axios.get(url + "/api/order/list", {
      headers: { token },
    });
    if (response.data.success) {
      setOrders(response.data.data);
    }
  };

  const updateOderStatus = async (event, orderId) => {
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
      await getOrder();
      navigate("/orders");
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
    const localToken = localStorage.getItem("token");
    const localAdmin = localStorage.getItem("admin");

    if (!(admin || localAdmin) || !(token || localToken)) {
      toast.error("Vui lòng đăng nhập trước");
      navigate("/");
    }
    getOrder();
  }, [admin, token]);

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
                <p>
                  {order.address.street +
                    ", " +
                    order.address.city +
                    ", " +
                    order.address.state}
                </p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
              <p className="order-item-date">
                Ngày đặt:{" "}
                {new Date(order.date).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <p>Số món: {order.items.length}</p>
            <p className="order-item-price">
              Tổng tiền: {order.amount.toLocaleString()} đ
            </p>
            <select
              onChange={(event) => updateOderStatus(event, order._id)}
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
