import React from 'react';

function PaymentSuccessPage({ orderDetails }) {
  return (
    <div className="payment-success-container">
      <div className="success-icon">✓</div>
      <h2 className="success-title">Payment Successful!</h2>
      
      {orderDetails && (
        <div className="order-summary">
          <p>Amount: ${orderDetails.amount.toFixed(2)}</p>
          <p>Order #: {orderDetails.orderNumber}</p>
          <p>Date: {new Date(orderDetails.date).toLocaleString()}</p>
        </div>
      )}
      
      <p className="thank-you-message">Thank you for your purchase!</p>
      
      <button 
        className="continue-button"
        onClick={() => window.location.href = '/'}
      >
        Continue Shopping
      </button>
    </div>
  );
}

export default PaymentSuccessPage;