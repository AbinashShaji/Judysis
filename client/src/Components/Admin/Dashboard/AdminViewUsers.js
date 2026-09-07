/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR VIEW ALL USERS (AdminViewUsers.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This screen displays a table of all registered citizens (petitioners) in the system.
 * The administrator can:
 *   1. View key citizen details (name, email, phone, Aadhaar ID, city).
 *   2. Click the profile view button to open a detailed citizen dossier (`AdminViewSingleUsers.js`).
 *   3. Toggle citizen account access by clicking "Activate" or "Deactivate".
 *   4. Click the top banner link to inspect pending citizen sign-up requests (`AdminViewUserReqs.js`).
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Rendered by `AdminMain.js` when visiting `/admin-viewallusers`.
 * - Calls `viewCount('viewAllUsers')` on mount to fetch all citizen user records.
 * - Clicking "Deactivate" calls `approveById('deActivateUserById', id)` to lock account access.
 * - Clicking "Activate" calls `approveById('activateUserById', id)` to restore account access.
 * - Modifying a user's active status immediately updates their ability to log in (`UserLogin.js`).
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import img from "../../../Assets/Vecto(2).png";
import { Link } from "react-router-dom";
import noData from "../../../Assets/noDataFound.json";
import Lottie from "lottie-react";
import '../../../Styles/AdminViewUsers.css';
import { toast } from "react-toastify";
import { approveById, viewCount } from "../../Services/AdminService";

/**
 * AdminViewUsers Component
 * ------------------------
 * Renders the tabular list of citizen accounts with toggleable activation statuses.
 */
function AdminViewUsers() {
  // State storing the list of registered users
  const [data, setData] = useState([]);

  /**
   * handleActivate
   * --------------
   * Unlocks a citizen's account so they can log into the system again.
   * 
   * @param {string} id - The MongoDB ObjectID of the user to activate
   */
  const handleActivate = async (id) => {
    try {
      const result = await approveById('activateUserById', id);

      if (result.success) {
        console.log(result);
        // Refresh the table with fresh database state
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
   * Suspends a citizen's account access so they cannot log in.
   * 
   * @param {string} id - The MongoDB ObjectID of the user to deactivate
   */
  const handleDeactivate = async (id) => {
    try {
      const result = await approveById('deActivateUserById', id);

      if (result.success) {
        console.log(result);
        // Refresh the table with fresh database state
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
   * Fetches all registered citizen records from the database using `viewAllUsers`.
   */
  const fetchdata = async () => {
    try {
      const result = await viewCount('viewAllUsers');

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
   * Fetches the user list as soon as the screen opens.
   */
  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="main-div">
      {/* Link to navigate to pending user registration requests */}
      <h3 className="admin-user-req-link">
        <Link to="/admin-userreqs" className="admin-user-req-linkh3">
          New User Requests
        </Link>
      </h3>

      {/* Check if user records were found */}
      {data.length !== 0 ? (
        <>
          <h3 className="mt-5 mb-3">Users</h3>
          <div className="table-container table-striped">
            <table className="table-change container-fluid">
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
                      {/* View Single User Dossier Profile Button */}
                      <td className="table-data">
                        <Link to={`/admin_view_single_user/${user._id}`}>
                          <button className="btn1 btn btn-outline-secondary p-1">
                            <img src={img} alt="View Details" />
                          </button>
                        </Link>
                      </td>
                      {console.log(user.isActive)}
                      {/* Toggle Account Status: Deactivate / Activate */}
                      <td className="table-data">
                        {user.isActive ? (
                          <button
                            className="btn btn-outline-danger button-size1 p-1"
                            onClick={() => handleDeactivate(user._id)}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-success button-size1 p-1"
                            onClick={() => handleActivate(user._id)}
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
        </>
      ) : (
        /* Empty State Illustration */
        <div className="no_data_animation">
          {/* <Lottie animationData={noData} className="no_data_animation" /> */}
          <h1 className="text-center">No Users</h1>
        </div>
      )}
    </div>
  );
}

export default AdminViewUsers;
