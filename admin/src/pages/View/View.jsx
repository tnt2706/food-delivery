import React from "react";
import "./View.css";
import { assets } from "../../assets/assets";

const ViewPopup = ({ item, onClose, url }) => {
  const previewImage = `${url}/images/${item.image}`;

  const formatPrice = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("vi-VN");
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h3>Chi tiết món ăn</h3>
          <button className="popup-close" onClick={onClose}>✖</button>
        </div>

        <div className="popup-body">
          <div className="image-section">
            <img src={previewImage || assets.upload_area} alt="Hình ảnh món ăn" />
          </div>

          <div className="info-grid">
            <div className="info-item full">
              <div className="label">Tên món</div>
              <div className="value">{item.name}</div>
            </div>

            <div className="info-item full">
              <div className="label">Mô tả món ăn</div>
              <div className="value">{item.description}</div>
            </div>

            <div className="info-item">
              <div className="label">Loại món ăn</div>
              <div className="value">{item.category}</div>
            </div>

            <div className="info-item">
              <div className="label">Giá món ăn</div>
              <div className="value price">{formatPrice(item.price)} ₫</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPopup;
