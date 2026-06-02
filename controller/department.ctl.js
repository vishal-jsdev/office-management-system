const Department = require('../models/department.Schema');
const Employee = require('../models/employee.Schema');
const {
    validateDate,
    validateId
} = require('../utils/user/userData.helper');
const { asyncHandler} = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/APIResponse');
const { ApiError } = require('../utils/APIError');
const User = require('../models/user.Schema');


module.exports.addDepartment = asyncHandler(async (req, res)=> {
    const { name, description, managerId } = req.body
    if(!name || !description || !managerId) {
        throw ApiError.badRequest('Name, Description and Manager Id are required',
            {
                name: !name? 'Name is required': undefined,
                description: !description ? 'Description is required': undefined,
                managerId: !managerId ? 'Manager Id is required': undefined
            }
        )
    }

    validateId(managerId, 'User');
    const existDepartment = await Department.findOne({managerId});
    if(existDepartment){
        throw ApiError.badRequest('Duplicate department is existed with manager Id')
    }

    const manager = await User.findOne({_id: managerId});
    if(!manager){
        throw ApiError.badRequest('User not found');
    }

    const department = new Department({
        name,
        description,
        managerId
    })
    await department.save();

    return res.status(201).json(ApiResponse.created(department, 'Department created successfully'))
})


module.exports.getAllDepartments = asyncHandler(async(req,res)=>{
    const { page= 1, limit=10 } = req.query;
    const skip = (page -1) * limit;
    const departments = await Department.find().populate('managerId').skip(skip).limit(limit).lean()
    for (const department of departments) {
        const employees = await Employee.find({departmentId: department._id}).lean()
        department.totalEmployees = employees.length;
    }
    return res.status(200).json(ApiResponse.success(departments, 'Departments fetched successfully'))
})

module.exports.getDepartment = asyncHandler(async(req,res)=>{
    validateId(req.params.id, 'department');
    
    const department = await Department.findById(req.params.id).populate('managerId').lean();
    const employees = await Employee.find({departmentId: department._id}).lean()
    department.employees = employees;
     const { managerId, ...departmentData } = department;
    const result = {
        ...departmentData,
        manager: managerId,
        employees: employees,
        totalEmployees: employees.length,
    };
    return res.status(200).json(ApiResponse.success(result, 'Department fetched successfully'))
})

module.exports.updateDepartment = asyncHandler(async(req,res)=>{
    const { id , managerId , name, description } = req.body;
    validateId(id, 'Department');
    if(managerId){
        validateId(managerId, 'User');

        const manager = await User.findOne({_id: managerId});
        if(!manager){
            throw ApiError.badRequest('User not found');
        }
    }

    const existDepartment = await Department.findOne({managerId});
    if(existDepartment){
        throw ApiError.badRequest('Duplicate department is existed with manager Id')
    }

    const saveData = {
        name,
        description,
        managerId,
    }

    const department = await Department.findByIdAndUpdate(id,
        { $set: saveData},
        { new: true, runValidators: true}
    )
    if(!department) {
        throw ApiError.notFound('Department not found');
    }

    return res.status(200).json(ApiResponse.success(department, 'Department updated successfully'))
});

module.exports.removeDepartment = asyncHandler(async(req,res)=>{
    validateId(req.params.id, 'department');
    const employees = await Employee.find({departmentId: req.params.id}).lean()
    if(employees.filter(employee => {
        return employee.status === 'active'
    }).length>0){
       throw ApiError.badRequest('Department has active employee'); 
    }
    const department = await Department.findByIdAndDelete(req.params.id);
    if(!department) {
        throw ApiError.notFound('Department not found');
    }
    return res.status(200).json(ApiResponse.success(department, 'Department removed successfully'))
})