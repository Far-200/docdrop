import Order from "../models/Order.js";
import generateOrderId from "../utils/generateOrderId.js";
import generateOTP from "../services/otpService.js";
import fs from "fs";
import path from "path";

const deleteUploadedFile = (fileUrl) => {
  if (!fileUrl) return;

  const cleanPath = fileUrl.replace(/^\/+/, "");
  const absolutePath = path.resolve(cleanPath);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

export const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      copies,
      colorMode,
      pageSize,
      orientation,
      printSides,
      binding,
    } = req.body;

    if (!customerName || !phone) {
      return res.status(400).json({
        success: false,
        message: "Customer name and phone are required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Document upload is required.",
      });
    }

    const orderId = generateOrderId();
    const otp = generateOTP();

    const newOrder = await Order.create({
      orderId,
      customerName,
      phone,
      email: email || "",
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      fileSize: req.file.size,
      printOptions: {
        copies: Number(copies) || 1,
        colorMode: colorMode || "black_white",
        pageSize: pageSize || "A4",
        orientation: orientation || "portrait",
        printSides: printSides || "single_side",
        binding: binding || "none",
      },
      otp,
      status: "uploaded",
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: {
        _id: newOrder._id,
        orderId: newOrder.orderId,
        otp: newOrder.otp,
        status: newOrder.status,
        customerName: newOrder.customerName,
        phone: newOrder.phone,
        email: newOrder.email,
        fileName: newOrder.fileName,
        fileUrl: newOrder.fileUrl,
        printOptions: newOrder.printOptions,
        createdAt: newOrder.createdAt,
      },
    });
  } catch (error) {
    console.error("Create order error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the order.",
    });
  }
};

export const trackOrder = async (req, res) => {
  try {
    const { orderId, otp } = req.body;

    if (!orderId || !otp) {
      return res.status(400).json({
        success: false,
        message: "Order ID and OTP are required.",
      });
    }

    const order = await Order.findOne({
      orderId: orderId.trim(),
      otp: otp.trim(),
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Invalid Order ID or OTP.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully.",
      data: {
        orderId: order.orderId,
        status: order.status,
        customerName: order.customerName,
        phone: order.phone,
        email: order.email,
        fileName: order.fileName,
        fileUrl: order.fileUrl,
        printOptions: order.printOptions,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Track order error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the order.",
    });
  }
};

export const deleteOrderByStudent = async (req, res) => {
  try {
    const { orderId, otp } = req.body;

    if (!orderId || !otp) {
      return res.status(400).json({
        success: false,
        message: "Order ID and OTP are required.",
      });
    }

    const order = await Order.findOne({
      orderId: orderId.trim(),
      otp: otp.trim(),
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Invalid Order ID or OTP.",
      });
    }

    deleteUploadedFile(order.fileUrl);

    await Order.deleteOne({ _id: order._id });

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully.",
    });
  } catch (error) {
    console.error("Delete order by student error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the order.",
    });
  }
};
