import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsCartPlus } from 'react-icons/bs';
import Swal from 'sweetalert2';
import './Card.css';
import 'sweetalert2/dist/sweetalert2.min.css';

export default function Card({ foodItem, options }) {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  
  // Default food image URL
  const defaultImageUrl = "https://via.placeholder.com/300x200?text=Food+Image";

  const handleImageError = (e) => {
    console.log(`Image failed to load for ${foodItem.name}:`, foodItem.imageURL);
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = defaultImageUrl;
  };

  const showSuccessAlert = () => {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Added to cart!',
      showConfirmButton: false,
      timer: 1500,
      background: '#f0fff4',
      iconColor: '#38a169',
      toast: true
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Something went wrong!',
      text: message,
      confirmButtonColor: '#38a169',
      background: '#f0fff4',
      confirmButtonText: 'Try Again'
    });
  };

  const handleAddToCart = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId || isNaN(userId)) {
      navigate('/login');
      return;
    }

    const requestBody = {
      name: foodItem.name,
      menuId: foodItem.menuID,
      userId: Number(userId),
      quantity: quantity,
      price: foodItem.price * quantity
    };

    try {
      const response = await fetch('http://localhost:5226/api/Cart/AddToCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();

      if (response.ok) {
        showSuccessAlert();
      } else {
        let errorMessage = responseData.title || 'Failed to add item to cart';
        
        if (responseData.errors) {
          errorMessage = Object.entries(responseData.errors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('\n');
        }

        showErrorAlert(errorMessage);
        console.error('Add to cart failed:', response.status, responseData);
      }
    } catch (error) {
      showErrorAlert('Unable to connect to server. Please check your connection.');
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="card-container">
      <div className="card">
        <img 
          src={foodItem.imageURL || defaultImageUrl}
          className="card-img-top"
          alt={foodItem.name}
          onError={handleImageError}
        />
        <div className="card-body">
          <h5 className="card-title">{foodItem.name}</h5>
          <p className="card-text">{foodItem.description}</p>
          <div className="price">Price: ₹{options.regular}</div>
          <button className="btn btn-success add-to-cart" onClick={handleAddToCart}>
            Add to Cart <BsCartPlus />
          </button>
        </div>
      </div>
    </div>
  );
}

Card.defaultProps = {
  foodItem: {
    name: '',
    description: '',
    imageURL: '',
    price: 0
  }
};
