const userSchema = require('../models/auth.Schema');
const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/APIError');

const authMiddleware = async (req, _, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(ApiError.unauthorized('No token, authorization denied'));
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userSchema.findById(decoded?.userId);
    if (!user) {
      return next(ApiError.unauthorized('Invalid token'));
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(ApiError.unauthorized('Token has expired'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      if (error.message === 'invalid signature') {
        return next(ApiError.unauthorized('Invalid token signature'));
      }
      if (error.message === 'jwt malformed') {
        return next(ApiError.unauthorized('Malformed token'));
      }
      return next(ApiError.unauthorized('Invalid token'));
    }
    if (error instanceof jwt.NotBeforeError) {
      return next(ApiError.unauthorized('Token not yet active'));
    }
    return next(ApiError.internal('Authentication failed'));
  }
};

module.exports = { authMiddleware };
