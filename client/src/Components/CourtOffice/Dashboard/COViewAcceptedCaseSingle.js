/**
 * ==============================================================================
 * COURT OFFICE VIEW ACCEPTED CASE DETAILS (COViewAcceptedCaseSingle.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This screen lets Court Office staff review all details of a case that has
 * already been assigned to a judge and is actively progressing through court hearings.
 * Staff can inspect:
 *   1. Petitioner (citizen who filed) contact details.
 *   2. Opponent (the accused or counterparty) information.
 *   3. Case details (title, description, incident date, evidence file).
 *   4. Assigned Judge details (name and contact number).
 *   5. Full hearing history timeline (dates, statuses, next hearing schedules).
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Rendered by Court Office routes when staff click "View More" on an assigned case
 *   from the Accepted Cases List (`COViewAllCasesAccepted.js`).
 * - Grabs the case ID directly from the URL parameters (`useParams`).
 * - Makes two backend calls:
 *     1. POST `getCaseById/:id` -> Fetches case and citizen details.
 *     2. POST `getStatusByCaseId/:id` -> Fetches hearing history and assigned judge info.
 * - Clicking "Evidence" opens a popup modal displaying the uploaded image or PDF document.
 * - Clicking "Case Updates" reveals the table showing all hearing milestone updates.
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import icon1 from "../../../Assets/profile.png";
import icon2 from "../../../Assets/mail.png";
import icon3 from "../../../Assets/contact.png";
import icon4 from "../../../Assets/house.png";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../Services/BaseURLMain";
import { IMG_BASE_URL } from "../../Services/BaseURL";
import { Modal, Button } from "react-bootstrap";

/**
 * CoViewAcceptedCaseSingle Component
 * -----------------------------------
 * Displays petitioner details, opponent information, case facts, assigned judge,
 * and an interactive hearing progress timeline for a specific court case.
 */
function CoViewAcceptedCaseSingle() {
  // Grab the case ID from the browser URL
  const { id } = useParams();
  console.log(id);

  // State storage variables
  const [Case, setCase] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [fileType, setFileType] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [uniqueJudges, setUniqueJudges] = useState([]);
  const [data,setData]=useState([])
  const [showUpdate,setshowUpdate]=useState(false)

  /**
   * Effect Hook: Load Case Data
   * ---------------------------
   * Calls POST `getCaseById/:id` to retrieve core case information.
   */
  useEffect(() => {
    axiosInstance
      .post(`getCaseById/${id}`)
      .then((result) => {
        console.log(result);
        setCase(result.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  /**
   * handleEvidenceClick
   * -------------------
   * Logic for processing and opening the evidence popup modal.
   */
  const handleEvidenceClick = () => {
    const evidence = Case?.evidence || {};
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
   * Closes the evidence preview popup modal.
   */
  const handleClose = () => setShowModal(false);

  /**
   * Effect Hook: Load Hearing Statuses & Judges
   * ------------------------------------------------
   * Retrieves all hearing records and extracts unique assigned judge details.
   */
  useEffect(() => {
    axiosInstance
      .post(`getStatusByCaseId/${id}`)
      .then((result) => {
        console.log(result);
        setData(result.data.data);
        const judgesMap = new Map();

        result.data.data.forEach((item) => {
          if (item.judgeId && !judgesMap.has(item.judgeId._id)) {
            judgesMap.set(item.judgeId._id, item.judgeId);
          }
        });

        setUniqueJudges(Array.from(judgesMap.values()));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  /**
   * showUpdates
   * -----------
   * Toggles the hearing status updates table visibility.
   */
  const showUpdates=(()=>{
    setshowUpdate(true)
  })

  return (
    <div className="adv_view_case_req">
      <div className="container">
        <div className="row">
          {/* LEFT COLUMN: Petitioner and Opponent Details */}
          <div className="col-5">
            <div className="adv_case_req_left_container1">
              <div className="adv_case_req_left_container1_head">
                <p>Petitioner Details</p>
              </div>
              <div className="adv_case_req_left_container1_content d-flex">
                <div>
                  <div className="d-flex mt-2">
                    <div className="px-3">
                      <img src={icon1} alt="icon1" />
                    </div>
                    <div>{Case?.userId?.name}</div>
                  </div>
                  <div className="d-flex mt-2">
                    <div className="px-3">
                      <img src={icon2} alt="icon2" />
                    </div>
                    <div>{Case?.userId?.email}</div>
                  </div>
                  <div className="d-flex mt-2">
                    <div className="px-3">
                      <img src={icon3} alt="icon3" />
                    </div>
                    <div>{Case?.userId?.contact}</div>
                  </div>
                  <div className="d-flex mt-2">
                    <div className="px-3">
                      <img src={icon4} alt="icon4" />
                    </div>
                    <div>{Case?.userId?.city}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="adv_case_req_left_container2 ">
              <div className="adv_case_req_left_container1_head">
                <p>Opponent Details</p>
              </div>
              <div className="adv_case_req_left_container1_content">
                <div className="d-flex mt-2">
                  <div className="px-3">Name :</div>
                  <div>{Case.opponentName ? Case.opponentName : "Unknown"}</div>
                </div>
                <div className="d-flex mt-2">
                  <div className="px-3">Address :</div>
                  <div>
                    {Case.opponentAddress ? Case.opponentAddress : "Unknown"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* RIGHT COLUMN: Case Facts, Assigned Judge, and Actions */}
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
                      <td>: {Case?.title}</td>
                    </tr>
                    <tr>
                      <td>Case Description</td>
                      <td>: {Case?.description}</td>
                    </tr>
                    <tr>
                      <td>Case Type</td>
                      <td>: {Case?.type}</td>
                    </tr>
                    <tr>
                      <td>Date of Request</td>
                      <td>: {Case?.dateOfIncident?.slice(0, 10)}</td>
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
                    {/* Display assigned judge(s) name and phone number */}
                    {uniqueJudges.map((judge) => (
                        <React.Fragment key={judge?._id}>
                      <tr>
                        <td>Judge Name</td>
                        <td>
                              : {judge?.name}{" "}
                        </td>
                      </tr>
                      <tr>
                      <td>Judge Contact</td>
                      <td>
                            : {judge?.contact}{" "}
                      </td>
                    </tr>
                    </React.Fragment>
                    ))}
                  </tbody>
                </table>
                <div className="adv_view_case_req_actions text-center mt-2">
                  <button className="btn bg-gold" 
                  onClick={showUpdates}
                >
                    Case Updates
                  </button>
                </div>

              
              </div>
            </div>
          </div>


          {/* CONDITIONAL SECTION: Hearing Updates History Table */}
          {showUpdate === true ? (

          <div className="col-12 mt-3">
            <div className="adv_case_req_right_container" style={{minHeight:"200px",maxHeight:"fit-content"}}>
              <div className="adv_case_req_left_container1_head">
                <p>Case Updates</p>
                  </div>
              <div className="adv_case_req_left_container1_content">
              <div className="advocate_home_container2_table table-responsive">
            <table className="table align-center">
              <thead>
                <tr>
                  <th scope="col">Sl. No</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Next Hearing Date</th>
                  <th scope="col">Details</th>
                </tr>
              </thead>
              <tbody>
              {data.length > 0 ? (
                data.map((caseReq, index) => (
                  <tr key={caseReq?._id}>
                    <td>{index + 1}</td>
                    <td>{caseReq?.date
                        ? caseReq.date.slice(0, 10)
                        : "N/A"}</td>
                    <td>{caseReq?.status
                        ? caseReq.status.slice(0, 10)
                        : "N/A"}</td>
                    <td>
                      {caseReq?.hearingDate
                        ? caseReq.hearingDate.slice(0, 10)
                        : "N/A"}
                    </td>
                    <td title={caseReq?.description}>{caseReq?.description?.slice(0, 50)}...</td>

                
                  </tr>
                ) )
            ) : (
                <tr>
                  <td colSpan="5">
                    <div className="">
                      <h1 className="text-center">No Updates Found</h1>
                    </div>
                  </td>
                </tr>
              )
                } 
              </tbody>
            </table>
            </div>
              </div>
              </div>
              </div>
                              ) : (
                                <></>
                              )}
              
        </div>
      </div>

      {/* POPUP MODAL: Evidence File Viewer */}
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

export default CoViewAcceptedCaseSingle;
