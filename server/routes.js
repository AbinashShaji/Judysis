/**
 * ============================================================================
 * FILE: routes.js (Central API Highway)
 * HANDOVER SUMMARY:
 * Think of this file as the central train station for our backend. It maps every
 * single URL request coming from the React screens (e.g., clicking 'Login', 
 * submitting a case, booking an advocate) to the exact controller function
 * responsible for saving or retrieving that data in MongoDB.
 * 
 * GLOBAL PREFIX: All routes listed here are accessed via `/judisys_api/<route>`
 * ============================================================================
 */

const express = require("express");
const router = express.Router();

// ============================================================================
// IMPORT CONTROLLERS (The Specialists Who Do the Actual Work)
// ============================================================================
const Admin = require("./controllers/adminController");
const User = require("./controllers/userController");
const advocates = require("./controllers/advocateController");
const cases = require("./controllers/caseController");
const appointments = require("./controllers/appointmentController");
const chat = require("./controllers/chatController");
const judges = require("./controllers/judgeController");
const caseStatusController = require("./controllers/caseStatusController");
const feedback = require("./controllers/feedbackController");

// ============================================================================
// 1. CITIZEN / USER ROUTES (Litigants)
// ============================================================================

/**
 * Route: POST /registerUser
 * Purpose: Registers a new citizen/litigant with an uploaded profile photo/document.
 * Routing & Rendering Flow: Called by the Citizen Registration page (UserRegistration.js).
 * Saves their profile in MongoDB and sends back a success message.
 */
router.post("/registerUser", User.uploadSingle, User.registerUser);

/**
 * Route: POST /loginUser
 * Purpose: Verifies email and password to log in a citizen.
 * Routing & Rendering Flow: Called by the User Login page (UserLogin.js).
 * If valid, user ID is saved in browser localStorage and user is redirected to UserHome.js.
 */
router.post("/loginUser", User.login);

/**
 * Route: POST /forgotPasswordUser
 * Purpose: Allows a user to submit their email if they forgot their password.
 * Routing & Rendering Flow: Called by the User Forgot Password modal/page.
 */
router.post("/forgotPasswordUser", User.forgotPassword);

/**
 * Route: POST /resetPasswordUser/:id
 * Purpose: Saves a brand new password for a specific user ID.
 * Routing & Rendering Flow: Called by User Reset Password screen to update user credentials.
 */
router.post("/resetPasswordUser/:id", User.resetPassword);

/**
 * Route: POST /viewUserById/:id
 * Purpose: Fetches all account information for one citizen by their ID.
 * Routing & Rendering Flow: Called by UserProfile.js to display personal details on the profile screen.
 */
router.post("/viewUserById/:id", User.viewUserById);

/**
 * Route: POST /viewUsersForAdmin
 * Purpose: Retrieves all newly registered citizens who are waiting for Admin verification.
 * Routing & Rendering Flow: Called by AdminViewUserReqs.js to render the user approval queue.
 */
router.post("/viewUsersForAdmin", User.viewUsersForAdminAprvl);

/**
 * Route: POST /viewAllUsers
 * Purpose: Retrieves the full list of citizens in the system.
 * Routing & Rendering Flow: Called by AdminViewUsers.js and Court Office user views to display the user directory table.
 */
router.post("/viewAllUsers", User.viewAllUsers);

/**
 * Route: POST /deActivateUserById/:id
 * Purpose: Temporarily freezes a citizen's account.
 * Routing & Rendering Flow: Called when an Admin clicks 'Deactivate' on AdminViewUsers.js.
 */
router.post("/deActivateUserById/:id", User.deActivateUserById);

/**
 * Route: POST /rejectUserById/:id
 * Purpose: Rejects a citizen's registration application.
 * Routing & Rendering Flow: Called from AdminViewUserReqs.js; marks the user status as rejected.
 */
router.post("/rejectUserById/:id", User.rejectUserById);

/**
 * Route: POST /approveUserById/:id
 * Purpose: Approves a citizen so they can log in and file cases.
 * Routing & Rendering Flow: Called from AdminViewUserReqs.js; enables the user to access citizen services.
 */
router.post("/approveUserById/:id", User.approveUserById);

/**
 * Route: POST /editUserById/:id
 * Purpose: Updates personal details and allows replacing the user's profile photo.
 * Routing & Rendering Flow: Called by UserProfile.js; re-renders updated info across UserHome and UserNavbar.
 */
router.post("/editUserById/:id", User.uploadSingle, User.editUserById);

/**
 * Route: POST /activateUserById/:id
 * Purpose: Re-activates a previously deactivated citizen account.
 * Routing & Rendering Flow: Called from AdminViewUsers.js table row action button.
 */
router.post("/activateUserById/:id", User.activateUserById);

// ============================================================================
// 2. ADMIN ROUTES
// ============================================================================

/**
 * Route: POST /adminResetPassword
 * Purpose: Updates the system administrator's login password.
 * Routing & Rendering Flow: Called from the Admin settings/password screen.
 */
router.post("/adminResetPassword", Admin.adminResetPassword);

/**
 * Route: POST /adminLogin
 * Purpose: Validates system administrator credentials.
 * Routing & Rendering Flow: Called by AdminLogin.js; on success, redirects to the Admin Dashboard (AdminMain.js).
 */
router.post("/adminLogin", Admin.login);

// ============================================================================
// 3. ADVOCATE / ATTORNEY ROUTES
// ============================================================================

/**
 * Route: POST /registerAdvocate
 * Purpose: Registers a new lawyer, saving their Bar Council certificate, degree, and profile photo.
 * Routing & Rendering Flow: Called by Advocate Registration (AdvocateReg.js).
 */
router.post("/registerAdvocate", advocates.upload, advocates.registerAdvocate);

/**
 * Route: POST /viewAdvocateById/:id
 * Purpose: Fetches full profile of a single advocate.
 * Routing & Rendering Flow: Called by User_ViewAdvocateDetail.jsx and AdvocateEditProfile.js to render bio, specialization, and ratings.
 */
router.post("/viewAdvocateById/:id", advocates.viewAdvocateById);

/**
 * Route: POST /forgotPassword
 * Purpose: Handles forgot password verification for advocates.
 * Routing & Rendering Flow: Called from the Advocate Login / Forgot Password modal.
 */
router.post("/forgotPassword", advocates.forgotPassword);

/**
 * Route: POST /loginAdvocate
 * Purpose: Validates an advocate's credentials and checks if their account is approved.
 * Routing & Rendering Flow: Called by AdvocateLogin.js; on success, redirects to AdvocateHome.js.
 */
router.post("/loginAdvocate", advocates.login);

/**
 * Route: POST /editAdvocateById/:id
 * Purpose: Updates an advocate's contact information and optional profile photo.
 * Routing & Rendering Flow: Called by AdvocateEditProfile.js.
 */
router.post(
  "/editAdvocateById/:id",
  advocates.uploadProfile,
  advocates.editAdvocateById
);

/**
 * Route: POST /deleteAdvocateById/:id
 * Purpose: Permanently removes an advocate from the system.
 * Routing & Rendering Flow: Triggered by Admin action on ViewAllAdvocates.js.
 */
router.post("/deleteAdvocateById/:id", advocates.deleteAdvocateById);

/**
 * Route: POST /resetPassword/:id
 * Purpose: Updates an advocate's password using their unique advocate ID.
 * Routing & Rendering Flow: Called from Advocate password reset interface.
 */
router.post("/resetPassword/:id", advocates.resetPassword);

/**
 * Route: POST /approveAdvocateById/:id
 * Purpose: Approves an advocate's legal credentials so they can begin taking cases.
 * Routing & Rendering Flow: Called from AdminViewAdvReqs.js; shifts advocate status to 'approved'.
 */
router.post("/approveAdvocateById/:id", advocates.approveAdvocateById);

/**
 * Route: POST /rejectAdvocateById/:id
 * Purpose: Rejects an advocate's registration application.
 * Routing & Rendering Flow: Called from AdminViewAdvReqs.js.
 */
router.post("/rejectAdvocateById/:id", advocates.rejectAdvocateById);

/**
 * Route: POST /viewAdvocateReqs
 * Purpose: Lists all advocates whose registration applications are pending Admin approval.
 * Routing & Rendering Flow: Populates the pending requests table on AdminViewAdvReqs.js.
 */
router.post("/viewAdvocateReqs", advocates.viewAdvocateReqs);

/**
 * Route: POST /viewAdvocates
 * Purpose: Fetches the entire directory of advocates for administration oversight.
 * Routing & Rendering Flow: Renders all lawyer cards on ViewAllAdvocates.js.
 */
router.post("/viewAdvocates", advocates.viewAdvocates);

/**
 * Route: POST /activateAdvocateById/:id
 * Purpose: Re-enables an advocate account.
 * Routing & Rendering Flow: Called from Admin advocate list.
 */
router.post("/activateAdvocateById/:id", advocates.activateAdvocateById);

/**
 * Route: POST /deactivateAdvocateById/:id
 * Purpose: Suspends an advocate's ability to consult or login.
 * Routing & Rendering Flow: Called from Admin advocate management table.
 */
router.post("/deactivateAdvocateById/:id", advocates.deactivateAdvocateById);

/**
 * Route: POST /viewAdvocatesBySpecializn
 * Purpose: Finds lawyers matching a specific legal category (e.g., Criminal, Civil, Family).
 * Routing & Rendering Flow: Powers the category search bar on User_ViewAllAdvocates.js.
 */
router.post("/viewAdvocatesBySpecializn", advocates.viewAdvocatesBySpecializn);

/**
 * Route: POST /addRating/:id
 * Purpose: Lets a citizen leave a star rating and review on an advocate's profile.
 * Routing & Rendering Flow: Called by User_ViewAdvocateDetail.jsx to update the lawyer's average star rating.
 */
router.post("/addRating/:id", advocates.addRating);

/**
 * Route: POST /viewActiveAdvocates
 * Purpose: Retrieves only approved and active advocates available for hire.
 * Routing & Rendering Flow: Renders the advocate catalog on User_ViewAllAdvocates.js.
 */
router.post("/viewActiveAdvocates", advocates.viewActiveAdvocates);

// ============================================================================
// 4. CASE MANAGEMENT ROUTES
// ============================================================================

/**
 * Route: POST /createCase
 * Purpose: Lets a citizen submit a new legal case along with supporting evidence files.
 * Routing & Rendering Flow: Called by UserAddCases.js. Newly created cases appear in the citizen's case history.
 */
router.post("/createCase", cases.upload, cases.createCase);

/**
 * Route: POST /getCaseType/:description
 * Purpose: Classifies or suggests case types based on a description.
 * Routing & Rendering Flow: Used during case filing to help users categorize their dispute.
 */
router.post("/getCaseType/:description", cases.getCaseType);

/**
 * Route: POST /getCaseByUserId/:id
 * Purpose: Retrieves all cases filed by a specific citizen.
 * Routing & Rendering Flow: Renders the case list on UserViewRecentCases.js.
 */
router.post("/getCaseByUserId/:id", cases.getCaseByUserId);

/**
 * Route: POST /getCaseById/:id
 * Purpose: Fetches complete details of a single case by its database ID.
 * Routing & Rendering Flow: Used by AdminViewSingleCase.js, JudgeViewSingleCase.jsx, and COViewSinglecase.jsx.
 */
router.post("/getCaseById/:id", cases.getCaseById);

/**
 * Route: POST /deleteCase/:id
 * Purpose: Deletes a case entry from the database.
 * Routing & Rendering Flow: Triggered by administrative case cleanup.
 */
router.post("/deleteCase/:id", cases.deleteCase);

/**
 * Route: POST /getAllCases
 * Purpose: Fetches every case in the system for administrative tracking.
 * Routing & Rendering Flow: Populates tables in AdminViewAllCases.js and COViewAllCases.jsx.
 */
router.post("/getAllCases", cases.getAllCases);

/**
 * Route: POST /getCaseAdvStatus
 * Purpose: Retrieves case counts and acceptance statuses for advocate dashboards.
 * Routing & Rendering Flow: Populates statistics on AdvocateHome.js.
 */
router.post("/getCaseAdvStatus", cases.getCaseAdvStatus);

/**
 * Route: POST /assignJudgeCaseById/:id
 * Purpose: Assigns a specific judge to preside over an approved case.
 * Routing & Rendering Flow: Called by Court Office (COViewSinglecase.jsx). Moves case to JudgeViewCases.js.
 */
router.post("/assignJudgeCaseById/:id", cases.assignJudgeCaseById);

/**
 * Route: POST /getCaseByJudgeId/:id
 * Purpose: Fetches all ongoing cases assigned to a particular judge.
 * Routing & Rendering Flow: Renders the active case docket on JudgeViewCases.js.
 */
router.post("/getCaseByJudgeId/:id", cases.getCaseByJudgeId);

/**
 * Route: POST /getClosedCaseByJudgeId/:id
 * Purpose: Fetches historical cases that have reached a final verdict by this judge.
 * Routing & Rendering Flow: Renders the archive on JudgeViewClosedCases.jsx.
 */
router.post("/getClosedCaseByJudgeId/:id", cases.getClosedCaseByJudgeId);

/**
 * Route: POST /getCasesJudgeAssign
 * Purpose: Retrieves cases that have been approved by advocates and are awaiting judge allocation.
 * Routing & Rendering Flow: Renders the case queue in Court Office dashboard (COViewAllCasesAccepted.js).
 */
router.post("/getCasesJudgeAssign", cases.getCasesJudgeAssign);

// ============================================================================
// 5. APPOINTMENT ROUTES
// ============================================================================

/**
 * Route: POST /createAppointment
 * Purpose: Schedules a consultation appointment between a citizen and an advocate.
 * Routing & Rendering Flow: Called by User_BookAppoinment.js. Appears in advocate's request list.
 */
router.post("/createAppointment", appointments.createAppointment);

/**
 * Route: POST /getAppointmentReqsByUserId/:id
 * Purpose: Lists all appointments booked by a citizen along with their statuses (Pending/Accepted/Rejected).
 * Routing & Rendering Flow: Displays booking history on the user's dashboard.
 */
router.post(
  "/getAppointmentReqsByUserId/:id",
  appointments.getAppointmentReqsByUserId
);

/**
 * Route: POST /getAppointmentReqsForAdv/:id
 * Purpose: Lists all incoming consultation requests sent to a specific advocate.
 * Routing & Rendering Flow: Renders the notification queue on AdvocateViewCaseReq.js.
 */
router.post(
  "/getAppointmentReqsForAdv/:id",
  appointments.getAppointmentReqsForAdv
);

/**
 * Route: POST /acceptReqbyAdv/:id
 * Purpose: Advocate accepts a citizen's consultation request.
 * Routing & Rendering Flow: Changes status to 'Accepted'. Enables direct chat and consultation.
 */
router.post("/acceptReqbyAdv/:id", appointments.acceptReqbyAdv);

/**
 * Route: POST /rejectReqbyAdv/:id
 * Purpose: Advocate declines an appointment request.
 * Routing & Rendering Flow: Changes status to 'Rejected'; notifies the citizen.
 */
router.post("/rejectReqbyAdv/:id", appointments.rejectReqbyAdv);

/**
 * Route: POST /getAppointmentReqsById/:id
 * Purpose: Fetches the details of a single appointment booking.
 * Routing & Rendering Flow: Used to populate appointment detail modals and confirmation cards.
 */
router.post("/getAppointmentReqsById/:id", appointments.getAppointmentReqsById);

/**
 * Route: POST /getApprovedAppointmentsForAdv/:id
 * Purpose: Retrieves only confirmed/approved appointments for an advocate.
 * Routing & Rendering Flow: Renders upcoming consultation schedule on AdvocateHome.js.
 */
router.post(
  "/getApprovedAppointmentsForAdv/:id",
  appointments.getApprovedAppointmentsForAdv
);

// ============================================================================
// 6. CHAT & MESSAGING ROUTES
// ============================================================================

/**
 * Route: POST /chatting
 * Purpose: Saves a new chat message sent between a citizen and an advocate.
 * Routing & Rendering Flow: Called by AdvocateChatBox.js and UserChattoAdvocate.js when sending a message.
 */
router.post("/chatting", chat.chatting);

/**
 * Route: POST /viewChatRecipientsforAdvocateById/:id
 * Purpose: Fetches all clients who have had conversations with this advocate.
 * Routing & Rendering Flow: Populates the conversation list on AdvocateChatSidebar.js.
 */
router.post(
  "/viewChatRecipientsforAdvocateById/:id",
  chat.viewChatRecipientsforAdvocateById
);

/**
 * Route: POST /viewChatRecipientsforUserId/:id
 * Purpose: Fetches all advocates that a citizen is currently chatting with.
 * Routing & Rendering Flow: Populates the sidebar conversation list on UserChattoAdvocate.js.
 */
router.post(
  "/viewChatRecipientsforUserId/:id",
  chat.viewChatRecipientsforUserId
);

/**
 * Route: POST /viewChatBetweenUserAndAdv
 * Purpose: Retrieves full message history between one citizen and one advocate.
 * Routing & Rendering Flow: Loads the active message bubble thread in the chat window.
 */
router.post("/viewChatBetweenUserAndAdv", chat.viewChatBetweenUserAndAdv);

// ============================================================================
// 7. JUDGE ROUTES
// ============================================================================

/**
 * Route: POST /registerJudge
 * Purpose: Onboards a new judge into the judicial system.
 * Routing & Rendering Flow: Called by Court Office (COAddJudge.js) to add judges to the court registry.
 */
router.post("/registerJudge", judges.registerJudge);

/**
 * Route: POST /viewJudgeById/:id
 * Purpose: Fetches the profile and court assignment of a specific judge.
 * Routing & Rendering Flow: Renders judge details in COViewSIngleJudge.jsx.
 */
router.post("/viewJudgeById/:id", judges.viewJudgeById);

/**
 * Route: POST /forgotPasswordJudge
 * Purpose: Handles password reset initiation for judges.
 * Routing & Rendering Flow: Called from the Judge Login interface.
 */
router.post("/forgotPasswordJudge", judges.forgotPassword);

/**
 * Route: POST /loginjudge
 * Purpose: Authenticates a judge's login credentials.
 * Routing & Rendering Flow: Called by JudgeLogin.jsx; redirects to JudgeHome.jsx upon success.
 */
router.post("/loginjudge", judges.login);

/**
 * Route: POST /editJudgeById/:id
 * Purpose: Updates judge profile details (court room, contact, designation).
 * Routing & Rendering Flow: Called from the judge administration panel.
 */
router.post("/editJudgeById/:id", judges.editJudgeById);

/**
 * Route: POST /deleteJudgeById/:id
 * Purpose: Removes a judge from active court assignments.
 * Routing & Rendering Flow: Triggered by court administration actions.
 */
router.post("/deleteJudgeById/:id", judges.deleteJudgeById);

/**
 * Route: POST /resetPasswordJudge/:id
 * Purpose: Resets the password for a judge by their ID.
 * Routing & Rendering Flow: Called from judge password reset screen.
 */
router.post("/resetPasswordJudge/:id", judges.resetPassword);

/**
 * Route: POST /rejectJudgeById/:id
 * Purpose: Rejects or revokes a judge's authorization.
 * Routing & Rendering Flow: Called from the judicial administrative review panel.
 */
router.post("/rejectJudgeById/:id", judges.rejectJudgeById);

/**
 * Route: POST /activateJudgeById/:id
 * Purpose: Activates a judge account so they can preside over cases.
 * Routing & Rendering Flow: Called by Admin or Court Office to enable judge login.
 */
router.post("/activateJudgeById/:id", judges.activateJudgeById);

/**
 * Route: POST /deactivateJudgeById/:id
 * Purpose: Suspends a judge account.
 * Routing & Rendering Flow: Called by Admin to pause judge activity.
 */
router.post("/deactivateJudgeById/:id", judges.deactivateJudgeById);

/**
 * Route: POST /viewJudges
 * Purpose: Returns all judges registered in the judicial network.
 * Routing & Rendering Flow: Renders the judge directory in AdminViewJudjes.js and COViewAlljudges.jsx.
 */
router.post("/viewJudges", judges.viewJudges);

/**
 * Route: POST /viewActiveJudges
 * Purpose: Returns only active judges available for assignment.
 * Routing & Rendering Flow: Populates the dropdown when Court Office assigns a judge to a case in COViewSinglecase.jsx.
 */
router.post("/viewActiveJudges", judges.viewActiveJudges);

/**
 * Route: POST /viewJudgesBySpecializn
 * Purpose: Filters judges based on judicial specialization (Civil, Criminal, Family, etc.).
 * Routing & Rendering Flow: Used by Court Office to match case subject matter with the right judge.
 */
router.post("/viewJudgesBySpecializn", judges.viewJudgesBySpecializn);

// ============================================================================
// 8. CASE HEARING STATUS ROUTES
// ============================================================================

/**
 * Route: POST /createStatus
 * Purpose: Records a hearing event, progress update, next hearing date, or case closure verdict.
 * Routing & Rendering Flow: Called by Judge from CaseHearings.jsx. Updates case progress timeline for litigants.
 */
router.post("/createStatus", caseStatusController.createStatus);

/**
 * Route: POST /getStatusById/:id
 * Purpose: Retrieves a specific hearing status record by its unique ID.
 * Routing & Rendering Flow: Used to view details of a single hearing note.
 */
router.post("/getStatusById/:id", caseStatusController.getStatusById);

/**
 * Route: POST /getStatusByCaseId/:id
 * Purpose: Fetches the chronological hearing history and timeline for a case.
 * Routing & Rendering Flow: Renders the hearing journey on UserViewHearingDetails.jsx, AdvocateCaseHearings.jsx, and AdminViewCaseStatus.js.
 */
router.post("/getStatusByCaseId/:id", caseStatusController.getStatusByCaseId);

// ============================================================================
// 9. FEEDBACK & REVIEWS
// ============================================================================

/**
 * Route: POST /addfeedback
 * Purpose: Submits a review or complaint about the platform or judicial services.
 * Routing & Rendering Flow: Called by UserAddFeedbacks.js. Saves review in MongoDB.
 */
router.post("/addfeedback", feedback.addfeedback);

/**
 * Route: POST /viewAllfeedbacks
 * Purpose: Retrieves all platform feedback and reviews submitted by citizens.
 * Routing & Rendering Flow: Populates the feedback table on AdminViewFeedbacks.jsx.
 */
router.post("/viewAllfeedbacks", feedback.viewAllfeedbacks);

/**
 * Route: POST /viewfeedbackById/:id
 * Purpose: Fetches a single feedback entry by its ID.
 * Routing & Rendering Flow: Used for reading specific feedback submissions in detail.
 */
router.post("/viewfeedbackById/:id", feedback.viewfeedbackById);

// Export the router so server/index.js can use all these endpoints!
module.exports = router;
