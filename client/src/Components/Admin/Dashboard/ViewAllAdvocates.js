/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR VIEW ALL ADVOCATES (ViewAllAdvocates.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This screen displays the complete roster of approved legal practitioners (advocates)
 * in the court management system.
 * The administrator can:
 *   1. Review advocate credentials (Bar Council Enrolment No, legal specializations,
 *      years of courtroom experience, contact email).
 *   2. Click the profile view button to open the lawyer's comprehensive dossier (`ViewProfile_AllAdvocate.js`).
 *   3. Toggle lawyer account access by clicking "Activate" or "Deactivate".
 *   4. Click the top link to review pending advocate registration requests (`AdminViewAdvReqs.js`).
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Rendered by `AdminMain.js` when visiting `/admin-viewalladvocates`.
 * - Calls `viewCount('viewAdvocates')` on component mount to retrieve active advocates from MongoDB.
 * - Clicking "Deactivate" calls `approveById('deactivateAdvocateById', id)` to pause lawyer privileges.
 * - Clicking "Activate" calls `approveById('activateAdvocateById', id)` to restore lawyer privileges.
 * - If an advocate is deactivated, they cannot log into their portal (`AdvocateLogin.js`)
 *   nor appear as available for citizen booking (`User_ViewAllAdvocates.js`).
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import "../../../Styles/ViewAllAdvocates.css";
import img from "../../../Assets/Vecto(2).png";
import { Link } from "react-router-dom";
import noData from "../../../Assets/noDataFound.json";
import Lottie from "lottie-react";
import { approveById, viewCount } from "../../Services/AdminService";
import { toast } from "react-toastify";

/**
 * ViewAllAdvocates Component
 * --------------------------
 * Renders the tabular list of approved advocates with account suspension controls.
 */
function ViewAllAdvocates() {
  // State storing the list of approved legal advocates
  const [data, setData] = useState([]);

  /**
   * handleActivate
   * --------------
   * Unlocks an advocate's account, allowing them to accept cases and sign in.
   * 
   * @param {string} id - The MongoDB ObjectID of the advocate
   */
  const handleActivate = async (id) => {
    try {
      const result = await approveById('activateAdvocateById', id);

      if (result.success) {
        console.log(result);
        // Refresh table with fresh data
        fetchdata();
      } else {
        console.error('View Error :', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred during login');
    }
  };

  /**
   * handleDeactivate
   * ----------------
   * Suspends an advocate's account, disabling their access to the system.
   * 
   * @param {string} id - The MongoDB ObjectID of the advocate
   */
  const handleDeactivate = async (id) => {
    try {
      const result = await approveById('deactivateAdvocateById', id);

      if (result.success) {
        console.log(result);
        // Refresh table with fresh data
        fetchdata();
      } else {
        console.error(' View Error :', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred during login');
    }
  };

  /**
   * fetchdata
   * ---------
   * Calls the backend to retrieve all registered advocates via `viewAdvocates`.
   */
  const fetchdata = async () => {
    try {
      const result = await viewCount('viewAdvocates');

      if (result.success) {
        console.log(result);
        if (result.user.length > 0)
          setData(result.user);
        else
          setData([]);
      } else {
        console.error('Village Office View Error :', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred during login');
    }
  };

  /**
   * Effect Hook: On Mount Data Loading
   * ----------------------------------
   * Loads the advocate list as soon as the screen opens.
   */
  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="main-div">
      {/* Link to navigate to pending advocate verification requests */}
      <Link
        to="/admin-adv-reqs"
        className="admin-user-req-linkh3"
        style={{ fontSize: "20px", fontWeight: "700" }}
      >
        View Advocate request
      </Link>

      {/* Check if advocate records exist */}
      {data.length > 0 ? (
        <div className="table-container table-striped">
          <table className="table-change container-fluid">
            <thead>
              <tr>
                <th className="table-header">Bar council Enrolment No</th>
                <th className="table-header">Advocate Name</th>
                <th className="table-header">Specialization areas</th>
                <th className="table-header">Contact</th>
                {/* <th className="table-header">Educational qualification</th> */}
                <th className="table-header">Years of Experience</th>
                <th className="table-header">View full Details</th>
                <th className="table-header">User Status</th>
              </tr>
            </thead>
            <tbody>
              {data.length ? (
                data.map((advocate) => (
                  <tr key={advocate._id}>
                    <td className="table-data">{advocate.bcNo}</td>
                    <td className="table-data">{advocate.name}</td>
                    <td className="table-data">{advocate.specialization}</td>
                    <td className="table-data">{advocate.email}</td>
                    {/* <td className="table-data">{advocate.qualification}</td> */}
                    <td className="table-data">{advocate.experience} years</td>
                    {/* View Single Advocate Dossier Profile */}
                    <td className="table-data">
                      <Link to={`/admin_view_single_advocate/${advocate._id}`}>
                        <button className="btn1 btn btn-outline-secondary">
                          <img src={img} alt="View Details" />
                        </button>
                      </Link>
                    </td>{" "}
                    {console.log(advocate.isActive)}
                    {/* Account Activation/Deactivation Toggle */}
                    <td className="table-data">
                      {advocate.isActive ? (
                        <button
                          className="btn btn-outline-danger button-size1 p-3 mr-2"
                          style={{ paddingRight: "15px" }}
                          onClick={() => handleDeactivate(advocate._id)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-success button-size1 p-3 mr-2"
                          onClick={() => handleActivate(advocate._id)}
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <h1>No Data obtained</h1>
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

export default ViewAllAdvocates;
