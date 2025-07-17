import React from "react";
import "./Footer.css";
import { assets } from "../../assets/frontend_assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img className="footer-logo" src={assets.logo} alt="" />
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="https://facebook.com" />
            <img src={assets.twitter_icon} alt="https://twitter.com" />
            <img src={assets.linkedin_icon} alt="https://linkedin.com" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>Company</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>Get in touch</h2>
          <ul>
            <li>+84-308-4900522</li>
            <li>contact@kokoria.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2025 @ Kokoria.com - All Right Reserved.
      </p>
    </div>
  );
};

export default Footer;
