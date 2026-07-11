import { useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import PromoCode from "./pages/PromoCode/PromoCode";
import Dashboard from "./pages/Dashboard/Dashboard";
import Customers from "./pages/Customers/Customers";
import StaffManagement from "./pages/StaffManagement/StaffManagement";
import Insights from "./pages/Insights/Insights";
import Login from "./components/Login/Login";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const App = () => {
  const url = import.meta.env.VITE_API_URL;
  const [token, setToken] = useState(
    () => localStorage.getItem("adminToken") || ""
  );
  const [role, setRole] = useState(() => localStorage.getItem("adminRole") || "");
  const [name, setName] = useState(() => localStorage.getItem("adminName") || "");

  // Every admin request carries the token header — the backend now enforces
  // Super Admin vs Staff on the sensitive routes regardless of what the UI hides.
  // Set synchronously during render (NOT in an effect): child pages fire their
  // data fetches in effects that run BEFORE a parent effect would, so on a hard
  // refresh every page was hitting the API without the token and getting 401s.
  if (token) axios.defaults.headers.common["token"] = token;
  else delete axios.defaults.headers.common["token"];

  const handleLogin = (tok, userRole, userName) => {
    localStorage.setItem("adminToken", tok);
    localStorage.setItem("adminRole", userRole || "");
    localStorage.setItem("adminName", userName || "");
    setToken(tok);
    setRole(userRole || "");
    setName(userName || "");
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminName");
    setToken("");
    setRole("");
    setName("");
  };

  const isSuperAdmin = role === "superadmin";

  if (!token) {
    return (
      <>
        <ToastContainer />
        <Login url={url} onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div className="admin-app-enter">
      <ToastContainer />
      <Navbar onLogout={handleLogout} name={name} role={role} />
      <hr />
      <div className="app-content">
        <Sidebar isSuperAdmin={isSuperAdmin} />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard url={url} isSuperAdmin={isSuperAdmin} />} />
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} isSuperAdmin={isSuperAdmin} />} />
          <Route path="/orders" element={<Orders url={url} />} />
          <Route path="/customers" element={<Customers url={url} />} />
          <Route path="/promocode" element={<PromoCode url={url} />} />
          <Route path="/insights" element={<Insights url={url} />} />
          <Route
            path="/staff"
            element={
              isSuperAdmin ? (
                <StaffManagement url={url} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
