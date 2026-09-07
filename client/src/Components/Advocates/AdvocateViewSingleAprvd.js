/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: AdvocateViewSingleAprvd.js
 * Path: client/src/Components/Advocates/AdvocateViewSingleAprvd.js
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This screen displays the complete file for an accepted case assigned to a lawyer.
 * It presents three clean panels of information:
 * 1. Client Details (name, phone, email, location, and photo).
 * 2. Opponent Details (the name and address of the person they are fighting in court).
 * 3. Case Details (what happened, incident date, and legal type).
 * Lawyers can also preview evidence files (PDFs or photos) in an interactive popup modal
 * and navigate directly to the court hearing schedule for this case.
 * 
 * ROUTING & RENDERING FLOW:
 * - Route: `/advocate_view_single_approved_case/:id`
 * - Rendering Impact: Opens when the lawyer clicks "View Details" on their approved cases list.
 * - Data Journey:
 *   1. Reads appointment ID (`id`) from the URL parameters.
 *   2. Contacts `/getAppointmentReqsById/:id` to fetch populated case and client records.
 *   3. Populates client, opponent, and case details across the dashboard cards.
 *   4. Clicking "Hearing Details" redirects the lawyer to `/adv-case-hearings/:caseId`.
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
 * AdvocateViewSingleAprvd Component
 * Displays the dossier of an active, accepted case and handles evidence previewing.
 */
function AdvocateViewSingleAprvd() {
  // Local state holding the full case record, client info, and evidence metadata
  const [data, setData] = useState({
    userId: { profilePic: { filename: "" } },
    caseId: { dateOfIncident: "", evidence: {} },
  });
  // State storing the specific case database ID for easy routing to hearing records
  const [cases, setCase] = useState("");

  // Read the appointment/request ID from the URL
  const { id } = useParams();
  const navigate = useNavigate();

  // Modal dialog states for viewing evidence documents/images
  const [showModal, setShowModal] = useState(false);
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [fileType, setFileType] = useState(""); // Detects whether evidence is an image or PDF

  /**
   * Effect Hook: Load Case & Client Record
   * Fetches the full dossier from the server whenever the route ID changes.
   */
  useEffect(() => {
    const fetchdata = async () => {
      try {
        console.log("id", id);
        // Call backend service to get appointment and nested case information
        const result = await ViewById("getAppointmentReqsById", id);

        if (result.success) {
          console.log(result);
          setData(result.user || null);
          setCase(result.user.caseId._id);
        } else {
          console.error("Advocate View Error :", result);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred while loading case details");
      }
    };
    fetchdata();
  }, [id]);

  /**
   * handleAccept
   * Marks a case appointment request as accepted by this advocate.
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
   * handleReject
   * Rejects an incoming client representation request.
   */
  const handleReject = async (id) => {
    try {
      const result = await approveById("rejectReqbyAdv", id);

      if (result.success) {
        console.log(result);
        navigate("/advocate_viewcasereq");
      } else {
        console.error("View Error :", result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred while rejecting request");
    }
  };

  /**
   * handleEvidenceClick
   * Inspects the attached file extension (.pdf vs images) and opens the modal preview.
   */
  const handleEvidenceClick = () => {
    const evidence = data.caseId.evidence || {};
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

  // Close the popup preview modal
  const handleClose = () => setShowModal(false);

  /**
   * handleViewHearingDetails
   * Navigates the advocate to the court hearing timeline screen for this specific case.
   */
  const handleViewHearingDetails = () => {
    navigate(`/adv-case-hearings/${cases}`);
  };

  return (
    <div className="adv_view_case_req">
      <div className="container">
        <div className="row">
          {/* Left Column: Client Details and Opponent Information */}
          <div className="col-5">
            {/* Client Profile Card */}
            <div className="adv_case_req_left_container1">
              <div className="adv_case_req_left_container1_head">
                <p>Client Details</p>
              </div>
              <div className="adv_case_req_left_container1_content d-flex">
                {/* Client Photo */}
                <div className="adv_case_req_left_container1_content_img">
                  <img
                    src={`${IMG_BASE_URL}/${data.userId.profilePic.filename}`}
                    alt="Client"
                  />
                </div>
                {/* Client Contact Info */}
                <div>
                  <div className="d-flex mt-2">
                    <div className="px-3">
                      <img src={icon1} alt="icon1" />
                    </div>
                    <div>{data.userId.name}</div>
                  </div>
                  <div className="d-flex mt-2">
                    <div className="px-3">
                      <img src={icon2} alt="icon2" />
                    </div>
                    <div>{data.userId.email}</div>
                  </div>
                  <div className="d-flex mt-2">
                    <div className="px-3">
                      <img src={icon3} alt="icon3" />
                    </div>
                    <div>{data.userId.contact}</div>
                  </div>
                  <div className="d-flex mt-2">
                    <div className="px-3">
                      <img src={icon4} alt="icon4" />
                    </div>
                    <div>{data.userId.city}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Opponent Card */}
            <div className="adv_case_req_left_container2 ">
              <div className="adv_case_req_left_container1_head">
                <p>Opponent Details</p>
              </div>
              <div className="adv_case_req_left_container1_content">
                <div className="d-flex mt-2">
                  <div className="px-3">Name :</div>
                  <div>
                    {data.caseId.opponentName
                      ? data.caseId.opponentName
                      : "Unknown"}
                  </div>
                </div>
                <div className="d-flex mt-2">
                  <div className="px-3">Address :</div>
                  <div>
                    {data.caseId.opponentAddress
                      ? data.caseId.opponentAddress
                      : "Unknown"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Case Incident Details & Hearing Action */}
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
                      <td>: {data.caseId.title}</td>
                    </tr>
                    <tr>
                      <td>Case Description</td>
                      <td>: {data.caseId.description}</td>
                    </tr>
                    <tr>
                      <td>Case Type</td>
                      <td>: {data.caseId.type}</td>
                    </tr>
                    <tr>
                      <td>Date of Request</td>
                      <td>: {data.caseId.dateOfIncident?.slice(0, 10)}</td>
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
                  </tbody>
                </table>

                {/* Hearing Schedule Button */}
                <div className="adv_view_case_req_actions text-center mt-5">
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
            /* Render PDF inside an embedded iframe */
            <iframe
              src={evidenceUrl}
              width="100%"
              height="500px"
              title="Evidence PDF"
            />
          ) : (
            /* Render image files */
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

export default AdvocateViewSingleAprvd;

