import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  trackOrderRequest,
  deleteOrderByStudentRequest,
} from "../services/orderService";
import { formatOptionLabel } from "../utils/formatOptions";
import StatusProgress from "../components/common/StatusProgress";

function TrackOrderPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    orderId: "",
    otp: "",
  });

  const [orderData, setOrderData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setOrderData(null);

    try {
      setIsChecking(true);

      const response = await trackOrderRequest({
        orderId: formData.orderId,
        otp: formData.otp,
      });

      setOrderData(response.data);
    } catch (error) {
      setErrorMessage(error.message || "Failed to track order.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order and uploaded file?",
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setErrorMessage("");
      setSuccessMessage("");

      await deleteOrderByStudentRequest({
        orderId: formData.orderId,
        otp: formData.otp,
      });

      setOrderData(null);
      setFormData({
        orderId: "",
        otp: "",
      });
      setSuccessMessage("Order deleted successfully.");
      navigate("/create-order");
    } catch (error) {
      setErrorMessage(error.message || "Failed to delete order.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="page track-order-page">
      <div className="container">
        <div className="page-topbar">
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>
        </div>

        <div className="track-layout">
          <div className="form-wrapper">
            <div className="form-header">
              <h1>Track Your Order</h1>
              <p>
                Enter your Order ID and OTP to check the current print status.
              </p>
            </div>

            <form className="doc-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group form-group-full">
                  <label htmlFor="orderId">Order ID</label>
                  <input
                    type="text"
                    id="orderId"
                    name="orderId"
                    placeholder="Enter your order ID"
                    value={formData.orderId}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group form-group-full">
                  <label htmlFor="otp">OTP</label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    placeholder="Enter your OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {errorMessage && <p className="form-error">{errorMessage}</p>}
              {successMessage && (
                <p className="form-success">{successMessage}</p>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={isChecking}
              >
                {isChecking ? "Checking..." : "Track Order"}
              </button>
            </form>
          </div>

          {orderData && (
            <div className="track-result-card">
              <p className="success-tag">Order Found</p>
              <h2>Current Order Status</h2>

              <StatusProgress currentStatus={orderData.status} />

              <div className="success-details">
                <div className="success-item">
                  <span>Order ID</span>
                  <strong>{orderData.orderId}</strong>
                </div>

                <div className="success-item">
                  <span>Status</span>
                  <strong className="status-text">
                    {formatOptionLabel(orderData.status)}
                  </strong>
                </div>

                <div className="success-item">
                  <span>Customer Name</span>
                  <strong>{orderData.customerName}</strong>
                </div>

                <div className="success-item">
                  <span>Phone</span>
                  <strong>{orderData.phone}</strong>
                </div>

                <div className="success-item">
                  <span>Email</span>
                  <strong>{orderData.email || "Not provided"}</strong>
                </div>

                <div className="success-item">
                  <span>File</span>
                  <strong>{orderData.fileName}</strong>
                </div>

                <div className="success-item">
                  <span>Copies</span>
                  <strong>{orderData.printOptions?.copies}</strong>
                </div>

                <div className="success-item">
                  <span>Color Mode</span>
                  <strong>
                    {formatOptionLabel(orderData.printOptions?.colorMode)}
                  </strong>
                </div>

                <div className="success-item">
                  <span>Page Size</span>
                  <strong>{orderData.printOptions?.pageSize}</strong>
                </div>

                <div className="success-item">
                  <span>Orientation</span>
                  <strong>
                    {formatOptionLabel(orderData.printOptions?.orientation)}
                  </strong>
                </div>

                <div className="success-item">
                  <span>Print Sides</span>
                  <strong>
                    {formatOptionLabel(orderData.printOptions?.printSides)}
                  </strong>
                </div>

                <div className="success-item">
                  <span>Binding</span>
                  <strong>
                    {formatOptionLabel(orderData.printOptions?.binding)}
                  </strong>
                </div>
              </div>

              <div className="track-order-actions">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete This Order"}
                </button>

                <Link to="/create-order" className="btn btn-secondary">
                  Upload Another File
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrackOrderPage;
