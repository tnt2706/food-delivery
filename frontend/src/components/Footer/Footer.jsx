import React from "react";
import "./Footer.css";
import { assets } from "../../assets/frontend_assets/assets";

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        {/* Logo & Mạng xã hội */}
        <div className="footer-section">
          <img className="footer-logo" src={assets.logo} alt="Kokoria Logo" />
          <p className="footer-tagline">Mang ẩm thực đến từng khoảnh khắc</p>
          <div className="footer-social-icons">
            <a href="https://facebook.com/kokoria.sg" target="_blank" rel="noopener noreferrer">
              <img src={assets.facebook_icon} alt="Facebook" />
            </a>
            <a href="https://instagram.com/kokoria.sg" target="_blank" rel="noopener noreferrer">
              <img src={assets.linkedin_icon} alt="Instagram" />
            </a>
          </div>
        </div>

        {/* Liên kết */}
        <div className="footer-section">
          <h3>Công ty</h3>
          <ul>
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/about">Về chúng tôi</a></li>
            <li><a href="/delivery">Giao hàng</a></li>
            <li><a href="/privacy">Chính sách bảo mật</a></li>
          </ul>
        </div>

        {/* Liên hệ */}
        <div className="footer-section">
          <h3>Liên hệ</h3>
          <ul>
            <li><a href="tel:+840708796719">(+84) 070.879.6719</a></li>
            <li><a href="mailto:contact@kokoria.com">contact@kokoria.com</a></li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-bottom-text">
        © 2025 Kokoria.com - All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
