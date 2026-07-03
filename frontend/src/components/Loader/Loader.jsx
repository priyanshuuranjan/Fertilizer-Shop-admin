import "./Loader.css";

// Full-screen branded loader shown while the app boots / products load.
// A growing seedling inside a spinning orbit — themed for a fertilizer shop.
const Loader = ({ message = "Growing your store..." }) => (
  <div className="loader-screen" role="status" aria-live="polite">
    <div className="loader-stage">
      <span className="loader-orbit" />
      <span className="loader-orbit loader-orbit-2" />
      <span className="loader-seedling">🌱</span>
    </div>
    <p className="loader-text">{message}</p>
    <div className="loader-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
);

// Small inline spinner for buttons / sections.
export const Spinner = ({ size = 22 }) => (
  <span
    className="inline-spinner"
    style={{ width: size, height: size }}
    aria-label="loading"
  />
);

export default Loader;
