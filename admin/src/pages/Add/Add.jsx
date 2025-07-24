import React, { useState, useEffect, useContext } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Add = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);

  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Chicken",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    const response = await axios.post(`${url}/api/food/add`, formData, {
      headers: { token },
    });

    if (response.data.success) {
      setData({
        name: "",
        description: "",
        price: "",
        category: "Chicken",
      });
      setImage(false);
      toast.success("🎉 " + response.data.message);
    } else {
      toast.error("❌ " + response.data.message);
    }
  };

  useEffect(() => {
    if (!admin && !token) {
      toast.error("Vui lòng đăng nhập trước");
      navigate("/");
    }
  }, []);

  return (
    <div className="add">
      <form onSubmit={onSubmitHandler} className="flex-col">
        <div className="add-img-upload flex-col">
          <p>Tải ảnh món ăn</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Tải ảnh"
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Tên món</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Nhập tên món ăn"
            required
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Mô tả món ăn</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Mô tả chi tiết về món ăn"
            required
          ></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Loại món ăn</p>
            <select
              name="category"
              required
              onChange={onChangeHandler}
              value={data.category}
            >
              <option value="Chicken">Gà rán</option>
              <option value="K-Food">Món Hàn</option>
              <option value="Tteokbokki">Tokbokki</option>
              <option value="Bibimbap">Cơm trộn Hàn Quốc</option>
              <option value="Sides">Món phụ & Ăn vặt</option>
              <option value="Desserts">Tráng miệng</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Giá món ăn</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="VD: 20.000 đ"
              required
            />
          </div>
        </div>

        <button type="submit" className="add-btn">
          Thêm món
        </button>
      </form>
    </div>
  );
};

export default Add;
