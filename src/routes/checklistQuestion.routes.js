const express = require("express");
const router = express.Router();
const questionController = require("../controllers/checklistQuestion.controller");
const { authorizeRoles: roleAuth } = require("../middlewares/auth.middleware");
const { authenticateUser: auth } = require("../middlewares/auth.middleware");
const { PROC } = require('../config/config.json').role

router.post("/", auth, roleAuth(PROC), questionController.createQuestion);
router.put("/:id", auth, roleAuth(PROC), questionController.updateQuestion);
router.delete("/:id", auth, roleAuth(PROC), questionController.deleteQuestion);

module.exports = router;

/** 
 * @swagger
 * tags:
 *   name: Checklist Questions
 *   description: API for managing checklist questions
 */

/**
 * @swagger
 * /checklist-questions:
 *   post:
 *     summary: Create a new checklist question (Procurement only)
 *     tags: [Checklist Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionText:
 *                 type: string
 *                 example: Is the packaging intact?
 *               type:
 *                 type: string
 *                 enum: [text, radio, dropdown, textarea, number, checkbox, file, datetime, date]
 *                 example: radio
 *               required:
 *                 type: boolean
 *                 example: true
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Yes", "No", "Not Applicable"]
 *               checklistId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Checklist question created successfully
 */

/**
 * @swagger
 * /checklist-questions/{id}:
 *   put:
 *     summary: Update an existing checklist question (Procurement only)
 *     tags: [Checklist Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the checklist question to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionText:
 *                 type: string
 *                 example: Is the item properly sealed?
 *               type:
 *                 type: string
 *                 enum: [text, radio, dropdown, textarea, number, checkbox, file, datetime, date]
 *                 example: dropdown
 *               required:
 *                 type: boolean
 *                 example: false
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Excellent", "Good", "Poor"]
 *     responses:
 *       200:
 *         description: Checklist question updated successfully
 *       404:
 *         description: Checklist question not found
 */


/** * @swagger
 * /checklist-questions/{id}:
 *   delete:
 *     summary: Delete a checklist question (Procurement only)
 *     tags: [Checklist Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Checklist question ID
 *     responses:
 *       200:
 *         description: Checklist question deleted successfully
 */ 