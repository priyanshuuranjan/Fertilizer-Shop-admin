import "./ProductItem.css";
import { assets } from "../../assets/assets";

const ProductItem = ({ id, name, price, description, image }) => {
  return (
    <div className="product-item">
      <div className="product-item-img-container">
        <img className="product-item-image" src={image} alt="" />
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
