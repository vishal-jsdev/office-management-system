const mongoose = require('mongoose')

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },
    targetDepartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    }


},{timestamps:true})

const Announcement = mongoose.model('Announcement', announcementSchema);
module.exports = Announcement;