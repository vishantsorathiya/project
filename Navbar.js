import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "react-bootstrap";
import { useCart } from "./ContextReducer";
import { CiLogout } from "react-icons/ci";
import { FaUtensils, FaShoppingCart, FaUserPlus, FaSignInAlt } from "react-icons/fa";

export default function Navbar() {
  let data = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm" style={{ backgroundColor: '#0d6efd' }}>
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <FaUtensils className="me-2" style={{ fontSize: "1.8rem" }} />
          <span className="fs-3 fw-bold">Tasty Eats</span>
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item mx-2">
              <Link
                className="nav-link fs-5 fw-medium position-relative"
                to="/"
              >
                Home
                <div className="nav-active-indicator"></div>
              </Link>
            </li>

            {localStorage.getItem("authToken") && (
              <li className="nav-item mx-2">
                <Link
                  className="nav-link fs-5 fw-medium position-relative"
                  to="/myOrder"
                >
                  My Orders
                  <div className="nav-active-indicator"></div>
                </Link>
              </li>
            )}

            <li className="nav-item mx-2">
              <Link
                className="nav-link fs-5 fw-medium position-relative"
                to="/aboutus"
              >
                About Us
                <div className="nav-active-indicator"></div>
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            {!localStorage.getItem("authToken") ? (
              <>
                <Link
                  className="btn btn-light text-success d-flex align-items-center gap-2"
                  to="/login"
                >
                  <FaSignInAlt />
                  <span>Login</span>
                </Link>
                <Link
                  className="btn btn-outline-light text-primary d-flex align-items-center gap-2"
                  to="/createuser"
                >
                  <FaUserPlus />
                  <span>Sign Up</span>
                </Link>
              </>
            ) : (
              <>
                <button
                  className="btn btn-light position-relative d-flex align-items-center gap-2"
                  onClick={() => navigate('/cart')}
                >
                  <FaShoppingCart className="text-primary" />
                  <span className="text-primary">Cart</span>
                  {data.length > 0 && (
                    <Badge
                      pill
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle"
                    >
                      {data.length}
                    </Badge>
                  )}
                </button>

                <button
                  className="btn btn-outline-light d-flex align-items-center gap-2"
                  onClick={handleLogout}
                >
                  <CiLogout className="fs-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .nav-link {
          transition: all 0.3s ease;
          color: rgba(255, 255, 255, 0.9) !important;
        }
        
        .nav-link:hover {
          color: #fff !important;
          transform: translateY(-2px);
        }
        
        .nav-active-indicator {
          position: absolute;
          bottom: -5px;
          left: 50%;
          width: 0;
          height: 2px;
          background: #fff;
          transition: all 0.3s ease;
        }
        
        .nav-link.active .nav-active-indicator,
        .nav-link:hover .nav-active-indicator {
          width: 80%;
          left: 10%;
        }
        
        .btn {
          transition: all 0.3s ease;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          background-color: rgba(255, 255, 255, 0.9);
        }
        
        .btn:hover {
          background-color: #fff;
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.25);
        }
      `}</style>
    </nav>
  );
}