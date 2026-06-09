const Announcement = require('../models/announcement.Schema');
const Department = require('../models/department.Schema');

const {asyncHandler } = require('../utils/asyncHandler');
const {ApiError }= require('../utils/APIError');
const {ApiResponse } = require('../utils/APIResponse');
const { validateDate, validateId } = require('../utils/user/userData.helper');

module.exports.addAnnouncement = asyncHandler(async(req,res)=>{
    const { title,  body, targetDepartment} = req.body;
    if(!title || !body){
        throw ApiError.badRequest('Title and Body are required',
            {
                title: !title ? 'Title is required': undefined,
                body: !body ? 'Body is required': undefined
            }
        )
    }

    const saveData = {
        title,
        body,
        createdBy: req.user.userId
    }
    if(targetDepartment){
        validateId(targetDepartment, 'Department');
        const department = await Department.findById(targetDepartment).lean();
        if(!department){
            throw ApiError.notFound('Department not found')
        }
        saveData.targetDepartment = targetDepartment;
    }

    const announcement = new Announcement(saveData);

    announcement.save();
    return res.status(201).json(ApiResponse.created(announcement,'Announcement created successfully'));
});

module.exports.getAllAnnouncement = asyncHandler(async(req,res)=>{
    const { page= 1, limit=10} = req.query;
    const skip = (page -1) * limit;
    const filters = {};
    if(req.user.role !== 'admin'){
        filters['$or'] = [
            {
                targetDepartment:req.user.departmentId
            },
            {
                targetDepartment: { "$exists": false }
            }
        ]
    }

     

    const [announcements, totalAnnouncements] = await Promise.all([
        Announcement.find(filters).skip(skip).limit(limit).lean(),
        Announcement.countDocuments(filters),
    ]);

    const totalPage = Math.ceil(totalAnnouncements/limit)
    return res.status(200).json(ApiResponse.success(announcements,'List of announcement fetched successfully',200, {page,limit,totalPage, totals:totalAnnouncements}))
    
})

module.exports.getAnnouncement = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    validateId(id, 'Announcement');

    const announcement = await Announcement.findById(id).lean();
    if(!announcement){
        throw ApiError.notFound('Announcement not found');
    }
    return res.status(200).json(ApiResponse.success(announcement,'Announcement fetched successfully'))
})

module.exports.updateAnnouncement = asyncHandler(async(req,res)=>{
    const { id , title, body, targetDepartment} = req.body;
    validateId(id, 'Announcement');
    
    const saveData = {}
    if(targetDepartment){
        validateId(targetDepartment, 'Announcement');
        const department = await Department.findById(targetDepartment).lean();
        if(!department){
            throw ApiError.notFound('Department not found')
        }
        saveData.targetDepartment = targetDepartment;
    }
    
    if(title && title.trim()){
        saveData.title = title
    }
    if(body && body.trim()) {
        saveData.body = body
    }


    const announcement = await Announcement.findByIdAndUpdate(id, {
        $set : saveData
    }, { new: true, runValidators: true});
    if(!announcement) {
        throw ApiError.notFound('Announcement not found');
    }

    return res.status(200).json(ApiResponse.success(announcement,'Annuouncement updated successfully'))

})


module.exports.removeAnnouncement = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    validateId(id, 'Announcement');

    const announcement = await Announcement.findByIdAndDelete(id);
    if(!announcement){
        throw ApiError.notFound('Announcement not found');      
    }
    return res.status(200).json(ApiResponse.success(announcement,'Annuouncement removed successfully'))

})