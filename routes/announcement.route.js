const express = require('express')
const route = express.Router();
const ctl = require('../controller/announcement.ctl');
const { authMiddleware, isAdmin, isEmployee, isManager} = require('../middleware/auth.middleware')
const {employeeOrAdminAuthMiddleware} = require('../middleware/employeeOrAdminAuth.middleware')

/**
 * @swagger
 * /announcement/add:
 *   post:
 *     summary: Create a new announcement
 *     tags: [Announcement Management]
 *     description: title and body are required
 *     security:
 *       - bearerAuth: []   # JWT token required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *             properties:
 *               title:
 *                 type: string
 *                 example: this is new title
 *               body:
 *                 type: string
 *                 example: this is new body
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
 *                 title:
 *                   type: string
 *                 body:
 *                   type: string
 *                 createdBy:
 *                   type: string
 *       201:
 *         description: Announcement successfully created
 *       400:
 *         description: Invalid input
 */
route.post('/add', authMiddleware, isAdmin, ctl.addAnnouncement);

/**
 * @swagger
 * /announcement/:
 *   get:
 *     summary: Get all announcements
 *     tags: [Announcement Management]
 *     description: Get all announcements
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
 *         description: Returns announcement data
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
 *                       title:
 *                         type: string
 *                       body:
 *                         type: string
 *                       createdBy:
 *                         type: string
 *                       targetDepartment:
 *                         type: string
 *      
 *                 message:
 *                   type: string
 *       201:
 *         description: Announcement successfully fetched
 *       400:
 *         description: Invalid input
 */
route.get('/', employeeOrAdminAuthMiddleware, ctl.getAllAnnouncement);

/**
 * @swagger
 * /announcement/{id}:
 *   get:
 *     summary: Get a single announcement
 *     tags: [Announcement Management]
 *     description: Get a single announcement
 *     security:
 *       - bearerAuth: []   # JWT token required
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Announcement ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns announcement data
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
 *                     title:
 *                       type: string
 *                     body:
 *                       type: string
 *                     createdBy:
 *                       type: string
 *                     targetDepartment:
 *                         type: string
 *        
 *                 message:
 *                   type: string
 *       201:
 *         description: Announcement successfully fetched
 *       400:
 *         description: Invalid input
 */
route.get('/:id', authMiddleware, isEmployee, ctl.getAnnouncement)

/**
 * @swagger
 * /announcement/update:
 *   patch:
 *     summary: Update a announcement
 *     tags: [Announcement Management]
 *     description: Update a announcement
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
 *               title:
 *                 type: string
 *                 example: Test title
 *               body:
 *                 type: string
 *                 example: Test body
 *     responses:
 *       200:
 *         description: Returns announcement data
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
 *                     title:
 *                       type: string
 *                     body:
 *                       type: string
 *                     createdBy:
 *                       type: string
 *                     targetDepartment:
 *                         type: string
 *        
 *                 message:
 *                   type: string
 *       201:
 *         description: Announcement successfully updated
 *       400:
 *         description: Invalid input
 */
route.patch('/update', authMiddleware, isAdmin, ctl.updateAnnouncement)


/**
 * @swagger
 * /announcement/{id}:
 *   delete:
 *     summary: Remove an announcement
 *     tags: [Announcement Management]
 *     description: Remove an announcement
 *     security:
 *       - bearerAuth: []   # JWT token required
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 6a1972bdbafcb144f6a5d8d2
 *         description: announcement id to remove details
 *     responses:
 *       200:
 *         description: Returns announcement data
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
 *                     title:
 *                       type: string
 *                     body:
 *                       type: string
 *                     createdBy:
 *                       type: string
 *                     targetDepartment:
 *                         type: string
 *        
 *                 message:
 *                   type: string
 *       201:
 *         description: Announcement successfully removed
 *       400:
 *         description: Invalid input
 */
route.delete('/:id', authMiddleware, isAdmin, ctl.removeAnnouncement)

module.exports = route;