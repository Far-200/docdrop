import { Link, useLocation } from "react-router-dom";
import { formatOptionLabel } from "../utils/formatOptions";

function OrderSuccessPage() {
  const location = useLocation();
  const orderData = location.state?.orderData;

  if (!orderData) {
    return (
      <div className="page success-page">
        <div className="container">
          <div className="success-card">
            <h1>No order data found</h1>
            <p>Please create an order first.</p>
            <Link to="/create-order" className="btn btn-primary">
              Go to Create Order
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page success-page">
      <div className="container">
        <div className="success-card">
          <p className="success-tag">Order Created Successfully</p>
          <h1>Your document has been submitted</h1>
          <p className="success-text">
            Save these details carefully. You will use them to track and verify
            your order.
          </p>

          <div className="success-details">
            <div className="success-item">
              <span>Order ID</span>
              <strong>{orderData.orderId}</strong>
            </div>

            <div className="success-item">
              <span>OTP</span>
              <strong>{orderData.otp}</strong>
            </div>

            <div className="success-item">
              <span>Status</span>
              <strong>{formatOptionLabel(orderData.status)}</strong>
            </div>

            <div className="success-item">
              <span>File</span>
              <strong>{orderData.fileName}</strong>
            </div>
          </div>

          <div className="hero-actions">
            <Link to="/" className="btn btn-secondary">
              Back to Home
            </Link>

            <Link to="/track-order" className="btn btn-secondary">
              Track This Order
            </Link>

            <Link to="/create-order" className="btn btn-primary">
              Create Another Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
