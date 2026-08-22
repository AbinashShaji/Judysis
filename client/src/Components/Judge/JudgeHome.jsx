import React, { useEffect, useState } from "react";
import "../../Styles/AdvocateHome.css";
import icon from "../../Assets/policeHomeCaseIcon.png";

import { Link, useNavigate } from "react-router-dom";

import noData from "../../Assets/noDataFound.json";
import Lottie from "lottie-react";
import { toast } from "react-toastify";

import { ViewById } from "../Services/CommonServices";

function JudgeHome() {
  const [advocate, setAdvocate] = useState({ dob: "" });
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("judge") === null) {
      navigate("/");
    }
  }, [navigate]);
  const id = localStorage.getItem("judge");

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const result = await ViewById("viewJudgeById", id);

        if (result.success) {
          console.log(result);
          setAdvocate(result.user);
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

  const toggleModal = () => setShowModal(!showModal);

  const [data, setData] = useState([]);

  const [resource, setResource] = useState([]);

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

  console.log(data);

  return (
    <div className="advocate_home">
      <div className="judge_home_banner">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <p>
                Justice is the constant and perpetual will to allot to every man
                his due.
                <br /> - Domitius Ulpian
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="advocate_home_container">
        <div className="container">
          <div className="row advocate_home_content">
            <div className="col-sm-12 mt-3">
              <div className="container advocate_home_container2">
                <div className="advocate_home_container2_title mt-3">
                  <p>Recent Case Requests</p>
                </div>
                <div className="advocate_home_container2_table table-responsive">
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
                          {Array.isArray(data) && data?.slice(0,4).map((caseReq) => (
                            <tr key={caseReq._id}>
                              <td>{caseReq.userId.name}</td>
                              <td>{caseReq.userId.email}</td>
                              <td>{caseReq.userId.contact}</td>
                              <td>{caseReq.type}</td>
                              <td>{caseReq.dateOfIncident.slice(0, 10)}</td>
                              <td>
                                <Link
                                  to={`/judge_view_single_case_req/${caseReq._id}`}
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
            <div className="col-lg-4 col-md-6 col-sm-12 mt-5 advocate_home_profile_container pb-2">
              <div className="container mt-5">
                <div className="advocate_home_profile_container_head">
                  <p className="advocate_home_profile_container_head_title">
                    {advocate.name}
                  </p>
                  <p className="advocate_home_profile_container_head_subtitle mt-2">
                    <span className="text-gold">{advocate.specialization}</span>
                  </p>
                  <p className="advocate_home_profile_container_head_subtitle mt-2">
                    <span className="text-gold">{advocate.experience}</span>{" "}
                    Years Of Experience
                  </p>
                </div>
                <div className="advocate_home_profile_container_body mt-5 text-wrap">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <td scope="col">Email Address</td>
                        <td scope="col">{advocate.email}</td>
                      </tr>
                      <tr>
                        <td scope="col">Contact Number</td>
                        <td scope="col">{advocate.contact}</td>
                      </tr>

                      <tr>
                        <td scope="col">Date Of Birth</td>
                        <td scope="col">{advocate.dob.slice(0, 10)}</td>
                      </tr>

                      <tr>
                        <td scope="col">Specialization Areas</td>
                        <td scope="col">{advocate.specialization}</td>
                      </tr>
                    </thead>
                  </table>
                  {/* <div className="advocate_home_edit_btn text-center mt-3">
                    <Link to={`/advocate_edit_profile`}>
                      <button type="submit">Edit</button>
                    </Link>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JudgeHome;
