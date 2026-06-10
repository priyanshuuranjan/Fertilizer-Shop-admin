import "./Skeleton.css";

// Base shimmer block — Facebook/YouTube style animated placeholder.
export const Skeleton = ({
  width = "100%",
  height = "16px",
  radius = "6px",
  className = "",
  style = {},
}) => (
  <span
    className={`skeleton ${className}`}
    style={{ width, height, borderRadius: radius, ...style }}
  />
);

// Placeholder that matches one row of the List table (6 columns).
export const ListRowSkeleton = () => (
  <div className="list-table-format">
    <Skeleton width="50px" height="50px" radius="4px" />
    <Skeleton width="80%" height="14px" />
    <Skeleton width="60%" height="14px" />
    <Skeleton width="40%" height="14px" />
    <Skeleton width="50%" height="14px" />
    <Skeleton width="20px" height="14px" />
  </div>
);

// Placeholder that matches one Orders card.
export const OrderCardSkeleton = () => (
  <div className="order-item">
    <Skeleton width="50px" height="50px" radius="6px" />
    <div className="skeleton-stack">
      <Skeleton width="90%" height="14px" />
      <Skeleton width="50%" height="14px" />
      <Skeleton width="70%" height="12px" />
      <Skeleton width="60%" height="12px" />
      <Skeleton width="40%" height="12px" />
    </div>
    <Skeleton width="60%" height="14px" />
    <Skeleton width="50%" height="14px" />
    <Skeleton width="120px" height="40px" radius="0" />
  </div>
);

export default Skeleton;
