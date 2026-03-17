import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllOrdersRequest,
  updateOrderStatusRequest,
  deleteOrderByAdminRequest,
} from "../services/orderService";
import { formatOptionLabel } from "../utils/formatOptions";
import StatusProgress from "../components/common/StatusProgress";

const API_FILE_BASE_URL = "http://localhost:5000";

function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [scrollTargetOrderId, setScrollTargetOrderId] = useState("");

  const orderRefs = useRef({});

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await getAllOrdersRequest();
      setOrders(response.data || []);
    } catch (error) {
      setErrorMessage(error.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!scrollTargetOrderId) return;

    const targetNode = orderRefs.current[scrollTargetOrderId];

    if (targetNode) {
      targetNode.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setScrollTargetOrderId("");
  }, [orders, scrollTargetOrderId]);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      setUpdatingOrderId(orderId);
      setErrorMessage("");
      setScrollTargetOrderId(orderId);

      await updateOrderStatusRequest(orderId, status);
      await fetchOrders();
    } catch (error) {
      setErrorMessage(error.message || "Failed to update status.");
    } finally {
      setUpdatingOrderId("");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this order and file?",
    );

    if (!confirmed) return;

    try {
      setUpdatingOrderId(orderId);
      setErrorMessage("");

      await deleteOrderByAdminRequest(orderId);
      await fetchOrders();
    } catch (error) {
      setErrorMessage(error.message || "Failed to delete order.");
    } finally {
      setUpdatingOrderId("");
    }
  };

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return orders;

    return orders.filter((order) => {
      const orderIdMatch = order.orderId?.toLowerCase().includes(query);
      const nameMatch = order.customerName?.toLowerCase().includes(query);
      const phoneMatch = order.phone?.toLowerCase().includes(query);
      const fileMatch = order.fileName?.toLowerCase().includes(query);

      return orderIdMatch || nameMatch || phoneMatch || fileMatch;
    });
  }, [orders, searchTerm]);

  return (
    <div className="page admin-page">
      <div className="container">
        <div className="page-topbar admin-topbar">
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>

          <button className="btn btn-secondary" onClick={fetchOrders}>
            Refresh Orders
          </button>
        </div>

        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>
            Manage all print orders, files, and status updates from one place.
          </p>
        </div>

        <div className="admin-toolbar">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by Order ID, customer name, phone, or file..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        {errorMessage && <p className="form-error">{errorMessage}</p>}

        {loading ? (
          <div className="admin-empty-state">
            <p>Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="admin-empty-state">
            <p>No matching orders found.</p>
          </div>
        ) : (
          <div className="admin-orders-grid">
            {filteredOrders.map((order) => (
              <div
                className="admin-order-card"
                key={order._id}
                ref={(element) => {
                  orderRefs.current[order.orderId] = element;
                }}
              >
                <div className="admin-order-top">
                  <div>
                    <p className="admin-order-label">Order ID</p>
                    <h2>{order.orderId}</h2>
                  </div>

                  <span className={`status-pill status-${order.status}`}>
                    {formatOptionLabel(order.status)}
                  </span>
                </div>

                <StatusProgress currentStatus={order.status} />

                <div className="admin-order-details">
                  <div className="admin-detail-item">
                    <span>Customer</span>
                    <strong>{order.customerName}</strong>
                  </div>

                  <div className="admin-detail-item">
                    <span>Phone</span>
                    <strong>{order.phone}</strong>
                  </div>

                  <div className="admin-detail-item">
                    <span>Email</span>
                    <strong>{order.email || "Not provided"}</strong>
                  </div>

                  <div className="admin-detail-item">
                    <span>File</span>
                    <strong>{order.fileName}</strong>
                  </div>

                  <div className="admin-detail-item">
                    <span>Copies</span>
                    <strong>{order.printOptions?.copies}</strong>
                  </div>

                  <div className="admin-detail-item">
                    <span>Color Mode</span>
                    <strong>
                      {formatOptionLabel(order.printOptions?.colorMode)}
                    </strong>
                  </div>

                  <div className="admin-detail-item">
                    <span>Page Size</span>
                    <strong>{order.printOptions?.pageSize}</strong>
                  </div>

                  <div className="admin-detail-item">
                    <span>Orientation</span>
                    <strong>
                      {formatOptionLabel(order.printOptions?.orientation)}
                    </strong>
                  </div>

                  <div className="admin-detail-item">
                    <span>Print Sides</span>
                    <strong>
                      {formatOptionLabel(order.printOptions?.printSides)}
                    </strong>
                  </div>

                  <div className="admin-detail-item">
                    <span>Binding</span>
                    <strong>
                      {formatOptionLabel(order.printOptions?.binding)}
                    </strong>
                  </div>
                </div>

                <div className="admin-file-actions">
                  <a
                    href={`${API_FILE_BASE_URL}${order.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                  >
                    View File
                  </a>

                  <a
                    href={`${API_FILE_BASE_URL}${order.fileUrl}`}
                    download
                    className="btn btn-secondary"
                  >
                    Download File
                  </a>
                </div>

                <div className="admin-status-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      handleStatusUpdate(order.orderId, "printing")
                    }
                    disabled={updatingOrderId === order.orderId}
                  >
                    Start Printing
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => handleStatusUpdate(order.orderId, "ready")}
                    disabled={updatingOrderId === order.orderId}
                  >
                    Mark Ready
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      handleStatusUpdate(order.orderId, "completed")
                    }
                    disabled={updatingOrderId === order.orderId}
                  >
                    Mark Completed
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteOrder(order.orderId)}
                    disabled={updatingOrderId === order.orderId}
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
