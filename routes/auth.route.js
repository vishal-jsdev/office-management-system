const express = require('express');
const route = express.Router();
const ctl = require('../controller/auth.ctl');
const { authMiddleware } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User Login/Register]
 *     description: name, email and password are required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John
 *               email:
 *                 type: string
 *                 example: example@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Invalid input
 */
route.post('/register', ctl.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [User Login/Register]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully logged in, returns JWT token
 *       401:
 *         description: Invalid credentials
 */
route.post('/login', ctl.login);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user data from token
 *     tags: [User Login/Register]
 *     security:
 *       - bearerAuth: []   # JWT token required
 *     responses:
 *       200:
 *         description: Returns user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       404:
 *         description: User not found
 */

route.get('/profile',authMiddleware , ctl.getProfile);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [User Login/Register]
 *     security:
 *       - bearerAuth: []   # JWT token required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *               - oldPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: password1234
 *               oldPassword:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully changed password,
 *       401:
 *         description: Invalid credentials
 */
route.post('/change-password',authMiddleware, ctl.changePassword); 


module.exports = route;