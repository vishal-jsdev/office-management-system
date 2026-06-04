const mongoose = require('mongoose');
const { USER_ROLES } = require('../constant/auth.constant');
const { EMPLOYEE_STATUS } = require('../constant/employee.constant');
const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    role: {
        type: String,
        required: true,
        enum: USER_ROLES,
        default: "employee",
    },
    departmentId:{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Department'
    },
    salary: {
      type: Number,
      required: true
    },
    joiningDate: {
      type: Date,
      required: true

    },
    status: {
      type: String,
      enum:EMPLOYEE_STATUS,
      required: true,
      default: 'active'
    },
    password: {
      type: String,
      required:  true
    }
  },
  {
    timestamps: true,
  }
);
employeeSchema.index({email: 1}, {unique: true})
const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;