/**
 * ============================================================================
 * COMPONENT: AdvocateHome.js (Lawyer Home Dashboard)
 * HANDOVER SUMMARY:
 * This is the central workspace for logged-in lawyers.
 * It displays the advocate's profile banner, star ratings, and lists all pending
 * consultation requests with citizen names and case dates.
 * 
 * ROUTING & RENDERING FLOW:
 * - Route: /advocate-home
 * - Fetches profile from: POST /judisys_api/viewAdvocateById/:id
 * - Fetches consultation requests from: POST /judisys_api/getAppointmentReqsForAdv/:id
 * ============================================================================
 */

import React, { useEffect, useState } from "react";
import "../../Styles/AdvocateHome.css";
import icon from "../../Assets/policeHomeCaseIcon.png";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import { toast } from "react-toastify";
import { ViewById } from "../Services/CommonServices";
import { IMG_BASE_URL } from "../Services/BaseURL";
import noData from "../../Assets/noDataFound.json";

function AdvocateHome() {
  const [advocate, setAdvocate] = useState({ profilePic: {}, idProof: {} });
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const id = localStorage.getItem("advocate");
  const imageUrl = IMG_BASE_URL;

  // Redirect to landing if lawyer is not authenticated
  useEffect(() => {
    if (!id) navigate("/");
  }, [id, navigate]);

  // Fetch Advocate Data
  useEffect(() => {
    const fetchAdvocateData = async () => {
      try {
        const result = await ViewById("viewAdvocateById", id);
        if (result.success) {
          setAdvocate(result.user);
        } else {
          console.error("Advocate View Error:", result);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred.");
      }
    };
    if (id) fetchAdvocateData();
  }, [id]);

  // Fetch Case Requests
  useEffect(() => {
    const fetchCaseRequests = async () => {
      try {
        const result = await ViewById("getAppointmentReqsForAdv", id);
        if (result.success) {
          setData(result.user || []);
        } else {
          console.error("Case Request Fetch Error:", result);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred.");
      }
    };
    if (id) fetchCaseRequests();
  }, [id]);

  const toggleModal = () => setShowModal(!showModal);

  return (
    <div className="advocate_home">
      {/* Banner */}
      <div className="advocate_home_banner">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <p>
                Lawyers are the only persons in whom ignorance of the law is not
                punished...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Case Requests Section */}
      <div className="advocate_home_container">
        <div className="container">
          <div className="row advocate_home_content">
            <div className="col-sm-12 mt-3">
              <div className="container advocate_home_container2">
                <div className="advocate_home_container2_title mt-3">
                  <p>Recent Case Requests</p>
                </div>
                <div className="advocate_home_container2_table table-responsive">
                  {data.length > 0 ? (
                    <table className="table align-center">
                      <thead>
                        <tr>
                          <th scope="col">Client Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Phone Number</th>
                          <th scope="col">Case Type</th>
                          <th scope="col">Date of Incident</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.slice(0, 4).map((caseReq) => (
                          <tr key={caseReq._id}>
                            <td>{caseReq.userId?.name || "N/A"}</td>
                            <td>{caseReq.userId?.email || "N/A"}</td>
                            <td>{caseReq.userId?.contact || "N/A"}</td>
                            <td>{caseReq.caseId?.type || "N/A"}</td>
                            <td>
                              {caseReq.caseId?.dateOfIncident
                                ? caseReq.caseId.dateOfIncident.slice(0, 10)
                                : "N/A"}
                            </td>
                            <td>
                              <Link
                                to={`/advocate_view_single_case_req/${caseReq._id}`}
                              >
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
                    <div className="no-cases">
                      <h1>No case requests</h1>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Advocate Profile */}
            <div className="col-lg-4 col-md-6 col-sm-12 mt-3 advocate_home_profile_container pb-2">
              <div className="container">
                <div className="advocate_home_profile_container_img">
                  <img
                    src={`${imageUrl}/${advocate.profilePic?.filename}`}
                    alt="Profile"
                  />
                </div>
                <div className="advocate_home_profile_container_head">
                  <p className="advocate_home_profile_container_head_title">
                    {advocate?.name}
                  </p>
                  <p className="advocate_home_profile_container_head_subtitle mt-1">
                    <span className="text-gold">
                      {advocate?.specialization || "N/A"}
                    </span>
                  </p>
                  <p className="advocate_home_profile_container_head_subtitle mt-1">
                    <span className="text-gold">
                      {advocate?.experience || 0}
                    </span>{" "}
                    Years Of Experience
                  </p>
                </div>
                <div className="advocate_home_profile_container_body mt-3 text-wrap">
                  <table className="w-100">
                    <tbody>
                      <tr>
                        <td>Email Address</td>
                        <td>{advocate?.email || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>Contact Number</td>
                        <td>{advocate?.contact || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>Bar Council Enrollment Number</td>
                        <td>{advocate?.bcNo || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>Specialization Areas</td>
                        <td>{advocate?.specialization || "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                  <caption className="px-1">
                    <a href="#!" onClick={toggleModal}>
                      View Id Proof
                    </a>
                  </caption>
                  <div className="advocate_home_edit_btn text-center mt-3">
                    <Link to={`/advocate_edit_profile`}>
                      <button type="submit">Edit</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal */}
            {showModal && (
              <>
                <div
                  className="modal fade show"
                  tabIndex="-1"
                  role="dialog"
                  style={{ display: "block" }}
                >
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">ID Proof</h5>
                        <button
                          type="button"
                          className="close"
                          onClick={toggleModal}
                        >
                          <span>&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <img
                          src={`${imageUrl}/${advocate.idProof?.filename}`}
                          className="img-fluid"
                          alt="ID Proof"
                        />
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={toggleModal}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-backdrop fade show" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdvocateHome;
