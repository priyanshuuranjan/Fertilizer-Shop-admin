import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import PromoCode from "./pages/PromoCode/PromoCode";
import Dashboard from "./pages/Dashboard/Dashboard";
import Customers from "./pages/Customers/Customers";
import Login from "./components/Login/Login";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const App = () => {
  const url = import.meta.env.VITE_API_URL;
  const [token, setToken] = useState(
    () => localStorage.getItem("adminToken") || ""
  );

  const handleLogin = (tok) => {
    localStorage.setItem("adminToken", tok);
    setToken(tok);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
  };

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
      <Navbar onLogout={handleLogout} />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard url={url} />} />
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
          <Route path="/customers" element={<Customers url={url} />} />
          <Route path="/promocode" element={<PromoCode url={url} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
