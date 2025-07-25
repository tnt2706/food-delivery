import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const Login = ({ url }) => {
  const navigate = useNavigate();
  const { admin, setAdmin, token, setToken } = useContext(StoreContext);
  const [data, setData] = useState({ email: "", password: "" });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(url + "/api/user/login", data);
      if (res.data.success) {
        if (res.data.role === "admin") {
          setToken(res.data.token);
          setAdmin(true);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("admin", true);
          toast.success("Đăng nhập thành công");
          navigate("/add");
        } else {
          toast.error("Bạn không có quyền truy cập Admin");
        }
      } else {
        toast.error(res.data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      toast.error("Không thể đăng nhập. Vui lòng kiểm tra lại thông tin.");
    }
  };

  useEffect(() => {
    if (admin && token) navigate("/add");
  }, []);

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <img src={assets.logo} className="login-popup-logo" alt="Logo" />
        <div className="login-popup-title">
          Đăng nhập quản trị
        </div>
        <div className="login-popup-inputs">
          <input
            name="email"
            value={data.email}
            // value="admin@gmail.com"
            onChange={onChangeHandler}
            type="email"
            placeholder="Nhập email của bạn"
            required
          />
          <input
            name="password"
            value={data.password}
            // value = "tranngoctinh96"
            onChange={onChangeHandler}
            type="password"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};

export default Login;
