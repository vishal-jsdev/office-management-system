const express = require('express');
const route = express.Router();
const ctl = require('../controller/user.ctl');
const { authMiddleware } = require('../middleware/auth.middleware');


route.post('/register', ctl.register);
route.post('/login', ctl.login);
route.get('/profile',authMiddleware , ctl.getProfile);
route.post('/change-password',authMiddleware, ctl.changePassword); 


module.exports = route;