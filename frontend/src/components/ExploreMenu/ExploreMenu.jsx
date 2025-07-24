import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/frontend_assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Khám phá thực đơn</h1>
      <p className="explore-menu-text">
        Chọn từ thực đơn phong phú với nhiều món ăn hấp dẫn. Sứ mệnh của chúng tôi là làm hài lòng khẩu vị của bạn và nâng tầm trải nghiệm ẩm thực, từng bữa ăn ngon lành một.
      </p>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_image.name ? "All" : item.menu_name
                )
              }
              key={index}
              className="explore-menu-list-item"
            >
              <img
                className={category === item.menu_name ? "active" : ""}
                src={item.menu_image}
                alt=""
              />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
