/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: COViewSinglecase.jsx
 * Path: client/src/Components/CourtOffice/Dashboard/COViewSinglecase.jsx
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This is the central case assignment and trial scheduling hub for Court Office staff.
 * When a citizen files a case and their lawyer accepts it, this screen lets the court staff:
 * 1. Inspect the complete lawsuit dossier (incident, opponent, evidence).
 * 2. Automatically load judges whose specialization matches the case (e.g. Criminal Law judges for criminal cases).
 * 3. Assign a Judge to preside over the case.
 * 4. Schedule the "First Hearing" (date, status, and clerk remarks).
 * 
 * ROUTING & RENDERING FLOW:
 * - Route: Rendered within `/co-view-singleCase/:id` inside the `COMain` shell container.
 * - Workflow:
 *   - Step 1: Queries `/getCaseById/:id` to get case details.
 *   - Step 2: Queries `/viewJudgesBySpecializn` matching `data.type` to populate the Judge dropdown.
 *   - Step 3: Clicking "Assign Judge" posts `{ judgeId }` to `/assignJudgeCaseById/:id`.
 *   - Step 4: Unlocks the "Add First Hearing" form.
 *   - Step 5: Submitting the hearing posts to `/createStatus`, officially kicking off the trial
 *     and redirecting staff to `/co_view_cases`.
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import "../../../Styles/AdvocateViewCaseReq.css";
import icon1 from "../../../Assets/profile.png";
import icon2 from "../../../Assets/mail.png";
import icon3 from "../../../Assets/contact.png";
import icon4 from "../../../Assets/house.png";

import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import { IMG_BASE_URL } from "../../Services/BaseURL";
import axiosInstance from "../../Services/BaseURLMain";
import {
  resetPassword,
  ViewByData,
  ViewById,
} from "../../Services/CommonServices";
import { approveById } from "../../Services/AdminService";

/**
 * COViewSinglecase Component
 * Orchestrates judicial assignment and initial court hearing scheduling for new cases.
 */
function COViewSinglecase() {
  // State storing the case details, filing party info, and incident metadata
  const [data, setData] = useState({
    userId: { profilePic: { filename: "" } },
    dateOfIncident: "",
    evidence: {},
    type: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  // Evidence attachment modal states
  const [showModal, setShowModal] = useState(false);
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [fileType, setFileType] = useState("");

  // Judge selection states
  const [advocate, setAdvocate] = useState([]);
  const [selectedadvocate, setSelectedAdvocate] = useState("");
  // Controls display of the First Hearing scheduling form
  const [showAssignModal, setShowAssignModal] = useState(false);

  /**
   * Effect Hook: Load Case Record
   * Fetches full lawsuit incident and petitioner records.
   */
  useEffect(() => {
    const fetchdata = async () => {
      try {
        console.log("id", id);
        const result = await ViewById("getCaseById", id);

        if (result.success) {
          console.log(result);
          setData(result.user || []);
        } else {
          console.error("Court Office View Error :", result);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred while loading case details");
      }
    };
    fetchdata();
  }, [id]);

  /**
   * Effect Hook: Find Judges by Specialization
   * Automatically queries available courtroom judges whose legal expertise matches this case type.
   */
  useEffect(() => {
    const fetchdata = async () => {
      try {
        let spl = data.type;
        const result = await ViewByData("viewJudgesBySpecializn", {
          specialization: spl,
        });

        if (result.success) {
          console.log(result);
          setAdvocate(result.user || []);
        } else {
          console.error("Judge Filter Error :", result);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred while matching judges");
      }
    };
    if (data.type) {
      fetchdata();
    }
  }, [data.type]);

  /**
   * handleAdvChange
   * Captures the clerk's selected Judge ID from the dropdown menu.
   */
  const handleAdvChange = (e) => {
    setSelectedAdvocate(e.target.value);
  };

  /**
   * handleAssign
   * Links the selected Judge to this case in the database.
   */
  const handleAssign = async () => {
    if (!selectedadvocate) {
      toast.warn("Please choose a judge first");
      return;
    }

    try {
      const result = await resetPassword(
        { judgeId: selectedadvocate },
        "assignJudgeCaseById",
        id
      );

      if (result.success) {
        // Unlock the First Hearing scheduling form
        setShowAssignModal(true);
        toast.success("Judge assigned successfully! Please schedule the first hearing below.");
        console.log(result);
      } else {
        console.error("Assignment Error :", result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred while assigning judge");
    }
  };

  /**
   * handleEvidenceClick
   * Opens evidence preview popup modal for PDF or image attachments.
   */
  const handleEvidenceClick = () => {
    const evidence = data?.evidence || {};
    const fileUrl = evidence.filename
      ? `${IMG_BASE_URL}/${evidence.filename}`
      : null;
    if (!fileUrl) {
      setFileType("none");
      setEvidenceUrl(null);
    } else {
      const fileExtension = fileUrl.split(".").pop().toLowerCase();
      setFileType(fileExtension);
      setEvidenceUrl(fileUrl);
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  // State storing the initial hearing record details
  const [firstHearing, setFirsthearing] = useState({
    caseId: "",
    status: "",
    hearingDate: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  // Synchronize caseId into hearing form once case loads
  useEffect(() => {
    if (data._id) {
      setFirsthearing((prev) => ({
        ...prev,
        caseId: data._id,
      }));
    }
  }, [data._id]);

  /**
   * handleHearingChange
   * Updates hearing inputs as the court clerk enters details.
   */
  const handleHearingChange = (e) => {
    setFirsthearing({
      ...firstHearing,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * validateForm
   * Verifies required fields for scheduling the inaugural hearing.
   */
  const validateForm = () => {
    let newErrors = {};

    if (!firstHearing.status) {
      newErrors.status = "Status is required.";
    }
    if (!firstHearing.hearingDate) {
      newErrors.hearingDate = "Hearing date is required.";
    }
    if (!firstHearing.description.trim()) {
      newErrors.description = "Description is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  /**
   * handleHearingSubmitfn
   * Persists the inaugural hearing record to `/createStatus` and redirects clerk to the cases queue.
   */
  const handleHearingSubmitfn = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form is valid, submitting data...");
      axiosInstance.post(`createStatus`, firstHearing)
        .then((result) => {
          console.log(result);
          if (result.data.status === 200) {
            toast.success("Hearing Added Successfully");
            // Return to master cases list
            navigate("/co_view_cases");
          } else {
            toast.warn(result.data.msg);
          }
        })
        .catch((error) => {
          console.error("Error creating hearing:", error);
          toast.error("Failed to add hearing");
        });
    }
  };

  return (
    <div className="adv_view_case_req">
      <div className="container">
        <div className="row">
          {/* Left Column: Petitioner (Litigant) & Opponent Info */}
          <div className="col-5">
            {/* Petitioner Details Card */}
            <div className="adv_case_req_left_container1">
              <div className="adv_case_req_left_container1_head">
                <p>Petitioner Details</p>
              </div>
              <div className="adv_case_req_left_container1_content d-flex">
                <div>
                  <div className="d-flex mt-2">
                    <div className="px-3">
                      <img src={icon1} alt="User Icon" />
                    </div>
                    <div>{data.userId?.name}</div>
                  </div>
                  <div className="d-flex mt-2">
                    <div className="px-3">
                      <img src={icon2} alt="Email Icon" />
                    </div>
                    <div>{data.userId?.email}</div>
                  </div>
                  <div className="d-flex mt-2">
                    <div className="px-3">
                      <img src={icon3} alt="Phone Icon" />
                    </div>
                    <div>{data.userId?.contact}</div>
                  </div>
                  <div className="d-flex mt-2">
                    <div className="px-3">
                      <img src={icon4} alt="Location Icon" />
                    </div>
                    <div>{data.userId?.city}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Opponent Details Card */}
            <div className="adv_case_req_left_container2 ">
              <div className="adv_case_req_left_container1_head">
                <p>Opponent Details</p>
              </div>
              <div className="adv_case_req_left_container1_content">
                <div className="d-flex mt-2">
                  <div className="px-3">Name :</div>
                  <div>{data.opponentName ? data.opponentName : "Unknown"}</div>
                </div>
                <div className="d-flex mt-2">
                  <div className="px-3">Address :</div>
                  <div>
                    {data.opponentAddress ? data.opponentAddress : "Unknown"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Case Incident Summary & Judge Assignment Form */}
          <div className="col-7">
            <div className="adv_case_req_right_container">
              <div className="adv_case_req_left_container1_head">
                <p>Case Details</p>
              </div>
              <div className="adv_case_req_left_container1_content">
                <table>
                  <tbody>
                    <tr>
                      <td>Case Title</td>
                      <td>: {data.title}</td>
                    </tr>
                    <tr>
                      <td>Case Description</td>
                      <td>: {data.description}</td>
                    </tr>
                    <tr>
                      <td>Case Type</td>
                      <td>: {data.type}</td>
                    </tr>
                    <tr>
                      <td>Date of Request</td>
                      <td>: {data.dateOfIncident?.slice(0, 10)}</td>
                    </tr>
                    <tr>
                      <td>Evidence</td>
                      <td>
                        :{" "}
                        <Link to="#" onClick={handleEvidenceClick}>
                          Click here
                        </Link>
                      </td>
                    </tr>
                    {/* Judge Selection Dropdown */}
                    <tr>
                      <td>Judge</td>
                      <td>
                        :
                        <select
                          value={selectedadvocate}
                          onChange={handleAdvChange}
                          className="ms-2"
                        >
                          <option value="">Choose Judge</option>
                          {advocate.length > 0 &&
                            advocate.map((x) => (
                              <option key={x._id} value={x._id}>
                                {x.name}
                              </option>
                            ))}
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Button to confirm judge assignment */}
                <div className="adv_view_case_req_actions text-center mt-2">
                  <button className="btn bg-gold" onClick={handleAssign}>
                    Assign Judge
                  </button>
                </div>

                {/* First Hearing Scheduling Form (Unlocked after judge is assigned) */}
                {showAssignModal === true && (
                  <div className="mt-4">
                    <form onSubmit={handleHearingSubmitfn}>
                      <table>
                        <tbody>
                          {/* Hearing Status */}
                          <tr className="col-6">
                            <td className="col-3">Status </td>
                            <td className="col-6 co_view_singlecase_addhearing_inp">
                              :{" "}
                              <select 
                                name="status"
                                onChange={handleHearingChange}
                                defaultValue=""
                              >
                                <option value="" hidden>Select Status</option>
                                <option value="Schedule First Hearing">
                                  Schedule First Hearing
                                </option>
                                <option value="On Hold">On Hold</option>
                              </select>
                              {errors.status && <p className="error-text">{errors.status}</p>}
                            </td>
                          </tr>

                          {/* Hearing Date Picker */}
                          <tr className="col-6">
                            <td className="col-3">Hearing Date </td>
                            <td className="col-6 co_view_singlecase_addhearing_inp">
                              : <input 
                                  type="date" 
                                  id="dateInput" 
                                  min={new Date().toISOString().split("T")[0]}
                                  onChange={handleHearingChange}
                                  name="hearingDate"
                                  value={firstHearing.hearingDate}
                                />
                              {errors.hearingDate && <p className="error-text">{errors.hearingDate}</p>}
                            </td>
                          </tr>

                          {/* Hearing Remarks Description */}
                          <tr className="col-6">
                            <td className="col-3">Description </td>
                            <td className="col-6 co_view_singlecase_addhearing_inp">
                              : <textarea
                                  name="description"
                                  value={firstHearing.description}
                                  onChange={handleHearingChange} 
                                  placeholder="Enter courtroom schedule details or remarks"
                                />
                              {errors.description && <p className="error-text">{errors.description}</p>}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Confirm Inaugural Hearing Submission */}
                      <div className="adv_view_case_req_actions text-center mt-2">
                        <button type="submit" className="btn bg-gold">
                          Add First Hearing
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Preview Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Evidence</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {fileType === "none" ? (
            <p>No Evidence Added</p>
          ) : fileType === "pdf" ? (
            <iframe
              src={evidenceUrl}
              width="100%"
              height="500px"
              title="Evidence PDF"
            />
          ) : (
            <img src={evidenceUrl} alt="Evidence" className="img-fluid" />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default COViewSinglecase;

