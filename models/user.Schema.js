const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
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
    }
  },
  {
    timestamps: true,
  }
);
userSchema.index({date:1})
const User = mongoose.model('User', userSchema);
module.exports = User;