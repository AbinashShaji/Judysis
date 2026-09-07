/**
 * ============================================================================
 * MODEL: appointmentSchema.js
 * HANDOVER SUMMARY:
 * This schema manages consultation appointment bookings between citizens and advocates.
 * When a citizen discovers a lawyer they like and wants legal advice on a case, 
 * they book an appointment date. The advocate can review, accept, or decline it.
 * 
 * RENDERING IMPACT:
 * If this data changes:
 * - Citizen's appointment booking status (pending/accepted/rejected) updates on User_BookAppoinment.js.
 * - Pending consultation requests populate the lawyer's queue (AdvocateViewCaseReq.js).
 * - Approved appointments populate the lawyer's calendar (AdvocateHome.js).
 * 
 * COLLECTION NAME IN MONGODB: 'appointmentReqs'
 * ============================================================================
 */

const mongoose = require("mongoose");

const appSchema = mongoose.Schema({
    // The citizen / client who booked this appointment.
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    // The specific case file they want to discuss.
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'cases'
    },
    // The scheduled calendar date and time for the consultation.
    date: {
        type: Date,
        required: true,
    },
    // Current booking status: starts as 'pending', changes to 'accepted' or 'rejected'.
    status: {
        type: String,
        default: 'pending'
    },
    // The lawyer requested for this consultation.
    advocateId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'advocates'
    }
});

// Export model for use by 'appointmentController.js'
module.exports = mongoose.model('appointmentReqs', appSchema);
