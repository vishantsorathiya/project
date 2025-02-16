import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchCartItems = async () => {
      try {
        const response = await fetch(`http://localhost:5226/api/Cart/GetCartItems/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
        } else {
          console.error("Failed to fetch cart items");
          Swal.fire('Error', 'Failed to load cart items', 'error');
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        Swal.fire('Error', 'Failed to connect to server', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [navigate]);

  const handleRemoveFromCart = async (cartId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove it!'
      });

      if (result.isConfirmed) {
        const response = await fetch(`http://localhost:5226/api/Cart/RemoveCartItem/${cartId}`, {
          method: "DELETE"
        });
    
        if (response.ok) {
          setCartItems(cartItems.filter(item => item.cartId !== cartId));
          Swal.fire('Removed!', 'Item has been removed from cart.', 'success');
        } else {
          Swal.fire('Error', 'Failed to remove item', 'error');
        }
      }
    } catch (error) {
      console.error("Error removing item:", error);
      Swal.fire('Error', 'Failed to connect to server', 'error');
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCODOrder = async () => {
    try {
      setProcessingPayment(true);
      
      const response = await fetch('http://localhost:5226/api/orders/create-cod', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            menuId: item.menuID,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: totalPrice,
          deliveryAddress: localStorage.getItem('userAddress') || ''
        })
      });

      if (!response.ok) throw new Error('Failed to create COD order');
      
      setCartItems([]);
      navigate('/order-success');
      
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setProcessingPayment(true);
      
      const orderResponse = await fetch('http://localhost:5226/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: totalPrice * 100,
          currency: 'INR',
          items: cartItems.map(item => ({
            menuId: item.menuID,
            quantity: item.quantity
          }))
        })
      });

      if (!orderResponse.ok) throw new Error('Failed to create payment order');
      const orderData = await orderResponse.json();

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Your Restaurant',
        description: 'Food Order Payment',
        image: '/logo.png',
        order_id: orderData.id,
        handler: async function(response) {
          try {
            const verifyResponse = await fetch('http://localhost:5226/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.orderId
              })
            });

            if (!verifyResponse.ok) throw new Error('Payment verification failed');
            
            setCartItems([]);
            navigate('/order-success');
          } catch (error) {
            Swal.fire('Error', error.message, 'error');
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
          contact: localStorage.getItem('userPhone') || ''
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setProcessingPayment(false);
    }
  };

  useEffect(() => {
    const loadRazorpay = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    };

    if (!window.Razorpay) {
      loadRazorpay();
    }
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <button 
        className="btn btn-outline-secondary mb-4" 
        onClick={() => navigate('/')}
      >
        ← Back to Menu
      </button>
      
      <h1 className="text-center fw-bold mb-4">🛒 Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center">
          <h3>Your cart is empty 😔</h3>
          <p>Go ahead and add some delicious food items!</p>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {cartItems.map(item => (
              <div key={item.cartId} className="col-12 col-md-6 col-lg-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <div className="card-text">
                      <p>Quantity: {item.quantity}</p>
                      <p>Price per item: ₹{item.price.toFixed(2)}</p>
                      <p>Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button 
                      className="btn btn-danger w-100"
                      onClick={() => handleRemoveFromCart(item.cartId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <h2 className="text-center fw-bold mb-3">🧾 Order Summary</h2>
            <div className="table-responsive">
              <table className="table table-bordered text-center">
                <thead className="table-success">
                  <tr>
                    <th>#</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={item.cartId}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.price.toFixed(2)}</td>
                      <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemoveFromCart(item.cartId)}
                        >
                          ❌ Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-end mt-4">
              <h3 className="fw-bold">
                Total: ₹{totalPrice.toFixed(2)}
              </h3>
            </div>

            <div className="text-center mt-4">
              <div className="mb-3">
                <h4>Select Payment Method:</h4>
                <div className="d-flex justify-content-center gap-3">
                  <button 
                    className={`btn ${selectedPaymentMethod === 'cod' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedPaymentMethod('cod')}
                  >
                    Cash on Delivery
                  </button>
                  <button 
                    className={`btn ${selectedPaymentMethod === 'online' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedPaymentMethod('online')}
                  >
                    Online Payment
                  </button>
                </div>
              </div>

              {selectedPaymentMethod === 'cod' && (
                <button 
                  className="btn btn-lg btn-warning px-5"
                  onClick={handleCODOrder}
                  disabled={processingPayment}
                >
                  {processingPayment ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      Placing Order...
                    </>
                  ) : (
                    '🛒 Confirm COD Order'
                  )}
                </button>
              )}

              {selectedPaymentMethod === 'online' && (
                <button 
                  className="btn btn-lg btn-success px-5"
                  onClick={handleCheckout}
                  disabled={processingPayment || cartItems.length === 0}
                >
                  {processingPayment ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      Processing Payment...
                    </>
                  ) : (
                    '💳 Proceed to Payment'
                  )}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}