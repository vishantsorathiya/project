import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useNavigate } from 'react-router-dom';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login'); // Redirect to login if user is not logged in
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:5226/api/Orders/GetOrders/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div className="container">
        <h1>Your Orders</h1>
        {orders.length === 0 ? (
          <p>You have no orders.</p>
        ) : (
          <div className="row">
            {orders.map(order => (
              <div key={order.OrderId} className="col-12 col-md-6 col-lg-4">
                <div className="card mt-3">
                  <div className="card-body">
                    <h5 className="card-title">Order ID: {order.OrderId}</h5>
                    <p className="card-text">Total Amount: ₹{order.TotalAmount.toFixed(2)}</p>
                    <p className="card-text">Order Date: {new Date(order.OrderDate).toLocaleDateString()}</p>
                    {/* Add more order details as needed */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
