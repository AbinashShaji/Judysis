/**
 * ============================================================================
 * MODEL: judgeModel.js
 * HANDOVER SUMMARY:
 * This schema defines the database structure for presiding Judges in the judicial system.
 * It stores their contact details, judicial experience, court specialization, 
 * and login status so the Court Office can assign them to oversee active courtroom cases.
 * 
 * RENDERING IMPACT:
 * If this data changes:
 * - Active judges populate the Court Office Case Assignment dropdown (COViewSinglecase.jsx).
 * - Judges log into their court dashboard (JudgeHome.jsx) to review case dockets and hearings.
 * - Admin and Court Office view all judges in AdminViewJudjes.js and COViewAlljudges.jsx.
 * 
 * COLLECTION NAME IN MONGODB: 'judges'
 * ============================================================================
 */

const mongoose = require("mongoose");

const judgeSchema = mongoose.Schema({
    // Full name of the Honorable Judge.
    name: {
        type: String,
        required: true,
    },
    // Contact phone number.
    contact: {
        type: Number,
        required: true,
    },
    // Official email address used to log into the Judge Portal.
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
    // Total years of judicial or courtroom experience.
    experience: {
        type: Number,
        required: true,
    },
    // Date of birth.
    dob: {
        type: Date,
        required: true,
    },
    // Area of legal expertise (e.g., "Criminal", "Constitutional", "Civil").
    specialization: {
        type: String,
        required: true,
    },
    // Active switch: 'true' means the judge is currently in office and available to preside over cases.
    isActive: {
        type: Boolean,
        default: true,
    }
});

// Export model for use by 'judgeController.js'
module.exports = mongoose.model('judges', judgeSchema);
