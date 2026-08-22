const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    aadhar: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      required: true,
    },

    adminApproved: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    advocateRequested: { type: Boolean, default: false },
    advocateAssigned: { type: Boolean, default: false },
    profilePic: {
      type: Object,
      required: true,
    },
  },
  { timeStamps: true }
);
module.exports = mongoose.model("users", schema);
