import React from 'react';
import { useDispatchCart } from '../components/ContextReducer';
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const dispatch = useDispatchCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("authToken");
    dispatch({ type: "DROP" }); // Clear cart on logout
    navigate("/login"); // Redirect to login page or any other logic
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}
