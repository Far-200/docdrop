import mongoose from "mongoose";

const printOptionsSchema = new mongoose.Schema(
  {
    copies: {
      type: Number,
      default: 1,
      min: 1,
    },
    colorMode: {
      type: String,
      enum: ["black_white", "color"],
      default: "black_white",
    },
    pageSize: {
      type: String,
      enum: ["A4", "A3", "Letter"],
      default: "A4",
    },
    layout: {
      type: String,
      enum: ["single", "double"],
      default: "single",
    },
    orientation: {
      type: String,
      enum: ["portrait", "landscape"],
      default: "portrait",
    },
    printSides: {
      type: String,
      enum: ["single_side", "double_side"],
      default: "single_side",
    },
    binding: {
      type: String,
      enum: ["none", "spiral", "stapled"],
      default: "none",
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: "",
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    printOptions: {
      type: printOptionsSchema,
      default: () => ({}),
    },
    otp: {
      type: String,
      required: true,
      trim: true,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: [
        "uploaded",
        "confirmed",
        "printing",
        "ready",
        "completed",
        "cancelled",
      ],
      default: "uploaded",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
