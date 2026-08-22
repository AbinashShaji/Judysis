const express = require("express");
const router = express.Router();

const Admin = require("./controllers/adminController");
const User = require("./controllers/userController");
const advocates = require("./controllers/advocateController");
const cases = require("./controllers/caseController");
const appointments = require("./controllers/appointmentController");
const chat = require("./controllers/chatController");
const judges = require("./controllers/judgeController");
const caseStatusController = require("./controllers/caseStatusController");
const feedback = require("./controllers/feedbackController");

// User routes

router.post("/registerUser", User.uploadSingle, User.registerUser);
router.post("/loginUser", User.login);
router.post("/forgotPasswordUser", User.forgotPassword);
router.post("/resetPasswordUser/:id", User.resetPassword);
router.post("/viewUserById/:id", User.viewUserById);
router.post("/viewUsersForAdmin", User.viewUsersForAdminAprvl);
router.post("/viewAllUsers", User.viewAllUsers);
router.post("/deActivateUserById/:id", User.deActivateUserById);
router.post("/rejectUserById/:id", User.rejectUserById);
router.post("/approveUserById/:id", User.approveUserById);
router.post("/editUserById/:id", User.uploadSingle, User.editUserById);
router.post("/activateUserById/:id", User.activateUserById);

//admin
router.post("/adminResetPassword", Admin.adminResetPassword);
router.post("/adminLogin", Admin.login);

//Attorney
//advocate routes
router.post("/registerAdvocate", advocates.upload, advocates.registerAdvocate);
router.post("/viewAdvocateById/:id", advocates.viewAdvocateById);
router.post("/forgotPassword", advocates.forgotPassword);
router.post("/loginAdvocate", advocates.login);
router.post(
  "/editAdvocateById/:id",
  advocates.uploadProfile,
  advocates.editAdvocateById
);
router.post("/deleteAdvocateById/:id", advocates.deleteAdvocateById);
router.post("/resetPassword/:id", advocates.resetPassword);
router.post("/approveAdvocateById/:id", advocates.approveAdvocateById);
router.post("/rejectAdvocateById/:id", advocates.rejectAdvocateById);
router.post("/viewAdvocateReqs", advocates.viewAdvocateReqs);
router.post("/viewAdvocates", advocates.viewAdvocates);
router.post("/activateAdvocateById/:id", advocates.activateAdvocateById);
router.post("/deactivateAdvocateById/:id", advocates.deactivateAdvocateById);
router.post("/viewAdvocatesBySpecializn", advocates.viewAdvocatesBySpecializn);
router.post("/addRating/:id", advocates.addRating);
router.post("/viewActiveAdvocates", advocates.viewActiveAdvocates);

//case routes
router.post("/createCase", cases.upload, cases.createCase);
router.post("/getCaseType/:description", cases.getCaseType);
router.post("/getCaseByUserId/:id", cases.getCaseByUserId);
router.post("/getCaseById/:id", cases.getCaseById);
router.post("/deleteCase/:id", cases.deleteCase);
router.post("/getAllCases", cases.getAllCases);
router.post("/getCaseAdvStatus", cases.getCaseAdvStatus);
router.post("/assignJudgeCaseById/:id", cases.assignJudgeCaseById);
router.post("/getCaseByJudgeId/:id", cases.getCaseByJudgeId);
router.post("/getClosedCaseByJudgeId/:id", cases.getClosedCaseByJudgeId);
router.post("/getCasesJudgeAssign", cases.getCasesJudgeAssign);

// Appointments
router.post("/createAppointment", appointments.createAppointment);
router.post(
  "/getAppointmentReqsByUserId/:id",
  appointments.getAppointmentReqsByUserId
);
router.post(
  "/getAppointmentReqsForAdv/:id",
  appointments.getAppointmentReqsForAdv
);
router.post("/acceptReqbyAdv/:id", appointments.acceptReqbyAdv);
router.post("/rejectReqbyAdv/:id", appointments.rejectReqbyAdv);
router.post("/getAppointmentReqsById/:id", appointments.getAppointmentReqsById);
router.post(
  "/getApprovedAppointmentsForAdv/:id",
  appointments.getApprovedAppointmentsForAdv
);

//chatting
router.post("/chatting", chat.chatting);
router.post(
  "/viewChatRecipientsforAdvocateById/:id",
  chat.viewChatRecipientsforAdvocateById
);
router.post(
  "/viewChatRecipientsforUserId/:id",
  chat.viewChatRecipientsforUserId
);
router.post("/viewChatBetweenUserAndAdv", chat.viewChatBetweenUserAndAdv);

// judge routes
router.post("/registerJudge", judges.registerJudge);
router.post("/viewJudgeById/:id", judges.viewJudgeById);
router.post("/forgotPasswordJudge", judges.forgotPassword);
router.post("/loginjudge", judges.login);
router.post("/editJudgeById/:id", judges.editJudgeById);
router.post("/deleteJudgeById/:id", judges.deleteJudgeById);
router.post("/resetPasswordJudge/:id", judges.resetPassword);
router.post("/rejectJudgeById/:id", judges.rejectJudgeById);
router.post("/activateJudgeById/:id", judges.activateJudgeById);
router.post("/deactivateJudgeById/:id", judges.deactivateJudgeById);
router.post("/viewJudges", judges.viewJudges);
router.post("/viewActiveJudges", judges.viewActiveJudges);
router.post("/viewJudgesBySpecializn", judges.viewJudgesBySpecializn);

//case status
router.post("/createStatus", caseStatusController.createStatus);
router.post("/getStatusById/:id", caseStatusController.getStatusById);
router.post("/getStatusByCaseId/:id", caseStatusController.getStatusByCaseId);

//Feedback
router.post("/addfeedback", feedback.addfeedback);
router.post("/viewAllfeedbacks", feedback.viewAllfeedbacks);
router.post("/viewfeedbackById/:id", feedback.viewfeedbackById);

module.exports = router;
