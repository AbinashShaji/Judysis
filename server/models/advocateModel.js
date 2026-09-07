/**
 * ============================================================================
 * MODEL: advocateModel.js
 * HANDOVER SUMMARY:
 * This database blueprint stores complete profiles for advocates (lawyers).
 * It tracks their personal details, legal qualifications, Bar Council enrollment 
 * number, uploaded identity certificates, approval status from the court admin, 
 * and community star ratings.
 * 
 * RENDERING IMPACT:
 * If this data changes:
 * - Approved advocates appear on the Citizen Advocate Directory (User_ViewAllAdvocates.js).
 * - Ratings updated here immediately reflect on the Advocate Profile card (User_ViewAdvocateDetail.jsx).
 * - Pending advocates appear in the Admin Verification queue (AdminViewAdvReqs.js).
 * 
 * COLLECTION NAME IN MONGODB: 'advocates'
 * ============================================================================
 */

const mongoose = require("mongoose");

const advSchema = mongoose.Schema({
    // The full legal name of the advocate.
    name: {
        type: String,
        required: true,
    },
    // Bar Council Registration Number (e.g., "BC/1234/2020") used to verify legitimacy.
    bcNo: {
        type: String,
        required: true,
    },
    // Phone number for client and court communications.
    contact: {
        type: Number,
        required: true,
    },
    // Unique login email address.
    email: {
        type: String,
        unique: true,
        required: true,
        dropDups: true
    },
    // Login password.
    password: {
        type: String,
        required: true,
    },
    // Number of years practicing law (helps citizens pick senior vs junior advocates).
    experience: {
        type: Number,
        required: true,
    },
    // Date of birth.
    dob: {
        type: Date,
        required: true,
    },
    // Saved file object for the lawyer's headshot image (stored in server/upload/).
    profilePic: {
        type: Object,
        required: true,
    },
    // Legal specialty area (e.g., "Criminal Law", "Civil Dispute", "Family Law", "Corporate").
    specialization: {
        type: String,
        required: true,
    },
    // Saved file object for their Bar Council ID certificate or law degree document.
    idProof: {
        type: Object,
        required: true,
    },
    // Flag indicating if the advocate's account is currently enabled by the admin.
    isActive: {
        type: Boolean,
        default: false,
    },
    // Admin review status. When 'true', the advocate is allowed to log in and take cases.
    adminApproved: {
        type: Boolean,
        default: false,
    },
    // Average feedback rating (out of 5 stars) given by citizens after consultations.
    rating: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Export model for use by 'advocateController.js'
module.exports = mongoose.model('advocates', advSchema);
