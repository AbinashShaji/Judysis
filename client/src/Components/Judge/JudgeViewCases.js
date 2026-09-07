/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: JudgeViewCases.js
 * Path: client/src/Components/Judge/JudgeViewCases.js
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This screen provides the Judge with a master roster of all active cases
 * currently assigned to their court chamber.
 * The Judge can see which lawyer is representing the client, the nature of the
 * dispute, and click the view button to inspect filings or schedule court dates.
 * 
 * ROUTING & RENDERING FLOW:
 * - Route: `/judge-view-cases` (accessible via "Current cases" in Judge Navbar).
 * - Data Journey:
 *   1. Reads judge ID from `localStorage.getItem('judge')`.
 *   2. Contacts `/getCaseByJudgeId/:id` to get all ongoing cases assigned to this judge.
 *   3. Populates an interactive table (Client, Email, Phone, Case Type, Advocate Name, Date).
 *   4. Clicking the action button navigates to `/judge_view_single_case_req/:id`.
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
import noData from "../../Assets/noDataFound.json";
import Lottie from "lottie-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import icon from "../../Assets/policeHomeCaseIcon.png";

import { Modal, Button } from "react-bootstrap";
import { IMG_BASE_URL } from "../Services/BaseURL";
import { ViewById } from "../Services/CommonServices";
import { approveById } from "../Services/AdminService";

/**
 * JudgeViewCases Component
 * Renders the table of all current trials assigned to the logged-in judge.
 */
function JudgeViewCases() {
  // Local state storing the array of assigned court cases
  const [data, setData] = useState([]);

  // Read the active judge ID from browser storage
  const id = localStorage.getItem("judge");
  const navigate = useNavigate();

  // Evidence preview modal state
  const [showModal, setShowModal] = useState(false);
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [fileType, setFileType] = useState(""); // Tracks whether evidence is a PDF or image

  /**
   * Effect Hook: Load All Assigned Cases
   * Queries the backend database for all cases assigned to this judge's ID.
   */
  useEffect(() => {
    const fetchdata = async () => {
      try {
        console.log("id", id);

        const result = await ViewById("getCaseByJudgeId", id);

        if (result.success) {
          console.log(result);
          setData(result.user || []);
        } else {
          console.error("Judge Cases Error :", result);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred while loading cases");
      }
    };
    fetchdata();
  }, [id]);

  /**
   * handleAccept
   * Helper action for accepting case assignments if needed.
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
      toast.error("An unexpected error occurred while approving case");
    }
  };

  /**
   * handleEvidenceClick
   * Inspects the file format of the evidence file and opens the preview popup.
   */
  const handleEvidenceClick = () => {
    const evidence = data.caseId?.evidence || {};
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
      {/* Title Header */}
      <center>
        <h2>View All cases</h2>
      </center>

      <div className="container">
        <div className="advocate_home_container2_table table-responsive">
          {/* Table of active trials */}
          {data.length !== 0 ? (
            <table className="table align-center">
              <thead>
                <tr>
                  <th scope="col">Client Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone Number</th>
                  <th scope="col">Case Type</th>
                  <th scope="col">Advocate Name</th>
                  <th scope="col">Date of Request</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((caseReq) => (
                  <tr key={caseReq._id}>
                    {/* Litigant Details */}
                    <td>{caseReq.userId?.name}</td>
                    <td>{caseReq.userId?.email}</td>
                    <td>{caseReq.userId?.contact}</td>
                    {/* Case Category */}
                    <td>{caseReq.type}</td>
                    {/* Appointed Defense / Legal Counsel */}
                    <td>{caseReq.advocateId?.name}</td>
                    {/* Filing Date */}
                    <td>{caseReq.dateOfIncident?.slice(0, 10)}</td>
                    {/* Action: Open full dossier */}
                    <td>
                      <Link to={`/judge_view_single_case_req/${caseReq._id}`}>
                        <button
                          type="button"
                          className="btn btn-outline px-3"
                        >
                          <img
                            src={icon}
                            className="img-fluid"
                            alt="View Case"
                          />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /* Animation displayed when no active cases are found */
            <div className="no_data_animation">
              <Lottie animationData={noData} className="no_data_animation" />
            </div>
          )}
        </div>
      </div>

      {/* Modal Dialog for previewing case evidence files */}
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

