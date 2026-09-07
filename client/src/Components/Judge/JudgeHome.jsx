/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: JudgeHome.jsx
 * Path: client/src/Components/Judge/JudgeHome.jsx
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This component is the personal homepage and command center for a presiding Judge.
 * When the Judge logs in, they see:
 * 1. An inspiring judicial quote banner.
 * 2. A table of recent cases assigned to their courtroom bench.
 * 3. A judicial profile card detailing their personal contact info, courtroom
 *    experience, and legal specialization.
 * 
 * ROUTING & RENDERING FLOW:
 * - Route: `/judge-home`
 * - Guard: Confirms `localStorage.getItem('judge')` is present; bounces unauthenticated users to `/`.
 * - Data Journey:
 *   1. Fetches judge profile from `/viewJudgeById/:id` and populates the profile summary card.
 *   2. Fetches assigned cases from `/getCaseByJudgeId/:id` and populates the recent cases table.
 *   3. Clicking the case action icon takes the judge to `/judge_view_single_case_req/:id`
 *      to review filings, manage proceedings, or record hearing results.
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import "../../Styles/AdvocateHome.css";
import icon from "../../Assets/policeHomeCaseIcon.png";

import { Link, useNavigate } from "react-router-dom";

import noData from "../../Assets/noDataFound.json";
import Lottie from "lottie-react";
import { toast } from "react-toastify";

import { ViewById } from "../Services/CommonServices";

/**
 * JudgeHome Component
 * Displays the primary judicial overview dashboard with assigned cases and profile details.
 */
function JudgeHome() {
  // State storing the judge's personal profile information
  const [advocate, setAdvocate] = useState({ dob: "" });
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  /**
   * Security Guard Effect:
   * Protects this dashboard against non-logged-in visitors.
   */
  useEffect(() => {
    if (localStorage.getItem("judge") === null) {
      navigate("/");
    }
  }, [navigate]);

  // Read current judge database ID from browser storage
  const id = localStorage.getItem("judge");

  /**
   * Effect Hook: Load Judge Profile
   * Retrieves the judge's credentials, qualifications, and contact information.
   */
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const result = await ViewById("viewJudgeById", id);

        if (result.success) {
          console.log(result);
          setAdvocate(result.user);
        } else {
          console.error("Judge Profile Error :", result);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred while loading profile");
      }
    };
    fetchdata();
  }, [id]);

  const toggleModal = () => setShowModal(!showModal);

  // State storing the list of courtroom cases assigned to this judge
  const [data, setData] = useState([]);
  const [resource, setResource] = useState([]);

  /**
   * Effect Hook: Load Assigned Cases
   * Queries the database for all cases assigned to this judge's bench.
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

  console.log(data);

  return (
    <div className="advocate_home">
      {/* Top Judicial Banner with Inspiring Quote */}
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
            {/* Main Area: Recent Assigned Cases Table */}
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
                        {Array.isArray(data) &&
                          data.slice(0, 4).map((caseReq) => (
                            <tr key={caseReq._id}>
                              {/* Litigant / Citizen Information */}
                              <td>{caseReq.userId?.name}</td>
                              <td>{caseReq.userId?.email}</td>
                              <td>{caseReq.userId?.contact}</td>
                              {/* Legal Category & Incident Date */}
                              <td>{caseReq.type}</td>
                              <td>{caseReq.dateOfIncident?.slice(0, 10)}</td>
                              {/* Action: Open dossier and schedule hearings */}
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
                    /* Fallback state when no cases are assigned yet */
                    <div className="no-cases">
                      <h1>No case requests</h1>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Summary Card */}
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
                        <td scope="col">{advocate.dob?.slice(0, 10)}</td>
                      </tr>
                      <tr>
                        <td scope="col">Specialization Areas</td>
                        <td scope="col">{advocate.specialization}</td>
                      </tr>
                    </thead>
                  </table>
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

