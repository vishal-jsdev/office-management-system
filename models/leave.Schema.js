const mongoose = require('mongoose')
const { LEAVE_TYPE, LEAVE_STATUS } = require('../constant/leave.constant')

const leaveScehma = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    type: {
        type: String,
        enum: LEAVE_TYPE,
        required: true,
    },
    fromDate: {
        type: Date,
        required:true
    },
    toDate: {
        type: Date,
        required:true
    },
    reason: {
        type: String,
        required:true
    },
    status: {
        type: String,
        enum: LEAVE_STATUS,
        required: true,
        default: 'pending'
    },
    reviewNote: {
        type: String
    },
    date: {
        type: Date
    }

})

const Leave = mongoose.model('Leave', leaveScehma);
module.exports = Leave;