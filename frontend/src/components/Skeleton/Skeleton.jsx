import "./Skeleton.css";

// Base shimmer block — Facebook/YouTube style animated placeholder.
// Pass any width/height/radius; everything else composes from this.
export const Skeleton = ({
  width = "100%",
  height = "16px",
  radius = "8px",
  className = "",
  style = {},
}) => (
  <span
    className={`skeleton ${className}`}
    style={{ width, height, borderRadius: radius, ...style }}
  />
);

// Placeholder that matches one ProductItem card (image + info block).
export const ProductCardSkeleton = () => (
  <div className="product-item skeleton-card">
    <Skeleton className="skeleton-card-img" height="300px" radius="15px 15px 0 0" />
    <div className="product-item-info">
      <div className="skeleton-row">
        <Skeleton width="55%" height="20px" />
        <Skeleton width="70px" height="16px" />
      </div>
      <Skeleton width="100%" height="10px" style={{ marginTop: "14px" }} />
      <Skeleton width="80%" height="10px" style={{ marginTop: "8px" }} />
      <div className="skeleton-row" style={{ marginTop: "20px" }}>
        <Skeleton width="35%" height="18px" />
        <Skeleton width="28%" height="16px" />
      </div>
    </div>
  </div>
);

// Placeholder that matches one MyOrders row.
export const OrderRowSkeleton = () => (
  <div className="my-orders-order">
    <Skeleton width="50px" height="50px" radius="50%" />
    <Skeleton width="85%" height="14px" />
    <Skeleton width="55%" height="14px" />
    <Skeleton width="45%" height="14px" />
    <Skeleton width="65%" height="14px" />
    <Skeleton width="100%" height="38px" radius="4px" />
  </div>
);

export default Skeleton;
