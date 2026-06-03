const express = require('express')
const route = express.Router();
const ctl = require('../controller/attendance.ctl');
const { authMiddleware, isAdmin, isManager, isEmployee } = require('../middleware/auth.middleware');
/**
 * @swagger
 * /attendance/check-in/{employeeId}:
 *   post:
 *     summary: Create a new attendance
 *     tags: [Attendance Management]
 *     description: employeeId is required
 *     security:
 *       - bearerAuth: []   # JWT token required
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         schema:
 *           type: string
 *           example: 6a1960fea11f709cd1467167
 *         required: true
 *         description: employee ID of attendance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *             properties:
 *               employeeId:
 *                 type: string
 *                 example: 6a1960fea11f709cd1467167
 *     responses:
 *       201:
 *         description: Attendance successfully created
 *       400:
 *         description: Invalid input
 */

route.post('/check-in/:employeeId', authMiddleware, isEmployee, ctl.checkIn);

/**
 * @swagger
 * /attendance/check-out/{id}:
 *   patch:
 *     summary: Update an attendance for check out 
 *     tags: [Attendance Management]
 *     description: id is required
 *     security:
 *       - bearerAuth: []   # JWT token required
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 6a1ebaa326a58a4ebdf01c28
 *         required: true
 *         description: ID in Object ID format
 *     responses:
 *       201:
 *         description: Attendance successfully updated
 *       400:
 *         description: Invalid input
 */

route.patch('/check-out/:id', authMiddleware, isEmployee, ctl.checkOut);


/**
 * @swagger
 * /attendance/:
 *   get:
 *     summary: Get an attendances 
 *     tags: [Attendance Management]
 *     description: Get an attendances
 *     security:
 *       - bearerAuth: []   # JWT token required
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           example: 1
 *         description: page number for the list
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           example: 10
 *         description: limit of the list
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *           example: 6a19720a235b3931304c5ebb
 *         description: employee id of the attendances
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           example: 01-06-2026
 *         description: date of the attendances
 *       - in: query
 *         name: month
 *         schema:
 *           type: number
 *           example: 5
 *         description: month of the attendances
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *           example: 6a1960fea11f709cd1467168
 *         description: department ID of the employees
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
 *                       status:
 *                         type: string
 *                       date:
 *                         type: string
 *                       employeeId:
 *                         type: object
 *                       checkIn:
 *                         type: string
 *                       checkOut:
 *                         type: string
 *                 message:
 *                   type: string
 *       201:
 *         description: Attendance successfully updated
 *       400:
 *         description: Invalid input
 */
route.get('/', authMiddleware, isManager, ctl.getAllAttendances);


/**
 * @swagger
 * /attendance/my-attendance:
 *   get:
 *     summary: Get an attendances 
 *     tags: [Attendance Management]
 *     description: Get an attendances
 *     security:
 *       - bearerAuth: []   # JWT token required
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           example: 1
 *         description: page number for the list
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           example: 10
 *         description: limit of the list
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *           example: 6a19720a235b3931304c5ebb
 *         required: true
 *         description: employee id of the attendances
 *       - in: query
 *         name: month
 *         schema:
 *           type: number
 *           example: 5
 *         description: month of the attendances
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *           example: 2026
 *         description: year of the attendances
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
 *                       status:
 *                         type: string
 *                       date:
 *                         type: string
 *                       employeeId:
 *                         type: object
 *                       checkIn:
 *                         type: string
 *                       checkOut:
 *                         type: string
 *                 message:
 *                   type: string
 *       201:
 *         description: Attendance successfully updated
 *       400:
 *         description: Invalid input
 */
route.get('/my-attendance', authMiddleware, ctl.getMyAttendance);

/**
 * @swagger
 * /attendance/update:
 *   patch:
 *     summary: Update a new attendance
 *     tags: [Attendance Management]
 *     description: id is required
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
 *                 example: 6a1960fea11f709cd1467167
 *               checkIn:
 *                 type: string
 *                 example: 2026-06-01 13:12
 *               checkOut:
 *                 type: string
 *                 example: 2026-06-01 15:12
 *               status:
 *                 type: string
 *                 example: OUT
 *     responses:
 *       201:
 *         description: Attendance successfully created
 *       400:
 *         description: Invalid input
 */

route.patch('/update', authMiddleware, isAdmin, ctl.updateAttendance);
module.exports = route;