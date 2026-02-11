import React, { useEffect, useState } from 'react';

const OrderConfirmation: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setTimeout(() => setShowConfetti(true), 400);
  }, []);

  // Mock order data - replace with actual data
  const orderData = {
    orderNumber: 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    email: 'customer@example.com',
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    }),
    items: [
      { name: 'Premium Leather Wallet', quantity: 1, price: 89.00 },
      { name: 'Classic Sunglasses', quantity: 2, price: 129.00 }
    ],
    subtotal: 347.00,
    shipping: 12.00,
    total: 359.00
  };

  return (
    <div className="order-success-container">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="confetti-wrapper">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      <div className={`content-wrapper ${isVisible ? 'visible' : ''}`}>
        {/* Success Icon */}
        <div className="success-icon-wrapper">
          <svg className="success-icon" viewBox="0 0 100 100">
            <circle className="success-circle" cx="50" cy="50" r="45" />
            <path className="success-check" d="M30 50 L45 65 L70 35" />
          </svg>
        </div>

        {/* Main Heading */}
        <h1 className="main-heading">Order Confirmed!</h1>
        <p className="subheading">
          Thank you for your purchase. We've sent a confirmation email to{' '}
          <strong>{orderData.email}</strong>
        </p>

        {/* Order Number Badge */}
        <div className="order-number-badge">
          <span className="order-label">Order Number</span>
          <span className="order-number">{orderData.orderNumber}</span>
        </div>

        {/* Order Details Card */}
        <div className="order-details-card">
          <div className="card-header">
            <h2>Order Summary</h2>
            <span className="estimated-delivery">
              Est. Delivery: <strong>{orderData.estimatedDelivery}</strong>
            </span>
          </div>

          <div className="items-list">
            {orderData.items.map((item, index) => (
              <div key={index} className="item-row">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">Qty: {item.quantity}</span>
                </div>
                <span className="item-price">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="totals-section">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${orderData.subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping</span>
              <span>${orderData.shipping.toFixed(2)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total</span>
              <span>${orderData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="next-steps">
          <h3>What happens next?</h3>
          <div className="steps-grid">
            <div className="step">
              <div className="step-icon">📧</div>
              <div className="step-content">
                <h4>Confirmation Email</h4>
                <p>Check your inbox for order details</p>
              </div>
            </div>
            <div className="step">
              <div className="step-icon">📦</div>
              <div className="step-content">
                <h4>Processing</h4>
                <p>We're preparing your items</p>
              </div>
            </div>
            <div className="step">
              <div className="step-icon">🚚</div>
              <div className="step-content">
                <h4>Shipping Updates</h4>
                <p>Track your delivery via email</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn btn-primary">Track Your Order</button>
          <button className="btn btn-secondary">Continue Shopping</button>
        </div>

        {/* Support Link */}
        <p className="support-text">
          Need help? <a href="/support">Contact our support team</a>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .order-success-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #fdfbf7 0%, #f8f4ed 100%);
          padding: 2rem 1rem;
          font-family: 'DM Sans', sans-serif;
          color: #2c2c2c;
          position: relative;
          overflow: hidden;
        }

        /* Confetti Animation */
        .confetti-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 10;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: confetti-fall 3s linear forwards;
          opacity: 0;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        /* Content Wrapper */
        .content-wrapper {
          max-width: 680px;
          margin: 0 auto;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .content-wrapper.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Success Icon */
        .success-icon-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
          animation: icon-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.2s backwards;
        }

        @keyframes icon-bounce {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .success-icon {
          width: 100px;
          height: 100px;
        }

        .success-circle {
          fill: none;
          stroke: #4ECDC4;
          stroke-width: 3;
          stroke-dasharray: 283;
          stroke-dashoffset: 283;
          animation: circle-draw 0.6s ease-out 0.3s forwards;
        }

        .success-check {
          fill: none;
          stroke: #4ECDC4;
          stroke-width: 4;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 70;
          stroke-dashoffset: 70;
          animation: check-draw 0.4s ease-out 0.6s forwards;
        }

        @keyframes circle-draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes check-draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        /* Typography */
        .main-heading {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 1rem;
          color: #2c2c2c;
          animation: fade-in-up 0.6s ease-out 0.4s backwards;
        }

        .subheading {
          text-align: center;
          font-size: 1.125rem;
          color: #666;
          margin-bottom: 2rem;
          line-height: 1.6;
          animation: fade-in-up 0.6s ease-out 0.5s backwards;
        }

        .subheading strong {
          color: #2c2c2c;
          font-weight: 600;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Order Number Badge */
        .order-number-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin-bottom: 2rem;
          animation: fade-in-up 0.6s ease-out 0.6s backwards;
        }

        .order-label {
          font-size: 0.875rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 500;
        }

        .order-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #FF6B6B;
          font-family: 'DM Sans', monospace;
          letter-spacing: 2px;
        }

        /* Order Details Card */
        .order-details-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
          animation: fade-in-up 0.6s ease-out 0.7s backwards;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f5f5f5;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .card-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          color: #2c2c2c;
        }

        .estimated-delivery {
          font-size: 0.875rem;
          color: #666;
        }

        .estimated-delivery strong {
          color: #4ECDC4;
          font-weight: 600;
        }

        /* Items List */
        .items-list {
          margin-bottom: 1.5rem;
        }

        .item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .item-row:last-child {
          border-bottom: none;
        }

        .item-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .item-name {
          font-weight: 500;
          color: #2c2c2c;
        }

        .item-quantity {
          font-size: 0.875rem;
          color: #999;
        }

        .item-price {
          font-weight: 600;
          color: #2c2c2c;
        }

        /* Totals Section */
        .totals-section {
          padding-top: 1rem;
          border-top: 2px solid #f5f5f5;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          font-size: 1rem;
        }

        .total-row.grand-total {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2c2c2c;
          border-top: 2px solid #2c2c2c;
          margin-top: 0.5rem;
          padding-top: 1rem;
        }

        /* Next Steps */
        .next-steps {
          background: linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          animation: fade-in-up 0.6s ease-out 0.8s backwards;
        }

        .next-steps h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: #2c2c2c;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .step {
          display: flex;
          gap: 1rem;
          align-items: start;
        }

        .step-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .step-content h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #2c2c2c;
        }

        .step-content p {
          font-size: 0.875rem;
          color: #666;
          line-height: 1.5;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          animation: fade-in-up 0.6s ease-out 0.9s backwards;
        }

        .btn {
          flex: 1;
          min-width: 200px;
          padding: 1rem 2rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'DM Sans', sans-serif;
        }

        .btn-primary {
          background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
        }

        .btn-secondary {
          background: white;
          color: #2c2c2c;
          border: 2px solid #e0e0e0;
        }

        .btn-secondary:hover {
          background: #f9f9f9;
          border-color: #2c2c2c;
          transform: translateY(-2px);
        }

        /* Support Text */
        .support-text {
          text-align: center;
          font-size: 0.875rem;
          color: #999;
          animation: fade-in-up 0.6s ease-out 1s backwards;
        }

        .support-text a {
          color: #4ECDC4;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        .support-text a:hover {
          color: #3bb3aa;
          text-decoration: underline;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .main-heading {
            font-size: 2.25rem;
          }

          .order-details-card {
            padding: 1.5rem;
          }

          .card-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .steps-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }

          .btn {
            min-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .order-success-container {
            padding: 1rem 0.75rem;
          }

          .main-heading {
            font-size: 1.875rem;
          }

          .order-details-card {
            padding: 1.25rem;
          }

          .next-steps {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderConfirmation;