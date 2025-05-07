import React, { useState } from 'react';

function PaymentPasswordPage({ onPaymentSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (password === '040322') {
        onPaymentSuccess();
      } else {
        setError('Invalid payment password. Please try again.');
      }
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="payment-password-container">
      <h2>Enter Payment Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <input
            type="password"
            maxLength={6}
            placeholder="6-digit payment password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            autoComplete="off"
            inputMode="numeric"
            pattern="[0-9]*"
          />
          {error && <p className="error-message">{error}</p>}
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting || password.length < 6}
          className={isSubmitting ? 'submitting' : ''}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Payment'}
        </button>
      </form>
    </div>
  );
}

export default PaymentPasswordPage;