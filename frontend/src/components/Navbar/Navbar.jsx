import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    toast.success("\u0110\u0103ng xu\u1EA5t th\u00E0nh c\u00F4ng");
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="logo" />
      </Link>

      <nav className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          Thực đơn
        </Link>
        <Link
          to="/reservation"
          onClick={() => setMenu("reservation")}
          className={menu === "reservation" ? "active" : ""}
        >
          Đặt bàn
        </Link>
      </nav>

      <div className="navbar-right">
        <div className={`navbar-search-icon ${getTotalCartAmount() > 0 ? 'has-items' : ''}`}>
          <Link to="/cart">
            <img src={assets.basket_icon} alt="Giỏ hàng" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {!token ? (
          <button className="login-btn" onClick={() => setShowLogin(true)}>Đăng nhập</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="Tài khoản" className="profile-icon" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myorders")}> <img src={assets.bag_icon} alt="Đơn hàng" /> <p>Đơn hàng</p> </li>
              <hr />
              <li onClick={logout}> <img src={assets.logout_icon} alt="Đăng xuất" /> <p>Đăng xuất</p> </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
