const Attendance = require('../models/attendance.Schema');

const {
    validateDate,
    validateId
} = require('../utils/user/userData.helper');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/APIResponse');
const { ApiError } = require('../utils/APIError')

module.exports.checkIn = asyncHandler(async(req,res)=>{
    const employeeId  = req.user.userId;
    validateId(employeeId, 'Employee')
    const checkInTime = new Date()
    const parsedDate = new Date(checkInTime.getFullYear(),checkInTime.getMonth(),checkInTime.getDay(),0,0,0,0)
    const existAttendance = await Attendance.findOne({employeeId, date:parsedDate});
    if(existAttendance){
        throw ApiError.badRequest('Attendace is already taken')
    }
    const attendace = new Attendance({
        employeeId,
        date: parsedDate,
        checkIn: new Date(),
        status: 'IN'
    })

    attendace.save()

    return res.status(201).json(ApiResponse.created(attendace, 'Check-in registered successfully'))
});

  function calculateWorkHours(checkInTime, checkOutTime) {
      const diffMs = checkOutTime.getTime() - checkInTime.getTime();
    
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      return `${hours}h ${minutes}m`;
    }

module.exports.checkOut = asyncHandler(async(req,res)=>{

    
    validateId(req.params.id, 'Attedance');
    const checkOutTime = new Date();
    
    const attendance = await Attendance.findById(req.params.id);
    if(!attendance){
        throw ApiError.notFound('Attendace not found')
    }
    
    const hoursWorked = calculateWorkHours(attendance?.checkIn, checkOutTime ?? new Date());
    const attendanceData = await Attendance.findByIdAndUpdate(req.params.id, {
        $set :{ checkOut: new Date(), hoursWorked ,status: "OUT"  }
    },{ new: true, runValidators: true})
    if(!attendanceData){
        throw ApiError.badRequest('Attendance not found')
    }

    return res.status(200).json(ApiResponse.success(attendanceData,'Check-out registered successfully'))

});


module.exports.getAllAttendances = asyncHandler(async(req, res)=>{
    const { page= 1, limit= 10, employeeId, date, month, departmentId} = req.query;

    const skip = (page - 1) * limit;
    const filters = {}
    if(employeeId) {
        filters.employeeId = employeeId;
    }
    if(date){
        filters.date = validateDate(date);
    }
    if(month){
        const startMonth = new Date(new Date().getFullYear(),month,1)
        const endMonth = new Date(new Date().getFullYear(), month, 30)
        filters.date = { $gt : startMonth, $lt: endMonth}
    }
    if(departmentId){
        filters.employeeId.departmentId = departmentId;
    }



    const attendances = await Attendance.find(filters).populate('employeeId').skip(skip).limit(limit).lean()
    const totalattendances = await Attendance.find(filters).lean()
    const totalPage = Math.ceil(totalattendances.length / limit); 
    return res.status(200).json(ApiResponse.success(attendances, 'List of attandances fetched successfully', 200, {page,limit,totalPage}));
})

module.exports.getMyAttendance = asyncHandler(async(req, res)=>{
    const { page=1, limit= 10,employeeId, month, year } = req.query;
    const skip = (page -1) * limit
    validateId(employeeId, 'Employee')
    const filters = {}
    filters.employeeId = employeeId

    if(month){
        const startMonth = new Date(new Date().getFullYear(),month,1)
        const endMonth = new Date(new Date().getFullYear(), month, 30)
        filters.date = { $gt : startMonth, $lt: endMonth}
    }

    if(year){
        const startYear = new Date(year,0,1)
        const endYear = new Date(year, 11, 31)
        filters.date = { $gt : startYear, $lt: endYear}
    }
    const attendances = await Attendance.find(filters).skip(skip).limit(limit).lean()
    const totalAttendances = await Attendance.find(filters).lean()
    const totalPage = Math.ceil(totalAttendances.length / limit); 
    
    return res.status(200).json(ApiResponse.success(attendances, 'Attendance fetched successfully', 200, {page,limit,totalPage}));

})

module.exports.updateAttendance = asyncHandler(async(req,res)=>{
    const { id, checkIn, checkOut, status } = req.body;

    const parsedCheckIn = new Date(checkIn)
    const parsedCheckOut = new Date(checkOut)

    const hoursWorked = calculateWorkHours(parsedCheckIn, parsedCheckOut);
    
    const saveData = {
        checkIn: parsedCheckIn,
        checkOut: parsedCheckOut,
        status,
        hoursWorked
    }

    const attendance = await Attendance.findByIdAndUpdate(id,{
        $set: saveData
    },{ new: true, runValidators: true})

    return res.status(200).json(ApiResponse.success(attendance, "Attendance updated successfully"))
})