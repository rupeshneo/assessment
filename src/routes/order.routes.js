const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { authorizeRoles: roleAuth } = require("../middlewares/auth.middleware");
const { authenticateUser: auth } = require("../middlewares/auth.middleware");

router.post("/", auth, roleAuth("procurement"), orderController.createOrder);
router.get("/", auth, orderController.getAllOrders);
router.put("/:id/status", auth, roleAuth("admin", "procurement", "inspection"), orderController.updateOrderStatus);
router.get("/:id", auth, orderController.getOrderById);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API for managing orders
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order (Procurement only)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Sample Order
 *               description:
 *                 type: string
 *                 example: This is a sample order description.
 *               clientId:
 *                 type: integer
 *                 example: 3
 *               procurementManagerId:
 *                 type: integer
 *                 example: 2
 *               inspectionManagerId:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       201:
 *         description: Order created successfully
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of orders
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin, Procurement, Inspection)
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "in_progress"
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       404:
 *         description: Order not found
 */ 
