const express = require('express');
const route = express.Router();
const ctl = require('../controller/department.ctl');
const { authMiddleware, isAdmin, isEmployee, isManager } = require('../middleware/auth.middleware');


/**
 * @swagger
 * /department/add:
 *   post:
 *     summary: Create a new department
 *     tags: [Department Management]
 *     description: name, description and managerId are required
 *     security:
 *       - bearerAuth: []   # JWT token required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - managerId
 *             properties:
 *               name:
 *                 type: string
 *                 example: IT
 *               description:
 *                 type: string
 *                 example: This is IT department
 *               managerId:
 *                 type: string
 *                 example: 6a1960fea11f709cd1467167
 *     responses:
 *       201:
 *         description: department successfully created
 *       400:
 *         description: Invalid input
 */

route.post('/add', authMiddleware, isAdmin, ctl.addDepartment);

/**
 * @swagger
 * /department/:
 *   get:
 *     summary: Get departments 
 *     tags: [Department Management]
 *     security:
 *       - bearerAuth: []   # JWT token required
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: Page number for pagination
 *         required: false
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *         description: Number of departments per page
 *         required: false
 *     responses:
 *       200:
 *         description: Returns department data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       managerId:
 *                         type: object
 *                       totalEmployees:
 *                         type: integer
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       404:
 *         description: User not found
 */
route.get('/', authMiddleware, ctl.getAllDepartments);

/**
 * @swagger
 * /department/{id}:
 *   get:
 *     summary: Get a department 
 *     tags: [Department Management]
 *     security:
 *       - bearerAuth: []   # JWT token required
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 6a197760b5a8ea451e22a5f8
 *         description: department id to fetch details
 *     responses:
 *       200:
 *         description: Returns department data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       managerId:
 *                         type: object
 *                       totalEmployees:
 *                         type: integer
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       404:
 *         description: User not found
 */
route.get('/:id', authMiddleware, ctl.getDepartment);


/**
 * @swagger
 * /department/update:
 *   patch:
 *     summary: Update a department details
 *     tags: [Department Management]
 *     description: name, description and managerId are required
 *     security:
 *       - bearerAuth: []   # JWT token required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 example: 6a1d63dc54057ee1b5561d44
 *               name:
 *                 type: string
 *                 example: IT
 *               description:
 *                 type: string
 *                 example: This is IT department
 *               managerId:
 *                 type: string
 *                 example: 6a1960fea11f709cd1467167
 *     responses:
 *       201:
 *         description: department successfully created
 *       400:
 *         description: Invalid input
 */

route.patch('/update', authMiddleware, isAdmin, ctl.updateDepartment);


/**
 * @swagger
 * /department/{id}:
 *   delete:
 *     summary: Remove a department 
 *     tags: [Department Management]
 *     security:
 *       - bearerAuth: []   # JWT token required
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 6a197760b5a8ea451e22a5f8
 *         description: department id to remove details
 *     responses:
 *       200:
 *         description: Return department data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       404:
 *         description: User not found
 */
route.delete('/:id', authMiddleware, isAdmin, ctl.removeDepartment);

module.exports = route;