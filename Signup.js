import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import "./signup.css"; 

export default function Signup() {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", geolocation: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentDate = new Date().toISOString();

      const response = await fetch("http://localhost:5226/api/Users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          location: credentials.geolocation,
          createdAt: currentDate,
          modifiedAt: currentDate,
        }),
      });

      const json = await response.json();
      console.log("Registration response:", json);

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: "You can now log in.",
        });
        navigate("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: json.message || "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred during registration.",
      });
    }
  };

  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              id="name"
              value={credentials.name}
              onChange={onChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              id="email"
              value={credentials.email}
              onChange={onChange}
              required
            />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="password"
                id="password"
                value={credentials.password}
                onChange={onChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="geolocation" className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              name="geolocation"
              id="geolocation"
              value={credentials.geolocation}
              onChange={onChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Sign Up</button>

          <div className="text-center mt-3">
            <Link to="/login" className="text-link">Already a user? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
