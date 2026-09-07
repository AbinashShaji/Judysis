/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: JudgeViewSingleCase.jsx
 * Path: client/src/Components/Judge/JudgeViewSingleCase.jsx
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This screen is the comprehensive case dossier for a presiding Judge.
 * When the Judge selects a case from their dashboard or active cases list,
 * this page shows all essential information needed to conduct a trial:
 * 1. The filing Citizen's identity and contact details.
 * 2. The opposing party's (defendant's) name and address.
 * 3. The official Case incident report, category, and attached evidence.
 * 4. The assigned Advocate's name and Bar Council registration number.
 * 5. A button to open the courtroom hearing schedule and record trial progress.
 * 
 * ROUTING & RENDERING FLOW:
 * - Route: `/judge_view_single_case_req/:id`
 * - Data Journey:
 *   1. Reads the case ID (`id`) from the URL parameters.
 *   2. Contacts `/getCaseById/:id` to retrieve the case with client and advocate details populated.
 *   3. Renders the information across three visual cards.
 *   4. Clicking "Hearing Details" redirects to `/case-hearings/:id` for scheduling and rulings.
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import "../../Styles/AdvocateViewCaseReq.css";
import img from "../../Assets/adv4.avif";
import icon1 from "../../Assets/profile.png";
import icon2 from "../../Assets/mail.png";
import icon3 from "../../Assets/contact.png";
import icon4 from "../../Assets/house.png";
import icon5 from "../../Assets/location.png";

import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import { IMG_BASE_URL } from "../Services/BaseURL";
import { ViewById } from "../Services/CommonServices";
import { approveById } from "../Services/AdminService";

/**
 * JudgeViewSingleCase Component
 * Displays full trial information for a judge and handles evidence document preview.
 */
function JudgeViewCases() {
  // State storing the case document including nested client and advocate information
  const [data, setData] = useState({
    userId: { profilePic: { filename: "" } },
    dateOfIncident: "",
    evidence: {},
  });

  // Extract the case ID from URL params
  const { id } = useParams();
  const navigate = useNavigate();

  // State controls for evidence viewer popup modal
  const [showModal, setShowModal] = useState(false);
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [fileType, setFileType] = useState(""); // Detects whether evidence is an image or PDF

  /**
   * Effect Hook: Load Case Dossier
   * Queries the database for complete details of the selected case ID.
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
          console.error("Judge View Error :", result);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred while loading case details");
      }
    };
    fetchdata();
  }, [id]);

  /**
   * handleViewHearingDetails
   * Navigates the judge to the courtroom hearing manager screen for this case.
   */
  const handleViewHearingDetails = () => {
    navigate(`/case-hearings/${id}`);
  };

  /**
   * handleAccept
   * Helper action for accepting assignments.
   */
  const handleAccept = async () => {
    try {
      const result = await approveById("acceptReqbyAdv", id);

      if (result.success) {
        console.log(result);
        navigate("/advocate_viewcasereq");
      } else {
        console.error("View Error :", result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred while accepting request");
    }
  };

  /**
   * handleEvidenceClick
   * Determines if the evidence is a PDF or image file and displays it inside the popup modal.
   */
  const handleEvidenceClick = () => {
    const evidence = data.evidence || {};
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

  // Close evidence modal
  const handleClose = () => setShowModal(false);

  return (
    <div className="adv_view_case_req">
      <div className="container">
        <div className="row">
          {/* Left Column: Client Profile and Opponent Details */}
          <div className="col-5">
            {/* Client Profile Card */}
            <div className="adv_case_req_left_container1">
              <div className="adv_case_req_left_container1_head">
                <p>Client Details</p>
              </div>
              <div className="adv_case_req_left_container1_content d-flex">
                {/* Client Avatar Image */}
                <div className="adv_case_req_left_container1_content_img">
                  <img
                    src={`${IMG_BASE_URL}/${data.userId?.profilePic?.filename}`}
                    alt="Client"
                  />
                </div>
                {/* Client Contact Info */}
                <div>
                  <div className="d-flex mt-2">
                    <div className="px-3">
                      <img src={icon1} alt="icon1" />
                    </div>
                    <div>{data.userId?.name}</div>
                  </div>
                  <div className="d-flex mt-2">
                    <div className="px-3">
                      <img src={icon2} alt="icon2" />
                    </div>
                    <div>{data.userId?.email}</div>
                  </div>
                  <div className="d-flex mt-2">
                    <div className="px-3">
                      <img src={icon3} alt="icon3" />
                    </div>
                    <div>{data.userId?.contact}</div>
                  </div>
                  <div className="d-flex mt-2">
                    <div className="px-3">
                      <img src={icon4} alt="icon4" />
                    </div>
                    <div>{data.userId?.city}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Opponent (Defendant) Information Card */}
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

          {/* Right Column: Case Incident Specifications and Legal Counsel */}
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
                    <tr>
                      <td>Advocate Name</td>
                      <td>: {data?.advocateId?.name}</td>
                    </tr>
                    <tr>
                      <td>Bar Council Number</td>
                      <td>: {data?.advocateId?.bcNo}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Button taking Judge to Courtroom Hearing Record Manager */}
                <div className="adv_view_case_req_actions text-center ">
                  <button
                    className="btn bg-gold"
                    onClick={handleViewHearingDetails}
                  >
                    Hearing Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Viewer Modal Dialog */}
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

export default JudgeViewCases;

