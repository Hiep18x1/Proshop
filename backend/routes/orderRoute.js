import express from "express";
const router = express.Router();

import {
  addOrderItem,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDeliverd,
  getOrders,
} from "../controllers/orderController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(protect, addOrderItem).get(protect, admin, getOrders);
router.route("/mine").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, admin, updateOrderToDeliverd);

export default router;
