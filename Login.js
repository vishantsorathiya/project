import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDispatchCart } from "../components/ContextReducer";
import "./login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatchCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Admin check before API call
      if (credentials.email === 'admin@example.com' && credentials.password === 'admin') {
        navigate('/admin');
        return;
      }

      const response = await fetch("http://localhost:5226/api/Users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const json = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", json.token);
        localStorage.setItem("userId", json.id);
        localStorage.setItem("userEmail", credentials.email);
        dispatch({ type: "DROP" });
        navigate("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Enter valid credentials",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred while logging in",
      });
    }
  };

  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <div className="login-container" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <div className="login-card shadow-lg rounded-4" style={{ backgroundColor: 'white', maxWidth: '450px' }}>
        <h1 className="text-center mb-4 fw-bold text-primary">Welcome Back</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label fw-medium text-secondary">
              Email Address
            </label>
            <input
              type="email"
              className="form-control form-control-lg border-secondary"
              style={{ borderRadius: '12px', borderWidth: '2px' }}
              name="email"
              id="email"
              value={credentials.email}
              onChange={onChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-medium text-secondary">
              Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control form-control-lg border-secondary"
                style={{ borderRadius: '12px 0 0 12px', borderWidth: '2px' }}
                name="password"
                id="password"
                value={credentials.password}
                onChange={onChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary border-secondary"
                style={{ 
                  borderWidth: '2px',
                  borderRadius: '0 12px 12px 0',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash className="fs-5" /> : <FaEye className="fs-5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 fw-bold"
            style={{
              borderRadius: '12px',
              fontSize: '1.1rem',
              backgroundColor: '#0d6efd',
              border: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Continue to Account
          </button>

          <div className="text-center mt-4">
            <Link 
              to="/createuser" 
              className="btn btn-outline-primary px-4 py-2"
              style={{
                borderRadius: '12px',
                fontWeight: '500'
              }}
            >
              Create New Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
