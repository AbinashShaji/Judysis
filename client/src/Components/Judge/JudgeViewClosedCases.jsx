/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: JudgeViewClosedCases.jsx
 * Path: client/src/Components/Judge/JudgeViewClosedCases.jsx
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This component acts as the Judge's historical case archive.
 * Once a Judge delivers a final verdict and marks a case status as "Closed",
 * the trial moves from active proceedings into this closed records archive.
 * Judges can revisit resolved cases at any time to review the past verdict and evidence.
 * 
 * ROUTING & RENDERING FLOW:
 * - Route: `/judge-view-closed-cases` (linked from "Closed Cases" in Judge Navbar).
 * - Data Journey:
 *   1. Reads active judge ID from `localStorage.getItem('judge')`.
 *   2. Contacts `/getClosedCaseByJudgeId/:id` to fetch only cases marked "Closed".
 *   3. Renders the resolved records in a clean table view.
 *   4. Clicking the action button navigates to `/judge_view_single_case_req/:id` for archived review.
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
 * JudgeViewClosedCases Component
 * Displays the archive of resolved trials concluded by this judge.
 */
function JudgeViewClosedCases() {
  // Local state storing the array of closed/resolved cases
  const [data, setData] = useState([]);

  // Read judge ID from storage
  const id = localStorage.getItem('judge');
  const navigate = useNavigate();

  // Modal states for previewing evidence
  const [showModal, setShowModal] = useState(false);
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [fileType, setFileType] = useState(""); // Tracks whether evidence is PDF or image

  /**
   * Effect Hook: Load Concluded Cases
   * Queries the database for cases marked "Closed" assigned to this judge.
   */
  useEffect(() => {
    const fetchdata = async () => {
      try {
        console.log("id", id);
        
        const result = await ViewById('getClosedCaseByJudgeId', id);

        if (result.success) {
          console.log(result);
          setData(result.user || []);
        } else {
          console.error('Judge View Error :', result);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred while loading closed cases');
      }
    };
    fetchdata();
  }, [id]);

  /**
   * handleEvidenceClick
   * Opens evidence attachment preview popup for the case.
   */
  const handleEvidenceClick = () => {
    const evidence = data.caseId?.evidence || {};
    const fileUrl = evidence.filename ? `${IMG_BASE_URL}/${evidence.filename}` : null;
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

  // Close modal dialog
  const handleClose = () => setShowModal(false);

  return (
    <div className="adv_view_case_req">
      {/* Archive Header Title */}
      <center>
        <h2>View All Closed Cases</h2>
      </center>

      <div className="container">
        <div className="advocate_home_container2_table table-responsive">
          {/* Table of closed cases */}
          {data.length !== 0 ? (
            <table className="table align-center">
              <thead>
                <tr>
                  <th scope="col">Client Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone Number</th>
                  <th scope="col">Case Type</th>
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
                    {/* Legal Category & Incident Date */}
                    <td>{caseReq.type}</td>
                    <td>{caseReq.dateOfIncident?.slice(0, 10)}</td>
                    {/* Action: Revisit the complete trial file and ruling */}
                    <td>
                      <Link to={`/judge_view_single_case_req/${caseReq._id}`}>
                        <button
                          type="button"
                          className="btn btn-outline px-3"
                        >
                          <img src={icon} className="img-fluid" alt="View Case" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /* Displayed when no closed cases exist */
            <div className="no-cases">
              <h1>No cases</h1>
            </div>
          )}
        </div>
      </div>

      {/* Evidence Viewer Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Evidence</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {fileType === "none" ? (
            <p>No Evidence Added</p>
          ) : fileType === "pdf" ? (
            <iframe src={evidenceUrl} width="100%" height="500px" title="Evidence PDF" />
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

export default JudgeViewClosedCases;

