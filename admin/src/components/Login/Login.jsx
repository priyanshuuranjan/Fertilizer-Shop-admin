import { useRef, useState } from "react";
import "./Login.css";
import axios from "axios";
import { toast } from "react-toastify";

const Login = ({ url, onLogin }) => {
  const [data, setData] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const tiltRef = useRef(null);

  const onChange = (e) =>
    setData((d) => ({ ...d, [e.target.name]: e.target.value }));

  // Interactive 3D tilt that follows the cursor
  const onMove = (e) => {
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${px * 10}deg`);
    el.style.setProperty("--rx", `${-py * 10}deg`);
  };
  const onLeave = () => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${url}/api/admin/login`, data);
      if (res.data.success) {
        setSuccess(true);
        setTimeout(
          () => onLogin(res.data.token, res.data.role, res.data.name),
          1000
        );
      } else {
        toast.error(res.data.message || "Login failed");
        setLoading(false);
      }
    } catch (err) {
      toast.error("Server error — is the backend running?");
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      {/* animated background */}
      <div className="login-orb orb-a" />
      <div className="login-orb orb-b" />
      <div className="login-orb orb-c" />
      <div className="login-grid" />

      <div className="login-perspective" onMouseMove={onMove} onMouseLeave={onLeave}>
        <div
          ref={tiltRef}
          className={`login-card ${success ? "is-success" : ""}`}
        >
          {/* ===== Brand panel ===== */}
          <div className="login-brand">
            <div className="brand-glow" />
            <svg className="brand-art" viewBox="0 0 200 210" aria-hidden="true">
              <defs>
                <linearGradient id="pot" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#1f9d57" />
                  <stop offset="1" stopColor="#0c6b39" />
                </linearGradient>
                <linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#7ef0a3" />
                  <stop offset="1" stopColor="#34c46f" />
                </linearGradient>
              </defs>
              {/* floating rings */}
              <circle className="ring ring1" cx="100" cy="96" r="78" />
              <circle className="ring ring2" cx="100" cy="96" r="58" />
              {/* pot */}
              <path d="M68 140 L132 140 L123 188 Q100 196 77 188 Z" fill="url(#pot)" />
              <ellipse cx="100" cy="141" rx="32" ry="7" fill="#3a2418" />
              {/* stem + leaves */}
              <path
                className="sprout"
                d="M100 141 C100 118 100 100 100 84"
                stroke="#3fae5e"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />
              <path
                className="leaf-l"
                d="M100 112 C76 108 64 90 67 70 C92 74 102 92 100 112Z"
                fill="url(#leaf)"
              />
              <path
                className="leaf-r"
                d="M100 102 C124 98 136 80 133 60 C108 64 98 82 100 102Z"
                fill="url(#leaf)"
              />
              <circle className="bud" cx="100" cy="80" r="7" fill="#a8f7c2" />
              {/* particles */}
              <circle className="dot d1" cx="40" cy="50" r="3" fill="#bff7d2" />
              <circle className="dot d2" cx="165" cy="44" r="4" fill="#ffe88a" />
              <circle className="dot d3" cx="158" cy="150" r="3" fill="#bff7d2" />
              <circle className="dot d4" cx="36" cy="150" r="4" fill="#9be8ff" />
            </svg>
            <h2 className="brand-title">Kumar Fertilizer</h2>
            <p className="brand-tag">Grow smart. Manage easy.</p>
          </div>

          {/* ===== Form panel ===== */}
          <form className="login-form" onSubmit={onSubmit}>
            <div className="form-badge">
              {success ? <span className="badge-check">✓</span> : "🔐"}
            </div>
            <h1>{success ? "Welcome back!" : "Admin Sign In"}</h1>
            <p className="form-sub">
              {success ? "Opening your dashboard…" : "Enter your credentials to continue"}
            </p>

            <label className="float-field">
              <span className="ff-icon">📧</span>
              <input
                name="email"
                type="email"
                placeholder=" "
                value={data.email}
                onChange={onChange}
                required
                autoComplete="username"
              />
              <span className="ff-label">Email address</span>
            </label>

            <label className="float-field">
              <span className="ff-icon">🔑</span>
              <input
                name="password"
                type={showPass ? "text" : "password"}
                placeholder=" "
                value={data.password}
                onChange={onChange}
                required
                autoComplete="current-password"
              />
              <span className="ff-label">Password</span>
              <button
                type="button"
                className="ff-eye"
                onClick={() => setShowPass((s) => !s)}
                tabIndex={-1}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </label>

            <button
              type="submit"
              className={`login-btn ${loading ? "loading" : ""} ${
                success ? "done" : ""
              }`}
              disabled={loading || success}
            >
              {success ? (
                "✓ Success"
              ) : loading ? (
                <span className="login-spinner" />
              ) : (
                <>
                  Sign In <span className="btn-arrow">→</span>
                </>
              )}
            </button>

            <p className="login-foot">🔒 Authorized access only</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
