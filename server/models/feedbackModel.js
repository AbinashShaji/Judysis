/**
 * ============================================================================
 * MODEL: feedbackModel.js
 * HANDOVER SUMMARY:
 * This schema stores general platform feedback, complaints, or service reviews 
 * submitted by citizens. It tracks who submitted the feedback, the date of submission, 
 * and their comments so the system administrator can monitor satisfaction and address issues.
 * 
 * RENDERING IMPACT:
 * If this data changes:
 * - Submissions from UserAddFeedbacks.js are saved here.
 * - All feedback entries are retrieved and rendered on the Admin Feedback table (AdminViewFeedbacks.jsx).
 * 
 * COLLECTION NAME IN MONGODB: 'feedback'
 * ============================================================================
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;

const fSchema = new Schema(
    {
        // Link to the citizen who authored this review/feedback.
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        // The calendar date when this feedback was recorded.
        date: {
            type: Date,
            required: true,
        },
        // The written review, comment, or complaint text.
        feedback: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

// Export model for use by 'feedbackController.js'
const feedback = mongoose.model("feedback", fSchema);
module.exports = feedback;