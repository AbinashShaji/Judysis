/**
 * ============================================================================
 * MODEL: userModel.js
 * HANDOVER SUMMARY:
 * This database schema stores the account profiles of everyday citizens (litigants).
 * It retains their identity info, government Aadhar ID number, address, 
 * approval status from administrators, and whether they have currently requested 
 * or been assigned legal counsel.
 * 
 * RENDERING IMPACT:
 * If this data changes:
 * - Affects Citizen Profile display (UserProfile.js) and Header name (UserNavbar.js).
 * - Pending citizen accounts show up in the Admin Approval queue (AdminViewUserReqs.js).
 * - Approved citizens gain full access to filing cases and chatting with lawyers.
 * 
 * COLLECTION NAME IN MONGODB: 'users'
 * ============================================================================
 */

const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    // Login and communication email address.
    email: {
      type: String,
      required: true,
    },
    // Citizen's full name.
    name: {
      type: String,
      required: true,
    },
    // Login password.
    password: {
      type: String,
      required: true,
    },
    // Government Identification (Aadhar Number) for legal authenticity.
    aadhar: {
      type: String,
      required: true,
    },
    // Phone number.
    contact: {
      type: String,
      required: true,
    },
    // City of residence (helps match with regional court jurisdictions).
    city: {
      type: String,
      required: true,
    },
    // Date of birth.
    dob: {
      type: Date,
      required: true,
    },
    // Gender identity.
    gender: {
      type: String,
      required: true,
    },
    // Whether the court administrator has reviewed and approved this citizen account.
    adminApproved: {
      type: Boolean,
      default: false,
    },
    // Whether the account is currently enabled and allowed to log in.
    isActive: {
      type: Boolean,
      default: false,
    },
    // Flag set to true when the citizen has sent an appointment or case request to an advocate.
    advocateRequested: { 
      type: Boolean, 
      default: false 
    },
    // Flag set to true once an advocate formally accepts the case.
    advocateAssigned: { 
      type: Boolean, 
      default: false 
    },
    // Stored image file object for citizen's profile photo (in server/upload/).
    profilePic: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

// Export model for use by 'userController.js'
module.exports = mongoose.model("users", schema);
