import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <div className="card shadow p-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 className="text-success mb-4">🎉 Order Placed Successfully!</h1>
        <p className="lead">
          Your order has been received. {window.location.search.includes('cod') && 
          "Our delivery partner will contact you for payment."}
        </p>
        <div className="mt-4">
          <button 
            className="btn btn-primary me-3"
            onClick={() => navigate('/orders')}
          >
            View Order Status
          </button>
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
} 