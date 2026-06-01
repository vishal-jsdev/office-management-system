const express = require('express');
const route = express.Router();
const ctl = require('../controller/employee.ctl');
const { authMiddleware, isAdmin, isManager, isEmployee } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /employee/add:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees  Management]
 *     description: name, email, phone, role, department id, salary, joining date and status are required
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
 *               - email
 *               - phone
 *               - role
 *               - departmentId
 *               - salary
 *               - joiningDate
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *                 example: John
 *               email:
 *                 type: string
 *                 example: example@example.com
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *               role:
 *                 type: string
 *                 example: employee
 *               departmentId: 
 *                 type: string
 *                 example: 6a1960fea11f709cd1467167
 *               salary:
 *                 type: number
 *                 example: 100000
 *               joiningDate:
 *                 type: string
 *                 example: 21-05-2026
 *               status:
 *                 type: string
 *                 example: active
 *     responses:
 *       201:
 *         description: employee successfully created
 *       400:
 *         description: Invalid input
 */
route.post('/add', authMiddleware, isAdmin, ctl.addEmployee);


/**
 * @swagger
 * /employee/:
 *   get:
 *     summary: Get employees 
 *     tags: [Employees  Management]
 *     security:
 *       - bearerAuth: []   # JWT token required
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           example: 1
 *         description: page of employee records
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           example: 1
 *         description: limit of employee records
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *           example: 6a1960fea11f709cd1467167
 *         description: department Id of employee records
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           example: employee
 *         description: The role of employee records
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           example: active
 *         description: The status of employee records
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

route.get('/',authMiddleware, isManager , ctl.getAllemployee);

/**
 * @swagger
 * /employee/{id}:
 *   get:
 *     summary: Get employees 
 *     tags: [Employees  Management]
 *     security:
 *       - bearerAuth: []   # JWT token required
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 6a197760b5a8ea451e22a5f8
 *         description: employee id to fetch details
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
route.get('/:id',authMiddleware, isEmployee , ctl.getEmployee);

/**
 * @swagger
 * /employee/update:
 *   patch:
 *     summary: update an employee details
 *     tags: [Employees  Management]
 *     description: id, name, phone, role, department id, salary and status are required
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
 *                 example: 6a1972bdbafcb144f6a5d8d2
 *               name:
 *                 type: string
 *                 example: John
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *               role:
 *                 type: string
 *                 example: employee
 *               departmentId: 
 *                 type: string
 *                 example: 6a1960fea11f709cd1467167
 *               salary:
 *                 type: number
 *                 example: 100000
 *               status:
 *                 type: string
 *                 example: active
 *     responses:
 *       201:
 *         description: employee successfully updated
 *       400:
 *         description: Invalid input
 */
route.patch('/update',authMiddleware, isAdmin , ctl.updateEmployee);


/**
 * @swagger
 * /employee/{id}:
 *   patch:
 *     summary: remove an employee data 
 *     tags: [Employees  Management]
 *     security:
 *       - bearerAuth: []   # JWT token required
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 6a197760b5a8ea451e22a5f8
 *         description: employee id to delete details
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
route.patch('/:id',authMiddleware, isAdmin , ctl.removeEmployee);

module.exports = route;