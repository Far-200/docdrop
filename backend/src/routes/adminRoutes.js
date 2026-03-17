import express from "express";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrderByAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/orders", getAllOrders);
router.patch("/orders/:orderId/status", updateOrderStatus);
router.delete("/orders/:orderId", deleteOrderByAdmin);

export default router;
