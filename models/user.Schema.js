const mongoose = require('mongoose');
const { USER_ROLES } = require('../constant/auth.constant');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
        type: String,
        required: true,
        enum: USER_ROLES,
        default: "employee",
    }
  },
  {
    timestamps: true,
  }
);
userSchema.index({email: 1})
const User = mongoose.model('User', userSchema);
module.exports = User;