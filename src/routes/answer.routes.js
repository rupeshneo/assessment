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
 *     summary: Submit checklist answers
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: integer
 *                 example: 1   
 *               responses:
 *                 type: string
 *                 description: JSON stringified array of responses
 *                 example: '[{"questionId": 1,"answers": ""},{"questionId": 2,"answers": "yes"},{"questionId": 3,"answers": "Apple,Orange"},{"questionId": 4,"answers": "No comments"},{"questionId": 5,"answers": "5"},{"questionId": 6,"answers": "JavaScript,Python"},{"questionId": 7,"answers": "dd"},{"questionId": 8,"answers": "2024-06-15 10:30:00"},{"questionId": 9,"answers": "1990-01-01"}]'
 *               files:
 *                type: array
 *                description: Array of files to upload
 *                items:
 *                  type: string
 *                  format: binary
 *                  description: Upload files. File fieldnames must be question_{id} (e.g., question_7)
 *     responses:
 *       200:
 *         description: Answers submitted successfully
 *       400:
 *         description: Bad request due to validation errors
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