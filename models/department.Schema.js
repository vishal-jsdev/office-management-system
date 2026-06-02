const mongoose= require('mongoose');

const departmentSchema= new mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        description: {
            type: String,
            require: true
        },
        managerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'User',
            require: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
)
const Department = mongoose.model('Department', departmentSchema);
module.exports = Department;