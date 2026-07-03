import "./PrintSlip.css";

const DELIVERY_FEE = 45;
const BRAND = "Kumar Fertilizer Shop";

// Renders a packing-slip layout for a single order. Stays off-screen in
// normal use; @media print rules (see PrintSlip.css) make it the only
// visible thing on the page when window.print() is triggered.
const PrintSlip = ({ order }) => {
  if (!order) return null;

  const addr = order.address || {};
  const subtotal = (order.items || []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const orderDate = new Date(order.date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="print-slip">
      <div className="ps-header">
        <div>
          <h1>{BRAND}</h1>
          <p className="ps-tagline">Packing Slip</p>
        </div>
        <div className="ps-meta">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Date:</strong> {orderDate}</p>
          <p><strong>Payment:</strong> {order.payment ? "Paid" : "Pending"}</p>
          <p><strong>Status:</strong> {order.status}</p>
        </div>
      </div>

      <div className="ps-ship-to">
        <p className="ps-label">Ship To</p>
        <p className="ps-customer-name">{addr.firstName} {addr.lastName}</p>
        {addr.street && <p>{addr.street}</p>}
        <p>{[addr.city, addr.state, addr.country, addr.zipcode].filter(Boolean).join(", ")}</p>
        {addr.phone && <p>Phone: {addr.phone}</p>}
      </div>

      <table className="ps-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {(order.items || []).map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>₹{item.price}</td>
              <td>₹{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ps-totals">
        <div><span>Subtotal</span><span>₹{subtotal}</span></div>
        <div><span>Delivery Fee</span><span>₹{DELIVERY_FEE}</span></div>
        {order.discount > 0 && (
          <div><span>Discount {order.promoCode ? `(${order.promoCode})` : ""}</span><span>- ₹{order.discount}</span></div>
        )}
        <div className="ps-grand-total"><span>Grand Total</span><span>₹{order.amount}</span></div>
      </div>

      <p className="ps-footer">Thank you for shopping with us! — {BRAND}</p>
    </div>
  );
};

export default PrintSlip;
