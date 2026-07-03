import "./Spinner.css";

const Spinner = ({ label = "Loading...", size = 38 }) => (
  <div className="spinner-wrap" role="status" aria-live="polite">
    <span
      className="spinner-ring"
      style={{ width: size, height: size }}
    />
    {label && <p className="spinner-label">{label}</p>}
  </div>
);

export default Spinner;
