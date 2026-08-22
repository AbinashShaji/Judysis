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

function COViewSinglecase() {
  const [data, setData] = useState({
    userId: { profilePic: { filename: "" } },
    dateOfIncident: "",
    evidence: {},
    type: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [advocate, setAdvocate] = useState([]);
  const [selectedadvocate, setSelectedAdvocate] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);


  useEffect(() => {
    const fetchdata = async () => {
      try {
        console.log("id", id);

        const result = await ViewById("getCaseById", id);

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
          console.error("Advocate View Error :", result);
          // toast.error(result.message);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred during login");
      }
    };
    fetchdata();
  }, [data.type]);

  const handleAdvChange = (e) => {
    const month = e.target.value;
    setSelectedAdvocate(month);
  };

  const handleAssign = async (jid) => {
    try {
      const result = await resetPassword(
        { judgeId: selectedadvocate },
        "assignJudgeCaseById",
        id
      );

      if (result.success) {
        setShowAssignModal(true);
        console.log(result);
        // navigate("/co_view_cases");
      } else {
        console.error(" View Error :", result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred during login");
    }
  };

  // console.log(data?.evidence?.filename+"datttttt");

  const handleEvidenceClick = () => {
    // const evidence = data?.user?.evidence || {};
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

  //updating first hearing by court official
    //   console.log(data._id+"caseID");
  const caseIdd=data._id
  console.log(caseIdd);
  
 
  const [firstHearing, setFirsthearing] = useState({
    caseId: "",
    status: "",
    hearingDate: "",
    description: "",
  });
  const [errors, setErrors] = useState({});


  useEffect(() => {
    if (data._id) {
      setFirsthearing((prev) => ({
        ...prev,
        caseId: data._id, // Update caseId when data._id is available
      }));
    }
  }, [data._id]);

  const handleHearingChange = (e) => {
    setFirsthearing({
      ...firstHearing,
      [e.target.name]: e.target.value,
    });
    console.log(firstHearing);
    
  };

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
  


  const handleHearingSubmitfn=((e)=>{
    e.preventDefault()
    if (validateForm()) {
        console.log("Form is valid, submitting data...");
        axiosInstance.post(`createStatus`,firstHearing)
        .then((result)=>{
            console.log(result);
            if(result.data.status===200){
                toast.success("Hearing Added Successfully")
                navigate("/co_view_cases")
            }
            else{
                toast.warn(result.data.msg)
            }
            
        })
        .catch((error)=>{
            console.log(error);
            
        })
    } else {
        console.log("Form validation failed");
      }
  })


  return (
    <div className="adv_view_case_req">
      <div className="container">
        <div className="row">
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
                      <td>: {data.dateOfIncident.slice(0, 10)}</td>
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
                      <td>Judge</td>
                      <td>
                        :
                        <select
                          value={selectedadvocate}
                          onChange={handleAdvChange}
                          className="ms-2"
                        >
                          <option value="">Choose Judge</option>
                          {console.log(advocate.length)}
                          {advocate.length > 0
                            ? advocate.map((x) => {
                                return (
                                  <>
                                    <option value={x._id}>{x.name}</option>
                                  </>
                                );
                              })
                            : ""}
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="adv_view_case_req_actions text-center mt-2">
                  <button className="btn bg-gold" onClick={handleAssign}>
                    Assign Judge
                  </button>
                </div>

                {/* Showing inputs for adding case hearing details */}
                {showAssignModal === true ? (
                  <div>
                    <form>
                    <table>
                      <tr className="col-6">
                        <td className="col-3">Status </td>
                        <td className="col-6 co_view_singlecase_addhearing_inp">
                          :{" "}
                          <select 
                          name="status"
                        //   value={firstHearing.status}
                          onChange={handleHearingChange}
                          >
                            <option hidden>Select Status</option>
                            <option value="Schedule First Hearing">
                              Schedule First Hearing
                            </option>
                            <option value="On Hold">On Hold</option>
                          </select>
                          {errors.status && <p className="error-text">{errors.status}</p>}
                        </td>
                      </tr>
                      <tr className="col-6">
                        <td className="col-3">Hearing Date </td>
                        <td className="col-6 co_view_singlecase_addhearing_inp">
                          : <input type="date" id="dateInput" 
                          min={new Date().toISOString().split("T")[0]}
                          onChange={handleHearingChange}
                          name="hearingDate"
                          value={firstHearing.hearingDate}
                          />
                              {errors.hearingDate && <p className="error-text">{errors.hearingDate}</p>}

                        </td>
                      </tr>{" "}
                      <tr className="col-6">
                        <td className="col-3">Description </td>
                        <td className="col-6 co_view_singlecase_addhearing_inp">
                          : <textarea
                          name="description"
                          value={firstHearing.description}
                          onChange={handleHearingChange} />
                              {errors.description && <p className="error-text">{errors.description}</p>}

                        </td>
                      </tr>
                    </table>
                    <div className="adv_view_case_req_actions text-center mt-2">
                  <button className="btn bg-gold" onClick={handleHearingSubmitfn}>
                    Add First Hearing
                  </button>
                  
                </div>
                </form>
                  </div>

                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
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

export default COViewSinglecase;
