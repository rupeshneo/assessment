const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { createUserValidation } = require('../validations/auth.validation');
const { authenticateUser, authorizeRoles } = require('../middlewares/auth.middleware');

router.post('/login', authController.login);
router.post('/register', authenticateUser, authorizeRoles('admin', 'procurement', 'inspection'), createUserValidation, authController.register);
router.post('/assign-inspection-manager', authenticateUser, authorizeRoles('admin'), authController.assignInspectionManager);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for user login and registration
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (Admin or Procurement only)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:   
 *                 type: string
 *                 example: "1234567890"
 *               password:
 *                 type: string
 *                 example: "Admin@123"
 *               role:
 *                 type: string
 *                 enum: [admin, procurement, inspection, client]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already exists
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and get JWT token
 *     tags: [Authentication]
 *     security: []        # 👈 disables auth for this route
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@manage.com
 *               password:
 *                 type: string
 *                 example: Admin@123
 *     responses:
 *       200:
 *         description: JWT token generated
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid password
 */

/**
 * @swagger
 * /auth/assign-inspection-manager:
 *   post:
 *     summary: Assign Inspection Manager to Procurement Manager (Procurement only)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inspectionManagerId:
 *                 type: integer
 *                 example: 3
 *               procurementManagerId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Inspection Manager assigned successfully
 *       404:
 *         description: Inspection Manager not found
 */
