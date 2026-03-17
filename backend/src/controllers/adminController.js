import Order from "../models/Order.js";
import fs from "fs";
import path from "path";

const deleteUploadedFile = (fileUrl) => {
  if (!fileUrl) return;

  const cleanPath = fileUrl.replace(/^\/+/, "");
  const absolutePath = path.resolve(
    "src",
    cleanPath.replace(/^uploads\//, "uploads/"),
  );

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      data: orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching orders.",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "uploaded",
      "confirmed",
      "printing",
      "ready",
      "completed",
      "cancelled",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status provided.",
      });
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      data: order,
    });
  } catch (error) {
    console.error("Update order status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating status.",
    });
  }
};

export const deleteOrderByAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    deleteUploadedFile(order.fileUrl);

    await Order.deleteOne({ _id: order._id });

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully.",
    });
  } catch (error) {
    console.error("Delete order by admin error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the order.",
    });
  }
};
