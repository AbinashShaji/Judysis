/**
 * ==============================================================================
 * Project: Judysis - Judicial Management System
 * File: COViewAlljudges.jsx
 * Path: client/src/Components/CourtOffice/Dashboard/COViewAlljudges.jsx
 * 
 * WHAT THIS FILE DOES IN SIMPLE ENGLISH:
 * This screen displays the master directory of all courtroom Judges.
 * Court office staff can review every judge's legal specialization and courtroom experience,
 * click to view their full credentials, and toggle their account between Active and Deactivated.
 * It also features an "Add New Judge" button to onboard new judicial officers.
 * 
 * ROUTING & RENDERING FLOW:
 * - Route: Rendered within `/co-view-judges` inside the `COMain` shell container.
 * - Data Journey:
 *   1. Calls `/viewJudges` on load to fetch all registered judges.
 *   2. Displays judges in a responsive table.
 *   3. Clicking "Activate" or "Deactivate" hits `/activateJudgeById` or `/deactivateJudgeById`
 *      and refreshes the list in place.
 *   4. Clicking "View Details" takes the clerk to `/co-view-single-judge/:id`.
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import "../../../Styles/ViewAllAdvocates.css";
import img from "../../../Assets/Vecto(2).png";
import img1 from "../../../Assets/Vectorsymbol.png";
import img2 from "../../../Assets/raphael_cross.png";
import { Link, useNavigate } from "react-router-dom";
import noReqFound from "../../../Assets/noReqFound.json";
import Lottie from "lottie-react";
import { toast } from "react-toastify";
import { approveById, viewCount } from "../../Services/AdminService";

/**
 * COViewAlljudges Component
 * Renders the judge roster and manages judicial account activation states.
 */
function COViewAlljudges() {
  const navigate = useNavigate();

  // Security check: Ensure court office staff is authenticated
  useEffect(() => {
    if (localStorage.getItem("court") == null) {
      navigate("/");
    }
  }, [navigate]);

  // State storing the array of judges
  const [data, setData] = useState([]);

  /**
   * handleActivate
   * Enables a deactivated judge account so they can log in and preside over cases.
   * 
   * @param {string} id - The unique judge database ID
   */
  const handleActivate = async (id) => {
    try {
      const result = await approveById('activateJudgeById', id);

      if (result.success) {
        console.log(result);
        toast.success("Judge account activated successfully");
        fetchdata(); // Refresh table
      } else {
        console.error('View Error :', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred while activating judge');
    }
  };

  /**
   * handleDeactivate
   * Temporarily disables a judge's account access.
   * 
   * @param {string} id - The unique judge database ID
   */
  const handleDeactivate = async (id) => {
    try {
      const result = await approveById('deactivateJudgeById', id);

      if (result.success) {
        console.log(result);
        toast.success("Judge account deactivated successfully");
        fetchdata(); // Refresh table
      } else {
        console.error('View Error :', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred while deactivating judge');
    }
  };

  /**
   * fetchdata
   * Queries the database for all judge accounts.
   */
  const fetchdata = async () => {
    try {
      const result = await viewCount('viewJudges');

      if (result.success) {
        console.log(result);
        if (result.user.length > 0)
          setData(result.user);
        else
          setData([]);
      } else {
        console.error('Court Office View Error :', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred while loading judges');
    }
  };

  // Initial load effect
  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="main-div">
      {/* Link to Judge Onboarding Form */}
      <h3 className="admin-user-req-link">
        <Link to='/co-add-judge' className="admin-user-req-linkh3">
          Add New Judge
        </Link>
      </h3>

      {data.length !== 0 ? (
        <>
          <h2 className="advocateRegistrationtitle">View All Judges</h2>

          <div className="table-container table-striped">
            <table className="table-change container-fluid">
              <thead className="admin-tab-head">
                <tr>
                  <th className="table-header admin-tab-head-text">Name</th>
                  <th className="table-header">Specialization</th>
                  <th className="table-header">E-Mail</th>
                  <th className="table-header">Contact</th>
                  <th className="table-header">Years of Experience</th>
                  <th className="table-header">View More</th>
                  <th className="table-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((advocate) => (
                  <tr key={advocate._id}>
                    {/* Judge Credentials */}
                    <td className="table-data">{advocate.name}</td>
                    <td className="table-data">{advocate.specialization}</td>
                    <td className="table-data">{advocate.email}</td>
                    <td className="table-data">{advocate.contact}</td>
                    <td className="table-data">{advocate.experience} years</td>
                    {/* View Individual Dossier Button */}
                    <td className="table-data">
                      <Link to={`/co-view-single-judge/${advocate._id}`}>
                        <button className="btn1 btn btn-outline-secondary ">
                          <img src={img} alt="View Details" />
                        </button>
                      </Link>
                    </td>
                    {/* Toggle Activation / Deactivation Status */}
                    <td className="table-data">
                      {advocate.isActive ? (
                        <button
                          className="btn btn-outline-danger button-size p-2"
                          onClick={() => handleDeactivate(advocate._id)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-success button-size p-2"
                          onClick={() => handleActivate(advocate._id)}
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Empty state animation */
        <div className="no_data_animation">
          <Lottie animationData={noReqFound} className="no_data_animation" />
          <h1 className="text-center">No New Requests</h1>
        </div>
      )}
    </div>
  );
}

export default COViewAlljudges;