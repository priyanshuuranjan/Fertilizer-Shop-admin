import { useState } from "react";
import "./ProductItem.css";
import { assets } from "../../assets/assets";

const ProductItem = ({ id, name, price, description, image }) => {
  const [itemCount, setItemCount] = useState(0);
  return (
    <div className="product-item">
      <div className="product-item-img-container">
        <img className="product-item-image" src={image} alt="" />
        {!itemCount ? (
          <img
            className="add"
            onClick={() => setItemCount((prev) => prev + 1)}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className="product-item-counter">
            <img
              onClick={() => setItemCount((prev) => prev - 1)}
              src={assets.remove_icon_red}
              alt=""
            />
            <p className="cartitemsp">{itemCount}</p>
            <img
              onClick={() => setItemCount((prev) => prev + 1)}
              src={assets.add_icon_green}
              alt=""
            />
          </div>
        )}
      </div>
      <div className="product-item-info">
        <div className="product-item-name-rating">
          <p className="namewe">{name}</p>
          <img className="ratingstars" src={assets.rating_starts} alt="" />
        </div>
        <p className="product-item-desc">{description}</p>
        <p className="product-item-price">₹{price}</p>
      </div>
    </div>
  );
};

export default ProductItem;
