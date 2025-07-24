import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>Đặt món Hàn yêu thích ngay tại đây</h2>
        <p>
          Thưởng thức gà rán chuẩn vị, tokbokki cay, và nhiều món ngon đường phố Hàn Quốc. Mỗi phần ăn là một niềm vui!
        </p>
        <button>Xem Thực Đơn</button>
      </div>
    </div>
  );
};

export default Header;
