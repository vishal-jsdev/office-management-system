const Leave = require('../models/leave.Schema')

const {asyncHandler} = require('../utils/asyncHandler');
const {ApiError} = require('../utils/APIError');
const {ApiResponse} = require('../utils/APIResponse');
const { LEAVE_TYPE, LEAVE_STATUS } = require('../constant/leave.constant');
const { validateId } = require('../utils/user/userData.helper');

module.exports.applyLeave = asyncHandler(async(req,res)=> {
    const { type, fromDate, toDate, reason }= req.body
    if(!type || !fromDate || !toDate || !reason){
        throw ApiError.badRequest('Type, fromDate, toDate and reason are required ', {
            type: !type ? 'Type is required': undefined,
            fromDate: !fromDate ? 'From Date is required': undefined,
            toDate: !toDate ? 'To Date is required': undefined,
            reason: !reason ? 'Reason is required': undefined
        })
    }

    const employeeId = req.user.userId

    if(!LEAVE_TYPE.includes(type)){
        throw ApiError.badRequest(`Type is invalid. Allow values are ${LEAVE_TYPE.join(',')}`)
    }

    const parsedFromDate = new Date(fromDate)
    const parsedToDate = new Date(toDate);

    if(parsedFromDate>parsedToDate){
        throw ApiError.badRequest('FromDate cann\'t be greater than To Date')
    }

    const leave = new Leave({
        type,
        fromDate: parsedFromDate,
        toDate: parsedToDate,
        reason,
        employeeId,
        status: 'pending',
        date: new Date()
    })
    leave.save()

    return res.status(201).json(ApiResponse.created(leave, 'Leave created successfully'))

})

module.exports.getAllLeaves = asyncHandler(async(req,res)=> {
    const { page=1, limit=10, type,status, employeeId, month }= req.query
    const skip = (page -1 ) * limit;
    const filters = {}
    if(type){
        if(!LEAVE_TYPE.includes(type)){
            throw ApiError.badRequest(`Type is invalid. Allow values are ${LEAVE_TYPE.join(',')}`)
        }
        filters.type = type;
    }
    if(status){
        if(!LEAVE_STATUS.includes(status)){
            throw ApiError.badRequest(`Status is invalid. Allow values are ${LEAVE_STATUS.join(',')}`)
        }
        filters.status = status;
    }

    if(employeeId){
        filters.employeeId = employeeId;
    }

    if(month){
        const startMonth = new Date(new Date().getFullYear(), month, 1)
        const endMonth = new Date(new Date().getFullYear(), month, 30)
        filters.date ={ $gt : startMonth, $lt: endMonth}
    }

    const leaves = await Leave.find(filters).skip(skip).limit(limit).lean();
    const totalLeaves = await Leave.find(filters).lean()
    const totalPage = Math.ceil(totalLeaves.length/limit)
    return res.status(200).json(ApiResponse.success(leaves,'List of leaves fetched successfully',200, {page,limit,totalPage, totals:totalLeaves.length}))

})

module.exports.getMyLeaves = asyncHandler(async(req,res)=>{
    const {page=1 ,limit=20 } = req.query;
    const skip = (page -1 ) * limit;
    const employeeId = req.user.userId
    const filter = {employeeId}

    const leaves = await Leave.find(filter).skip(skip).limit(limit).lean()
    
    const totalLeaves = await Leave.find(filter).lean()
    const totalPage = Math.ceil(totalLeaves.length/limit)
    return res.status(200).json(ApiResponse.success(leaves,'List of my leaves fetched successfully',200, {page,limit,totalPage, totals:totalLeaves.length}))
})

module.exports.getSingleLeave = asyncHandler(async(req,res)=>{
    const id = req.params.id
    validateId(id, 'Leave');
    const leave = await Leave.findOne({_id:id, employeeId: req.user.userId});
    if(!leave){
        throw ApiError.notFound('Leave not found');
    }
    return res.status(200).json(ApiResponse.success(leave,'Leave fetched successfully'))
});

module.exports.approveLeave = asyncHandler(async(req,res)=>{
    const {id,note} = req.body;
    validateId(id, 'Leave')
    const saveData = {
        reviewNote: note,
        status: 'approved'
    }
    const leave = await Leave.findByIdAndUpdate(id,{
        $set: saveData
    }, {new: true,runValidators:true})
    if(!leave){
        throw ApiError.notFound('Leave not found')
    }

    return res.status(200).json(ApiResponse.success(leave,'Leave updated successfully'))
})

module.exports.rejectLeave = asyncHandler(async(req,res)=>{
    const {id,reason} = req.body;
    validateId(id, 'Leave')
    if(!reason){
        throw ApiError.badRequest('Reason is required');
    }
    const saveData = {
        reason,
        status: 'rejected'
    }
    const leave = await Leave.findByIdAndUpdate(id,{
        $set: saveData
    }, {new: true,runValidators:true})
    if(!leave){
        throw ApiError.notFound('Leave not found')
    }

    return res.status(200).json(ApiResponse.success(leave,'Leave updated successfully'))
})

module.exports.cancelLeave = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateId(id, 'Leave')
    const leave = await Leave.findById(id);
    if(!leave){
        throw ApiError.notFound('Leave not found');
    }
    if(['approved','rejected'].includes(leave.status)){
        throw ApiError.badRequest(`Leave is already ${leave.status}`)
    }
    if(leave.employeeId.toString()!==req.user.userId){
        throw ApiError.badRequest('Leave is not owned by the user')
    }
    
    const leaveData = await Leave.findByIdAndDelete(id)

    return res.status(200).json(ApiResponse.success(leaveData,'Leave deleted successfully'))
})

