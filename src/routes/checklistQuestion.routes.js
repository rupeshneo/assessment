const express = require("express");
const router = express.Router();
const questionController = require("../controllers/checklistQuestion.controller");
const { authorizeRoles: roleAuth } = require("../middlewares/auth.middleware");
const { authenticateUser: auth } = require("../middlewares/auth.middleware");

router.post("/", auth, roleAuth("procurement"), questionController.createQuestion);
router.put("/:id", auth, roleAuth("procurement"), questionController.updateQuestion);
router.delete("/:id", auth, roleAuth("procurement"), questionController.deleteQuestion);

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
 *     responses:
 *       201:
 *         description: Checklist question created successfully
 */

/**
 * @swagger
 * /checklist-questions/{id}:
 *   put:
 *     summary: Update a checklist question (Procurement only)
 *     tags: [Checklist Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Checklist question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionText:
 *                 type: string
 *                 example: Is the packaging intact and undamaged?
 *     responses:
 *       200:
 *         description: Checklist question updated successfully
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