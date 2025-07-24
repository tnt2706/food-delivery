import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { priceFormat } from "../../utils/priceFormat";
import { PackageOpen } from "lucide-react";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await axios.post(
      url + "/api/order/userorders",
      {},
      { headers: { token } }
    );
    if (response.data.success) {
      setData(response.data.data);
    }
  };

  const statusOptions = {
    "Food Processing": "Đang xử lý",
    "Out for delivery": "Đang giao hàng",
    Delivered: "Đã giao",
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <div className="orders-header">
        <p className="title">Đặt hàng</p>
        <div className="separator" />
      </div>
      <div className="container">
        {data.map((order, index) => (
          <div key={index} className="my-orders-order">
            <div className="order-icon">
              <PackageOpen size={32} color="#3b82f6" />
            </div>

            <p>
              {order.items
                .map((item) => `${item.name} × ${item.quantity}`)
                .join(", ")}
            </p>

            <p>{priceFormat(order.amount)}</p>
            <p>Số món: {order.items.length}</p>
            <p>
              <span>●</span>
              <b> {statusOptions[order.status]}</b>
            </p>
            <button onClick={fetchOrders}>Theo dõi đơn</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
