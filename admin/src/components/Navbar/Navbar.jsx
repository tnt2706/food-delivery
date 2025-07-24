import React, { useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ThanhDieuHuong = () => {
  const dieuHuong = useNavigate();
  const { token, admin, setAdmin, setToken } = useContext(StoreContext);

  const dangXuat = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setToken("");
    setAdmin(false);
    toast.success("Đăng xuất thành công");
    dieuHuong("/");
  };

  return (
    <div className="navbar">
      <div className="navbar-left" onClick={() => dieuHuong("/")}>
        <img className="logo" src={assets.logo} alt="logo" />
        <h1 className="brand-name">Trang quản trị</h1>
      </div>
      <div className="navbar-right">
        {token && admin ? (
          <p className="auth-btn" onClick={dangXuat}>Đăng xuất</p>
        ) : (
          <p className="auth-btn" onClick={() => dieuHuong("/")}>Đăng nhập</p>
        )}
        <img className="profile" src={assets.profile_image} alt="ảnh đại diện" />
      </div>
    </div>
  );
};

export default ThanhDieuHuong;
