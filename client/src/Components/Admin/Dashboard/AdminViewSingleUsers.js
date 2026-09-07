/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR VIEW SINGLE USER PROFILE (AdminViewSingleUsers.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This screen displays a detailed dossier / profile page for a single citizen user.
 * The administrator can inspect:
 *   - Profile photograph
 *   - Full legal name
 *   - Email address
 *   - Phone contact number
 *   - Gender
 *   - Residential city
 *   - Date of birth
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Rendered by `AdminMain.js` when navigating to `/admin_view_single_user/:id`
 *   (triggered by clicking the view icon in `AdminViewUsers.js` or `AdminViewUserReqs.js`).
 * - Extracts citizen ID from the URL parameters (`useParams`).
 * - Calls `ViewById('viewUserById', id)` to query the citizen's database record.
 * - Profile photo is displayed using `${IMG_BASE_URL}/${advocate.profilePic.filename}`.
 * - Provides administrative action handlers (`handleApprove`, `handleReject`, `handleActivate`, `handleDeactivate`)
 *   to update account authorization in MongoDB.
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import img from "../../../Assets/image 21.png";
import { IMG_BASE_URL } from '../../Services/BaseURL';
import { toast } from "react-toastify";
import { approveById, viewCount } from "../../Services/AdminService";
import { ViewById } from "../../Services/CommonServices";

/**
 * AdminViewSingleUsers Component
 * ------------------------------
 * Displays the user's personal details and avatar image in an admin layout.
 */
function AdminViewSingleUsers() {
  // State storing the citizen's profile info (note: variable name is 'advocate' historically, holds user record)
  const [advocate, setAdvocate] = useState({
    profilePic: { filename: '' },
    dob: ''
  });
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  // Read citizen ID from URL parameter (/admin_view_single_user/:id)
  const { id } = useParams();

  /**
   * Effect Hook: Route Guard
   * ------------------------
   * If the administrator is not logged in, redirect them back to the homepage.
   */
  useEffect(() => {
    if (localStorage.getItem("admin") == null) {
      navigate("/");
    }
  }, [navigate]);

  /**
   * handleApprove
   * -------------
   * Approves a pending citizen sign-up application.
   * 
   * @param {string} id - The MongoDB ObjectID of the user to approve
   */
  const handleApprove = async (id) => {
    try {
      const result = await approveById('approveUserById', id);

      if (result.success) {
        console.log(result);
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
   * handleReject
   * ------------
   * Rejects a pending citizen sign-up application.
   * 
   * @param {string} id - The MongoDB ObjectID of the user to reject
   */
  const handleReject = async (id) => {
    try {
      const result = await approveById('rejectUserById', id);

      if (result.success) {
        console.log(result);
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
   * Fetches this specific citizen's profile details from the database using their ID.
   */
  const fetchdata = async () => {
    try {
      const result = await ViewById('viewUserById', id);

      if (result.success) {
        console.log(result);
        if (result.user)
          setAdvocate(result.user);
        else
          setAdvocate({});
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
   * Effect Hook: On Mount & ID Change
   * ---------------------------------
   * Loads user data whenever the component mounts or the `id` in the URL changes.
   */
  useEffect(() => {
    fetchdata();
  }, [id]);

  /**
   * handleActivate
   * --------------
   * Unlocks and activates an account.
   */
  const handleActivate = async (id) => {
    try {
      const result = await approveById('activateAdvocateById', id);

      if (result.success) {
        console.log(result);
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
   * Deactivates and locks an account.
   */
  const handleDeactivate = async (id) => {
    try {
      const result = await approveById('deactivateAdvocateById', id);

      if (result.success) {
        console.log(result);
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

  return (
    <div className="container-fluid mt-5">
      <div className="row justify-content-center">
        {/* LEFT COLUMN: Profile Picture & Citizen Name */}
        <div className="admin_view_advocate_img col-lg-4 col-md-6 col-sm-12 text-center">
          <img
            src={`${IMG_BASE_URL}/${advocate.profilePic.filename}`}
            className="img-fluid rounded"
            alt="Citizen Profile"
          />
          <br />
          <label className="advocate-name d-block mt-3">{advocate.name}</label>
          <br />
        </div>

        {/* RIGHT COLUMN: Tabular Profile Biodata */}
        <div className="col-lg-8 col-md-6 col-sm-12 ">
          <div>
            <table className="table custom-table">
              <tbody>
                {/* Citizen Full Name */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Name </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.name}</label>
                  </td>
                </tr>

                {/* Citizen Email */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Email </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.email}</label>
                  </td>
                </tr>

                {/* Citizen Contact Phone */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Contact </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.contact}</label>
                  </td>
                </tr>

                {/* Citizen Gender */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Gender </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.gender}</label>
                  </td>
                </tr>

                {/* Citizen City */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">City </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.city} </label>
                  </td>
                </tr>

                {/* Citizen Date of Birth */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Date Of Birth </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.dob.slice(0, 10)}</label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminViewSingleUsers;
