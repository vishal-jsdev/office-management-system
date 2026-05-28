const mongoose = require('mongoose');
const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
        type: String,
        enum: ["admin", "manager", "employee"],
        default: "employee",
    }
  },
  {
    timestamps: true,
  }
);

const Auth = mongoose.model('Auth', authSchema);
module.exports = Auth;