/**
 * ============================================================================
 * CONTROLLER: feedbackController.js
 * HANDOVER SUMMARY:
 * This controller handles citizen reviews, feedback notes, and complaints.
 * When a citizen has finished a case or interacted with a lawyer, they can 
 * submit feedback here, which the administrator reviews to monitor service quality.
 * ============================================================================
 */

const feedback = require('../models/feedbackModel');

/**
 * FUNCTION: addfeedback
 * PURPOSE: Saves a new feedback comment submitted by a citizen into the database.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: The 'Submit Feedback' form on UserAddFeedbacks.js.
 * - Endpoint: POST /judisys_api/addfeedback
 * - If this data changes: A new review is permanently stored and immediately becomes
 *   visible to the system administrator in the Admin Feedback overview (AdminViewFeedbacks.jsx).
 */
const addfeedback = (req, res) => {
  // Step 1: Create a new feedback document with citizen's user ID, feedback message, and current date.
  const feedback1 = new feedback({
    userId: req.body.userId,
    feedback: req.body.feedback,
    date: new Date()
  });

  // Step 2: Save the document in MongoDB.
  feedback1.save()
    .then(data => {
      res.json({
        status: 200,
        message: "feedback added  successfully",
        data: data,
      });
    })
    .catch(err => {
      console.error(err);
      res.json({
        err: err,
        status: 500,
      });
    });
};

/**
 * FUNCTION: viewAllfeedbacks
 * PURPOSE: Retrieves every feedback submission along with the citizen's user profile details.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: Component load (useEffect) in AdminViewFeedbacks.jsx.
 * - Endpoint: POST /judisys_api/viewAllfeedbacks
 * - If this data changes: Directly updates the feedback table seen by the Administrator.
 *   Uses '.populate("userId")' so the citizen's real name and contact appear alongside their review.
 */
const viewAllfeedbacks = (req, res) => {
  // Step 1: Query MongoDB for all feedback entries and pull citizen names using populate.
  feedback.find()
    .populate('userId')
    .exec()
    .then((feedbacks) => {
      res.status(200).json({
        status: 200,
        message: "feedbacks retrieved successfully",
        data: feedbacks,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        status: 500,
        message: "Error retrieving feedbacks",
        error: err,
      });
    });
};

/**
 * FUNCTION: deletefeedbackById
 * PURPOSE: Deletes a specific feedback message by its database ID.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: Clicking the 'Delete' trash icon next to a feedback row in the Admin portal.
 * - Endpoint: /deletefeedbackById/:id
 * - If this data changes: Removes the entry from MongoDB and re-renders the feedback table.
 */
const deletefeedbackById = (req, res) => {
  feedback.findByIdAndDelete({ _id: req.params.id })
    .exec()
    .then((feedbacks) => {
      res.json({
        status: 200,
        message: "feedbacks deleted successfully",
        data: feedbacks,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        status: 500,
        message: "Error retrieving feedbacks",
        error: err,
      });
    });
};

/**
 * FUNCTION: viewfeedbackById
 * PURPOSE: Fetches the details of a single feedback comment using its ID.
 * 
 * ROUTING & RENDERING FLOW:
 * - Endpoint: POST /judisys_api/viewfeedbackById/:id
 * - Grabs one specific review from the database for detail modals or inspection.
 */
const viewfeedbackById = (req, res) => {
  feedback.findById({ _id: req.params.id })
    .exec()
    .then((feedbacks) => {
      res.json({
        status: 200,
        message: "feedbacks retrieved successfully",
        data: feedbacks,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        status: 500,
        message: "Error retrieving feedbacks",
        error: err,
      });
    });
};

module.exports = {
  addfeedback,
  viewAllfeedbacks,
  viewfeedbackById,
  deletefeedbackById,
};
