const mongoose= require('mongoose');

const attendanceSchema= new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'Employee',
            require: true
        },
        date: {
            type: Date,
            require: true
        },
        checkIn: {
            type: Date,
            require: true
        },
        checkOut: {
            type: Date,

        },
        hoursWorked: {
            type: String
        },
        status: {
            type: String,
            require: true
        },
        note: {
            type: String
        }
    },
    {
        timestamps: true
    }
)
const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;