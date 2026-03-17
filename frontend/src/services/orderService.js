import API_BASE_URL from "./api";

export const createOrderRequest = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create order.");
  }

  return data;
};

export const trackOrderRequest = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/orders/track`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch order.");
  }

  return data;
};

export const deleteOrderByStudentRequest = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/orders/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete order.");
  }

  return data;
};

export const getAllOrdersRequest = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/orders`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch orders.");
  }

  return data;
};

export const updateOrderStatusRequest = async (orderId, status) => {
  const response = await fetch(
    `${API_BASE_URL}/admin/orders/${orderId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update order status.");
  }

  return data;
};

export const deleteOrderByAdminRequest = async (orderId) => {
  const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete order.");
  }

  return data;
};
