import { useContext, useRef } from "react";
import "./ProductItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const ProductItem = ({ id, name, price, description, image, size, stock }) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);

  const cardRef = useRef(null);

  const outOfStock = stock !== undefined && stock <= 0;

  // Interactive 3D tilt: rotate the card toward the cursor with a subtle
  // depth lift. Resets smoothly when the pointer leaves.
  const handleMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 14; // left/right
    const rotateX = (0.5 - y) * 14; // up/down
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    card.style.setProperty("--glow-x", `${x * 100}%`);
    card.style.setProperty("--glow-y", `${y * 100}%`);
  };

  const handleLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform =
      "perspective(900px) rotateX(0) rotateY(0) translateY(0) scale(1)";
  };

  return (
    <div
      ref={cardRef}
      className={`product-item ${outOfStock ? "product-item-oos" : ""}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="product-item-glow" />
      <div className="product-item-img-container">
        <img
          className="product-item-image"
          src={url + "/images/" + image}
          alt=""
        />
        {outOfStock && <span className="oos-badge">Out of Stock</span>}
        {outOfStock ? null : !cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className="product-item-counter">
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt=""
            />
            <p className="cartitemsp">{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
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
        <div className="product-item-price-size">
          <p className="product-item-price">₹{price}</p>
          <p className="product-item-size">Size: {size}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
