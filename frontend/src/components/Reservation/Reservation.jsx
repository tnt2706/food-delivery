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
    if (!fields.name.trim()) newErrors.name = "Name is required";
    if (!fields.email.trim()) newErrors.email = "Email is required";
    if (!fields.phone.trim()) newErrors.phone = "Phone number is required";
    if (!fields.date) newErrors.date = "Date is required";
    if (!fields.time) newErrors.time = "Time is required";
    if (!fields.guests || Number(fields.guests) < 1) newErrors.guests = "At least 1 guest";
    if (!fields.branch.trim()) newErrors.branch = "Please select a location";
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
        toast.error("Please login first");
        navigate("/reservation"); // hoặc "/signin" tùy theo app của bạn
        throw new Error("User not authenticated");
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
        <h2>🎉 Reservation Successful!</h2>
        <p>Thank you for your booking.</p>
        <p>We’ll redirect you to the homepage in a moment...</p>
      </div>
    );
  }

  return (
    <div className="reservation-container">
      <form className="reservation-form" onSubmit={handleSubmit}>
        <h1 className="title">Table Reservation Form</h1>
        <p className="description">
          Book at least <strong>2 hours</strong> in advance. We’ll confirm via email or phone.
        </p>

        <label>
          Contact name <span className="required">*</span>
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
          Email address <span className="required">*</span>
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
          Phone number <span className="required">*</span>
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
              Date of arrival <span className="required">*</span>
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
              Time <span className="required">*</span>
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
          Number of guests <span className="required">*</span>
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
          Location <span className="required">*</span>
        </label>
        <select
          name="branch"
          value={form.branch}
          onChange={handleChange}
          className={errors.branch ? "input-error" : ""}
        >
          <option value="">Select a location</option>
          <option>Downtown</option>
          <option>City Mall</option>
          <option>Riverside</option>
        </select>
        {errors.branch && <div className="error">{errors.branch}</div>}

        <label>Additional message</label>
        <textarea
          name="message"
          rows="3"
          value={form.message}
          onChange={handleChange}
          placeholder="Enter any request or message"
        ></textarea>

        <button type="submit" disabled={!isFormValid}>
          Submit Reservation
        </button>

        {submitStatus === "error" && (
          <p className="error-msg">Submission failed. Please try again.</p>
        )}
      </form>
    </div>
  );
};

export default Reservation;
