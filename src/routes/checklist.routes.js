const express = require("express");
const router = express.Router();
const checklistController = require("../controllers/checklist.controller");
const { authorizeRoles: roleAuth } = require("../middlewares/auth.middleware");
const { authenticateUser: auth } = require("../middlewares/auth.middleware");

// Procurement Manager creates checklist
router.post("/", auth, roleAuth("procurement"), checklistController.createChecklist);

// Anyone (with permission) can view checklist
router.get("/:id", auth, checklistController.getChecklist);

module.exports = router;

/** 
 * @swagger
 * tags:
 *   name: Checklists
 *   description: API for managing checklists
 */

/** 
 * @swagger
 * /checklists:
 *   post:
 *     summary: Create a new checklist (Procurement only)
 *     tags: [Checklists]
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
 *               name:
 *                 type: string
 *                 example: "New Checklist"
 *               description:
 *                 type: string
 *                 example: "Checklist description"
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       example: "Question text"
 *                     type:
 *                       type: string
 *                       enum: ["text","radio","dropdown","textarea","number","checkbox","file","datetime","date"]
 *                       example: "text"
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Option 1", "Option 2"]
 *                     required:
 *                       type: boolean
 *                       example: true
 *     responses:
 *       201:
 *         description: Checklist created successfully
 */

/**
 * @swagger
 * /checklists/{id}:
 *   get:
 *     summary: Get checklist by ID
 *     tags: [Checklists]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Checklist ID
 *     responses:
 *       200:
 *         description: Checklist retrieved successfully
 */ 