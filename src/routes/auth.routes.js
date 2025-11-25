const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { createUserValidation } = require('../validations/auth.validation');
const { authenticateUser, authorizeRoles } = require('../middlewares/auth.middleware');
const { ADMIN, PROC, INSP } = require('../config/config.json').role

router.post('/login', authController.login);
router.post('/register', authenticateUser, authorizeRoles( ADMIN, PROC, INSP ), createUserValidation, authController.register);
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
 *                 example: Procurement Manager
 *               email:
 *                 type: string
 *                 example: procurement@manage.com
 *               phone:   
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 example: "Admin@123"
 *               role:
 *                 type: string
 *                 example: "procurement"
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
 *     security: []
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
 *         description: Invalid credentials
 */

/**
 * @swagger
 * tags:
 *   name: Assign
 *   description: API for user login and registration
 */

/**
 * @swagger
 * /auth/assign-inspection-manager:
 *   post:
 *     summary: Assign Inspection Manager to Procurement Manager (Procurement only)
 *     tags: [Assign]
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
