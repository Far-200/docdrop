import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  createOrder,
  trackOrder,
  deleteOrderByStudent,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", upload.single("file"), createOrder);
router.post("/track", trackOrder);
router.delete("/delete", deleteOrderByStudent);

export default router;
