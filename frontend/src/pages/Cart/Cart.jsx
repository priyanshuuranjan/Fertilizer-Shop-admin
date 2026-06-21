import "./Cart.css";
import { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    product_list,
    removeFromCart,
    getTotalCartAmount,
    url,
    deliveryFee,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    getDiscount,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState(null); // { type: "ok"|"err", text }

  const subtotal = getTotalCartAmount();
  const discount = getDiscount();
  const total = subtotal === 0 ? 0 : subtotal + deliveryFee - discount;

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) {
      setPromoMsg({ type: "err", text: "Enter a promo code" });
      return;
    }
    const res = await applyPromoCode(promoInput.trim());
    setPromoMsg({ type: res.success ? "ok" : "err", text: res.message });
    if (res.success) setPromoInput("");
  };

  const handleRemovePromo = () => {
    removePromoCode();
    setPromoMsg(null);
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {product_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id} className="cart-items-title cart-items-item">
                <img src={url + "/images/" + item.image} alt="item image" />
                <p>{item.name}</p>
                <p>₹{item.price}</p>
                <p>{cartItems[item._id]}</p>
                <p>₹{item.price * cartItems[item._id]}</p>
                <p onClick={() => removeFromCart(item._id)} className="cross">
                  x
                </p>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{subtotal === 0 ? 0 : deliveryFee}</p>
            </div>
            <hr />
            {discount > 0 && (
              <>
                <div className="cart-total-details cart-discount">
                  <p>Discount ({appliedPromo.code})</p>
                  <p>− ₹{discount}</p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{total}</b>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p className="promocodep">
              If you have a promo code, Enter it here
            </p>
            {appliedPromo && getDiscount() > 0 ? (
              <div className="cart-promocode-applied">
                <p>
                  <b>{appliedPromo.code}</b> applied — you saved ₹{getDiscount()}
                </p>
                <button onClick={handleRemovePromo}>Remove</button>
              </div>
            ) : (
              <div className="cart-promocode-input">
                <input
                  type="text"
                  placeholder="Promo Code"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                />
                <button onClick={handleApplyPromo}>Submit</button>
              </div>
            )}
            {promoMsg && (
              <p
                className={
                  promoMsg.type === "ok" ? "promo-msg ok" : "promo-msg err"
                }
              >
                {promoMsg.text}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
