import { useEffect, useState } from 'react';

export default function Adminorders() {
  const [orderData, setOrderData] = useState([]);

  const fetchMyOrder = async () => {
    try {
      const response = await fetch("http://localhost:5226/api/orders/all");
      if (!response.ok) {
        throw new Error("Failed to fetch order data");
      }
      const data = await response.json();
      setOrderData(data);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };
  

  useEffect(() => {
    fetchMyOrder();
  }, []);
  

  return (
    <div className='container'>
      <div className='row'>
        {orderData.length > 0 ? orderData.map((emailData, index) => (
          <div key={index} className='mt-5'>
            <div className='fs-3 p-3 bg-danger border rounded'>E-mail: {emailData.email}</div>
            <hr />
            {emailData.order_data.slice(0).reverse().map((order, orderIndex) => (
              <div key={orderIndex}>
                {order.map((orderItem, itemIndex) => (
                  <div key={itemIndex} className='mt-3'>
                    {orderItem.Order_date ? (
                      <div className='m-auto mt-3 text-start'>
                        {orderItem.Order_date}
                        <hr />
                      </div>
                    ) : (
                      <div className='col-12 col-lg-6 text-start'>
                        <div className="card mt-3" style={{ maxHeight: "360px" }}>
                          <div className="card-body">
                            <h5 className="card-title">{orderItem.name}</h5>
                            <div className='container w-100 p-0' style={{ height: "38px" }}>
                              <span className='m-1'>{orderItem.qty}</span>
                              <span className='m-1'>{orderItem.size}</span>
                              <span className='m-1'>{orderItem.Order_date}</span>
                              <div className='d-inline ms-5 h-100 w-20 fs-4'>
                                ₹{orderItem.price}/-
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )) : (
          <div>No orders available</div>
        )}
      </div>
    </div>
  );
}
