/**
 * ============================================================================
 * MODEL: caseStatusModel.js
 * HANDOVER SUMMARY:
 * This schema acts as the running courtroom court diary / hearing timeline for a case.
 * Every time a hearing happens, evidence is presented, an order is issued, or a 
 * next hearing date is scheduled, a new entry is saved here.
 * 
 * RENDERING IMPACT:
 * If this data changes:
 * - Citizen's Hearing Details screen (UserViewHearingDetails.jsx) renders the new hearing note.
 * - Advocate Case Hearings screen (AdvocateCaseHearings.jsx) displays next scheduled dates.
 * - Judge courtroom hearing logs (CaseHearings.jsx) update in real-time.
 * 
 * COLLECTION NAME IN MONGODB: 'casestatus'
 * ============================================================================
 */

const mongoose = require("mongoose");

const statusSchema = mongoose.Schema({
    // Link to the parent legal case being heard.
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'cases'
    },
    // Link to the citizen / litigant involved.
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    // Link to the advocate representing the case.
    advocateId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'advocates'
    },
    // Link to the judge presiding over this hearing.
    judgeId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'judges'
    },
    // Hearing outcome or current posture (e.g., 'Pending', 'Hearing Scheduled', 'Adjourned', 'Verdict Delivered', 'Closed').
    status: {
        type: String,
        default: 'Pending',
    },
    // Date when this status update was recorded.
    date: {
        type: Date,
    },
    // Upcoming date when the next court session will take place.
    hearingDate: {
        type: Date,
    },
    // Detailed courtroom notes, orders, or arguments recorded by the judge or clerk.
    description: {
        type: String
    }
}, { timestamps: true });

// Export model for use by 'caseStatusController.js'
module.exports = mongoose.model('casestatus', statusSchema);
