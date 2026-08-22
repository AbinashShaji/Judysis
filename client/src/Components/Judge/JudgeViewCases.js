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

function JudgeViewCases() {
  const [data, setData] = useState([]);

  const id = localStorage.getItem("judge");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [fileType, setFileType] = useState(""); // State to store the file type

  useEffect(() => {
    const fetchdata = async () => {
      try {
        console.log("id", id);

        const result = await ViewById("getCaseByJudgeId", id);

        if (result.success) {
          console.log(result);
          setData(result.user || []);
        } else {
          console.error("Advocate View Error :", result);
          // toast.error(result.message);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred during login");
      }
    };
    fetchdata();
  }, [id]);

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
      toast.error("An unexpected error occurred during login");
    }
  };

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

  const handleClose = () => setShowModal(false);

  return (
    <div className="adv_view_case_req">
      <center>
        {" "}
        <h2>View All cases</h2>
      </center>
      <div className="container">
        <div className="advocate_home_container2_table table-responsive">
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
                {data &&
                  data?.map((caseReq) => (
                    <tr key={caseReq._id}>
                      <td>{caseReq.userId.name}</td>
                      <td>{caseReq.userId.email}</td>
                      <td>{caseReq.userId.contact}</td>
                      <td>{caseReq.type}</td>
                      <td>{caseReq.advocateId.name}</td>
                      <td>{caseReq.dateOfIncident.slice(0, 10)}</td>
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
            <div className="no_data_animation">
              <Lottie animationData={noData} className="no_data_animation" />
            </div>
          )}
        </div>
      </div>

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
