/**
 * ==============================================================================
 * SYSTEM ADMINISTRATOR ADVOCATE DOSSIER INSPECTION (ViewProfile_AR.js)
 * ==============================================================================
 * 
 * What This Component Does:
 * -------------------------
 * This screen displays an in-depth profile dossier for a specific legal advocate (lawyer).
 * The administrator can:
 *   1. View the lawyer's official headshot, legal specialization, and courtroom experience.
 *   2. Click "View Id Proof" to open a modal popup previewing their scanned legal license / ID card.
 *   3. Inspect Bar Council enrollment number, email, phone, and date of birth.
 *   4. Take action depending on the `view` mode:
 *        - `view === "request"`: Shows "Accept" and "Reject" buttons for pending applicants.
 *        - `view === "view"`: Shows "Activate" and "Deactivate" buttons for active practitioners.
 * 
 * Routing & Rendering Flow:
 * -------------------------
 * - Rendered by `AdminMain.js` when visiting `/adminviewrequest/:id`.
 * - Reads advocate ID from `useParams()`.
 * - Calls `ViewById('viewAdvocateById', id)` to retrieve complete credentials from MongoDB.
 * - Clicking "Accept" marks the advocate as approved via `approveById('approveAdvocateById', id)`.
 * - Clicking "Reject" deletes the advocate registration via `approveById('rejectAdvocateById', id)`.
 * - Clicking "Activate" or "Deactivate" toggles active status for already approved advocates.
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../../Styles/ViewProfile_AR.css";
import img from "../../../Assets/image 21.png";
import { IMG_BASE_URL } from '../../Services/BaseURL';
import { toast } from "react-toastify";
import { approveById, viewCount } from "../../Services/AdminService";
import { ViewById } from "../../Services/CommonServices";

/**
 * ViewProfile_AR Component
 * ------------------------
 * Renders an advocate's full profile dossier, license preview modal, and contextual actions.
 * 
 * @param {Object} props
 * @param {string} props.view - Controls button mode ('request' for pending signups, 'view' for approved lawyers)
 */
function ViewProfile_AR({ view }) {
  // State storing the advocate's detailed profile record
  const [advocate, setAdvocate] = useState(null);
  const [data, setData] = useState([]);
  // Controls ID proof popup modal visibility
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  // Read advocate ID from the URL (/adminviewrequest/:id)
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
   * Approves a pending advocate's registration request.
   * 
   * @param {string} id - The MongoDB ObjectID of the advocate to approve
   */
  const handleApprove = async (id) => {
    try {
      const result = await approveById('approveAdvocateById', id);

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
   * Rejects and removes a pending advocate's registration application.
   * 
   * @param {string} id - The MongoDB ObjectID of the advocate to reject
   */
  const handleReject = async (id) => {
    try {
      const result = await approveById('rejectAdvocateById', id);

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
   * Queries the backend for this specific advocate's complete profile using their ID.
   */
  const fetchdata = async () => {
    try {
      const result = await ViewById('viewAdvocateById', id);

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
   * Loads advocate profile details whenever the screen opens or the ID changes.
   */
  useEffect(() => {
    fetchdata();
  }, [id]);

  /**
   * handleActivate
   * --------------
   * Unlocks an active advocate's account.
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
   * Suspends an active advocate's account.
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

  /**
   * toggleModal
   * -----------
   * Opens or closes the ID proof preview popup dialog.
   */
  const toggleModal = () => setShowModal(!showModal);

  // Return empty if advocate record has not yet loaded
  if (!advocate) {
    return "";
  }

  return (
    <div className="container-fluid mt-4 ms-3">
      <div className="row justify-content-center mt-5">
        {/* LEFT COLUMN: Advocate Photo, Name, Specialization & ID Proof Link */}
        <div className="admin_view_advocate_img col-lg-4 col-md-6 col-sm-12 text-center">
          <img
            src={`${IMG_BASE_URL}/${advocate.profilePic.filename}`}
            className="img-fluid rounded"
            alt="Advocate"
          />
          <br />
          <label className="advocate-name d-block mt-3">{advocate.name}</label>
          <label className="practice-area d-block">{advocate.specialization}</label>
          <label className="experience-label d-block">
            {advocate.experience} Years of Experience 
          </label>
          <br />
          {/* Link to trigger the ID Proof Modal */}
          <Link className="link-label" to="#!" onClick={toggleModal}>
            View Id Proof
          </Link>
        </div>

        {/* RIGHT COLUMN: Official Credential Details */}
        <div className="col-lg-8 col-md-6 col-sm-12 ">
          <div>
            <table className="table custom-table">
              <tbody>
                {/* Bar Council Enrollment Number */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Bar Council Enrollment Number </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.bcNo}</label>
                  </td>
                </tr>

                {/* Email Address */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">E-Mail </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.email}</label>
                  </td>
                </tr>

                {/* Contact Phone */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Contact Number </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.contact}</label>
                  </td>
                </tr>

                {/* Legal Specialization */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Specialization Area </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.specialization}</label>
                  </td>
                </tr>

                {/* Courtroom Experience */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Years of Experience </label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.experience} years</label>
                  </td>
                </tr>

                {/* Date of Birth */}
                <tr>
                  <td className="left-alignn">
                    <label className="sub-label">Date Of Birth</label>
                  </td>
                  <td className="left-alignn"> : </td>
                  <td className="left-alignn">
                    <label className="sub-label">{advocate.dob.slice(0, 10)}</label>
                  </td>
                </tr>

                {/* CONTEXTUAL ACTION BUTTONS: Dependent on view mode */}
                {view === "view" ? (
                  /* Mode: Managing an approved advocate (Activate / Deactivate) */
                  <div className="row justify-content-center mt-4 arr">
                    <div className="col-auto">
                      {advocate.isActive ? (
                        <button
                          className="btn btn-outline-danger button-size1"
                          onClick={() => handleDeactivate(advocate._id)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-success button-size1"
                          onClick={() => handleActivate(advocate._id)}
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </div>
                ) : view === "request" ? (
                  /* Mode: Moderating a pending registration (Accept / Reject) */
                  <div className="row justify-content-center mt-4 arr">
                    <div className="col-auto">
                      <button
                        className="btn btn-warning btn-style me-2"
                        onClick={() => handleApprove(advocate._id)}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-style btn-warning"
                        onClick={() => handleReject(advocate._id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* POPUP MODAL: Scanned Bar Council ID Proof Document */}
      <div
        className={`modal fade ${showModal ? 'show' : ''}`}
        tabIndex="-1"
        role="dialog"
        style={{ display: showModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">ID Proof</h5>
              <button
                type="button"
                className="close"
                onClick={toggleModal}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <img
                src={`${IMG_BASE_URL}/${advocate.idProof.filename}`}
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

      {/* Modal Dark Overlay Backdrop */}
      {showModal && <div className="modal-backdrop fade show" />}
    </div>
  );
}

export default ViewProfile_AR;
