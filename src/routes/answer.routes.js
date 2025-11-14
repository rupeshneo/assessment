const express = require("express");
const router = express.Router();
const answerController = require("../controllers/answer.controller");
const { authorizeRoles: roleAuth } = require("../middlewares/auth.middleware");
const { authenticateUser: auth } = require("../middlewares/auth.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");

// Inspection Manager submits answers
router.post("/", auth, roleAuth("inspection"),uploadMiddleware.any(),  answerController.submitAnswer);

// View answers for specific order
router.get("/order/:orderId", auth, answerController.getAnswersByOrder);

module.exports = router;

/** 
 * @swagger
 * tags:
 *   name: Answers
 *   description: API for managing checklist answers
 */

/** 
 * @swagger
 * /answers:
 *   post:
 *     summary: Submit checklist answers (Inspection only)
 *     tags: [Answers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: integer
 *                 example: 1
 *               responses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: integer
 *                       example: 1
 *                     answer:
 *                       type: string
 *                       example: "Yes"
 *     responses:
 *       201:
 *         description: Answers submitted successfully
 */

/**
 * @swagger
 * /answers/order/{orderId}:
 *   get:
 *     summary: Get answers by order ID
 *     tags: [Answers]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: The ID of the order to retrieve answers for
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved answers
 *       404:
 *         description: Order not found
 */
