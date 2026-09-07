/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR PENDING ADVOCATE REQUESTS (AdminViewAdvReqs.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This screen allows the administrator to review and verify newly registered lawyers
 * (advocates) before granting them permission to take cases on JudiSys.
 * The administrator can:
 *   1. View the lawyer's Bar Council enrollment number, legal specialization,
 *      years of practice, email, and phone number.
 *   2. Click "View More" to open their comprehensive background dossier (`ViewProfile_AR.js`).
 *   3. Click the green checkmark button to Approve the lawyer's registration.
 *   4. Click the red cross button to Reject and remove the unverified application.
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Rendered by `AdminMain.js` when navigating to `/admin-adv-reqs`
 *   (or clicking "View Advocate request" from `ViewAllAdvocates.js`).
 * - Calls `viewCount('viewAdvocateReqs')` to fetch only unapproved advocates from MongoDB.
 * - Approving an advocate via `approveById('approveAdvocateById', id)`:
 *     - Marks the advocate as approved in the database.
 *     - Optimistically removes them from the pending list state.
 *     - Allows the lawyer to log in (`AdvocateLogin.js`) and receive client case requests.
 * - Rejecting an advocate via `approveById('rejectAdvocateById', id)`:
 *     - Permanently removes their pending application from MongoDB.
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
 * AdminViewAdvReqs Component
 * --------------------------
 * Displays pending lawyer applications in a table with Approve / Reject action controls.
 */
function AdminViewAdvReqs() {
  const navigate = useNavigate();

  /**
   * Effect Hook: Route Guard
   * ------------------------
   * Ensures only logged-in administrators can access the advocate verification queue.
   */
  useEffect(() => {
    if (localStorage.getItem("admin") == null) {
      navigate("/");
    }
  }, [navigate]);

  // State storing the list of pending advocate applications
  const [data, setData] = useState([]);

  /**
   * fetchdata
   * ---------
   * Queries the backend for lawyer accounts that are awaiting administrative verification.
   */
  const fetchdata = async () => {
    try {
      const result = await viewCount("viewAdvocateReqs");

      if (result.success) {
        console.log(result);
        setData(result.user.length > 0 ? [...result.user] : []);
      } else {
        console.error(" View Error :", result);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  /**
   * Effect Hook: On Mount Data Loading
   * ----------------------------------
   * Fetches the queue of pending advocates as soon as the screen opens.
   */
  useEffect(() => {
    fetchdata();
  }, []);

  /**
   * handleApprove
   * -------------
   * Approves the lawyer's credentials and unlocks their portal access.
   * 
   * @param {string} id - The MongoDB ObjectID of the advocate to approve
   */
  const handleApprove = async (id) => {
    try {
      const result = await approveById("approveAdvocateById", id);

      if (result.success) {
        console.log(result);
        toast.success("Approved Successfully");
        // Optimistically remove the approved advocate from the pending list on screen
        setData((prevData) => prevData.filter((advocate) => advocate._id !== id));
      } else {
        console.error("View Error :", result);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  /**
   * handleReject
   * ------------
   * Rejects and removes an unverified or ineligible advocate registration.
   * 
   * @param {string} id - The MongoDB ObjectID of the advocate to reject
   */
  const handleReject = async (id) => {
    try {
      const result = await approveById("rejectAdvocateById", id);

      if (result.success) {
        console.log(result);
        // Optimistically remove the rejected advocate from the pending list on screen
        setData((prevData) => prevData.filter((advocate) => advocate._id !== id));
      } else {
        console.error(" View Error :", result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  useEffect(() => {
    console.log("Data updated:", data);
  }, [data]);

  return (
    <div className="main-div">
      {/* Check if any pending advocate registration requests exist */}
      {data?.length !== 0 ? (
        <div className="table-container table-striped">
          <table className="table-change container-fluid">
            <thead className="admin-tab-head">
              <tr>
                <th className="table-header admin-tab-head-text">BC No</th>
                <th className="table-header admin-tab-head-text"> Name</th>
                <th className="table-header">Specialization</th>
                <th className="table-header">E-Mail</th>
                <th className="table-header">Contact</th>
                <th className="table-header">Years of Experience</th>
                <th className="table-header">View More</th>
                <th className="table-header">Approve</th>
                <th className="table-header">Remove</th>
              </tr>
            </thead>
            <tbody>
              {data && data?.length ? (
                data.map((advocate) => (
                  <tr key={advocate._id}>
                    <td className="table-data">{advocate.bcNo}</td>
                    <td className="table-data">{advocate.name}</td>
                    <td className="table-data">{advocate.specialization}</td>
                    <td className="table-data">{advocate.email}</td>
                    <td className="table-data">{advocate.contact}</td>
                    <td className="table-data">{advocate.experience} years</td>
                    {/* View Full Lawyer Dossier */}
                    <td className="table-data">
                      <Link to={`/adminviewrequest/${advocate._id}`}>
                        <button className="btn1 btn btn-outline-secondary">
                          <img src={img} alt="View Details" />
                        </button>
                      </Link>
                    </td>
                    {/* Approve Registration Button */}
                    <td className="table-data">
                      <button
                        className="btn btn-outline-success"
                        onClick={() => handleApprove(advocate._id)}
                      >
                        <img src={img1} alt="Approve Advocate" />
                      </button>
                    </td>
                    {/* Reject & Remove Registration Button */}
                    <td className="table-data">
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleReject(advocate._id)}
                      >
                        <img src={img2} alt="Reject Advocate" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No Data obtained
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="no-advocates">
          <h1>No New Requests</h1>
        </div>
      )}
    </div>
  );
}

export default AdminViewAdvReqs;
