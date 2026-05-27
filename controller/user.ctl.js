const User = require('../models/user.Schema');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
  validateDate,
  validateId
} = require('../utils/user/userData.helper');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/APIResponse');
const { ApiError } = require('../utils/APIError');
const JWT_SECRET = process.env.JWT_SECRET_KEY;
const JWT_EXPIRY = process.env.JWT_EXPIRES_IN || '7d';

function sanitizeUser(user) {
  return {
    _id: user?._id,
    email: user?.email,
    name: user?.name
  };
}
module.exports.register = asyncHandler(async (req, res) => {
  const { name, email , password, role } = req.body;
  if (!name || !email || !password ) {
    throw ApiError.badRequest(
      'Name, Email and Password are required',
      {
        name: !name ? 'Name is required' : undefined,
        email: !email ? 'Email is required' : undefined,
        password: !password ? 'Password is required' : undefined
      }
    );
  }

if (password.length < 6) {
    throw ApiError.validationError(
      'Password must be at least 6 characters long',
      {
        password: 'Password must be at least 6 characters long',
      }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    role
  });
  const newUser = await user.save();
const token = jwt.sign({ userId: newUser._id , name:newUser.name, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

  
  return res
    .status(201)
    .json(
      ApiResponse.created(
        {...sanitizeUser(newUser), token },
        'User created successfully!'
      )
    );
});

module.exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw ApiError.badRequest('Email and password are required', {
      email: !email ? 'email is required' : undefined,
      password: !password ? 'password is required' : undefined,
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid password');
  }

  const token = jwt.sign({ userId: user._id , name:user.name, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });

  return res
    .status(200)
    .json(
      ApiResponse.success(
        { ...sanitizeUser(user), token },
        'Login successfully!'
      )
    );
});


module.exports.getProfile = asyncHandler(async (req, res) => {
  

  return res
    .status(200)
    .json(
      ApiResponse.success(
        req.user,
        'User got successfully!'
      )
    );
});

module.exports.changePassword = asyncHandler(async (req, res) => {
  const { newPassword, oldPassword } = req.body;

  if (!newPassword || !oldPassword) {
    throw ApiError.badRequest('New password and old password are required', {
      newPassword: !newPassword ? 'New password is required' : undefined,
      oldPassword: !oldPassword ? 'Old password is required' : undefined,
    });
  }
  
  const user = await User.findOne({ email: req.user.email });
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid password');
  }

 const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  user.password =  hashedPassword;
  const newUser = await user.save();

  return res
    .status(200)
    .json(
      ApiResponse.success(
        { ...sanitizeUser(newUser) },
        'Password changed successfully'
      )
    );
});





