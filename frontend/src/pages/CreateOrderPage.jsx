import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrderRequest } from "../services/orderService";

function CreateOrderPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    copies: 1,
    colorMode: "black_white",
    pageSize: "A4",
    orientation: "portrait",
    printSides: "single_side",
    binding: "none",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file || null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!selectedFile) {
      setErrorMessage("Please select a file before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = new FormData();
      payload.append("customerName", formData.customerName);
      payload.append("phone", formData.phone);
      payload.append("email", formData.email);
      payload.append("copies", formData.copies);
      payload.append("colorMode", formData.colorMode);
      payload.append("pageSize", formData.pageSize);
      payload.append("orientation", formData.orientation);
      payload.append("printSides", formData.printSides);
      payload.append("binding", formData.binding);
      payload.append("file", selectedFile);

      const response = await createOrderRequest(payload);

      navigate("/order-success", {
        state: {
          orderData: response.data,
        },
      });
    } catch (error) {
      setErrorMessage(error.message || "Failed to create order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page create-order-page">
      <div className="container">
        <div className="page-topbar">
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>
        </div>

        <div className="form-wrapper">
          <div className="form-header">
            <h1>Create Print Order</h1>
            <p>
              Fill in your details, upload the document, and choose how you want
              it printed.
            </p>
          </div>

          <form className="doc-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="customerName">Full Name</label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  placeholder="Enter your full name"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="email">Email Address (Optional)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="fileUpload">Upload Document</label>
                <input
                  type="file"
                  id="fileUpload"
                  name="fileUpload"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  required
                />
                {selectedFile && (
                  <p className="file-note">
                    Selected file: <strong>{selectedFile.name}</strong>
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="copies">Copies</label>
                <input
                  type="number"
                  id="copies"
                  name="copies"
                  min="1"
                  value={formData.copies}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="colorMode">Color Mode</label>
                <select
                  id="colorMode"
                  name="colorMode"
                  value={formData.colorMode}
                  onChange={handleChange}
                >
                  <option value="black_white">Black & White</option>
                  <option value="color">Color</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="pageSize">Page Size</label>
                <select
                  id="pageSize"
                  name="pageSize"
                  value={formData.pageSize}
                  onChange={handleChange}
                >
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="Letter">Letter</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="orientation">Orientation</label>
                <select
                  id="orientation"
                  name="orientation"
                  value={formData.orientation}
                  onChange={handleChange}
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="printSides">Print Sides</label>
                <select
                  id="printSides"
                  name="printSides"
                  value={formData.printSides}
                  onChange={handleChange}
                >
                  <option value="single_side">Single Side</option>
                  <option value="double_side">Double Side</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="binding">Binding</label>
                <select
                  id="binding"
                  name="binding"
                  value={formData.binding}
                  onChange={handleChange}
                >
                  <option value="none">None</option>
                  <option value="spiral">Spiral</option>
                  <option value="stapled">Stapled</option>
                </select>
              </div>
            </div>

            {errorMessage && <p className="form-error">{errorMessage}</p>}

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateOrderPage;
