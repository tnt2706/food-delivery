import React, { useEffect, useState, useContext } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { Trash2, Pencil, Eye } from 'lucide-react';
import EditPopup from "../Edit/Edit";
import ViewPopup from "../View/View";

const List = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const [list, setList] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [showViewPopup, setShowViewPopup] = useState(false);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Lỗi khi lấy danh sách món ăn");
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(
      `${url}/api/food/remove`,
      { id: foodId },
      { headers: { token } }
    );
    await fetchList();
    if (response.data.success) {
      toast.success("Đã xóa món ăn thành công");
    } else {
      toast.error("Lỗi khi xóa món ăn");
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowEditPopup(true);
  };

  const handleView = (item) => {
    setViewItem(item);
    setShowViewPopup(true);
  };

  const categoryMap = {
    Chicken: "Gà rán",
    "K-Food": "Món Hàn",
    Tteokbokki: "Tokbokki",
    Bibimbap: "Cơm trộn Hàn Quốc",
    Sides: "Món phụ & Ăn vặt",
    Desserts: "Tráng miệng",
  };

  useEffect(() => {
    if (!admin && !token) {
      toast.error("Vui lòng đăng nhập trước");
      navigate("/");
    }
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <div className="list-table">
        <div className="list-table-format title">
          <b>Hình ảnh</b>
          <b>Tên món</b>
          <b>Danh mục</b>
          <b>Giá</b>
          <b>Thao tác</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className="list-table-format">
            <img src={`${url}/images/${item.image}`} alt={item.name} />
            <p>{item.name}</p>
            <p>{categoryMap[item.category]}</p>
            <p>{item.price.toLocaleString()} đ</p>
            <div className="action-buttons">
              <div
                className="icon-wrapper view-icon"
                title="Xem trước"
                onClick={() => handleView(item)}
              >
                <Eye size={18} strokeWidth={2} />
              </div>
              <div
                className="icon-wrapper edit-icon"
                title="Chỉnh sửa"
                onClick={() => handleEdit(item)}
              >
                <Pencil size={18} strokeWidth={2} />
              </div>
              <div
                className="icon-wrapper delete-icon"
                title="Xóa món"
                onClick={() => removeFood(item._id)}
              >
                <Trash2 size={18} strokeWidth={2} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {showEditPopup && (
        <EditPopup
          item={editItem}
          onClose={() => setShowEditPopup(false)}
          onUpdate={fetchList}
          url={url}
          token={token}
        />
      )}

      {showViewPopup && (
      <ViewPopup
        item={viewItem}
        onClose={() => setShowViewPopup(false)}
        url={url}
      />
    )}
    </div>
  );
};

export default List;
