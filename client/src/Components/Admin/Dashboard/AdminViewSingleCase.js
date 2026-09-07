/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR VIEW SINGLE CASE DOSSIER (AdminViewSingleCase.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This screen provides the administrator with a complete 360-degree overview
 * of any court case filed in the system.
 * The administrator can inspect:
 *   1. Client (Petitioner) details: Profile picture, name, email, phone, city.
 *   2. Opponent (Counterparty) details: Full name and residential address.
 *   3. Case facts: Title, description, lawsuit category, date of incident.
 *   4. Attached Evidence: Click to preview scanned documents (PDF or image).
 *   5. Assigned Advocate (Lawyer) credentials and specialization.
 *   6. Sub-navigation buttons (when approved) to inspect:
 *        - Case Status hearing milestones (`AdminViewCaseStatus.js`)
 *        - Additional evidence documents (`AdminViewEvidences.js`)
 *        - Client fee payments (`AdminViewPayment.js`)
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Rendered by `AdminMain.js` when visiting `/admin_view_single_case/:id`
 *   (accessed by clicking "Details" on `AdminViewAllCases.js`).
 * - Retrieves the case ID from URL parameters (`useParams`).
 * - Calls `ViewById('getCaseById', id)` to query the full case document from MongoDB.
 * - Clicking "Evidence: Click here" dynamically identifies whether the file is a PDF
 *   or image and displays an interactive modal popup.
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import img from "../../../Assets/adv4.avif";
import icon1 from "../../../Assets/profile.png";
import icon2 from "../../../Assets/mail.png";
import icon3 from "../../../Assets/contact.png";
import icon4 from "../../../Assets/house.png";
import icon5 from "../../../Assets/location.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { IMG_BASE_URL } from "../../Services/BaseURL";
import { ViewById } from "../../Services/CommonServices";

/**
 * AdminViewSingleCase Component
 * -----------------------------
 * Displays full court case particulars, petitioner/opponent cards, and evidence viewer.
 */
function AdminViewSingleCase() {
  // State storing the case document and related citizen/lawyer details
  const [data, setData] = useState({
    userId: { profilePic: { filename: "" } },
    advocateId: {},
    dateOfIncident: "",
    evidence: { filename: "" },
  });
  // Read case ID from URL (/admin_view_single_case/:id)
  const { id } = useParams();
  const navigate = useNavigate();
  const aid = localStorage.getItem("advocateId");
  // Controls evidence preview popup modal visibility
  const [showModal, setShowModal] = useState(false);
  // Full web link to access the evidence file
  const [evidenceUrl, setEvidenceUrl] = useState("");
  // Detects file extension ('pdf', 'jpg', 'png', etc.) for proper modal rendering
  const [fileType, setFileType] = useState("");

  /**
   * Effect Hook: Load Case Data
   * ---------------------------
   * Calls `ViewById('getCaseById', id)` to fetch the full case file on mount.
   */
  useEffect(() => {
    const fetchdata = async () => {
      try {
        console.log("id", id);

        const result = await ViewById("getCaseById", id);

        if (result.success) {
          console.log(result);
          setData(result.user || null);
        } else {
          console.error("Advocate View Error :", result);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };
    fetchdata();
  }, [id]);

  /**
   * handleEvidenceClick
   * -------------------
   * Triggered when the admin clicks "Click here" to view evidence.
   * Identifies file extension (PDF or image) and opens the modal viewer.
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

  /**
   * handleClose
   * -----------
   * Closes the evidence popup modal.
   */
  const handleClose = () => setShowModal(false);

  return (
    <div className="adv_view_case_req">
      <div className="container">
        <div className="row mt-3">
          {/* LEFT COLUMN: Petitioner (Client) and Opponent Details */}
          <div className="col-5">
            {/* Client / Petitioner Card */}
            <div className="adv_case_req_left_container1">
              <div className="adv_case_req_left_container1_head">
                <p>Client Details</p>
              </div>
              <div className="adv_case_req_left_container1_content d-flex">
                <div className="adv_case_req_left_container1_content_img">
                  <img
                    src={`${IMG_BASE_URL}/${data.userId?.profilePic?.filename}`}
                    alt="Client"
                  />
                </div>
                <div>
                  {/* Name */}
                  <div className="d-flex mt-2">
                    <div className="px-3">
                      <img src={icon1} alt="icon1" />
                    </div>
                    <div className="text-break">{data.userId?.name}</div>
                  </div>
                  {/* Email */}
                  <div className="d-flex mt-2">
                    <div className="px-3">
                      <img src={icon2} alt="icon2" />
                    </div>
                    <div className="text-break">{data.userId?.email}</div>
                  </div>
                  {/* Contact Number */}
                  <div className="d-flex mt-3">
                    <div className="px-3">
                      <img src={icon3} alt="icon3" />
                    </div>
                    <div>{data.userId?.contact}</div>
                  </div>
                  {/* City */}
                  <div className="d-flex mt-2">
                    <div className="px-3">
                      <img src={icon4} alt="icon4" />
                    </div>
                    <div className="text-break">{data.userId?.city}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Opponent Card */}
            <div className="adv_case_req_left_container2">
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

          {/* RIGHT COLUMN: Case Specifics, Assigned Advocate, and Deep Links */}
          <div className="col-7">
            <div className="adv_case_req_right_container">
              <div className="adv_case_req_left_container1_head">
                <p>Case Details</p>
              </div>
              <div className="adv_case_req_left_container1_content">
                <table>
                  <tbody>
                    {/* Display Assigned Advocate details if advocate accepted */}
                    {data.advocateStatus === true ? (
                      <>
                        <tr>
                          <td>Advocate Name</td>
                          <td>: {data.advocateId?.name}</td>
                        </tr>
                        <tr>
                          <td>Type</td>
                          <td>: {data.advocateId?.specialization}</td>
                        </tr>
                      </>
                    ) : (
                      ""
                    )}
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
                  </tbody>
                </table>

                {/* Sub-Navigation: Case Status, Evidences, Payments */}
                {data.adminApproved === true ? (
                  <div className="row justify-content-center mt-4 arr">
                    <div className="col-auto">
                      <Link to={`/admin_view_case_status/${data._id}`}>
                        <button className="btn btn-warning btn-style me-2">
                          Case Status
                        </button>
                      </Link>
                    </div>
                    <div className="col-auto">
                      <Link to={`/admin_view_added_evidences/${data._id}`}>
                        <button className="btn btn-warning btn-style me-2">
                          Evidences Info
                        </button>
                      </Link>
                    </div>
                    <div className="col-auto">
                      <Link
                        to={`/admin_view_client_payment_status/${data._id}`}
                      >
                        <button className="btn btn-warning btn-style me-2">
                          Payment Info
                        </button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP MODAL: Interactive Evidence Viewer (PDF or Image) */}
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

export default AdminViewSingleCase;
