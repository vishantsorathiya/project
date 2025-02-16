import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Admin.css"; // External CSS file for styles

export default function Admin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><Link to="/admin">Products</Link></li>
          <li><Link to="/admin/orders">Orders</Link></li>
          <li><Link to="/admin/categories">Categories</Link></li>
        </ul>
        <button onClick={handleLogout} className="logout-btn">
          <i className="fa-solid fa-sign-out-alt"></i> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
