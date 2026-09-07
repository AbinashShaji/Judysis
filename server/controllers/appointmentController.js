/**
 * ============================================================================
 * CONTROLLER: appointmentController.js
 * HANDOVER SUMMARY:
 * This controller acts as the legal consultation booking desk.
 * Citizens use it to schedule consultation sessions with lawyers regarding specific cases.
 * Lawyers use it to review incoming consultation requests, accept them (which formally takes
 * on the case), or decline them if they are unavailable.
 * ============================================================================
 */

const caseSchema = require('../models/caseModel');
const AppointmentReq = require('../models/appointmentSchema');

/**
 * FUNCTION: createAppointment
 * PURPOSE: Allows a citizen to request an appointment with a chosen lawyer for a specific case.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: The 'Book Appointment' button on User_BookAppoinment.js.
 * - Endpoint: POST /judisys_api/createAppointment
 * - Logic:
 *   1. Checks if the citizen has already sent a pending request to this same lawyer for this case.
 *   2. If already sent (flag = 1), warns the citizen: "You have already send request to this Advocate".
 *   3. If new (flag = 0), saves the appointment with status 'pending'.
 * - If this data changes: A notification and new request row immediately appear on the
 *   Lawyer's Case Request screen (AdvocateViewCaseReq.js).
 */
const createAppointment = async (req, res) => {
  const { userId, caseId, advocateId } = req.body;
  let flag = 0;

  // Step 1: Prevent accidental duplicate requests by checking existing records.
  await AppointmentReq.findOne({ advocateId: advocateId, caseId: caseId }).then(data => {
    if (data != null) {
      flag = 1;
    }
  });

  let date = new Date();

  // Step 2: Prepare the new appointment details.
  const newAppointment = new AppointmentReq({
    userId: userId,
    caseId: caseId,
    advocateId: advocateId,
    date: date,
  });

  // Step 3: If this is the first request, save it.
  if (flag == 0) {
    await newAppointment.save().then(savedAppointment => {
      res.json({
        status: 200,
        msg: 'Appointment request created successfully',
        data: savedAppointment
      });
    }).catch(err => {
      console.log(err);
      res.json({
        status: 500,
        msg: 'Failed to create appointment request',
        error: err.message
      });
    });
  } else {
    // Step 4: Warn the user if they have already sent a request to this lawyer.
    res.json({
      status: 500,
      msg: 'You have already send request to this Advocate'
    });
  }
};

/**
 * FUNCTION: getAppointmentReqsForAdv
 * PURPOSE: Retrieves all pending appointment requests waiting for a specific lawyer's review.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: Component load on AdvocateViewCaseReq.js.
 * - Endpoint: POST /judisys_api/getAppointmentReqsForAdv/:id
 * - If this data changes: Populates the pending requests table where the lawyer can click 'Accept' or 'Reject'.
 */
const getAppointmentReqsForAdv = async (req, res) => {
  try {
    const appointments = await AppointmentReq.find({ advocateId: req.params.id, status: 'pending' })
      .populate('userId')
      .populate('caseId')
      .populate('advocateId');

    res.status(200).json({
      status: 200,
      msg: 'Appointments retrieved successfully',
      data: appointments
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      msg: 'Failed to retrieve appointments',
      error: err.message
    });
  }
};

/**
 * FUNCTION: getApprovedAppointmentsForAdv
 * PURPOSE: Retrieves all confirmed (accepted) consultation appointments for a lawyer.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: Component load on the Advocate Dashboard (AdvocateHome.js).
 * - Endpoint: POST /judisys_api/getApprovedAppointmentsForAdv/:id
 * - If this data changes: Displays the upcoming consultation calendar on the lawyer's home screen.
 */
const getApprovedAppointmentsForAdv = async (req, res) => {
  try {
    const appointments = await AppointmentReq.find({ advocateId: req.params.id, status: 'accepted' })
      .populate('userId')
      .populate('caseId');

    res.status(200).json({
      status: 200,
      msg: 'Appointments retrieved successfully',
      data: appointments
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      msg: 'Failed to retrieve appointments',
      error: err.message
    });
  }
};

/**
 * FUNCTION: getAppointmentReqsByUserId
 * PURPOSE: Retrieves the appointment request history for a specific citizen.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: Citizen dashboard views.
 * - Endpoint: POST /judisys_api/getAppointmentReqsByUserId/:id
 * - If this data changes: Shows the citizen whether their consultation request was accepted or declined.
 */
const getAppointmentReqsByUserId = async (req, res) => {
  try {
    const appointments = await AppointmentReq.findById({ _id: req.params.id })
      .populate('userId')
      .populate('caseId');

    res.status(200).json({
      status: 200,
      msg: 'Appointments retrieved successfully',
      data: appointments
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      msg: 'Failed to retrieve appointments',
      error: err.message
    });
  }
};

/**
 * FUNCTION: acceptReqbyAdv
 * PURPOSE: Lawyer officially accepts a citizen's consultation request and agrees to represent the case.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: The green 'Accept' button on AdvocateViewCaseReq.js.
 * - Endpoint: POST /judisys_api/acceptReqbyAdv/:id
 * - Real-World Impact:
 *   1. Updates the appointment booking status to 'accepted'.
 *   2. CRITICAL STEP: Finds the associated legal case in 'caseModel' and updates:
 *      - advocateStatus: true (Lawyer is officially on board)
 *      - approvalStatus: true (Case petition is approved for representation)
 *      - advocateId: advocateId (Assigns this lawyer to the case)
 * - If this data changes:
 *   - The case moves into the lawyer's active caseload (AdvocateViewAprvdCases.jsx).
 *   - Direct in-app chat between citizen and lawyer is unlocked!
 *   - The case shows up in the Court Office queue for Judge allocation (COViewAllCasesAccepted.js).
 */
const acceptReqbyAdv = async (req, res) => {
  let caseId = null, advocateId = null;

  try {
    // Step 1: Look up the appointment to extract which case and lawyer are involved.
    await AppointmentReq.findById({ _id: req.params.id }).then(data => {
      caseId = data.caseId;
      advocateId = data.advocateId;
    }).catch(err => {
      console.log(err);
    });

    // Step 2: Mark the appointment status as 'accepted'.
    const appointment = await AppointmentReq.findByIdAndUpdate(
      { _id: req.params.id },
      { status: 'accepted' }
    );

    if (!appointment) {
      return res.status(404).json({
        status: 404,
        msg: 'Appointment request not found'
      });
    }

    // Step 3: Automatically update the master case file to link this lawyer as legal counsel.
    await caseSchema.findByIdAndUpdate(
      { _id: caseId },
      { advocateStatus: true, approvalStatus: true, advocateId: advocateId }
    );

    res.json({
      status: 200,
      msg: 'Appointment request updated successfully',
      data: appointment
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      msg: 'Failed to update appointment request',
      error: err.message
    });
  }
};

/**
 * FUNCTION: rejectReqbyAdv
 * PURPOSE: Lawyer declines an appointment request.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: The red 'Reject' button on AdvocateViewCaseReq.js.
 * - Endpoint: POST /judisys_api/rejectReqbyAdv/:id
 * - If this data changes: Sets status to 'rejected' so the citizen knows to request a different lawyer.
 */
const rejectReqbyAdv = async (req, res) => {
  try {
    const appointment = await AppointmentReq.findByIdAndUpdate(
      { _id: req.params.id },
      { status: 'rejected' }
    );

    if (!appointment) {
      return res.status(404).json({
        status: 404,
        msg: 'Appointment request not found'
      });
    }

    res.json({
      status: 200,
      msg: 'Appointment request updated successfully',
      data: appointment
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      msg: 'Failed to update appointment request',
      error: err.message
    });
  }
};

/**
 * FUNCTION: getAppointmentReqsById
 * PURPOSE: Retrieves detailed info for a single appointment booking by its ID.
 * 
 * ROUTING & RENDERING FLOW:
 * - Endpoint: POST /judisys_api/getAppointmentReqsById/:id
 * - Populates User, Case, and Advocate details for viewing appointment cards or modals.
 */
const getAppointmentReqsById = async (req, res) => {
  try {
    const appointments = await AppointmentReq.findById({ _id: req.params.id })
      .populate('userId')
      .populate('caseId')
      .populate('advocateId');

    res.status(200).json({
      status: 200,
      msg: 'Appointments retrieved successfully',
      data: appointments
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      msg: 'Failed to retrieve appointments',
      error: err.message
    });
  }
};

module.exports = {
  createAppointment,
  getAppointmentReqsForAdv,
  getAppointmentReqsByUserId,
  acceptReqbyAdv,
  rejectReqbyAdv,
  getAppointmentReqsById,
  getApprovedAppointmentsForAdv
};
