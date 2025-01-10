import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>Nurture Your Fields with the Best Fertilizer!</h2>
        <p>
          Order premium fertilizers to enrich your soil and boost crop yield.
          Choose sustainable products to cultivate healthier fields and a
          greener tomorrow.
        </p>
        <a href="#explore-menu">
          <button className="buttonwl">View Menu</button>
        </a>
      </div>
    </div>
  );
};

export default Header;
