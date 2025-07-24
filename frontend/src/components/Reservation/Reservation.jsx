import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./Reservation.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";

const Reservation = () => {
  const navigate = useNavigate();
  const { url, token } = useContext(StoreContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    branch: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const validate = (fields = form) => {
    const newErrors = {};
    if (!fields.name.trim()) newErrors.name = "Vui lòng nhập họ tên";
    if (!fields.email.trim()) newErrors.email = "Vui lòng nhập email";
    if (!fields.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!fields.date) newErrors.date = "Vui lòng chọn ngày";
    if (!fields.time) newErrors.time = "Vui lòng chọn giờ";
    if (!fields.guests || Number(fields.guests) < 1) newErrors.guests = "Cần ít nhất 1 khách";
    if (!fields.branch.trim()) newErrors.branch = "Vui lòng chọn chi nhánh";
    return newErrors;
  };

  useEffect(() => {
    const currentErrors = validate();
    setIsFormValid(Object.keys(currentErrors).length === 0);
  }, [form]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (!token) {
        toast.error("Vui lòng đăng nhập trước");
        navigate("/reservation"); // hoặc chuyển hướng đến "/signin"
        throw new Error("Người dùng chưa xác thực");
      }

      const payload = {
        email: form.email,
        phone: form.phone,
        date: new Date(`${form.date}T${form.time}`),
        guests: Number(form.guests),
        branch: form.branch,
        message: form.message,
      };

      await axios.post(`${url}/api/reservation/add`, payload, {
        headers: { token },
      });

      setSubmitStatus("success");
      setTimeout(() => {
        window.location.href = "/";
      }, 5000);
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="success-screen">
        <h2>🎉 Đặt bàn thành công!</h2>
        <p>Cảm ơn bạn đã đặt chỗ.</p>
        <p>Bạn sẽ được chuyển hướng về trang chủ sau ít giây...</p>
      </div>
    );
  }

  return (
    <div className="reservation-container">
      <form className="reservation-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <p className="title">Form Đặt Bàn</p>
        <div className="separator" />
        <div className="description">
          <span className="icon">🔔</span>
          Vui lòng đặt bàn trước ít nhất 2 tiếng. Chúng tôi sẽ xác nhận qua email hoặc điện thoại.
        </div>
      </div>


        <label>
          Họ tên liên hệ <span className="required">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className={errors.name ? "input-error" : ""}
        />
        {errors.name && <div className="error">{errors.name}</div>}

        <label>
          Địa chỉ email <span className="required">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className={errors.email ? "input-error" : ""}
        />
        {errors.email && <div className="error">{errors.email}</div>}

        <label>
          Số điện thoại <span className="required">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className={errors.phone ? "input-error" : ""}
        />
        {errors.phone && <div className="error">{errors.phone}</div>}

        <div className="row">
          <div className="column">
            <label>
              Ngày đến <span className="required">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={errors.date ? "input-error" : ""}
            />
            {errors.date && <div className="error">{errors.date}</div>}
          </div>
          <div className="column">
            <label>
              Giờ <span className="required">*</span>
            </label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className={errors.time ? "input-error" : ""}
            />
            {errors.time && <div className="error">{errors.time}</div>}
          </div>
        </div>

        <label>
          Số lượng khách <span className="required">*</span>
        </label>
        <input
          type="number"
          name="guests"
          value={form.guests}
          onChange={handleChange}
          className={errors.guests ? "input-error" : ""}
        />
        {errors.guests && <div className="error">{errors.guests}</div>}

        <label>
          Chi nhánh <span className="required">*</span>
        </label>
        <select
          name="branch"
          value={form.branch}
          onChange={handleChange}
          className={errors.branch ? "input-error" : ""}
        >
          <option value="">Chọn chi nhánh</option>
          <option>🏡 207/33 đường 3/2, Q.10</option>
          <option>🏡 573/2 Sư Vạn Hạnh, Q.10</option>
          <option>🏡 106 Lê Văn Duyệt, Q.Bình Thạnh</option>
          <option>🏡 228A Trần Hưng Đạo, Cần Thơ</option>
        </select>
        {errors.branch && <div className="error">{errors.branch}</div>}

        <label>Tin nhắn thêm</label>
        <textarea
          name="message"
          rows="3"
          value={form.message}
          onChange={handleChange}
          placeholder="Nhập yêu cầu hoặc lời nhắn của bạn"
        ></textarea>

        <button type="submit" disabled={!isFormValid}>
          Gửi đặt bàn
        </button>

        {submitStatus === "error" && (
          <p className="error-msg">Gửi thất bại. Vui lòng thử lại.</p>
        )}
      </form>
    </div>
  );
};

export default Reservation;
