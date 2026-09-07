/**
 * ============================================================================
 * MODEL: caseModel.js
 * HANDOVER SUMMARY:
 * This is the central legal dossier in JudiSys. It stores every detail of a legal 
 * petition: who filed it (userId), what happened (description & dateOfIncident), 
 * the opponent party's info, uploaded evidence files, the assigned lawyer (advocateId), 
 * and the assigned Judge (judgeId).
 * 
 * RENDERING IMPACT:
 * If this data changes:
 * - Citizen's Recent Cases view (UserViewRecentCases.js) updates automatically.
 * - Advocate Case Dashboard (AdvocateViewAprvdCases.jsx) lists newly assigned cases.
 * - Court Office Queue (COViewAllCasesAccepted.js) displays cases awaiting judge allocation.
 * - Judge Case Docket (JudgeViewCases.js) reflects assigned court trials.
 * 
 * COLLECTION NAME IN MONGODB: 'cases'
 * ============================================================================
 */

const mongoose = require("mongoose");

const caseSchema = mongoose.Schema({
    // Link to the Citizen / Litigant who filed this petition (from the 'users' collection).
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    // The formal title of the case (e.g., "Property Boundary Dispute on Plot 42").
    title: {
        type: String,
        required: true,
    },
    // Link to the presiding Judge assigned by Court Office (from 'judges' collection).
    judgeId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'judges'
    },
    // Whether the assigned judge has accepted and begun hearing this case.
    judgeStatus: {
        type: Boolean,
        default: false
    },
    // A detailed narrative of what occurred and what legal relief is sought.
    description: {
        type: String,
        required: true,
    },
    // Legal category (e.g., "Civil", "Criminal", "Labor", "Commercial").
    type: {
        type: String,
        required: true,
    },
    // The date when the disputed incident took place.
    dateOfIncident: {
        type: Date,
        required: true,
    },
    // Full name of the opposing party / respondent.
    opponentName: {
        type: String
    },
    // Physical address or contact details of the opposing party.
    opponentAddress: {
        type: String
    },
    // Jurisdiction or city where the incident occurred.
    location: {
        type: String,
        required: true,
    },
    // Uploaded PDF, photo, or document evidence stored in server/upload/.
    evidence: {
        type: Object
    },
    // General approval flag from administration or court clerk.
    approvalStatus: {
        type: Boolean,
        default: false
    },
    // Lifecycle milestone: starts at 'new', moves to 'in-progress', and finally 'closed'.
    caseStatus: {
        type: String,
        default: 'new'
    },
    // Whether an advocate has formally agreed to represent the client in this case.
    advocateStatus: {
        type: Boolean,
        default: false
    },
    // Link to the representing Advocate (from 'advocates' collection).
    advocateId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'advocates'
    },
    // Legal consultation or court fee requested for this case.
    paymentRequested: {
        type: Number,
        default: 0
    },
    // Total fee amount paid and collected so far.
    paymentCollected: {
        type: Number,
        default: 0
    },
});

// Export model for use by 'caseController.js'
module.exports = mongoose.model("cases", caseSchema);
