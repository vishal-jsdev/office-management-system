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
        ref: 'User'

    },
    targetDepartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    }


})

const Announcement = mongoose.model('Announcement', announcementSchema);
module.exports = Announcement;