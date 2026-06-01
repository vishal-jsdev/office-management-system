const Employee = require('../models/employee.Schema');
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
const { USER_ROLES } = require('../constant/auth.constant');
const { EMPLOYEE_STATUS } = require('../constant/employee.constant');
const JWT_SECRET = process.env.JWT_SECRET_KEY;
const JWT_EXPIRY = process.env.JWT_EXPIRES_IN || '7d';

function sanitizeUser(user) {
  return {
    id: user?._id,
    email: user?.email,
    name: user?.name
  };
}
module.exports.addEmployee = asyncHandler(async (req, res) => {
  const { name, email , phone, role, departmentId, salary, joiningDate, status } = req.body;
  if (!name || !email || !phone || !role || !departmentId || !salary || !joiningDate || !status) {
    throw ApiError.badRequest(
      'Name, Email, Phone, Role, Department Id, Salary, Joining Date and Status are required',
      {
        name: !name ? 'Name is required' : undefined,
        email: !email ? 'Email is required' : undefined,
        phone: !phone ? 'Phone is required' : undefined,
        role: !role? 'Role is required': undefined,
        departmentId: !departmentId? 'Department Id is required': undefined,
        salary: !salary? 'Salary is required': undefined,
        joiningDate: !joiningDate? 'Joining Date is required': undefined,
        status: !status? 'Status is required': undefined
      }
    );
  }

  validateId(departmentId, 'Department')
  const parsedJoiningDate = validateDate(joiningDate)



  if(!USER_ROLES.includes(role)){
    throw ApiError.badRequest(`User role is invalid. Allow values are ${USER_ROLES.join(',')}`)
  }

  if(!EMPLOYEE_STATUS.includes(status)){
    throw ApiError.badRequest(`Employee status is invalid. Allow values are ${EMPLOYEE_STATUS.join(',')}`)
  }
   const existEmployee = await Employee.findOne({email: email.toLowerCase()})
   if(existEmployee) {
     throw ApiError.badRequest('Employee already exists')
   }


  const employee = new Employee({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone,
    role: role ?? "employee",
    departmentId,
    salary,
    joiningDate: parsedJoiningDate,
    status: status ?? "active"
  });
  await employee.save();

  
  return res
    .status(201)
    .json(
      ApiResponse.created(
        employee,
        'Employee created successfully!'
      )
    );
});

module.exports.getAllemployee = asyncHandler(async(req,res)=>{
  const { page = 1, limit = 10, departmentId, role, status } = req.query;

  const filter = {}
    
  if(departmentId) {
    filter.departmentId = departmentId;
  }
  if(role){
    if(!USER_ROLES.includes(role)){
      throw ApiError.badRequest(`User role is invalid. Allow values are ${USER_ROLES.join(',')}`)
    }
    filter.role = role;
  }
  if(status){
    if(!EMPLOYEE_STATUS.includes(status)){
      throw ApiError.badRequest(`Employee status is invalid. Allow values are ${EMPLOYEE_STATUS.join(',')}`)
    }
    filter.status = status;
  }
  const skip = (page -1) * limit

  const employees = await Employee.find(filter).skip(skip).limit(limit).lean()
  return res.status(200).json(ApiResponse.success(employees, "Employees list fetched successfully"))

});

module.exports.getEmployee = asyncHandler(async(req,res)=>{

  validateId(req.params.id, 'employee')

  const employee = await Employee.findById(req.params.id);
  if(!employee){
    throw ApiError.notFound('Employee is not found');
  }

  return res.status(200)
.json(ApiResponse.success(employee,'Employee fetched successfully'))
})

module.exports.updateEmployee = asyncHandler(async(req, res)=>{

  const {id , ...reqData} = req.body;


  validateId(id, 'Employee');
  if(reqData.role){
    if(!USER_ROLES.includes(reqData.role)){
      throw ApiError.badRequest(`User role is invalid. Allow values are ${USER_ROLES.join(',')}`)
    }
  }
  if(reqData.departmentId){
    validateId(reqData.departmentId, 'Employee')
  }
  if(reqData.status){
    if(!EMPLOYEE_STATUS.includes(reqData.status)){
      throw ApiError.badRequest(`Employee status is invalid. Allow values are ${EMPLOYEE_STATUS.join(',')}`)
    }
  }
  
  const saveData = {
    name:reqData.name,
    phone:reqData.phone,
    role:reqData.role,
    departmentId:reqData.departmentId,
    salary:reqData.salary,
    status:reqData.status
  }

  const employeeData = await Employee.findByIdAndUpdate(id,{$set:saveData},{new:true,runValidators:true})
  if(!employeeData){
    throw ApiError.notFound('Employee not found');
  }

  return res.status(200).json(ApiResponse.success(employeeData,'Employee updated succcessfully'));

})


module.exports.removeEmployee = asyncHandler(async(req,res)=>{
  validateId(req.params.id, 'employee');

  const employeeData = await Employee.findByIdAndUpdate(req.params.id, {
    $set : {status: 'inactive'}
  },{
    new:true,runValidators:true
  })
  if(!employeeData){
    throw ApiError.notFound('Employee not found')
  }

  return res.status(200).json(ApiResponse.success(employeeData, 'Employee deleted successfully'))
})