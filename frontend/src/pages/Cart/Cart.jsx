import React, { useContext, useEffect, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { priceFormat } from "../../utils/priceFormat";

const Cart = () => {
  const {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
  } = useContext(StoreContext);

  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  // Tính lại tổng khi cartItems thay đổi
  useEffect(() => {
    setTotalAmount(getTotalCartAmount());
  }, [cartItems, getTotalCartAmount]);

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Ảnh</p>
          <p>Tên món</p>
          <p>Đơn giá</p>
          <p>Số lượng</p>
          <p>Thành tiền</p>
          <p>Xóa</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={`${url}/images/${item.image}`} alt={item.name} />
                  <p>{item.name}</p>
                  <p>{priceFormat(item.price)}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>{priceFormat(item.price * cartItems[item._id])}</p>
                  <p
                    onClick={() => removeFromCart(item._id)}
                    className="cross"
                    style={{ cursor: "pointer" }}
                  >
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Tổng giỏ hàng</h2>
          <div>
            <div className="cart-total-details">
              <p>Tạm tính</p>
              <p>{priceFormat(totalAmount)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Phí giao hàng</p>
              <p>{ priceFormat(totalAmount === 0 ? 0 : 20000)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Tổng cộng</b>
              <b>{priceFormat(totalAmount === 0 ? 0 : totalAmount + 20000)}</b>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>
            TIẾN HÀNH THANH TOÁN
          </button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>Nếu bạn có mã giảm giá, nhập tại đây</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Mã giảm giá" />
              <button>Áp dụng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
