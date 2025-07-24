import React, { useState } from "react";
import "./Edit.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const EditPopup = ({ item, onClose, onUpdate, url, token }) => {
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(`${url}/images/${item.image}`);
  const [data, setData] = useState({
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", item._id);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(`${url}/api/food/edit`, formData, {
        headers: { token },
      });
      if (response.data.success) {
        toast.success("Cập nhật món ăn thành công");
        onUpdate();
        onClose();
      } else {
        toast.error("❌ Cập nhật thất bại");
      }
    } catch (err) {
      toast.error("Lỗi máy chủ");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>✖</button>
        <h2>Chỉnh sửa món ăn</h2>
        <form className="popup-form" onSubmit={handleSubmit}>
          <div className="popup-img-upload flex-col">
            <p>Ảnh món ăn</p>
            <label htmlFor="edit-image">
              <img
                src={previewImage || assets.upload_area}
                alt="preview"
              />
            </label>
            <input
              type="file"
              id="edit-image"
              onChange={handleImageChange}
              hidden
            />
          </div>

          <label>
            Tên món:
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={onChangeHandler}
              required
            />
          </label>

          <label>
            Mô tả món ăn:
            <textarea
              name="description"
              value={data.description}
              rows="4"
              onChange={onChangeHandler}
              required
            ></textarea>
          </label>

          <label>
            Loại món ăn:
            <select
              name="category"
              value={data.category}
              onChange={onChangeHandler}
              required
            >
              <option value="Chicken">Gà rán</option>
              <option value="K-Food">Món Hàn</option>
              <option value="Tteokbokki">Tokbokki</option>
              <option value="Bibimbap">Cơm trộn Hàn Quốc</option>
              <option value="Sides">Món phụ & Ăn vặt</option>
              <option value="Desserts">Tráng miệng</option>
            </select>
          </label>

          <label>
            Giá món ăn:
            <input
              type="number"
              name="price"
              value={data.price}
              onChange={onChangeHandler}
              required
            />
          </label>

          <button type="submit" className="edit-btn">
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPopup;
