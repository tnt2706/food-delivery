import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>Order your favourite food here</h2>
        <p>
         Discover the bold, savory flavors of Korea with our signature fried chicken and classic street food.
         Whether you crave spicy tteokbokki or sweet soy garlic wings, we’re here to serve happiness in every bite.
        </p>
        <button>View Menu</button>
      </div>
    </div>
  );
};

export default Header;
