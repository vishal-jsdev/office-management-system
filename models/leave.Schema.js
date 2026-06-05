const mongoose = require('mongoose')
const { LEAVE_TYPE, LEAVE_STATUS } = require('../constant/leave.constant')

const leaveScehma = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        require: true
    },
    type: {
        type: String,
        enum: LEAVE_TYPE,
        required: true,
    },
    fromDate: {
        type: Date,
        require:true
    },
    toDate: {
        type: Date,
        require:true
    },
    reason: {
        type: String
    },
    status: {
        type: String,
        enum: LEAVE_STATUS,
        require: true,
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