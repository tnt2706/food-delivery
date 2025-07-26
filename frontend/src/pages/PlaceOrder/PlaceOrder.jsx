import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { priceFormat } from "../../utils/priceFormat";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [submitStatus, setSubmitStatus] = useState("");

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];

    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item };
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 20000,
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });

      if (response.data.success) {
        setSubmitStatus("success");
        setTimeout(() => {
          window.location.href = "/";
        }, 5000);
      } else {
        toast.error("Đã có lỗi xảy ra khi đặt hàng.");
        setSubmitStatus("error");
      }
    } catch (error) {
      toast.error("Không thể gửi đơn hàng. Vui lòng thử lại.");
      setSubmitStatus("error");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Vui lòng đăng nhập trước khi đặt hàng.");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      toast.error("Vui lòng thêm món vào giỏ hàng.");
      navigate("/cart");
    }
  }, [token]);

  if (submitStatus === "success") {
    return (
      <div className="success-screen">
        <h2>🎉 Đặt hàng thành công!</h2>
        <p>Cảm ơn bạn đã mua hàng.</p>
        <p>Bạn sẽ được chuyển về trang chủ trong giây lát...</p>
      </div>
    );
  }

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Thông tin giao hàng</p>
        <div className="multi-fields">
          <input
            required
            name="lastName"
            value={data.lastName}
            onChange={onChangeHandler}
            type="text"
            placeholder="Họ"
          />
          <input
            required
            name="firstName"
            value={data.firstName}
            onChange={onChangeHandler}
            type="text"
            placeholder="Tên"
          />
        </div>
        <input
          required
          name="email"
          value={data.email}
          onChange={onChangeHandler}
          type="email"
          placeholder="Địa chỉ Email"
        />
        <input
          name="street"
          value={data.street}
          onChange={onChangeHandler}
          type="text"
          placeholder="Địa chỉ (số nhà, đường...)"
        />
        <div className="multi-fields">
          <input
            name="city"
            value={data.city}
            onChange={onChangeHandler}
            type="text"
            placeholder="Quận / Huyện"
          />
          <input
            name="state"
            value={data.state}
            onChange={onChangeHandler}
            type="text"
            placeholder="Tỉnh / Thành phố "
          />
        </div>
        <input
          name="phone"
          value={data.phone}
          onChange={onChangeHandler}
          type="text"
          placeholder="Số điện thoại"
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Tổng đơn hàng</h2>
          <div>
            <div className="cart-total-details">
              <p>Tạm tính</p>
              <p>{priceFormat(getTotalCartAmount())}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Phí giao hàng</p>
              <p>{priceFormat(getTotalCartAmount() === 0 ? 0 : 20000)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Tổng cộng</b>
              <b>
                {priceFormat(getTotalCartAmount() === 0
                  ? 0
                  : getTotalCartAmount() + 20000)}
              </b>
            </div>
          </div>
          <button type="submit">THANH TOÁN NGAY</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
