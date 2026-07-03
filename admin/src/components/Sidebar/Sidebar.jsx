import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isSuperAdmin }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/dashboard" className="sidebar-option">
          <svg className="sidebar-svg orderr" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
          <p>Dashboard</p>
        </NavLink>

        <NavLink to="/add" className="sidebar-option">
          <img className="addd" src={assets.add_icon} alt="icon" />
          <p>Add Items</p>
        </NavLink>

        <NavLink to="/list" className="sidebar-option">
          <img className="listt" src={assets.order_icon} alt="icon" />
          <p>List Items</p>
        </NavLink>

        <NavLink to="/orders" className="sidebar-option">
          <img className="orderr" src={assets.order_icon} alt="icon" />
          <p>Orders</p>
        </NavLink>

        <NavLink to="/customers" className="sidebar-option">
          <svg className="sidebar-svg orderr" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <p>Customers</p>
        </NavLink>

        <NavLink to="/promocode" className="sidebar-option">
          <img className="orderr" src={assets.order_icon} alt="icon" />
          <p>Promo Codes</p>
        </NavLink>

        {isSuperAdmin && (
          <NavLink to="/staff" className="sidebar-option">
            <svg className="sidebar-svg orderr" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
              <path d="M12 12v0" />
            </svg>
            <p>Manage Staff</p>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
