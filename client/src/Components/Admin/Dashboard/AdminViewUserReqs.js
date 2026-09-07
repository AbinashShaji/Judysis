/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR PENDING CITIZEN REQUESTS (AdminViewUserReqs.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This screen displays a table of newly registered citizens whose accounts are
 * currently pending administrative verification.
 * The administrator can:
 *   1. Review applicant details (name, email, phone, Aadhaar number, city).
 *   2. Click the profile icon to inspect their full dossier (`AdminViewSingleUsers.js`).
 *   3. Click "Approve" to activate the citizen's account so they can log in.
 *   4. Click "Delete" (Reject) to discard invalid or fraudulent account registrations.
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Rendered by `AdminMain.js` when visiting `/admin-userreqs` (linked from the top
 *   of `AdminViewUsers.js`).
 * - Calls `viewCount('viewUsersForAdmin')` to fetch only unapproved citizen accounts.
 * - Approving an account via `approveById('approveUserById', id)` updates MongoDB and
 *   moves the citizen into the main Users table (`AdminViewUsers.js`).
 * - Deleting an account via `approveById('rejectUserById', id)` permanently purges the
 *   unverified application from the system.
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import img from "../../../Assets/Vecto(2).png";
import { Link, useNavigate } from "react-router-dom";
import noData from "../../../Assets/noDataFound.json";
import Lottie from "lottie-react";
import '../../../Styles/AdminViewUsers.css';
import { toast } from "react-toastify";
import { approveById, viewCount } from "../../Services/AdminService";

/**
 * AdminViewUserReqs Component
 * ---------------------------
 * Displays the list of pending citizen registrations with Approve / Delete action buttons.
 */
function AdminViewUserReqs() {
  const navigate = useNavigate();

  /**
   * Effect Hook: Route Guard
   * ------------------------
   * Ensures only logged-in administrators can access this moderation interface.
   */
  useEffect(() => {
    if (localStorage.getItem("admin") == null) {
      navigate("/");
    }
  }, [navigate]);

  // State storing the list of pending citizen registration applications
  const [data, setData] = useState([]);

  /**
   * handleApprove
   * -------------
   * Approves a citizen registration so they can log into the platform.
   * 
   * @param {string} id - The MongoDB ObjectID of the pending citizen
   */
  const handleApprove = async (id) => {
    try {
      const result = await approveById('approveUserById', id);

      if (result.success) {
        console.log(result);
        // Refresh the list after approval
        fetchdata();
      } else {
        console.error('View Error :', result);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred view Users');
    }
  };

  /**
   * handleReject
   * ------------
   * Deletes and purges a rejected citizen sign-up attempt.
   * 
   * @param {string} id - The MongoDB ObjectID of the citizen to reject
   */
  const handleReject = async (id) => {
    try {
      const result = await approveById('rejectUserById', id);

      if (result.success) {
        console.log(result);
        // Refresh the list after deletion
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
   * Queries the backend for citizen accounts waiting for administrator approval.
   */
  const fetchdata = async () => {
    try {
      const result = await viewCount('viewUsersForAdmin');

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
   * Fetches pending applications when the screen opens.
   */
  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="main-div">
      {/* Check if any pending registration requests exist */}
      {data.length !== 0 ? (
        <>
          <h3 className="mt-5 mb-3">New Users</h3>
          <div className="table-container table-striped">
            <table className="container-fluid">
              <thead className="thead-dark">
                <tr>
                  <th className="table-header fw-bolder">Name</th>
                  <th className="table-header fw-bolder">Email</th>
                  <th className="table-header fw-bolder">Contact</th>
                  <th className="table-header fw-bolder">Aadhar Number</th>
                  <th className="table-header fw-bolder">City</th>
                  <th className="table-header fw-bolder">Profile</th>
                  <th className="table-header fw-bolder">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.length ? (
                  data.map((user) => (
                    <tr key={user._id}>
                      <td className="table-data">{user.name}</td>
                      <td className="table-data">{user.email}</td>
                      <td className="table-data">{user.contact}</td>
                      <td className="table-data">{user.aadhar}</td>
                      <td className="table-data">{user.city}</td>
                      {/* View Single User Profile Link */}
                      <td className="table-data">
                        <Link to={`/admin_view_single_user/${user._id}`}>
                          <button className="btn1 btn btn-outline-secondary p-1">
                            <img src={img} alt="View Details" />
                          </button>
                        </Link>
                      </td>
                      {console.log(user.isActive)}
                      {/* Action Buttons: Approve or Delete */}
                      <td className="table-data">
                        <button
                          className="btn btn-outline-success button-size p-1 ms-3"
                          onClick={() => handleApprove(user._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-outline-danger button-size p-1 ms-3"
                          onClick={() => handleReject(user._id)}
                        >
                          Delete
                        </button>
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
        </>
      ) : (
        /* Empty State */
        <div className="no-advocates">
          <h1>No New Requests</h1>
        </div>
      )}
    </div>
  );
}

export default AdminViewUserReqs;