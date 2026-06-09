const employeeSchema = require('../models/employee.Schema');
const userSchema = require('../models/user.Schema');

const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/APIError');

const employeeOrAdminAuthMiddleware = async (req, _, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(ApiError.unauthorized('No token, authorization denied'));
    }
    const userData = {};
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userSchema.findById(decoded?.userId);
    if (user){
      if(user.role !== 'admin'){
        next(ApiError.unauthorized('Role is invalid'))

      }
    } else {
      const employee = await employeeSchema.findById(decoded?.userId);
      if (!employee) {
        return next(ApiError.unauthorized('Only employee has authorization to this endpoint'));
      }
      userData.departmentId = employee.departmentId;
    }
   

    req.user = {...decoded, ...userData};
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


module.exports = { employeeOrAdminAuthMiddleware };
