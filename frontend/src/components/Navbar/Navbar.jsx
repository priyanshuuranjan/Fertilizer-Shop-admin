import { useState, useContext } from "react";
import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";


const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  // Scroll to an in-page section. If we're not on the page that has it,
  // route there first (via React Router) and then scroll once it renders.
  const scrollToSection = (id, onHomeOnly = false) => {
    const doScroll = () =>
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    if (onHomeOnly && location.pathname !== "/") {
      navigate("/");
      setTimeout(doScroll, 100);
    } else {
      doScroll();
    }
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="logo" />
      </Link>
      <button
        className={`navbar-hamburger ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Menu"
      >
        <span />
        <span />
        <span />
      </button>
      <ul
        className={`navbar-menu ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
      >
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>
        <a
          onClick={() => {
            setMenu("menu");
            scrollToSection("explore-menu", true);
          }}
          className={menu === "menu" ? "active" : ""}
          style={{ cursor: "pointer" }}
        >
          Menu
        </a>
        <Link
        to="/myorders"
          onClick={() => setMenu("order")}
          className={menu === "order" ? "active" : ""}
        >
          Order
        </Link>
        <Link
          to="/advisor"
          onClick={() => setMenu("advisor")}
          className={menu === "advisor" ? "active" : ""}
        >
          Crop Advisor
        </Link>
        <a
          onClick={() => {
            setMenu("contact-us");
            scrollToSection("footer");
          }}
          className={menu === "contact-us" ? "active" : ""}
          style={{ cursor: "pointer" }}
        >
          Contact Us
        </a>
      </ul>
      <div className="navbar-right">
        {/* <img src={assets.search_icon} alt="search icon" /> */}
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img className="basketlogo" src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button className="signbutton" onClick={() => setShowLogin(true)}>
            sign in
          </button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} className="white-filter" alt="" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="icon" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="icon" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
