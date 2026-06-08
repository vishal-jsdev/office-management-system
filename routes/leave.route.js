const express = require('express');
const route = express.Router();
const ctl = require('../controller/leave.ctl');
const { authMiddleware, isAdmin, isEmployee, isManager} = require('../middleware/auth.middleware')
const { employeeAuthMiddleware} = require('../middleware/employeeAuth.middleware')

/**
 * @swagger
 * /leave/apply:
 *   post:
 *     summary: Create a new leave
 *     tags: [Leave Management]
 *     description: type, fromDate, toDate and reason are required
 *     security:
 *       - bearerAuth: []   # JWT token required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - fromDate
 *               - toDate
 *               - reason
 *             properties:
 *               type:
 *                 type: string
 *                 example: sick
 *               fromDate:
 *                 type: string
 *                 example: 2026-06-01
 *               toDate:
 *                 type: string
 *                 example: 2026-06-04
 *               reason:
 *                 type: string
 *                 example: travel to Ahmedabad
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
 *                 type:
 *                   type: string
 *                 fromDate:
 *                   type: string
 *                 toDate:
 *                   type: string
 *                 reason:
 *                   type: string
 *       201:
 *         description: Leave successfully created
 *       400:
 *         description: Invalid input
 */
route.post('/apply', employeeAuthMiddleware, ctl.applyLeave);

/**
 * @swagger
 * /leave/:
 *   get:
 *     summary: Get all leaves
 *     tags: [Leave Management]
 *     description: Get all leaves
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
 *         name: status
 *         schema:
 *           type: string
 *           example: pending
 *         description: The status of leave
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *           example: 6a2030e7af9e36b237cdd53a
 *         description: The employeeId of leave
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           example: sick
 *         description: The type of leave
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           example: 5
 *         description: The month of leave
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
 *                       type:
 *                         type: string
 *                       fromDate:
 *                         type: string
 *                       toDate:
 *                         type: string
 *                       reason:
 *                         type: string
 *      
 *                 message:
 *                   type: string
 *       201:
 *         description: Leave successfully fetched
 *       400:
 *         description: Invalid input
 */
route.get('/', authMiddleware, isManager, ctl.getAllLeaves);

/**
 * @swagger
 * /leave/my-leave:
 *   get:
 *     summary: Get all my leaves
 *     tags: [Leave Management]
 *     description: Get all my leaves
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
 *                       type:
 *                         type: string
 *                       fromDate:
 *                         type: string
 *                       toDate:
 *                         type: string
 *                       reason:
 *                         type: string
 *      
 *                 message:
 *                   type: string
 *       201:
 *         description: Leave successfully fetched
 *       400:
 *         description: Invalid input
 */
route.get('/my-leave', employeeAuthMiddleware, ctl.getMyLeaves);

/**
 * @swagger
 * /leave/{id}:
 *   get:
 *     summary: Get a single leave
 *     tags: [Leave Management]
 *     description: Get a single leave
 *     security:
 *       - bearerAuth: []   # JWT token required
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Leave ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns department data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     type:
 *                       type: string
 *                     fromDate:
 *                       type: string
 *                     toDate:
 *                       type: string
 *                     reason:
 *                         type: string
 *        
 *                 message:
 *                   type: string
 *       201:
 *         description: Leave successfully fetched
 *       400:
 *         description: Invalid input
 */
route.get('/:id', employeeAuthMiddleware, ctl.getSingleLeave);

/**
 * @swagger
 * /leave/approve:
 *   patch:
 *     summary: Approve a leave
 *     tags: [Leave Management]
 *     description: Approve a leave
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
 *               note:
 *                 type: string
 *                 example: Leave approved
 *     responses:
 *       200:
 *         description: Returns department data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     type:
 *                       type: string
 *                     fromDate:
 *                       type: string
 *                     toDate:
 *                       type: string
 *                     reason:
 *                         type: string
 *        
 *                 message:
 *                   type: string
 *       201:
 *         description: Leave successfully fetched
 *       400:
 *         description: Invalid input
 */
route.patch('/approve', authMiddleware, isManager, ctl.approveLeave);

/**
 * @swagger
 * /leave/reject:
 *   patch:
 *     summary: Reject a leave
 *     tags: [Leave Management]
 *     description: Reject a leave
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
 *               reason:
 *                 type: string
 *                 example: not having a fever 
 *     responses:
 *       200:
 *         description: Returns department data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     type:
 *                       type: string
 *                     fromDate:
 *                       type: string
 *                     toDate:
 *                       type: string
 *                     reason:
 *                         type: string
 *        
 *                 message:
 *                   type: string
 *       201:
 *         description: Leave successfully fetched
 *       400:
 *         description: Invalid input
 */
route.patch('/reject', authMiddleware, isManager, ctl.rejectLeave);

/**
 * @swagger
 * /leave/cancel/{id}:
 *   delete:
 *     summary: Cancel a leave
 *     tags: [Leave Management]
 *     description: Cancel a leave
 *     security:
 *       - bearerAuth: []   # JWT token required
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 6a1972bdbafcb144f6a5d8d2
 *         description: leave id to cancel details
 *     responses:
 *       200:
 *         description: Returns department data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     type:
 *                       type: string
 *                     fromDate:
 *                       type: string
 *                     toDate:
 *                       type: string
 *                     reason:
 *                         type: string
 *        
 *                 message:
 *                   type: string
 *       201:
 *         description: Leave successfully fetched
 *       400:
 *         description: Invalid input
 */
route.delete('/cancel/:id', employeeAuthMiddleware, ctl.cancelLeave);

module.exports = route;