/**
 * ============================================================================
 * CONTROLLER: caseStatusController.js
 * HANDOVER SUMMARY:
 * This controller manages courtroom proceedings and hearing updates for active cases.
 * Every time a judge holds a session, schedules the next hearing date, notes down 
 * witness testimonies, or delivers a final verdict, this controller records the milestone 
 * and automatically updates the case's progress across all dashboards.
 * ============================================================================
 */

const caseSchema = require("../models/caseModel");
const Casestatus = require("../models/caseStatusModel");

/**
 * FUNCTION: createStatus
 * PURPOSE: Records a new hearing session, next court date, or final case verdict.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: The 'Add Hearing Status' form filled by the Judge in CaseHearings.jsx.
 * - Endpoint: POST /judisys_api/createStatus
 * - Real-World Impact:
 *   1. Looks up the parent case to automatically link the right Citizen, Advocate, and Judge.
 *   2. Saves the hearing notes and future court date into the 'casestatus' timeline.
 *   3. If the judge selected status "Closed", this function automatically flips the parent
 *      case's 'caseStatus' to "Closed" as well!
 * - If this data changes:
 *   - The Citizen's Hearing Timeline (UserViewHearingDetails.jsx) updates with the next court date.
 *   - The Advocate's Hearing Schedule (AdvocateCaseHearings.jsx) adds the session to their calendar.
 *   - If closed, the case moves out of active trials and into JudgeViewClosedCases.jsx.
 */
const createStatus = async (req, res) => {
  const caseId = req.body.caseId;

  // Step 1: Look up the original case dossier so we have all parties' IDs.
  const caseDatas = await caseSchema.findById(caseId);

  try {
    // Step 2: Build a new status entry containing hearing notes, date, and participants.
    const newStatus = new Casestatus({
      caseId: caseId,
      userId: caseDatas.userId,
      judgeId: caseDatas.judgeId,
      advocateId: caseDatas.advocateId,
      status: req.body.status,
      date: new Date(),
      hearingDate: req.body.hearingDate ? req.body.hearingDate : "",
      description: req.body.description,
    });

    // Step 3: Save the hearing log in MongoDB.
    await newStatus.save();

    // Step 4: If the case reached its final ruling ("Closed"), update the master case status.
    if (req.body.status == "Closed") {
      await caseSchema.findByIdAndUpdate(caseId, {
        $set: { caseStatus: "Closed" },
      });
    }

    res.json({ status: 200, data: newStatus, msg: "added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: error.message });
  }
};

/**
 * FUNCTION: getAllStatuses
 * PURPOSE: Retrieves every hearing status recorded across all cases in the system.
 * 
 * ROUTING & RENDERING FLOW:
 * - Used for administrative auditing and tracking global courtroom activity.
 */
const getAllStatuses = async (req, res) => {
  try {
    const statuses = await Casestatus.find();
    res.status(200).json(statuses);
  } catch (error) {
    res.json({ status: 500, message: error.message });
  }
};

/**
 * FUNCTION: getStatusById
 * PURPOSE: Fetches the details of a single hearing status entry by its unique ID.
 * 
 * ROUTING & RENDERING FLOW:
 * - Endpoint: POST /judisys_api/getStatusById/:id
 * - Grabs one specific hearing note and populates the advocate and citizen profiles.
 */
const getStatusById = async (req, res) => {
  const { id } = req.params;

  try {
    const status = await Casestatus.findById(id)
      .populate("advocateId")
      .populate("userId");
    if (!status) {
      return res.json({ status: 500, message: "Status not found" });
    }
    res.json({
      status: 200,
      data: status,
    });
  } catch (error) {
    res.json({ status: 500, message: error.message });
  }
};

/**
 * FUNCTION: getStatusByCaseId
 * PURPOSE: Retrieves the entire chronological hearing history for a specific case.
 * 
 * ROUTING & RENDERING FLOW:
 * - Triggered by: Component load on UserViewHearingDetails.jsx, AdvocateCaseHearings.jsx,
 *   and AdminViewCaseStatus.js.
 * - Endpoint: POST /judisys_api/getStatusByCaseId/:id
 * - If this data changes: Displays the entire court timeline from Day 1 to the final verdict.
 *   Results are sorted in reverse chronological order (newest hearings first) and populated
 *   with full details for the Advocate, Citizen, Case, and Judge.
 */
const getStatusByCaseId = async (req, res) => {
  try {
    const status = await Casestatus.find({ caseId: req.params.id })
      .sort({ createdAt: -1 })
      .populate("advocateId")
      .populate("userId")
      .populate("caseId")
      .populate("judgeId");
      
    if (!status) {
      return res.json({ status: 500, message: "Status not found" });
    }
    res.status(200).json({
      status: 200,
      data: status,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

module.exports = {
  createStatus,
  getAllStatuses,
  getStatusById,
  getStatusByCaseId,
};
